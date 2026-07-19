import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    title: "FATAH",
    subtitle: "Network Administrator & AI Prompt Specialist",
    portfolio: "Web Portfolio",
    portfolioDesc: "My projects and experiences",
    journal: "Web Journal",
    journalDesc: "Articles, notes, and thoughts",
    github: "GitHub",
    githubDesc: "Open source contributions & code",
    linkedin: "LinkedIn",
    linkedinDesc: "Professional network & resume",
    threads: "Threads",
    threadsDesc: "Short thoughts and updates",
    email: "Email",
    emailDesc: "Send me a message or business inquiry via email",
    whatsapp: "WhatsApp",
    whatsappDesc: "Contact me directly for a fast response"
  },
  id: {
    title: "FATAH",
    subtitle: "Administrator Jaringan & Spesialis AI Prompt",
    portfolio: "Portofolio Web",
    portfolioDesc: "Proyek dan pengalaman saya",
    journal: "Jurnal Web",
    journalDesc: "Artikel, catatan, dan pemikiran",
    github: "GitHub",
    githubDesc: "Kontribusi kode sumber terbuka",
    linkedin: "LinkedIn",
    linkedinDesc: "Jaringan profesional & resume",
    threads: "Threads",
    threadsDesc: "Pikiran singkat dan pembaruan",
    email: "Email",
    emailDesc: "Kirim pesan atau tawaran kerja melalui email",
    whatsapp: "WhatsApp",
    whatsappDesc: "Hubungi saya secara langsung untuk respons cepat"
  }
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
