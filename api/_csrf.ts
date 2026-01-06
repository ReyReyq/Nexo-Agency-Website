/**
 * CSRF Protection Utility for Vercel Serverless Functions
 * Uses Origin/Referer header validation for stateless CSRF protection
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Allowed origins for form submissions
const ALLOWED_ORIGINS = [
  'https://nexo.agency',
  'https://www.nexo.agency',
  'https://nexoagency.org',
  'https://www.nexoagency.org',
];

// Development origins (only allowed in non-production)
const DEV_ORIGINS = [
  'http://localhost:8082',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:8082',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

/**
 * Check if an origin is allowed
 */
function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;

  // Check production origins
  if (ALLOWED_ORIGINS.some(allowed => origin === allowed || origin.startsWith(allowed))) {
    return true;
  }

  // Check development origins (only in non-production)
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  if (!isProduction && DEV_ORIGINS.some(dev => origin === dev || origin.startsWith(dev))) {
    return true;
  }

  return false;
}

/**
 * Extract origin from referer header
 */
function getOriginFromReferer(referer: string | undefined): string | undefined {
  if (!referer) return undefined;

  try {
    const url = new URL(referer);
    return url.origin;
  } catch {
    return undefined;
  }
}

/**
 * Validate CSRF protection via Origin/Referer headers
 * Returns null if valid, or an error response object if invalid
 */
export function validateCsrf(req: VercelRequest): { status: number; error: string } | null {
  // Skip CSRF check for OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    return null;
  }

  // Only check state-changing methods
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE' && req.method !== 'PATCH') {
    return null;
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // First check Origin header (most reliable)
  if (origin) {
    if (isOriginAllowed(origin)) {
      return null; // Valid
    }
    // Invalid origin explicitly provided
    console.warn(`CSRF: Rejected request with invalid origin: ${origin}`);
    return { status: 403, error: 'Invalid request origin' };
  }

  // Fall back to Referer header (for older browsers that don't send Origin)
  const refererOrigin = getOriginFromReferer(referer);
  if (refererOrigin && isOriginAllowed(refererOrigin)) {
    return null; // Valid
  }

  // No valid Origin or Referer - likely a direct/programmatic request
  // This could be legitimate API usage or an attack
  // For form endpoints, we require a valid origin
  console.warn(`CSRF: Rejected request without valid origin. Referer: ${referer || 'none'}`);
  return { status: 403, error: 'Missing or invalid request origin' };
}

/**
 * Set CORS headers based on origin
 */
export function setCorsHeaders(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin;

  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // Don't set Access-Control-Allow-Origin for unknown origins

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
}

/**
 * Combined middleware for CORS and CSRF protection
 * Returns true if the request should continue, false if it was handled (error or preflight)
 */
export function handleCorsAndCsrf(req: VercelRequest, res: VercelResponse): boolean {
  // Set CORS headers
  setCorsHeaders(req, res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  // Validate CSRF
  const csrfError = validateCsrf(req);
  if (csrfError) {
    res.status(csrfError.status).json({ error: csrfError.error });
    return false;
  }

  return true;
}

/**
 * Get the list of allowed origins for reference
 */
export function getAllowedOrigins(): string[] {
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  return isProduction ? [...ALLOWED_ORIGINS] : [...ALLOWED_ORIGINS, ...DEV_ORIGINS];
}
