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
        gsap.registerPlugin();
        const customEase = "M0,0 C0.16,1 0.3,1 1,1";

        const tl = gsap.timeline();
        
        tl.to('.header', {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: `custom(${customEase})`
        })
        .to('.link-card', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: `custom(${customEase})`
        }, "-=0.6")
        .to('.footer', {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, "-=0.4");
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
        
        const delay = type === 'theme' ? 800 : 500;
        
        setTimeout(() => {
          if (type === 'theme') {
             gsap.to('.theme-overlay', { 
               autoAlpha: 0, 
               duration: 0.5 
             });
          }
          
          gsap.to(['.header h1', '.header p', '.link-card', '.footer'], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "M0,0 C0.16,1 0.3,1 1,1",
            onComplete: () => setTransitionState(null)
          });
        }, delay); 
      }
    });

    if (type === 'theme') {
      tl.to('.theme-overlay', { autoAlpha: 1, duration: 0.3 }, 0);
    }

    tl.to(['.header h1', '.header p', '.link-card', '.footer'], {
      opacity: 0,
      y: -10,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.in'
    }, 0);
  };

  return (
    <>
      <SEOHead />
      {!isAdminRoute && (loading || configLoading) && <Loader onComplete={() => setLoading(false)} />}
      
      <div className="theme-overlay">
        <CircularProgress size={48} sx={{ color: 'var(--text-primary)' }} />
      </div>

      <div className="app-container" ref={mainRef}>
        <div className="bg-mesh"></div>

        {isAdminRoute ? (
          <AdminPortal onBackToHome={() => navigateTo('/')} />
        ) : (
          <div className="content-wrapper">
            <header className="header">
              <div className="title-row">
                <button 
                  className="glass control-btn" 
                  onClick={() => handleToggle('lang', toggleLanguage)} 
                  disabled={transitionState !== null}
                  aria-label="Toggle Language"
                >
                  {transitionState === 'lang' ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : (lang === 'en' ? '🇬🇧' : '🇮🇩')}
                </button>
                <h1>{t('title')}</h1>
                <button 
                  className="glass control-btn" 
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

            <footer className="footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <p>{t('footer')}</p>
              <button 
                onClick={() => navigateTo('/admin')} 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.35rem', 
                  fontSize: '0.75rem', 
                  color: 'var(--text-secondary)',
                  opacity: 0.7,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                title="Admin Control Panel"
              >
                <LockOutlined sx={{ fontSize: 13 }} />
                <span>Admin</span>
              </button>
            </footer>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
