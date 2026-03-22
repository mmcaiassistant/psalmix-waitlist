import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { ADMIN_SESSION_COOKIE, getSessionToken } from "@/lib/adminAuth";
import { checkRateLimit, getIP } from "@/lib/rateLimit";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  // ── Brute force protection: 10 attempts per IP per 15 minutes ──────────
  const ip = getIP(request);
  const rl = checkRateLimit(`admin-auth:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts — try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    // Use constant-time comparison to prevent timing attacks
    const passwordValid =
      password &&
      typeof password === "string" &&
      (() => {
        try {
          const a = Buffer.from(password);
          const b = Buffer.from(ADMIN_PASSWORD!);
          return a.length === b.length && timingSafeEqual(a, b);
        } catch {
          return false;
        }
      })();

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, getSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  // Explicitly set path: "/" to match the Set-Cookie path, ensuring the browser
  // actually clears the cookie rather than leaving it for the root path.
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
