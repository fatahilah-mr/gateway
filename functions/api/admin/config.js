// functions/api/admin/config.js
// Admin endpoints for viewing and updating site_config

import { authenticateAdmin, jsonResponse, errorResponse } from '../_auth.js';

export async function onRequest(context) {
  const { request, env } = context;

  const admin = await authenticateAdmin(request, env);
  if (!admin) {
    return errorResponse('Unauthorized: Admin login required', 401);
  }

  if (!env.DB) {
    return errorResponse('Database binding (DB) is not configured', 500);
  }

  // 1. GET: Fetch current site_config
  if (request.method === 'GET') {
    try {
      const config = await env.DB.prepare('SELECT * FROM site_config WHERE id = ?').bind('default').first();
      return jsonResponse({ success: true, config: config || {} });
    } catch (err) {
      return errorResponse(`Failed to fetch site config: ${err.message}`, 500);
    }
  }

  // 2. PUT or POST: Update site_config
  if (request.method === 'PUT' || request.method === 'POST') {
    try {
      const body = await request.json();
      const {
        name,
        short_name,
        en_title,
        en_subtitle,
        en_hint,
        en_card_hint,
        en_footer,
        id_title,
        id_subtitle,
        id_hint,
        id_card_hint,
        id_footer
      } = body;

      const existing = await env.DB.prepare('SELECT * FROM site_config WHERE id = ?').bind('default').first();

      await env.DB.prepare(`
        INSERT INTO site_config (
          id, name, short_name,
          en_title, en_subtitle, en_hint, en_card_hint, en_footer,
          id_title, id_subtitle, id_hint, id_card_hint, id_footer,
          updated_at
        ) VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          short_name = excluded.short_name,
          en_title = excluded.en_title,
          en_subtitle = excluded.en_subtitle,
          en_hint = excluded.en_hint,
          en_card_hint = excluded.en_card_hint,
          en_footer = excluded.en_footer,
          id_title = excluded.id_title,
          id_subtitle = excluded.id_subtitle,
          id_hint = excluded.id_hint,
          id_card_hint = excluded.id_card_hint,
          id_footer = excluded.id_footer,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        name !== undefined ? name : existing?.name || '',
        short_name !== undefined ? short_name : existing?.short_name || '',
        en_title !== undefined ? en_title : existing?.en_title || '',
        en_subtitle !== undefined ? en_subtitle : existing?.en_subtitle || '',
        en_hint !== undefined ? en_hint : existing?.en_hint || '',
        en_card_hint !== undefined ? en_card_hint : existing?.en_card_hint || '',
        en_footer !== undefined ? en_footer : existing?.en_footer || '',
        id_title !== undefined ? id_title : existing?.id_title || '',
        id_subtitle !== undefined ? id_subtitle : existing?.id_subtitle || '',
        id_hint !== undefined ? id_hint : existing?.id_hint || '',
        id_card_hint !== undefined ? id_card_hint : existing?.id_card_hint || '',
        id_footer !== undefined ? id_footer : existing?.id_footer || ''
      ).run();

      return jsonResponse({ success: true, message: 'Site configuration updated successfully' });
    } catch (err) {
      return errorResponse(`Failed to update site config: ${err.message}`, 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}
