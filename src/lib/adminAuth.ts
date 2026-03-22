import { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "psalmix_admin_session";
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || "psalmix-admin-dev-token";

export function isAdminAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  return sessionCookie?.value === SESSION_TOKEN;
}

export function getSessionToken(): string {
  return SESSION_TOKEN;
}

export { ADMIN_SESSION_COOKIE };
