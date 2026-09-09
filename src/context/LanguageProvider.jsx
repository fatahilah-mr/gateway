import React, { createContext, useContext, useState, useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  // Determine initial language based on URL path, preference cookie/storage, or browser locale
  const getInitialLang = () => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    if (path === '/id' || path.startsWith('/id/')) {
      return 'id';
    }
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('lang_pref');
      if (stored === 'id' || stored === 'en') {
        return stored;
      }
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('id')) {
        return 'id';
      }
    }
    return 'en';
  };

  const [lang, setLang] = useState(getInitialLang);
  const { config, loading, error } = useConfig();

  // Switch language explicitly and sync URL + Cookie
  const switchLanguage = (targetLang) => {
    if (targetLang !== 'id' && targetLang !== 'en') return;
    setLang(targetLang);
    localStorage.setItem('lang_pref', targetLang);
    document.cookie = `lang_pref=${targetLang}; path=/; max-age=31536000; SameSite=Lax`;

    const currentPath = window.location.pathname;
    if (targetLang === 'id') {
      if (currentPath !== '/id' && !currentPath.startsWith('/admin')) {
        window.history.pushState({}, '', '/id');
      }
    } else {
      if (currentPath.startsWith('/id')) {
        window.history.pushState({}, '', '/');
      }
    }
  };

  const toggleLanguage = () => {
    switchLanguage(lang === 'en' ? 'id' : 'en');
  };

  // Sync state on popstate (browser back / forward button)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/id' || path.startsWith('/id/')) {
        setLang('id');
      } else if (path === '/' || path === '') {
        const stored = localStorage.getItem('lang_pref');
        setLang(stored === 'id' ? 'id' : 'en');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keep URL path in sync with initial language on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (!path.startsWith('/admin')) {
      if (lang === 'id' && path === '/') {
        window.history.replaceState({}, '', '/id');
      } else if (lang === 'en' && path.startsWith('/id')) {
        window.history.replaceState({}, '', '/');
      }
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const translations = config ? {
    en: { title: config.name, ...config.en },
    id: { title: config.name, ...config.id }
  } : { en: {}, id: {} };

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, setLanguage: switchLanguage, toggleLanguage, t, config, configLoading: loading, error }}>
      {children}
    </LanguageContext.Provider>
  );
};
