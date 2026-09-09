import React, { useState } from 'react';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';

const ICON_THEMES = {
  portfolio: {
    bg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(2, 132, 199, 0.32))',
    color: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.25)'
  },
  blog: {
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.32))',
    color: '#d97706',
    glow: 'rgba(251, 191, 36, 0.25)'
  },
  status: {
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.32))',
    color: '#059669',
    glow: 'rgba(52, 211, 153, 0.25)'
  },
  github: {
    bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(124, 58, 237, 0.32))',
    color: '#7c3aed',
    glow: 'rgba(167, 139, 250, 0.25)'
  },
  linkedin: {
    bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(29, 78, 216, 0.32))',
    color: '#2563eb',
    glow: 'rgba(96, 165, 250, 0.25)'
  },
  threads: {
    bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.18), rgba(225, 29, 72, 0.32))',
    color: '#e11d48',
    glow: 'rgba(251, 113, 133, 0.25)'
  },
  email: {
    bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.18), rgba(234, 88, 12, 0.32))',
    color: '#ea580c',
    glow: 'rgba(251, 146, 60, 0.25)'
  },
  whatsapp: {
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(4, 120, 87, 0.32))',
    color: '#047857',
    glow: 'rgba(52, 211, 153, 0.25)'
  }
};

const DEFAULT_THEME = {
  bg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(14, 165, 233, 0.32))',
  color: '#0284c7',
  glow: 'rgba(56, 189, 248, 0.25)'
};

const LinkCard = ({ id, url, title, description, icon: Icon }) => {
  const [isLoading, setIsLoading] = useState(false);

  const themeConfig = ICON_THEMES[id] || DEFAULT_THEME;

  const handleClick = (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);

    // Track click asynchronously via Cloudflare D1
    if (id) {
      try {
        fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
          keepalive: true
        }).catch(() => {});
      } catch {
        // ignore tracking errors gracefully
      }
    }

    // Smooth feedback before navigation
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsLoading(false);
    }, 150);
  };

  return (
    <a 
      href={url} 
      target="_blank"
      rel="me noopener noreferrer"
      aria-label={`${title}: ${description}`}
      onClick={handleClick}
      className={`link-card ${isLoading ? 'is-loading' : ''}`}
    >
      <div className="link-card-inner">
        <div 
          className="link-icon" 
          style={{ 
            background: themeConfig.bg,
            boxShadow: `0 4px 16px 0 ${themeConfig.glow}`
          }}
        >
          {Icon ? <Icon sx={{ fontSize: 23, color: 'inherit' }} /> : null}
        </div>
        <div className="link-content">
          <h2 className="link-title">{title}</h2>
          <p className="link-desc">{description}</p>
        </div>
        <div className="link-arrow-box">
          {isLoading ? (
            <CircularProgress size={16} sx={{ color: 'inherit' }} />
          ) : (
            <ArrowForward sx={{ fontSize: 18 }} />
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
