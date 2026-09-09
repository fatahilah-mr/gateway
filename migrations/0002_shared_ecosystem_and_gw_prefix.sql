-- Migration: 0002_shared_ecosystem_and_gw_prefix.sql
-- Description: Standardisasi prefix gw_ untuk Gateway Portal dan implementasi dynamic registry _README_SHARED_DATABASE

-- 1. Tabel Registrasi Ekosistem Multi-App
CREATE TABLE IF NOT EXISTS _ecosystem_registry (
    app_id TEXT PRIMARY KEY,
    app_name TEXT NOT NULL,
    table_prefix TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daftarkan Gateway Portal
INSERT OR REPLACE INTO _ecosystem_registry (
    app_id, app_name, table_prefix, domain, description, status, updated_at
) VALUES (
    'gateway',
    'Gateway Link Portal',
    'gw_',
    'link.fmr.web.id',
    'Personal Link Hub, Social Gateway & Public Portal',
    'active',
    CURRENT_TIMESTAMP
);

-- 2. View Dinamis _README_SHARED_DATABASE (Live Schema Registry untuk AI Agent)
DROP VIEW IF EXISTS _README_SHARED_DATABASE;
CREATE VIEW _README_SHARED_DATABASE AS
SELECT 
    r.app_name AS [APPLICATION],
    r.table_prefix AS [PREFIX_WAJIB],
    r.domain AS [DOMAIN_WEB],
    (
        SELECT GROUP_CONCAT(m.name, ', ')
        FROM sqlite_master m
        WHERE m.type = 'table' AND m.name LIKE r.table_prefix || '%'
    ) AS [TABEL_FISIK_AKTIF_REALTIME],
    '⚠️ ATURAN AI: HANYA KELOLA TABEL DENGAN PREFIX DI ATAS. DILARANG DROP TABEL PREFIX LAIN!' AS [PERINGATAN_UNTUK_AI]
FROM _ecosystem_registry r
UNION ALL
SELECT 
    '=== PROTOKOL AI UNTUK MENAMBAH WEB BARU ===' AS [APPLICATION],
    'SOP_REGISTER' AS [PREFIX_WAJIB],
    'Seluruh web pribadi berbagi 1 D1 ini' AS [DOMAIN_WEB],
    'Jalankan: INSERT INTO _ecosystem_registry (app_id, app_name, table_prefix, domain, description) VALUES (...);' AS [TABEL_FISIK_AKTIF_REALTIME],
    'Gunakan prefix unik (contoh: blog_, port_). View ini akan otomatis mendeteksi tabel baru Anda!' AS [PERINGATAN_UNTUK_AI];

-- 3. Tabel Standard Ber-prefix gw_
CREATE TABLE IF NOT EXISTS gw_site_config (
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

CREATE TABLE IF NOT EXISTS gw_links (
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

CREATE TABLE IF NOT EXISTS gw_link_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id TEXT NOT NULL,
    referer TEXT,
    country TEXT,
    user_agent TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES gw_links(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_gw_links_sort_order ON gw_links(sort_order);
CREATE INDEX IF NOT EXISTS idx_gw_links_is_active ON gw_links(is_active);
CREATE INDEX IF NOT EXISTS idx_gw_clicks_link_id ON gw_link_clicks(link_id);
