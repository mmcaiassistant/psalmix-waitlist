import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "psalmix_admin_session";
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || "psalmix-admin-dev-token";

export function isAdminAuthenticated(request?: NextRequest): boolean {
  // Server-side check from request cookies
  if (request) {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
    return sessionCookie?.value === SESSION_TOKEN;
  }
  return false;
}

export function getSessionToken(): string {
  return SESSION_TOKEN;
}

export { ADMIN_SESSION_COOKIE };
