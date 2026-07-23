import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

import { useConfig } from '../hooks/useConfig';

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('id'); // default ID
  const { config, loading, error } = useConfig();
  
  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'id' : 'en');
  };

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const translations = config ? {
    en: { title: config.name, ...config.en },
    id: { title: config.name, ...config.id }
  } : { en: {}, id: {} };

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, config, configLoading: loading }}>
      {children}
    </LanguageContext.Provider>
  );
};
