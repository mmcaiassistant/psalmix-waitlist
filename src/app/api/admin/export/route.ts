import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TABLE = "waitlist_users";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: users, error } = await supabase
      .from(TABLE)
      .select("position, email, referral_code, referral_count, referred_by, created_at")
      .order("position", { ascending: true });

    if (error) throw error;

    const headers = ["Position", "Email", "Referral Code", "Referral Count", "Referred By (ID)", "Joined At"];
    const escape = (cell: unknown) => {
      const s = String(cell ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = (users || []).map((u) => [
      u.position,
      u.email,
      u.referral_code,
      u.referral_count ?? 0,
      u.referred_by ?? "",
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
