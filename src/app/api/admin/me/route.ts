import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";

/**
 * GET /api/admin/me
 * Returns 200 if the admin session cookie is valid, 401 otherwise.
 * Used by the admin UI to auto-restore session on page refresh.
 */
export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
