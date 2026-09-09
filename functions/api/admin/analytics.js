// functions/api/admin/analytics.js
// Admin endpoint for link analytics and click statistics

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

  try {
    const [totalClicksResult, topLinksResult, recentClicksResult] = await env.DB.batch([
      env.DB.prepare('SELECT SUM(click_count) as total_clicks, COUNT(*) as total_links FROM gw_links'),
      env.DB.prepare('SELECT id, en_title, id_title, url, click_count, is_active FROM gw_links ORDER BY click_count DESC'),
      env.DB.prepare('SELECT id, link_id, referer, country, clicked_at FROM gw_link_clicks ORDER BY clicked_at DESC LIMIT 50')
    ]);

    return jsonResponse({
      success: true,
      summary: {
        totalClicks: totalClicksResult?.results?.[0]?.total_clicks || 0,
        totalLinks: totalClicksResult?.results?.[0]?.total_links || 0
      },
      topLinks: topLinksResult?.results || [],
      recentClicks: recentClicksResult?.results || []
    });
  } catch (err) {
    return errorResponse(`Failed to fetch analytics: ${err.message}`, 500);
  }
}
