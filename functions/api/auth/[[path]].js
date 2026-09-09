// functions/api/auth/[[path]].js
// GitHub OAuth Handler & Admin Session Management

import {
  createSessionToken,
  authenticateAdmin,
  jsonResponse,
  errorResponse,
  ALLOWED_ADMIN,
  SESSION_COOKIE_NAME
} from '../_auth.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '');

  // 1. Check current admin session: GET /api/auth/me
  if (pathname === '/api/auth/me') {
    const admin = await authenticateAdmin(request, env);
    if (!admin) {
      return jsonResponse({ authenticated: false });
    }
    return jsonResponse({
      authenticated: true,
      user: {
        login: admin.username,
        role: 'admin'
      }
    });
  }

  // 2. Admin logout: POST /api/auth/logout
  if (pathname === '/api/auth/logout') {
    const cookieHeader = `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
    return jsonResponse({ success: true, message: 'Logged out' }, 200, {
      'Set-Cookie': cookieHeader
    });
  }

  // 3. GitHub OAuth Login initiation: GET /api/auth or GET /api/auth/login
  if (pathname === '/api/auth' || pathname === '/api/auth/login') {
    const clientId = env.GITHUB_CLIENT_ID || 'Ov23liY7TkeLfzyHzZsA';
    if (!clientId) {
      return errorResponse('Missing GITHUB_CLIENT_ID in Cloudflare Pages environment variables', 500);
    }

    const state = Math.random().toString(36).substring(2);
    const redirectParam = url.searchParams.get('redirect') || '/admin';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${url.origin}/api/auth/callback`,
      scope: 'read:user',
      state: encodeURIComponent(JSON.stringify({ redirect: redirectParam, nonce: state }))
    });

    return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
  }

  // 4. GitHub OAuth Callback: GET /api/auth/callback
  if (pathname === '/api/auth/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return errorResponse('Missing code parameter from GitHub OAuth', 400);
    }

    const clientId = env.GITHUB_CLIENT_ID || 'Ov23liY7TkeLfzyHzZsA';
    if (!clientId || !env.GITHUB_CLIENT_SECRET) {
      return errorResponse('Missing GitHub OAuth credentials in environment variables', 500);
    }

    // A. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Gateway-Auth'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    if (!tokenResponse.ok) {
      return errorResponse(`Failed to exchange code with GitHub: ${tokenResponse.statusText}`, 502);
    }

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return errorResponse(`GitHub OAuth Error: ${tokenData.error_description || tokenData.error}`, 400);
    }

    const accessToken = tokenData.access_token;

    // B. Fetch GitHub user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Gateway-Auth',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userResponse.ok) {
      return errorResponse('Failed to fetch GitHub profile', 502);
    }

    const userData = await userResponse.json();
    const githubUsername = userData.login;

    // C. Strict Admin Verification
    if (githubUsername.toLowerCase() !== ALLOWED_ADMIN.toLowerCase()) {
      return new Response(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Akses Ditolak - Gateway Admin</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .card { background: #1e293b; padding: 32px; border-radius: 16px; max-width: 480px; text-align: center; border: 1px solid #ef4444; }
            h1 { color: #ef4444; margin-top: 0; font-size: 1.5rem; }
            p { color: #94a3b8; line-height: 1.6; }
            a { display: inline-block; margin-top: 16px; background: #3b82f6; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>⛔ Akses Ditolak</h1>
            <p>Akun GitHub <strong>@${githubUsername}</strong> tidak memiliki otorisasi admin untuk portal ini. Hanya pemilik repositori (<strong>@${ALLOWED_ADMIN}</strong>) yang diizinkan mengelola data.</p>
            <a href="/">Kembali ke Beranda</a>
          </div>
        </body>
        </html>
      `, {
        status: 403,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // D. Create signed session token
    const secret = env.GITHUB_CLIENT_SECRET;
    const sessionToken = await createSessionToken(githubUsername, secret);

    // E. Determine redirect destination
    let destination = '/admin';
    try {
      const stateParam = url.searchParams.get('state');
      if (stateParam) {
        const parsed = JSON.parse(decodeURIComponent(stateParam));
        if (parsed?.redirect?.startsWith('/')) {
          destination = parsed.redirect;
        }
      }
    } catch {
      // fallback to /admin
    }

    // Set secure HttpOnly cookie valid for 7 days
    const cookieHeader = `${SESSION_COOKIE_NAME}=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;

    // Also support legacy Sveltia CMS window.opener message if invoked from popup
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Login Berhasil</title>
      </head>
      <body>
        <script>
          (function() {
            if (window.opener) {
              const content = JSON.stringify({ token: "${accessToken}", provider: "github" });
              window.opener.postMessage("authorization:github:success:" + content, window.location.origin);
              window.close();
            } else {
              window.location.href = "${destination}";
            }
          })();
        </script>
        <p style="font-family:sans-serif; text-align:center; margin-top:40px;">Mengalihkan ke Admin Dashboard...</p>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': cookieHeader
      }
    });
  }

  return errorResponse(`Endpoint not found: ${url.pathname}`, 404);
}
