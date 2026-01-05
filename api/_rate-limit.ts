/**
 * Rate Limiting Utility for Vercel Serverless Functions
 *
 * This implementation uses in-memory storage which works per serverless instance.
 * Note: In a serverless environment, each instance maintains its own rate limit store.
 * This provides protection against rapid-fire requests but won't share state across instances.
 *
 * For more robust rate limiting across all instances, consider:
 * - Vercel KV (Redis)
 * - Upstash Redis
 * - External rate limiting service
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RateLimitRecord {
  count: number;
  firstRequestTime: number;
}

// In-memory store for rate limiting
// Key format: "endpoint:ip"
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup old entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

/**
 * Clean up expired rate limit records
 */
function cleanupExpiredRecords(windowMs: number): void {
  const now = Date.now();

  // Only cleanup once per interval
  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }

  lastCleanup = now;

  const keysToDelete: string[] = [];
  rateLimitStore.forEach((record, key) => {
    if (now - record.firstRequestTime > windowMs) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => rateLimitStore.delete(key));
}

/**
 * Get the client IP address from the request
 */
export function getClientIp(req: VercelRequest): string {
  // Vercel provides the real IP in x-forwarded-for or x-real-ip
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];

  if (typeof forwardedFor === 'string') {
    // x-forwarded-for can contain multiple IPs, take the first one (client)
    return forwardedFor.split(',')[0].trim();
  }

  if (typeof realIp === 'string') {
    return realIp;
  }

  // Fallback (shouldn't happen on Vercel)
  return 'unknown';
}

/**
 * Check if a request should be rate limited
 *
 * @param ip - The client IP address
 * @param endpoint - Identifier for the endpoint (e.g., 'submit-form', 'newsletter')
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number = 5,
  windowMs: number = 60000 // 1 minute default
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = `${endpoint}:${ip}`;

  // Cleanup expired records periodically
  cleanupExpiredRecords(windowMs);

  const record = rateLimitStore.get(key);

  // First request or window expired
  if (!record || now - record.firstRequestTime > windowMs) {
    rateLimitStore.set(key, { count: 1, firstRequestTime: now });
    return {
      allowed: true,
      remaining: limit - 1,
      resetIn: windowMs,
    };
  }

  // Within the window - check count
  if (record.count >= limit) {
    const resetIn = windowMs - (now - record.firstRequestTime);
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.max(0, resetIn),
    };
  }

  // Increment count
  record.count++;
  const resetIn = windowMs - (now - record.firstRequestTime);

  return {
    allowed: true,
    remaining: limit - record.count,
    resetIn: Math.max(0, resetIn),
  };
}

/**
 * Rate limit configuration for different endpoints
 */
export const RATE_LIMITS = {
  // Form submissions: 5 per minute (generous for legitimate users)
  'submit-form': { limit: 5, windowMs: 60000 },
  // Newsletter: 3 per minute (less frequent need)
  'newsletter': { limit: 3, windowMs: 60000 },
} as const;

/**
 * Apply rate limiting to a request
 * Sets appropriate headers and returns error response if limited
 *
 * @returns true if request should continue, false if rate limited
 */
export function applyRateLimit(
  req: VercelRequest,
  res: VercelResponse,
  endpoint: keyof typeof RATE_LIMITS
): boolean {
  const config = RATE_LIMITS[endpoint];
  const ip = getClientIp(req);

  const { allowed, remaining, resetIn } = checkRateLimit(
    ip,
    endpoint,
    config.limit,
    config.windowMs
  );

  // Set rate limit headers (following standard conventions)
  res.setHeader('X-RateLimit-Limit', config.limit.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString());

  if (!allowed) {
    const resetSeconds = Math.ceil(resetIn / 1000);

    // Log rate limit hit for monitoring
    console.warn(`Rate limit exceeded for ${endpoint} from IP: ${ip}`);

    res.status(429).json({
      error: 'יותר מדי בקשות. אנא נסו שוב בעוד מספר דקות.',
      errorEn: 'Too many requests. Please try again in a few minutes.',
      retryAfter: resetSeconds,
    });

    // Set Retry-After header
    res.setHeader('Retry-After', resetSeconds.toString());

    return false;
  }

  return true;
}
