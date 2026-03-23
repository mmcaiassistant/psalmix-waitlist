import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SHARE_TABLE = "share_events";
const ALLOWED_CHANNELS = new Set(["facebook", "instagram", "copy", "twitter", "whatsapp", "email"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referralCode, channel } = body || {};

    if (!referralCode || typeof referralCode !== "string" || !channel || typeof channel !== "string") {
      return NextResponse.json(
        { error: "Missing referralCode or channel" },
        { status: 400 }
      );
    }

    // Validate channel against allowlist
    const normalizedChannel = channel.toLowerCase().trim();
    if (!ALLOWED_CHANNELS.has(normalizedChannel)) {
      return NextResponse.json(
        { error: "Invalid channel" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from(SHARE_TABLE).insert({
      referral_code: referralCode,
      channel: normalizedChannel,
    });

    if (error) {
      console.warn("Share tracking failed", error.message);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
