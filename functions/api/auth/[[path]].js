export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth/', '');
  
  if (path === 'callback') {
    const code = url.searchParams.get('code');
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ 
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code 
      })
    });
    
    if (!response.ok) {
      return new Response(`Error: ${response.statusText}`, { status: response.status });
    }
    
    const data = await response.json();
    
    if (data.error) {
      return new Response(`Error: ${data.error_description}`, { status: 400 });
    }
    
    const access_token = data.access_token;
    
    return new Response(`
      <script>
        window.opener.postMessage(
          'authorization:github:success:{"token":"${access_token}","provider":"github"}',
          '*'
        );
      </script>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
  
  if (path === '' || path === 'api/auth') {
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${url.origin}/api/auth/callback`,
      scope: 'repo,user'
    });
    return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
  }
  
  return new Response('Not found', { status: 404 });
}
