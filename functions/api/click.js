// functions/api/click.js
// Endpoint to track link clicks and record light analytics

import { jsonResponse, errorResponse } from './_auth.js';

export async function onRequest(context) {
  const { request, env, waitUntil } = context;

  if (request.method !== 'POST' && request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  let linkId = '';
  if (request.method === 'GET') {
    const url = new URL(request.url);
    linkId = url.searchParams.get('id');
  } else {
    try {
      const body = await request.json();
      linkId = body?.id;
    } catch {
      const url = new URL(request.url);
      linkId = url.searchParams.get('id');
    }
  }

  if (!linkId || typeof linkId !== 'string') {
    return errorResponse('Missing or invalid link id', 400);
  }

  if (!env.DB) {
    return errorResponse('Database binding (DB) is not configured', 500);
  }

  const referer = request.headers.get('Referer') || '';
  const userAgent = request.headers.get('User-Agent') || '';
  const country = request.cf?.country || 'Unknown';

  const updatePromise = (async () => {
    try {
      await env.DB.batch([
        env.DB.prepare('UPDATE gw_links SET click_count = click_count + 1 WHERE id = ?').bind(linkId),
        env.DB.prepare('INSERT INTO gw_link_clicks (link_id, referer, country, user_agent) VALUES (?, ?, ?, ?)').bind(
          linkId,
          referer.slice(0, 255),
          country.slice(0, 10),
          userAgent.slice(0, 255)
        )
      ]);
    } catch (err) {
      console.error('Click tracking error:', err);
    }
  })();

  if (typeof waitUntil === 'function') {
    waitUntil(updatePromise);
  } else {
    await updatePromise;
  }

  return jsonResponse({ success: true, linkId });
}
