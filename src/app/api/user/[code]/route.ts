import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculatePosition } from "@/lib/position";
import { checkRateLimit, getIP } from "@/lib/rateLimit";

const WAITLIST_TABLE = "waitlist_users";

// Disable caching for this dynamic route
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Referral code must be exactly 6 uppercase alphanumeric chars (our format)
const REFERRAL_CODE_REGEX = /^[A-Z0-9]{6}$/;

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  // ── Rate limit: 30 lookups per IP per minute ──────────────────────────
  const ip = getIP(request);
  const rl = checkRateLimit(`user-lookup:${ip}`, 30, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests — slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  const code = params.code.toUpperCase();

  // ── Validate code format before hitting DB ─────────────────────────────
  if (!REFERRAL_CODE_REGEX.test(code)) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const { data: user, error } = await supabase
      .from(WAITLIST_TABLE)
      .select("id, referral_code, referral_count, position")
      .eq("referral_code", code)
      .maybeSingle();

    if (error) {
      console.error("DB error in /api/user/[code]:", error);
      return NextResponse.json(
        { error: "Server error" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const referralCode = user.referral_code || code;

    // Use referral_count from user record (updated on signup)
    // This is more reliable than counting from referrals table
    const referrals = user.referral_count ?? 0;

    const initialPosition = user.position ?? 1;
    const positionStats = calculatePosition(initialPosition, referrals);

    return NextResponse.json({
      referralCode,
      referrals,
      position: positionStats.currentPosition,
      peopleAhead: positionStats.peopleAhead,
      movedUpBy: positionStats.movedUpBy,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
