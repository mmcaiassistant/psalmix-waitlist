import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Mock mode for preview
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    return NextResponse.json({ total: 2847 });
  }

  const { count, error } = await supabase
    .from("waitlist_users")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ total: count ?? 0 });
}
