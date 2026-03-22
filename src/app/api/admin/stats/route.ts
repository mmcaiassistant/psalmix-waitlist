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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, today, week, month, topReferrers, signupsData] = await Promise.all([
      supabase.from(TABLE).select("id", { count: "exact", head: true }),
      supabase.from(TABLE).select("id", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
      supabase.from(TABLE).select("id", { count: "exact", head: true }).gte("created_at", weekStart.toISOString()),
      supabase.from(TABLE).select("id", { count: "exact", head: true }).gte("created_at", monthStart.toISOString()),
      supabase.from(TABLE).select("id, email, referral_count, position").order("referral_count", { ascending: false }).limit(10),
      supabase.from(TABLE).select("created_at").gte("created_at", new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()).order("created_at", { ascending: true }),
    ]);

    // Build chart data
    const chartMap: Record<string, number> = {};
    signupsData.data?.forEach((s) => {
      const date = new Date(s.created_at).toISOString().split("T")[0];
      chartMap[date] = (chartMap[date] || 0) + 1;
    });
    const chartArray = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      return { date: key, count: chartMap[key] || 0 };
    });

    return NextResponse.json({
      stats: {
        totalSignups: total.count ?? 0,
        signupsToday: today.count ?? 0,
        signupsThisWeek: week.count ?? 0,
        signupsThisMonth: month.count ?? 0,
      },
      topReferrers: topReferrers.data ?? [],
      chartData: chartArray,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
