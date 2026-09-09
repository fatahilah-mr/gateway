// functions/api/admin/links/reorder.js
// Batch update sort order for links

import { authenticateAdmin, jsonResponse, errorResponse } from '../../_auth.js';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  const admin = await authenticateAdmin(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin login required', 401);
  }

  if (!env.DB) {
    return errorResponse('Database binding (DB) is not configured', 500);
  }

  try {
    const body = await request.json();
    // Expected: { orders: [{ id: 'portfolio', sort_order: 1 }, ...] } or array of { id, sort_order }
    const items = Array.isArray(body) ? body : body?.orders;

    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse('Invalid payload: expected an array of { id, sort_order }', 400);
    }

    const statements = items.map(item => {
      return env.DB.prepare('UPDATE gw_links SET sort_order = ? WHERE id = ?').bind(
        Number(item.sort_order),
        item.id
      );
    });

    await env.DB.batch(statements);

    return jsonResponse({ success: true, message: 'Links reordered successfully', count: items.length });
  } catch (err) {
    return errorResponse(`Failed to reorder links: ${err.message}`, 500);
  }
}
