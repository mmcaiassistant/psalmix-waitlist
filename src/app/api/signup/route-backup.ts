import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
    const referralCode = (body.referralCode as string | undefined)?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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

    const { data: existing } = await supabase
      .from("waitlist_users")
      .select("id,email,position,referral_code")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        already: true,
        position: existing.position,
        referralCode: existing.referral_code,
      });
    }

    const { count } = await supabase
      .from("waitlist_users")
      .select("id", { count: "exact", head: true });

    const position = (count ?? 0) + 1;

    let newReferralCode = generateReferralCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existingCode } = await supabase
        .from("waitlist_users")
        .select("id")
        .eq("referral_code", newReferralCode)
        .maybeSingle();
      if (!existingCode) break;
      newReferralCode = generateReferralCode();
      attempts += 1;
    }

    let referredById: string | null = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from("waitlist_users")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();
      referredById = referrer?.id ?? null;
    }

    const { data: createdUser, error } = await supabase
      .from("waitlist_users")
      .insert({
        email,
        referral_code: newReferralCode,
        referred_by: referredById,
        position,
      })
      .select("id,position,referral_code")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (referredById) {
      await supabase.from("referrals").insert({
        referrer_id: referredById,
        referee_id: createdUser.id,
      });

      const { data: referrerCounts } = await supabase
        .from("waitlist_users")
        .select("referral_count")
        .eq("id", referredById)
        .maybeSingle();

      const nextCount = (referrerCounts?.referral_count ?? 0) + 1;
      await supabase
        .from("waitlist_users")
        .update({ referral_count: nextCount })
        .eq("id", referredById);
    }

    return NextResponse.json({
      position: createdUser.position,
      referralCode: createdUser.referral_code,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
