import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLanguage } from './context/LanguageProvider';
import { useTheme } from './context/ThemeProvider';
import Loader from './components/Loader';
import LinkCard from './components/LinkCard';
import { Sun, Moon, Loader2 } from 'lucide-react';
import { USER_CONFIG } from './data/config';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [transitionState, setTransitionState] = useState(null);
  const { t, lang, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const mainRef = useRef(null);

  const links = USER_CONFIG.links;

  // GSAP Entrance Animation
  useEffect(() => {
    if (!loading && mainRef.current) {
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
          stagger: 0.1,
          ease: `custom(${customEase})`
        }, "-=0.6");
      }, mainRef);

      return () => ctx.revert();
    }
  }, [loading]);

  const handleToggle = (type, action) => {
    if (transitionState) return; // Prevent multiple clicks
    setTransitionState(type);

    const tl = gsap.timeline({
      onComplete: () => {
        action();
        
        // Extra delay to allow new background image to load
        const delay = type === 'theme' ? 800 : 500;
        
        setTimeout(() => {
          if (type === 'theme') {
             gsap.to('.theme-overlay', { 
               autoAlpha: 0, 
               duration: 0.5 
             });
          }
          
          gsap.to(['.header h1', '.header p', '.link-card'], {
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

    // Fade out content before switching
    tl.to(['.header h1', '.header p', '.link-card'], {
      opacity: 0,
      y: -10,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.in'
    }, 0);
  };

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      <div className="theme-overlay">
        <Loader2 className="spin-icon large-spinner" />
      </div>

      <div className="app-container" ref={mainRef}>
        <div className="bg-mesh"></div>
        
        <div className="content-wrapper">
          <header className="header">
            <div className="title-row">
              <button 
                className="glass control-btn" 
                onClick={() => handleToggle('lang', toggleLanguage)} 
                disabled={transitionState !== null}
                aria-label="Toggle Language"
              >
                {transitionState === 'lang' ? <Loader2 className="spin-icon" /> : lang.toUpperCase()}
              </button>
              <h1>{t('title')}</h1>
              <button 
                className="glass control-btn" 
                onClick={() => handleToggle('theme', toggleTheme)} 
                disabled={transitionState !== null}
                aria-label="Toggle Theme"
              >
                {transitionState === 'theme' ? <Loader2 className="spin-icon" /> : (theme === 'dark' ? <Moon /> : <Sun />)}
              </button>
            </div>
            <p className="subtitle">{t('subtitle')}</p>
            <p className="feature-hint">{t('hint')}</p>
          </header>

          <main className="links-container">
            {links.map((link) => (
              <LinkCard 
                key={link.id}
                url={link.url}
                title={t(link.titleKey)}
                description={t(link.descKey)}
                icon={link.icon}
              />
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
