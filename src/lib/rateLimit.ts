/**
 * In-memory rate limiter for API routes.
 * Keyed by IP address. Resets per window.
 *
 * NOTE: This is process-local. On Vercel each serverless invocation is isolated,
 * so this provides best-effort protection per instance. For stricter enforcement
 * use an external store (Redis / Upstash) — acceptable for MVP.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Returns true if the request is allowed, false if it should be blocked.
 * @param key   Unique key (e.g. IP + route).
 * @param limit Max requests per window.
 * @param windowMs Window size in milliseconds.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  const allowed = entry.count <= limit;
  return { allowed, remaining, resetAt: entry.resetAt };
}

/**
 * Extract a best-effort IP from a Next.js Request object.
 */
export function getIP(request: Request): string {
  const headers = request instanceof Request ? request.headers : (request as { headers: Headers }).headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
