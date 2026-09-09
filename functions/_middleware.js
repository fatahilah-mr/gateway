// functions/_middleware.js
// Cloudflare Pages Edge Middleware for Geolocation Routing & i18n

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

  // 1. Pass through API routes, static assets, admin portal, or direct file extensions
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/assets') ||
    url.pathname.startsWith('/content') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.includes('.')
  ) {
    const res = await next();
    return applySecurityHeaders(res);
  }

  // 2. Read language preference cookie (set when user manually switches)
  const cookieHeader = request.headers.get('Cookie') || '';
  const hasEnPref = cookieHeader.includes('lang_pref=en');
  const hasIdPref = cookieHeader.includes('lang_pref=id');

  // 3. Geolocation routing for the root path '/'
  if (url.pathname === '/' || url.pathname === '') {
    const country = request.cf?.country || '';

    // If visitor is from Indonesia (or has ID preference) and hasn't explicitly chosen English:
    if ((country === 'ID' || hasIdPref) && !hasEnPref) {
      return Response.redirect(`${url.origin}/id`, 302);
    }
    const res = await next();
    return applySecurityHeaders(res);
  }

  // 4. If path is '/id' or '/id/'
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
