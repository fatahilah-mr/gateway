// functions/api/admin/links.js
// Admin CRUD operations for links

import { authenticateAdmin, jsonResponse, errorResponse } from '../_auth.js';

export async function onRequest(context) {
  const { request, env } = context;

  // Verify Admin Authentication
  const admin = await authenticateAdmin(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin login required', 401);
  }

  if (!env.DB) {
    return errorResponse('Database binding (DB) is not configured', 500);
  }

  const method = request.method;

  // 1. GET: Fetch all links (including inactive ones)
  if (method === 'GET') {
    try {
      const result = await env.DB.prepare(
        'SELECT * FROM gw_links ORDER BY sort_order ASC'
      ).all();

      return jsonResponse({
        success: true,
        links: result.results || []
      });
    } catch (err) {
      return errorResponse(`Failed to fetch links: ${err.message}`, 500);
    }
  }

  // 2. POST: Create a new link
  if (method === 'POST') {
    try {
      const body = await request.json();
      const {
        id,
        url,
        icon = 'link',
        en_title = '',
        en_description = '',
        id_title = '',
        id_description = '',
        sort_order,
        is_active = 1,
        is_highlight = 0
      } = body;

function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString.trim());
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

      if (!id || !url || !en_title || !id_title) {
        return errorResponse('Missing required fields: id, url, en_title, id_title', 400);
      }

      if (!isValidUrl(url)) {
        return errorResponse('Invalid URL: must be a valid http(s), mailto, or tel link', 400);
      }

      // Check if id already exists
      const existing = await env.DB.prepare('SELECT id FROM gw_links WHERE id = ?').bind(id).first();
      if (existing) {
        return errorResponse(`Link with id '${id}' already exists`, 409);
      }

      // Auto compute sort_order if not provided
      let order = sort_order;
      if (order === undefined || order === null) {
        const maxOrderRow = await env.DB.prepare('SELECT MAX(sort_order) as max_order FROM gw_links').first();
        order = (maxOrderRow?.max_order || 0) + 1;
      }

      await env.DB.prepare(`
        INSERT INTO gw_links (
          id, url, icon, en_title, en_description, id_title, id_description,
          sort_order, is_active, is_highlight, click_count, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
      `).bind(
        id.trim(),
        url.trim(),
        icon.trim(),
        en_title.trim(),
        en_description.trim(),
        id_title.trim(),
        id_description.trim(),
        order,
        is_active ? 1 : 0,
        is_highlight ? 1 : 0
      ).run();

      return jsonResponse({ success: true, message: 'Link created successfully', id }, 201);
    } catch (err) {
      return errorResponse(`Failed to create link: ${err.message}`, 500);
    }
  }

  // 3. PUT: Update an existing link
  if (method === 'PUT') {
    try {
      const body = await request.json();
      const {
        id,
        url,
        icon,
        en_title,
        en_description,
        id_title,
        id_description,
        sort_order,
        is_active,
        is_highlight
      } = body;

      if (!id) {
        return errorResponse('Missing link id to update', 400);
      }

      if (url !== undefined && !isValidUrl(url)) {
        return errorResponse('Invalid URL: must be a valid http(s), mailto, or tel link', 400);
      }

      const existing = await env.DB.prepare('SELECT * FROM gw_links WHERE id = ?').bind(id).first();
      if (!existing) {
        return errorResponse(`Link with id '${id}' not found`, 404);
      }

      await env.DB.prepare(`
        UPDATE gw_links SET
          url = ?,
          icon = ?,
          en_title = ?,
          en_description = ?,
          id_title = ?,
          id_description = ?,
          sort_order = ?,
          is_active = ?,
          is_highlight = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        url !== undefined ? url.trim() : existing.url,
        icon !== undefined ? icon.trim() : existing.icon,
        en_title !== undefined ? en_title.trim() : existing.en_title,
        en_description !== undefined ? en_description.trim() : existing.en_description,
        id_title !== undefined ? id_title.trim() : existing.id_title,
        id_description !== undefined ? id_description.trim() : existing.id_description,
        sort_order !== undefined ? Number(sort_order) : existing.sort_order,
        is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
        is_highlight !== undefined ? (is_highlight ? 1 : 0) : existing.is_highlight,
        id
      ).run();

      return jsonResponse({ success: true, message: 'Link updated successfully', id });
    } catch (err) {
      return errorResponse(`Failed to update link: ${err.message}`, 500);
    }
  }

  // 4. DELETE: Delete a link
  if (method === 'DELETE') {
    try {
      const url = new URL(request.url);
      let id = url.searchParams.get('id');

      if (!id) {
        try {
          const body = await request.json();
          id = body?.id;
        } catch {
          // ignore
        }
      }

      if (!id) {
        return errorResponse('Missing link id to delete', 400);
      }

      await env.DB.prepare('DELETE FROM gw_links WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true, message: 'Link deleted successfully', id });
    } catch (err) {
      return errorResponse(`Failed to delete link: ${err.message}`, 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}
