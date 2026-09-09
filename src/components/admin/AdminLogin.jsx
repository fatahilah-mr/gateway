import React from 'react';
import GitHub from '@mui/icons-material/GitHub';
import LockOutlined from '@mui/icons-material/LockOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';

const AdminLogin = ({ onBackToHome }) => {
  const handleLogin = () => {
    window.location.href = '/api/auth/login?redirect=/admin';
  };

  return (
    <div className="admin-wrapper">
      <div className="glass admin-login-card">
        <div className="login-icon">
          <LockOutlined sx={{ fontSize: 32 }} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Gateway Admin
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Masuk dengan akun GitHub Anda untuk mengelola tautan, profil, dan memantau analitik Cloudflare D1.
        </p>

        <button 
          onClick={handleLogin}
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.25rem' }}
        >
          <GitHub sx={{ fontSize: 22 }} />
          Masuk dengan GitHub (@fatahilah-mr)
        </button>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          🔒 Akses dienkripsi dan hanya diizinkan untuk pemilik repositori.
        </p>

        <button 
          onClick={onBackToHome}
          className="btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <ArrowBack sx={{ fontSize: 18 }} />
          Kembali ke Portal Publik
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
