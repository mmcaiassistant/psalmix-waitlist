import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { addSubscriberToFlowDesk, updateReferralCount } from "@/lib/flodesk";
import { checkRateLimit, getIP } from "@/lib/rateLimit";

// --- Validation constants -------------------------------------------------
const EMAIL_MAX_LENGTH = 254; // RFC 5321 max
const REFERRAL_CODE_REGEX = /^[A-Z0-9]{6}$/; // 6-char base32 subset, uppercase only

// -------------------------------------------------------------------------

const generateReferralCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export async function POST(request: Request) {
  // ── Rate limit: 5 signups per IP per 10 minutes ─────────────────────────
  const ip = getIP(request);
  const rl = checkRateLimit(`signup:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await request.json();

    // ── Type guard: email must be a string ──────────────────────────────
    if (typeof body.email !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : undefined;

    // Raw referralCode — must be string or absent; sanitize immediately
    const rawCode =
      typeof body.referralCode === "string"
        ? body.referralCode.trim().toUpperCase()
        : undefined;

    // ── Email validation ────────────────────────────────────────────────
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return NextResponse.json(
        { error: "Email address is too long" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // ── referralCode validation ─────────────────────────────────────────
    // Accept only exactly-6-char alphanumeric codes (our format).
    // Reject any SQL injection, XSS, or garbage strings silently by
    // treating an invalid code as "no referral".
    const referralCode =
      rawCode && REFERRAL_CODE_REGEX.test(rawCode) ? rawCode : undefined;

    // ── firstName sanitisation ──────────────────────────────────────────
    const safeFirstName =
      typeof firstName === "string" && firstName.length <= 100
        ? firstName
        : undefined;

    // Mock mode for preview (use server-only env var, not NEXT_PUBLIC_)
    if (process.env.MOCK_MODE === "true") {
      const mockCode = generateReferralCode();
      const mockPosition = Math.floor(Math.random() * 500) + 2848;
      return NextResponse.json({
        position: mockPosition,
        referralCode: mockCode,
      });
    }

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from("waitlist_users")
      .select("id,email,position,referral_code")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      // If already exists, just return their info (they can access dashboard again)
      return NextResponse.json({
        already: true,
        position: existing.position,
        referralCode: existing.referral_code,
      });
    }

    // Calculate position in waitlist
    const { count } = await supabase
      .from("waitlist_users")
      .select("id", { count: "exact", head: true });

    const position = (count ?? 0) + 1;

    // Generate unique referral code — try up to 5 times; return 500 if all collide
    let newReferralCode = generateReferralCode();
    let codeUnique = false;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const { data: existingCode } = await supabase
        .from("waitlist_users")
        .select("id")
        .eq("referral_code", newReferralCode)
        .maybeSingle();
      if (!existingCode) {
        codeUnique = true;
        break;
      }
      newReferralCode = generateReferralCode();
    }
    if (!codeUnique) {
      console.error(
        "Referral code collision: all 5 attempts exhausted for",
        email
      );
      return NextResponse.json(
        { error: "Server error — please try again" },
        { status: 500 }
      );
    }

    // Find referrer if referral code was provided
    let referredById: string | null = null;
    let referrerEmail: string | null = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from("waitlist_users")
        .select("id,email")
        .eq("referral_code", referralCode)
        .maybeSingle();

      if (referrer) {
        referredById = referrer.id;
        referrerEmail = referrer.email;
      }
    }

    // Insert new user into Supabase
    const { data: createdUser, error } = await supabase
      .from("waitlist_users")
      .insert({
        email,
        first_name: safeFirstName || null,
        referral_code: newReferralCode,
        referred_by: referredById,
        position,
        referral_count: 0,
      })
      .select("id,position,referral_code")
      .single();

    if (error) {
      console.error("Supabase insert error:", error.code, error.details);
      // Do not expose DB internals — check for duplicate email (code 23505)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already on the waitlist." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Something went wrong — please try again." },
        { status: 500 }
      );
    }

    // ✨ Sync to FlowDesk (non-blocking - don't fail signup if FlowDesk fails)
    try {
      await addSubscriberToFlowDesk(email, {
        firstName: safeFirstName,
        referralCode: newReferralCode,
        position: createdUser.position,
        referredBy: referralCode || undefined,
      });
    } catch (flowdeskError) {
      console.error("FlowDesk sync failed (non-critical):", flowdeskError);
    }

    // Handle referral tracking
    if (referredById && referrerEmail) {
      const { error: referralInsertError } = await supabase
        .from("referrals")
        .insert({
          referrer_id: referredById,
          referee_id: createdUser.id,
        });
      if (referralInsertError) {
        console.error("Failed to insert referral record:", referralInsertError);
      }

      const { data: updatedReferrer, error: rpcError } = await supabase.rpc(
        "increment_referral_count",
        { user_id: referredById }
      );
      if (rpcError) {
        console.error("increment_referral_count RPC failed:", rpcError);
      }

      const nextCount =
        typeof updatedReferrer === "number" ? updatedReferrer : 1;

      try {
        await updateReferralCount(referrerEmail, nextCount);
      } catch (flowdeskError) {
        console.error(
          "FlowDesk referral count update failed (non-critical):",
          flowdeskError
        );
      }
    }

    // Return success response
    return NextResponse.json({
      position: createdUser.position,
      referralCode: createdUser.referral_code,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
