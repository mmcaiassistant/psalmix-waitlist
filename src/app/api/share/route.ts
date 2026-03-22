import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SHARE_TABLE = "share_events";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referralCode, channel } = body || {};

    if (!referralCode || !channel) {
      return NextResponse.json(
        { error: "Missing referralCode or channel" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from(SHARE_TABLE).insert({
      referral_code: referralCode,
      channel,
    });

    if (error) {
      console.warn("Share tracking failed", error.message);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
