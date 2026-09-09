import React, { useState, useEffect, useCallback } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import LinkIcon from '@mui/icons-material/Link';
import Person from '@mui/icons-material/Person';
import BarChart from '@mui/icons-material/BarChart';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Logout from '@mui/icons-material/Logout';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Save from '@mui/icons-material/Save';
import Close from '@mui/icons-material/Close';

import { ICON_MAP } from '../../data/iconMap';
import './admin.css';

const DEFAULT_LINK_FORM = {
  id: '',
  url: '',
  icon: 'link',
  en_title: '',
  en_description: '',
  id_title: '',
  id_description: '',
  is_active: 1,
  is_highlight: 0
};

const AdminDashboard = ({ user, onLogout, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState([]);
  const [config, setConfig] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isNewLink, setIsNewLink] = useState(true);
  const [linkFormData, setLinkFormData] = useState(DEFAULT_LINK_FORM);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [linksRes, configRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/links', { cache: 'no-store' }),
        fetch('/api/admin/config', { cache: 'no-store' }),
        fetch('/api/admin/analytics', { cache: 'no-store' })
      ]);

      if (linksRes.ok) {
        const linksData = await linksRes.json();
        if (linksData.success) setLinks(linksData.links || []);
      }
      if (configRes.ok) {
        const configData = await configRes.json();
        if (configData.success) setConfig(configData.config || {});
      }
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        if (analyticsData.success) setAnalytics(analyticsData);
      }
    } catch (err) {
      showFeedback('error', `Gagal memuat data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reorder Links
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    const reordered = newLinks.map((item, idx) => ({
      ...item,
      sort_order: idx + 1
    }));

    setLinks(reordered);

    try {
      const orders = reordered.map(l => ({ id: l.id, sort_order: l.sort_order }));
      const res = await fetch('/api/admin/links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      if (!res.ok) throw new Error('Gagal menyimpan urutan ke D1');
      showFeedback('success', 'Urutan tautan berhasil disimpan');
    } catch (err) {
      showFeedback('error', err.message);
      fetchData(); // Rollback
    }
  };

  // Toggle Active / Inactive
  const handleToggleActive = async (link) => {
    const updatedStatus = link.is_active ? 0 : 1;
    const newLinks = links.map(l => l.id === link.id ? { ...l, is_active: updatedStatus } : l);
    setLinks(newLinks);

    try {
      const res = await fetch('/api/admin/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: link.id, is_active: updatedStatus })
      });
      if (!res.ok) throw new Error('Gagal memperbarui status');
      showFeedback('success', `Tautan '${link.id}' ${updatedStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (err) {
      showFeedback('error', err.message);
      fetchData();
    }
  };

  // Toggle Highlight
  const handleToggleHighlight = async (link) => {
    const updatedStatus = link.is_highlight ? 0 : 1;
    const newLinks = links.map(l => l.id === link.id ? { ...l, is_highlight: updatedStatus } : l);
    setLinks(newLinks);

    try {
      const res = await fetch('/api/admin/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: link.id, is_highlight: updatedStatus })
      });
      if (!res.ok) throw new Error('Gagal memperbarui status highlight');
      showFeedback('success', `Highlight '${link.id}' diperbarui`);
    } catch (err) {
      showFeedback('error', err.message);
      fetchData();
    }
  };

  // Delete Link
  const handleDeleteLink = async (id) => {
    if (!window.confirm(`Hapus tautan '${id}' secara permanen dari Cloudflare D1?`)) return;

    try {
      const res = await fetch(`/api/admin/links?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Gagal menghapus tautan');
      setLinks(prev => prev.filter(l => l.id !== id));
      showFeedback('success', `Tautan '${id}' berhasil dihapus`);
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  // Open Modal for Create or Edit
  const openCreateModal = () => {
    setIsNewLink(true);
    setLinkFormData({
      ...DEFAULT_LINK_FORM,
      sort_order: links.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (link) => {
    setIsNewLink(false);
    setLinkFormData({ ...link });
    setModalOpen(true);
  };

  // Save Link (Form submit)
  const handleSaveLink = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = isNewLink ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/links', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkFormData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan tautan');
      }

      showFeedback('success', `Tautan '${linkFormData.id}' berhasil disimpan ke D1`);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  // Save Profile / Config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan profil');
      }

      showFeedback('success', 'Pengaturan situs dan profil berhasil diperbarui di Cloudflare D1');
    } catch (err) {
      showFeedback('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    onLogout();
  };

  const availableIcons = Object.keys(ICON_MAP);

  return (
    <div className="admin-wrapper">
      {/* Top Navbar */}
      <header className="glass admin-navbar">
        <div className="admin-brand">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Gateway Control Panel</h2>
          <span className="admin-badge">D1 Connected</span>
        </div>

        <div className="admin-nav-actions">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            @{user?.login || 'admin'}
          </span>
          <button onClick={onBackToHome} className="btn-secondary" title="Buka Portal Publik">
            <OpenInNew sx={{ fontSize: 16 }} />
            Lihat Portal
          </button>
          <button onClick={handleLogout} className="btn-danger" title="Keluar">
            <Logout sx={{ fontSize: 16 }} />
            Keluar
          </button>
        </div>
      </header>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`feedback-banner ${feedback.type}`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} style={{ color: 'inherit' }}>
            <Close sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <nav className="glass admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          <LinkIcon sx={{ fontSize: 18 }} />
          Kelola Tautan ({links.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Person sx={{ fontSize: 18 }} />
          Profil & Pengaturan
        </button>
        <button
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart sx={{ fontSize: 18 }} />
          Analitik & Klik
        </button>
      </nav>

      {/* Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <CircularProgress size={36} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Memuat data dari Cloudflare D1...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: LINKS */}
          {activeTab === 'links' && (
            <section className="glass admin-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Daftar Tautan Portal</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Urutan dan status langsung sinkron seketika ke database SQLite D1.
                  </p>
                </div>
                <button onClick={openCreateModal} className="btn-primary">
                  <Add sx={{ fontSize: 18 }} />
                  Tambah Tautan
                </button>
              </div>

              <div className="admin-links-list">
                {links.map((link, idx) => {
                  const IconComponent = ICON_MAP[link.icon] || ICON_MAP.link;
                  return (
                    <div 
                      key={link.id} 
                      className={`glass admin-link-card ${!link.is_active ? 'inactive' : ''}`}
                    >
                      {/* Reorder Arrows */}
                      <div className="link-reorder-controls">
                        <button 
                          className="reorder-btn" 
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          title="Pindah ke atas"
                        >
                          <KeyboardArrowUp sx={{ fontSize: 20 }} />
                        </button>
                        <button 
                          className="reorder-btn" 
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === links.length - 1}
                          title="Pindah ke bawah"
                        >
                          <KeyboardArrowDown sx={{ fontSize: 20 }} />
                        </button>
                      </div>

                      {/* Link Info */}
                      <div className="admin-link-info">
                        <div className="link-avatar">
                          <IconComponent sx={{ fontSize: 22, color: 'var(--accent)' }} />
                        </div>
                        <div className="link-details">
                          <div className="link-primary-title">
                            <span>{link.id_title || link.en_title}</span>
                            {link.is_highlight ? (
                              <Star sx={{ fontSize: 16, color: '#f59e0b' }} title="Featured / Highlight" />
                            ) : null}
                          </div>
                          <div className="link-url-sub" title={link.url}>
                            {link.url}
                          </div>
                        </div>
                      </div>

                      {/* Actions & Metrics */}
                      <div className="admin-link-actions">
                        <span className="click-badge" title="Total Klik">
                          {link.click_count || 0} klik
                        </span>

                        <button 
                          className="btn-secondary"
                          onClick={() => handleToggleHighlight(link)}
                          title={link.is_highlight ? "Hapus highlight" : "Jadikan highlight"}
                          style={{ padding: '0.4rem 0.6rem' }}
                        >
                          {link.is_highlight ? <Star sx={{ fontSize: 16, color: '#f59e0b' }} /> : <StarBorder sx={{ fontSize: 16 }} />}
                        </button>

                        <button 
                          className="btn-secondary"
                          onClick={() => handleToggleActive(link)}
                          title={link.is_active ? "Nonaktifkan tautan" : "Aktifkan tautan"}
                          style={{ padding: '0.4rem 0.6rem' }}
                        >
                          {link.is_active ? <Visibility sx={{ fontSize: 16, color: '#10b981' }} /> : <VisibilityOff sx={{ fontSize: 16, color: '#ef4444' }} />}
                        </button>

                        <button 
                          className="btn-secondary"
                          onClick={() => openEditModal(link)}
                          title="Edit Tautan"
                          style={{ padding: '0.4rem 0.6rem' }}
                        >
                          <Edit sx={{ fontSize: 16 }} />
                        </button>

                        <button 
                          className="btn-danger"
                          onClick={() => handleDeleteLink(link.id)}
                          title="Hapus"
                          style={{ padding: '0.4rem 0.6rem' }}
                        >
                          <Delete sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* TAB 2: PROFILE & CONFIG */}
          {activeTab === 'profile' && config && (
            <section className="glass admin-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Pengaturan Profil & Teks Portal</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Perubahan langsung disimpan ke Cloudflare D1 dan tampil seketika di fatah.web.id.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.name || ''} 
                      onChange={e => setConfig({ ...config, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Singkat / Brand</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.short_name || ''} 
                      onChange={e => setConfig({ ...config, short_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Judul Utama (EN)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.en_title || ''} 
                      onChange={e => setConfig({ ...config, en_title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Judul Utama (ID)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.id_title || ''} 
                      onChange={e => setConfig({ ...config, id_title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Subjudul / Profesi (EN)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.en_subtitle || ''} 
                      onChange={e => setConfig({ ...config, en_subtitle: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subjudul / Profesi (ID)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.id_subtitle || ''} 
                      onChange={e => setConfig({ ...config, id_subtitle: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hint Tema & Bahasa (EN)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.en_hint || ''} 
                      onChange={e => setConfig({ ...config, en_hint: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hint Tema & Bahasa (ID)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.id_hint || ''} 
                      onChange={e => setConfig({ ...config, id_hint: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Petunjuk Kartu (EN)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.en_card_hint || ''} 
                      onChange={e => setConfig({ ...config, en_card_hint: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Petunjuk Kartu (ID)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.id_card_hint || ''} 
                      onChange={e => setConfig({ ...config, id_card_hint: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Footer Copyright (EN)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.en_footer || ''} 
                      onChange={e => setConfig({ ...config, en_footer: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Footer Copyright (ID)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={config.id_footer || ''} 
                      onChange={e => setConfig({ ...config, id_footer: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save sx={{ fontSize: 18 }} />}
                    Simpan Perubahan ke D1
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && analytics && (
            <section className="glass admin-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Statistik & Analitik Klik Real-Time</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Pelacakan klik link yang tercatat otomatis di tabel link_clicks D1.
                  </p>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="glass stat-card">
                  <div className="stat-num">{analytics.summary?.totalClicks || 0}</div>
                  <div className="stat-label">Total Klik Semua Tautan</div>
                </div>
                <div className="glass stat-card">
                  <div className="stat-num">{analytics.summary?.totalLinks || 0}</div>
                  <div className="stat-label">Total Tautan Terdaftar</div>
                </div>
              </div>

              <h4 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem' }}>Performa Setiap Tautan</h4>
              <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Tautan</th>
                      <th>URL</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Jumlah Klik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.topLinks || []).map(item => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.id_title || item.en_title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{item.url}</td>
                        <td>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '6px', 
                            fontSize: '0.75rem',
                            background: item.is_active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: item.is_active ? '#10b981' : '#ef4444'
                          }}>
                            {item.is_active ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
                          {item.click_count || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 style={{ margin: '1.5rem 0 1rem', fontSize: '1.1rem' }}>50 Aktivitas Klik Terakhir</h4>
              <div style={{ overflowX: 'auto' }}>
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Waktu</th>
                      <th>ID Tautan</th>
                      <th>Negara</th>
                      <th>Referer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.recentClicks || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                          Belum ada aktivitas klik tercatat.
                        </td>
                      </tr>
                    ) : (
                      analytics.recentClicks.map(log => (
                        <tr key={log.id}>
                          <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{log.clicked_at}</td>
                          <td style={{ fontWeight: 600 }}>{log.link_id}</td>
                          <td>{log.country || 'Unknown'}</td>
                          <td style={{ color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.referer || 'Langsung / Direct'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}

      {/* CREATE / EDIT LINK MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="glass modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {isNewLink ? 'Tambah Tautan Baru' : `Edit Tautan: ${linkFormData.id}`}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                <Close sx={{ fontSize: 22 }} />
              </button>
            </div>

            <form onSubmit={handleSaveLink}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ID Unik (slug/identifier)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={linkFormData.id} 
                    onChange={e => setLinkFormData({ ...linkFormData, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                    disabled={!isNewLink}
                    placeholder="misal: github, resume, portofolio"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ikon</label>
                  <select 
                    className="form-select"
                    value={linkFormData.icon}
                    onChange={e => setLinkFormData({ ...linkFormData, icon: e.target.value })}
                  >
                    {availableIcons.map(iconKey => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target URL</label>
                <input 
                  type="url" 
                  className="form-input"
                  value={linkFormData.url} 
                  onChange={e => setLinkFormData({ ...linkFormData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Judul Tautan (Bahasa Indonesia)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={linkFormData.id_title} 
                    onChange={e => setLinkFormData({ ...linkFormData, id_title: e.target.value })}
                    placeholder="Contoh: Portofolio Web"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Judul Tautan (English)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={linkFormData.en_title} 
                    onChange={e => setLinkFormData({ ...linkFormData, en_title: e.target.value })}
                    placeholder="Example: Web Portfolio"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Deskripsi Singkat (ID)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={linkFormData.id_description} 
                    onChange={e => setLinkFormData({ ...linkFormData, id_description: e.target.value })}
                    placeholder="Contoh: Proyek dan pengalaman saya"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Deskripsi Singkat (EN)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={linkFormData.en_description} 
                    onChange={e => setLinkFormData({ ...linkFormData, en_description: e.target.value })}
                    placeholder="Example: My projects and experiences"
                  />
                </div>
              </div>

              <div className="form-row" style={{ alignItems: 'center', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox"
                    checked={Boolean(linkFormData.is_active)}
                    onChange={e => setLinkFormData({ ...linkFormData, is_active: e.target.checked ? 1 : 0 })}
                  />
                  <span>Tampilkan di Portal (Aktif)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox"
                    checked={Boolean(linkFormData.is_highlight)}
                    onChange={e => setLinkFormData({ ...linkFormData, is_highlight: e.target.checked ? 1 : 0 })}
                  />
                  <span>Beri Tanda Bintang (Highlight)</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save sx={{ fontSize: 18 }} />}
                  Simpan Tautan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
