import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './context/LanguageProvider';
import LinkCard from './components/LinkCard';
import SEOHead from './components/SEOHead';
import AdminPortal from './components/admin/AdminPortal';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { ICON_MAP } from './data/iconMap';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { t, lang, switchLanguage, config } = useLanguage();
  const mainRef = useRef(null);

  // Sync route on browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  const links = config?.links.map(link => ({
    id: link.id,
    url: link.url,
    titleKey: lang === 'en' ? link.en_title : link.id_title,
    descKey: lang === 'en' ? link.en_description : link.id_description,
    icon: ICON_MAP[link.icon] || ICON_MAP.link
  })) ?? [];

  return (
    <>
      <SEOHead />
      
      <div className={`app-container ${isAdminRoute ? 'is-admin' : ''}`} ref={mainRef}>
        {isAdminRoute ? (
          <AdminPortal onBackToHome={() => navigateTo('/')} />
        ) : (
          <div className="content-wrapper">
            <header className="header">
              <div className="header-top-row">
                <div className="lang-switcher">
                  <button 
                    type="button" 
                    className={`lang-btn ${lang === 'id' ? 'is-active' : ''}`}
                    onClick={() => switchLanguage('id')}
                    aria-label="Bahasa Indonesia"
                  >
                    ID
                  </button>
                  <span className="lang-divider">/</span>
                  <button 
                    type="button" 
                    className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}
                    onClick={() => switchLanguage('en')}
                    aria-label="English"
                  >
                    EN
                  </button>
                </div>
              </div>

              <h1 className="header-title">{t('title')}</h1>
              <p className="subtitle">{t('subtitle')}</p>
              <p className="card-hint">{t('cardHint')}</p>
            </header>

            <main className="links-container">
              {links.map((link) => (
                <LinkCard 
                  key={link.id}
                  id={link.id}
                  url={link.url}
                  title={link.titleKey}
                  description={link.descKey}
                  icon={link.icon}
                />
              ))}
            </main>

            <footer className="footer">
              <p>{t('footer')}</p>
              <button 
                onClick={() => navigateTo('/admin')} 
                className="admin-link-btn"
                title="Admin Control Panel"
              >
                <LockOutlined sx={{ fontSize: 13 }} />
                <span>ADMIN</span>
              </button>
            </footer>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
