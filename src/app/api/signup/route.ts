// Updated signup route with FlowDesk integration
// BACKUP: Original route is at route.ts
// To use this version: rename route.ts to route-backup.ts and this file to route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { addSubscriberToFlowDesk, updateReferralCount } from "@/lib/flodesk";

const generateReferralCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email as string | undefined)?.toLowerCase().trim();
    const firstName = (body.firstName as string | undefined)?.trim();
    const referralCode = (body.referralCode as string | undefined)?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Mock mode for preview
    if (process.env.NEXT_PUBLIC_MOCK_MODE === "true") {
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
      if (!existingCode) { codeUnique = true; break; }
      newReferralCode = generateReferralCode();
    }
    if (!codeUnique) {
      console.error("Referral code collision: all 5 attempts exhausted for", email);
      return NextResponse.json({ error: "Server error — please try again" }, { status: 500 });
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
        first_name: firstName || null,
        referral_code: newReferralCode,
        referred_by: referredById,
        position,
        referral_count: 0,
      })
      .select("id,position,referral_code")
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ✨ NEW: Sync to FlowDesk (non-blocking - don't fail signup if FlowDesk fails)
    try {
      await addSubscriberToFlowDesk(email, {
        firstName,
        referralCode: newReferralCode,
        position: createdUser.position,
        referredBy: referralCode || undefined,
      });
    } catch (flowdeskError) {
      // Log error but don't fail the signup
      console.error('FlowDesk sync failed (non-critical):', flowdeskError);
    }

    // Handle referral tracking
    if (referredById && referrerEmail) {
      // Add referral record — log but don't fail signup if this errors
      const { error: referralInsertError } = await supabase.from("referrals").insert({
        referrer_id: referredById,
        referee_id: createdUser.id,
      });
      if (referralInsertError) {
        console.error("Failed to insert referral record:", referralInsertError);
      }

      // Atomic increment — no race condition
      const { data: updatedReferrer, error: rpcError } = await supabase.rpc("increment_referral_count", {
        user_id: referredById,
      });
      if (rpcError) {
        console.error("increment_referral_count RPC failed:", rpcError);
      }

      const nextCount = typeof updatedReferrer === "number" ? updatedReferrer : 1;

      // Update referrer's count in FlowDesk (triggers milestone emails)
      try {
        await updateReferralCount(referrerEmail, nextCount);
      } catch (flowdeskError) {
        console.error('FlowDesk referral count update failed (non-critical):', flowdeskError);
      }
    }

    // Return success response
    return NextResponse.json({
      position: createdUser.position,
      referralCode: createdUser.referral_code,
    });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
