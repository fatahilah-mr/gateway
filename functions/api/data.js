// functions/api/data.js
// Public endpoint to retrieve site config and active links from Cloudflare D1

import { jsonResponse, errorResponse } from './_auth.js';

export async function onRequest({ env }) {
  if (!env.DB) {
    return errorResponse('Database binding (DB) is not configured', 500);
  }

  try {
    // 1. Fetch site_config and active links in parallel batch for maximum performance
    const [configResult, linksResult] = await env.DB.batch([
      env.DB.prepare('SELECT * FROM site_config WHERE id = ?').bind('default'),
      env.DB.prepare('SELECT * FROM links WHERE is_active = 1 ORDER BY sort_order ASC')
    ]);

    const rawConfig = configResult?.results?.[0] || {
      name: 'Fatahilah Miftahul Rahman',
      short_name: 'FATAH',
      en_title: 'Fatahilah Miftahul Rahman',
      en_subtitle: 'Network Engineer & Web Developer',
      en_hint: 'Tap the icons above to change language or theme',
      en_card_hint: '👇 Tap a card to visit the link',
      en_footer: '© 2026 Fatahilah Miftahul Rahman. All Rights Reserved.',
      id_title: 'Fatahilah Miftahul Rahman',
      id_subtitle: 'Teknisi Jaringan & Pengembang Web',
      id_hint: 'Ketuk ikon di atas untuk mengubah bahasa atau tema',
      id_card_hint: '👇 Ketuk kartu di bawah untuk membuka tautannya',
      id_footer: '© 2026 Fatahilah Miftahul Rahman. Hak Cipta Dilindungi.'
    };

    const config = {
      name: rawConfig.name,
      shortName: rawConfig.short_name,
      en: {
        title: rawConfig.en_title,
        subtitle: rawConfig.en_subtitle,
        hint: rawConfig.en_hint,
        cardHint: rawConfig.en_card_hint,
        footer: rawConfig.en_footer
      },
      id: {
        title: rawConfig.id_title,
        subtitle: rawConfig.id_subtitle,
        hint: rawConfig.id_hint,
        cardHint: rawConfig.id_card_hint,
        footer: rawConfig.id_footer
      }
    };

    const links = (linksResult?.results || []).map(row => ({
      id: row.id,
      url: row.url,
      icon: row.icon,
      is_highlight: Boolean(row.is_highlight),
      click_count: row.click_count || 0,
      en: {
        title: row.en_title,
        description: row.en_description
      },
      id: {
        title: row.id_title,
        description: row.id_description
      }
    }));

    return jsonResponse({
      success: true,
      config,
      links,
      timestamp: Date.now()
    });
  } catch (err) {
    return errorResponse(`Failed to load data: ${err.message}`, 500);
  }
}
