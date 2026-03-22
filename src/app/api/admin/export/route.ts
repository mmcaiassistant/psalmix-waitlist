import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// Lazy-initialize to avoid module-level createClient crash during build
let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

const TABLE = "waitlist_users";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sb = getSupabase();
    const { data: users, error } = await sb
      .from(TABLE)
      .select("position, email, first_name, referral_code, referral_count, referred_by, created_at")
      .order("position", { ascending: true });

    if (error) throw error;

    // Resolve referred_by UUIDs → emails in one batch query
    const referrerIds = Array.from(
      new Set((users || []).map((u) => u.referred_by).filter(Boolean) as string[])
    );
    let referrerMap: Record<string, string> = {};
    if (referrerIds.length > 0) {
      const { data: referrers } = await sb
        .from(TABLE)
        .select("id, email")
        .in("id", referrerIds);
      referrers?.forEach((r) => { referrerMap[r.id] = r.email; });
    }

    const headers = ["Position", "Email", "First Name", "Referral Code", "Referral Count", "Referred By (Email)", "Joined At"];
    const escape = (cell: unknown) => {
      const s = String(cell ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = (users || []).map((u) => [
      u.position,
      u.email,
      u.first_name ?? "",
      u.referral_code,
      u.referral_count ?? 0,
      u.referred_by ? (referrerMap[u.referred_by] ?? u.referred_by) : "",
      u.created_at ? new Date(u.created_at).toISOString() : "",
    ].map(escape).join(","));

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="psalmix-waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("Admin export error:", err);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
