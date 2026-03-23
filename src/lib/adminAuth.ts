import { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "psalmix_admin_session";

// Never fall back to a hardcoded token in production.
// If ADMIN_SESSION_TOKEN is not set, authentication will always fail —
// this prevents the dev-fallback string from granting access to anyone who reads the repo.
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? "";

export function isAdminAuthenticated(request: NextRequest): boolean {
  if (!SESSION_TOKEN) return false; // env var not configured → never authenticated
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  return sessionCookie?.value === SESSION_TOKEN;
}

export function getSessionToken(): string {
  return SESSION_TOKEN;
}

export { ADMIN_SESSION_COOKIE };
