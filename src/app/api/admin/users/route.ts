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

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;

  try {
    const { count: totalCount } = await supabase.from(TABLE).select("id", { count: "exact", head: true });

    const { data: users, error } = await supabase
      .from(TABLE)
      .select("id, email, position, referral_code, referral_count, referred_by, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Enrich with referrer email (batch lookup by id)
    const referrerIds = Array.from(new Set((users || []).map((u) => u.referred_by).filter(Boolean) as string[]));
    let referrerMap: Record<string, string> = {};
    if (referrerIds.length > 0) {
      const { data: referrers } = await supabase
        .from(TABLE)
        .select("id, email")
        .in("id", referrerIds);
      referrers?.forEach((r) => { referrerMap[r.id] = r.email; });
    }

    const enriched = (users || []).map((u) => ({
      ...u,
      referredByEmail: u.referred_by ? referrerMap[u.referred_by] ?? null : null,
      name: null, // firstName not stored in DB — surfaced for visibility
    }));

    return NextResponse.json({
      users: enriched,
      pagination: {
        page,
        limit,
        total: totalCount ?? 0,
        totalPages: Math.ceil((totalCount ?? 0) / limit),
      },
    });
  } catch (err) {
    console.error("Admin users error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
