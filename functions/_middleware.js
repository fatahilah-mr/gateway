// functions/_middleware.js
// Cloudflare Pages Edge Middleware for Geolocation Routing, OWASP Headers, and Anomaly Monitoring

import { sendSecurityAlert } from './_monitor.js';

// Threat & Intrusion Signatures
const SCANNER_REGEX = /(?:\.env|\.git|\.aws|\.ssh|wp-login|wp-admin|phpmyadmin|xmlrpc|setup\.cgi|\.php$|\/console|\/eval-stdin|\/actuator|\/swagger|\/api-docs)/i;
const INJECTION_REGEX = /(?:union\s+select|select\s+.*\s+from|delete\s+from|drop\s+table|--|'\s*or\s*'1'\s*=\s*'1|"\s*or\s*"1"\s*=\s*"1|<script|javascript:|onerror=|onload=|document\.cookie|\.\.\/|\.\.\\|\/etc\/passwd)/i;

// In-memory fallback throttle for isolates
const localThrottleMap = new Map();

/**
 * Checks whether an alert for a specific IP and category has been sent recently.
 * Uses Cloudflare Cache API with fallback to in-memory map.
 */
async function isAlertThrottled(ip, category) {
  const now = Date.now();
  const throttleKeyStr = `${ip}:${category}`;
  
  // 1. Check local isolate memory (fast path)
  const lastSent = localThrottleMap.get(throttleKeyStr);
  if (lastSent && now - lastSent < 300000) { // 5 minutes
    return true;
  }
  localThrottleMap.set(throttleKeyStr, now);

  // 2. Cross-request datacenter cache check
  try {
    if (typeof caches !== 'undefined' && caches.default) {
      const cache = caches.default;
      const cacheKey = new Request(`https://anomaly-throttle.internal/${encodeURIComponent(throttleKeyStr)}`, { method: 'GET' });
      const cached = await cache.match(cacheKey);
      if (cached) return true;

      const throttleResponse = new Response('1', {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'text/plain'
        }
      });
      await cache.put(cacheKey, throttleResponse);
    }
  } catch {
    // Ignore cache API errors, fallback already handled
  }

  return false;
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Helper to attach standard OWASP security headers to responses
  const applySecurityHeaders = (res) => {
    if (!res) return res;
    const secureResponse = new Response(res.body, res);
    secureResponse.headers.set('X-Content-Type-Options', 'nosniff');
    secureResponse.headers.set('X-Frame-Options', 'DENY');
    secureResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    secureResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    secureResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    return secureResponse;
  };

  const ip = request.headers.get('cf-connecting-ip') || 'Unknown';
  const country = request.cf?.country || 'XX';
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const fullTarget = `${url.pathname}${url.search}`;

  // ─── 1. ANOMALY & INTRUSION DETECTION SENSOR ───────────────────────
  let anomalyType = null;
  let matchReason = '';

  if (SCANNER_REGEX.test(url.pathname)) {
    anomalyType = 'Scanner / Vulnerability Probe';
    matchReason = `Target path matched probe signature: ${url.pathname}`;
  } else if (INJECTION_REGEX.test(fullTarget)) {
    anomalyType = 'Malicious Injection Attempt';
    matchReason = `Query or path matched injection signature`;
  }

  if (anomalyType) {
    const throttled = await isAlertThrottled(ip, anomalyType);
    if (!throttled && context.waitUntil) {
      context.waitUntil(
        sendSecurityAlert(env, {
          service: 'Gateway Portal',
          host: url.hostname,
          type: anomalyType,
          ip,
          country,
          path: url.pathname,
          query: url.search,
          userAgent,
          action: 'Diblokir Otomatis (403 Forbidden)',
          details: matchReason
        })
      );
    }

    return applySecurityHeaders(
      new Response(JSON.stringify({ error: 'Forbidden', message: 'Malicious probe detected.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }

  // ─── 2. STATIC ASSETS & API ROUTE PASS-THROUGH ────────────────────
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/assets') ||
    url.pathname.startsWith('/content') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.includes('.')
  ) {
    try {
      const res = await next();
      return applySecurityHeaders(res);
    } catch (err) {
      if (context.waitUntil) {
        context.waitUntil(
          sendSecurityAlert(env, {
            service: 'Gateway Portal',
            host: url.hostname,
            type: '500 Server Exception',
            ip,
            country,
            path: url.pathname,
            query: url.search,
            userAgent,
            action: 'Error Logged',
            details: err?.message || 'Unhandled Server Error'
          })
        );
      }
      throw err;
    }
  }

  // ─── 3. GEOLOCATION ROUTING & I18N ─────────────────────────────────
  const cookieHeader = request.headers.get('Cookie') || '';
  const hasEnPref = cookieHeader.includes('lang_pref=en');
  const hasIdPref = cookieHeader.includes('lang_pref=id');

  // Root path routing
  if (url.pathname === '/' || url.pathname === '') {
    if ((country === 'ID' || hasIdPref) && !hasEnPref) {
      return Response.redirect(`${url.origin}/id`, 302);
    }
    const res = await next();
    return applySecurityHeaders(res);
  }

  // Indonesian localized path
  if (url.pathname === '/id' || url.pathname === '/id/') {
    if (env && env.ASSETS) {
      const indexRequest = new Request(`${url.origin}/`, request);
      const res = await env.ASSETS.fetch(indexRequest);
      return applySecurityHeaders(res);
    }
    const res = await next();
    return applySecurityHeaders(res);
  }

  const res = await next();
  return applySecurityHeaders(res);
}
