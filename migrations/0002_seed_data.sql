-- Migration: 0002_seed_data.sql
-- Description: Seed data dari config.json ke Cloudflare D1

INSERT INTO site_config (
    id, name, short_name,
    en_title, en_subtitle, en_hint, en_card_hint, en_footer,
    id_title, id_subtitle, id_hint, id_card_hint, id_footer
) VALUES (
    'default',
    'Fatahilah Miftahul Rahman',
    'FATAH',
    'Fatahilah Miftahul Rahman',
    'Network Engineer & Web Developer',
    'Tap the icons above to change language or theme',
    '👇 Tap a card to visit the link',
    '© 2026 Fatahilah Miftahul Rahman. All Rights Reserved.',
    'Fatahilah Miftahul Rahman',
    'Teknisi Jaringan & Pengembang Web',
    'Ketuk ikon di atas untuk mengubah bahasa atau tema',
    '👇 Ketuk kartu di bawah untuk membuka tautannya',
    '© 2026 Fatahilah Miftahul Rahman. Hak Cipta Dilindungi.'
) ON CONFLICT(id) DO NOTHING;

INSERT INTO links (id, url, icon, en_title, en_description, id_title, id_description, sort_order, is_active, is_highlight, click_count) VALUES
('portfolio', 'https://fatahmr.my.id', 'web', 'Web Portfolio', 'My projects and experiences', 'Portofolio Web', 'Proyek dan pengalaman saya', 1, 1, 0, 0),
('blog', 'https://blog.fatahmr.my.id', 'book', 'Web Blog', 'Articles, tutorials, and tech insights', 'Blog Web', 'Tulisan, tutorial, dan wawasan teknologi', 2, 1, 0, 0),
('status', 'https://status.fatah.web.id', 'web', 'Website Status', 'A page showing real-time availability and status for all Fatah web services.', 'Status Website', 'Halaman ketersediaan dan status real-time untuk semua layanan web Fatah.', 3, 1, 0, 0),
('github', 'https://github.com/fatahilah-mr', 'github', 'GitHub', 'Open source contributions & code', 'GitHub', 'Kontribusi kode sumber terbuka', 4, 1, 0, 0),
('linkedin', 'https://linkedin.com/in/fatahilah-mr', 'linkedin', 'LinkedIn', 'Professional network & resume', 'LinkedIn', 'Jaringan profesional & resume', 5, 1, 0, 0),
('threads', 'https://www.threads.com/@fatah_f100', 'chat', 'Threads', 'Short thoughts and updates', 'Threads', 'Pikiran singkat dan pembaruan', 6, 1, 0, 0),
('email', 'mailto:fatahilah@protonmail.com', 'email', 'Email', 'Send me a message or business inquiry via email', 'Email', 'Kirim pesan atau tawaran kerja melalui email', 7, 1, 0, 0),
('whatsapp', 'https://wa.me/6285117470256?text=%3E%20_from%20gateway_%0AHello%20Fatah!', 'phone', 'WhatsApp', 'Contact me directly for a fast response', 'WhatsApp', 'Hubungi saya secara langsung untuk respons cepat', 8, 1, 0, 0)
ON CONFLICT(id) DO NOTHING;
