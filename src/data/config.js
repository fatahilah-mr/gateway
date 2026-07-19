import { Globe, BookOpen, Github, Linkedin, MessageCircle, Mail, Smartphone } from 'lucide-react';

export const USER_CONFIG = {
  // Personal Info
  name: "FATAH",
  
  // English Translations
  en: {
    subtitle: "Network Engineer & Web Developer",
    hint: "Tap the icons above to change language or theme",
    footer: `© ${new Date().getFullYear()} Fatahilah Miftahul Rahman. All Rights Reserved.`,
    portfolio: "Web Portfolio",
    portfolioDesc: "My projects and experiences",
    blog: "Web Blog",
    blogDesc: "Articles, tutorials, and tech insights",
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

  // Indonesian Translations
  id: {
    subtitle: "Teknisi Jaringan & Pengembang Web",
    hint: "Ketuk ikon di atas untuk mengubah bahasa atau tema",
    footer: `© ${new Date().getFullYear()} Fatahilah Miftahul Rahman. Hak Cipta Dilindungi.`,
    portfolio: "Portofolio Web",
    portfolioDesc: "Proyek dan pengalaman saya",
    blog: "Blog Web",
    blogDesc: "Tulisan, tutorial, dan wawasan teknologi",
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
  },

  // Link Definitions
  links: [
    {
      id: 'portfolio',
      url: 'https://fatahmr.my.id',
      titleKey: 'portfolio',
      descKey: 'portfolioDesc',
      icon: Globe
    },
    {
      id: 'blog',
      url: 'https://blog.fatahmr.my.id',
      titleKey: 'blog',
      descKey: 'blogDesc',
      icon: BookOpen
    },
    {
      id: 'github',
      url: 'https://github.com/fatahilah-mr',
      titleKey: 'github',
      descKey: 'githubDesc',
      icon: Github
    },
    {
      id: 'linkedin',
      url: 'https://linkedin.com/in/fatahilah-mr',
      titleKey: 'linkedin',
      descKey: 'linkedinDesc',
      icon: Linkedin
    },
    {
      id: 'threads',
      url: 'https://www.threads.com/@fatah_f100',
      titleKey: 'threads',
      descKey: 'threadsDesc',
      icon: MessageCircle
    },
    {
      id: 'email',
      url: 'mailto:fatahilah.f10@gmail.com',
      titleKey: 'email',
      descKey: 'emailDesc',
      icon: Mail
    },
    {
      id: 'whatsapp',
      url: 'https://wa.me/6285117470256?text=%3E%20_from%20gateway_%0AHello%20Fatah!',
      titleKey: 'whatsapp',
      descKey: 'whatsappDesc',
      icon: Smartphone
    }
  ]
};
