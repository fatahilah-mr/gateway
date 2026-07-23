import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageProvider';

export default function SEOHead() {
  const { lang, t } = useLanguage();

  useEffect(() => {
    // 1. Update HTML lang attribute
    document.documentElement.lang = lang;

    // 2. Dynamic Title based on active language for max SEO keyword matching
    const pageTitle = lang === 'id' 
      ? 'Fatahilah Miftahul Rahman | Portal & Hub Link Resmi'
      : 'Fatahilah Miftahul Rahman | Official Gateway & Link Hub';
    
    document.title = pageTitle;

    // 3. Dynamic Meta Description
    const metaDesc = lang === 'id'
      ? 'Situs resmi dan portal link Fatahilah Miftahul Rahman. Akses portofolio Teknisi Jaringan, blog teknologi, proyek GitHub, profil LinkedIn, dan kontak.'
      : 'Official website and link portal of Fatahilah Miftahul Rahman. Access Network Engineering portfolio, tech blog, GitHub projects, LinkedIn profile, and contact info.';

    const descElem = document.querySelector('meta[name="description"]');
    if (descElem) {
      descElem.setAttribute('content', metaDesc);
    }

    const ogDescElem = document.querySelector('meta[property="og:description"]');
    if (ogDescElem) {
      ogDescElem.setAttribute('content', metaDesc);
    }
  }, [lang, t]);

  return null;
}
