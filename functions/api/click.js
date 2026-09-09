// functions/api/click.js
// Endpoint to track link clicks and record light analytics with anti-bot and rate-limiting protection

import { jsonResponse, errorResponse } from './_auth.js';

const KNOWN_BOT_REGEX = /bot|spider|crawl|slurp|curl|wget|python|headless|httpclient|postman|apachebench|lighthouse|bytespider|gptbot/i;

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

  const userAgent = request.headers.get('User-Agent') || '';
  const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

  // 1. Bot Protection: Ignore automated bot clicks so they don't consume write quotas
  if (KNOWN_BOT_REGEX.test(userAgent)) {
    return jsonResponse({ success: true, ignored: true, reason: 'bot_filtered' });
  }

  // 2. IP Debounce Protection (5-second throttle per IP + linkId)
  // Absorbs rapid click spam (double clicks or script loops) at Cloudflare Edge with 0 D1 write
  let isThrottled = false;
  try {
    const cache = caches?.default;
    if (cache) {
      const lockUrl = new URL(`https://cache-internal.local/throttle/click/${encodeURIComponent(clientIp)}/${encodeURIComponent(linkId)}`);
      const cacheKey = new Request(lockUrl.toString(), { method: 'GET' });
      const existing = await cache.match(cacheKey);
      if (existing) {
        isThrottled = true;
      } else {
        const lockResp = new Response('1', {
          headers: {
            'Cache-Control': 'public, max-age=5',
            'Content-Type': 'text/plain'
          }
        });
        if (typeof waitUntil === 'function') {
          waitUntil(cache.put(cacheKey, lockResp));
        } else {
          await cache.put(cacheKey, lockResp);
        }
      }
    }
  } catch (cacheErr) {
    // Fail-open: if cache has issues, proceed with normal execution
  }

  if (isThrottled) {
    return jsonResponse({ success: true, rateLimited: true, linkId });
  }

  const referer = request.headers.get('Referer') || '';
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
