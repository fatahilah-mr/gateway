import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPortal = ({ onBackToHome }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', {
          cache: 'no-store',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.warn('Auth check failed:', err);
      } finally {
        if (isMounted) setCheckingAuth(false);
      }
    }

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <CircularProgress size={42} sx={{ color: 'var(--text-primary)' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Memverifikasi sesi admin...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onBackToHome={onBackToHome} />;
  }

  return (
    <AdminDashboard 
      user={user} 
      onLogout={() => setUser(null)} 
      onBackToHome={onBackToHome} 
    />
  );
};

export default AdminPortal;
