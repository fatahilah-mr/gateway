export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  // Normalize pathname by removing trailing slash if present
  const pathname = url.pathname.replace(/\/$/, '');

  if (pathname === '/api/auth/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'User-Agent': 'Cloudflare-Pages-Auth'
      },
      body: JSON.stringify({ 
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code 
      })
    });
    
    if (!response.ok) {
      return new Response(`Error exchanging code: ${response.statusText}`, { status: response.status });
    }
    
    const data = await response.json();
    
    if (data.error) {
      return new Response(`OAuth Error: ${data.error_description || data.error}`, { status: 400 });
    }
    
    const access_token = data.access_token;
    
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><title>Authorizing...</title></head>
      <body>
      <script>
        (function() {
          const content = JSON.stringify({
            token: "${access_token}",
            provider: "github"
          });
          const message = "authorization:github:success:" + content;
          if (window.opener) {
            window.opener.postMessage(message, "*");
            window.close();
          } else {
            document.body.innerText = "Authentication successful! You can close this window.";
          }
        })();
      </script>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  if (pathname === '/api/auth') {
    if (!env.GITHUB_CLIENT_ID) {
      return new Response('Missing GITHUB_CLIENT_ID environment variable in Cloudflare Pages settings.', { status: 500 });
    }

    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${url.origin}/api/auth/callback`,
      scope: 'repo,user'
    });
    return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
  }

  return new Response(`Not found: ${url.pathname}`, { status: 404 });
}
