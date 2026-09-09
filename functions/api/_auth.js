// functions/api/_auth.js
// Shared authentication and helper functions for Cloudflare Pages Functions

const ALLOWED_ADMIN = 'fatahilah-mr';
const SESSION_COOKIE_NAME = 'gateway_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Standard JSON response with strict anti-cache headers
 */
export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...extraHeaders
    }
  });
}

/**
 * Error JSON response
 */
export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message, success: false }, status);
}

/**
 * Convert string to Uint8Array
 */
function strToBuf(str) {
  return new TextEncoder().encode(str);
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Import HMAC key
 */
async function getCryptoKey(secret) {
  const keyData = strToBuf(secret || 'cf-gateway-default-key-321');
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Create a signed session token
 */
export async function createSessionToken(username, secret) {
  const key = await getCryptoKey(secret);
  const payload = {
    username,
    exp: Date.now() + SESSION_DURATION_MS
  };
  const payloadStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(strToBuf(payloadStr));

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    strToBuf(encodedPayload)
  );
  const encodedSignature = base64UrlEncode(signature);

  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify session token and return payload
 */
export async function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, encodedSignature] = parts;

  try {
    const key = await getCryptoKey(secret);
    const signature = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      strToBuf(encodedPayload)
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(payloadJson);

    if (payload.exp < Date.now()) return null;
    if (payload.username?.toLowerCase() !== ALLOWED_ADMIN.toLowerCase()) return null;

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Parse Cookie header
 */
export function parseCookies(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  });
  return cookies;
}

/**
 * Authenticate admin request
 */
export async function authenticateAdmin(request, env) {
  const secret = env.GITHUB_CLIENT_SECRET || env.ADMIN_SECRET || 'cf-gateway-default-key-321';
  
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const verified = await verifySessionToken(token, secret);
    if (verified) return verified;
  }

  // 2. Check Cookie
  const cookies = parseCookies(request);
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  if (sessionToken) {
    const verified = await verifySessionToken(sessionToken, secret);
    if (verified) return verified;
  }

  return null;
}

export { ALLOWED_ADMIN, SESSION_COOKIE_NAME };
