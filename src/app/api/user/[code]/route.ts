import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculatePosition } from "@/lib/position";

const WAITLIST_TABLE = "waitlist_users";

// Disable caching for this dynamic route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  try {
    const { data: user, error } = await supabase
      .from(WAITLIST_TABLE)
      .select("*")
      .eq("referral_code", code)
      .maybeSingle();

    if (error || !user) {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
