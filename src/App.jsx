import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLanguage } from './context/LanguageProvider';
import { useTheme } from './context/ThemeProvider';
import Loader from './components/Loader';
import LinkCard from './components/LinkCard';
import SEOHead from './components/SEOHead';
import AdminPortal from './components/admin/AdminPortal';
import LightMode from '@mui/icons-material/LightMode';
import DarkMode from '@mui/icons-material/DarkMode';
import CircularProgress from '@mui/material/CircularProgress';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { ICON_MAP } from './data/iconMap';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [transitionState, setTransitionState] = useState(null);
  const { t, lang, toggleLanguage, config, configLoading } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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

  // GSAP Entrance Animation for Public Portal
  useEffect(() => {
    if (!isAdminRoute && !configLoading && !loading && mainRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        
        tl.to('.header', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform'
        })
        .to('.link-card', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform'
        }, "-=0.4")
        .to('.footer', {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform'
        }, "-=0.3");
      }, mainRef);

      return () => ctx.revert();
    }
  }, [loading, configLoading, isAdminRoute]);

  const handleToggle = (type, action) => {
    if (transitionState) return; // Prevent spam clicks
    setTransitionState(type);

    const tl = gsap.timeline({
      onComplete: () => {
        action();
        
        const delay = type === 'theme' ? 600 : 400;
        
        setTimeout(() => {
          if (type === 'theme') {
             gsap.to('.theme-overlay', { 
               autoAlpha: 0, 
               duration: 0.4 
             });
          }
          
          gsap.to(['.header h1', '.header p', '.status-badge', '.link-card', '.footer'], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: 'transform',
            onComplete: () => setTransitionState(null)
          });
        }, delay); 
      }
    });

    if (type === 'theme') {
      tl.to('.theme-overlay', { autoAlpha: 1, duration: 0.25 }, 0);
    }

    tl.to(['.header h1', '.header p', '.status-badge', '.link-card', '.footer'], {
      opacity: 0,
      y: -8,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power2.in'
    }, 0);
  };

  return (
    <>
      <SEOHead />
      {!isAdminRoute && (loading || configLoading) && <Loader onComplete={() => setLoading(false)} />}
      
      <div className="theme-overlay">
        <CircularProgress size={44} sx={{ color: 'var(--text-primary)' }} />
      </div>

      <div className="app-container" ref={mainRef}>
        {isAdminRoute ? (
          <AdminPortal onBackToHome={() => navigateTo('/')} />
        ) : (
          <div className="content-wrapper">
            <header className="header">
              <div className="status-badge">
                <span className="status-dot"></span>
                <span>{lang === 'en' ? 'GATEWAY // ONLINE' : 'GERBANG // AKTIF'}</span>
              </div>

              <div className="title-row">
                <button 
                  className="control-btn" 
                  onClick={() => handleToggle('lang', toggleLanguage)} 
                  disabled={transitionState !== null}
                  aria-label="Toggle Language"
                >
                  {transitionState === 'lang' ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : (lang === 'en' ? '🇬🇧' : '🇮🇩')}
                </button>
                <h1>{t('title')}</h1>
                <button 
                  className="control-btn" 
                  onClick={() => handleToggle('theme', toggleTheme)} 
                  disabled={transitionState !== null}
                  aria-label="Toggle Theme"
                >
                  {transitionState === 'theme' ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : (theme === 'dark' ? <DarkMode /> : <LightMode />)}
                </button>
              </div>

              <p className="subtitle">{t('subtitle')}</p>
              <p className="feature-hint">{t('hint')}</p>
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
