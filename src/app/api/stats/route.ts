import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Mock mode for preview
  if (process.env.MOCK_MODE === 'true') {
    return NextResponse.json({ total: 2847 });
  }

  const { count, error } = await supabase
    .from("waitlist_users")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Stats fetch error:", error.code);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }

  return NextResponse.json({ total: count ?? 0 });
}
