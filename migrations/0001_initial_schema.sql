-- Migration: 0001_initial_schema.sql
-- Description: Inisialisasi skema tabel untuk Gateway Portal di Cloudflare D1

CREATE TABLE IF NOT EXISTS site_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    en_title TEXT NOT NULL,
    en_subtitle TEXT NOT NULL,
    en_hint TEXT NOT NULL,
    en_card_hint TEXT NOT NULL,
    en_footer TEXT NOT NULL,
    id_title TEXT NOT NULL,
    id_subtitle TEXT NOT NULL,
    id_hint TEXT NOT NULL,
    id_card_hint TEXT NOT NULL,
    id_footer TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'link',
    en_title TEXT NOT NULL,
    en_description TEXT NOT NULL,
    id_title TEXT NOT NULL,
    id_description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_highlight INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS link_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id TEXT NOT NULL,
    referer TEXT,
    country TEXT,
    user_agent TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_links_sort_order ON links(sort_order);
CREATE INDEX IF NOT EXISTS idx_links_is_active ON links(is_active);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON link_clicks(link_id);
