import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

import { USER_CONFIG } from '../data/config';

const translations = {
  en: { title: USER_CONFIG.name, ...USER_CONFIG.en },
  id: { title: USER_CONFIG.name, ...USER_CONFIG.id }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // default EN
  
  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'id' : 'en');
  };

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
