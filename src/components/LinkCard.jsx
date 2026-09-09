import React, { useState } from 'react';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';

const ACCENT_COLORS = {
  portfolio: 'var(--nb-blue)',
  blog: 'var(--nb-yellow)',
  status: 'var(--nb-green)',
  github: 'var(--nb-purple)',
  linkedin: 'var(--nb-blue)',
  threads: 'var(--nb-pink)',
  email: 'var(--nb-orange)',
  whatsapp: 'var(--nb-lime)'
};

const LinkCard = ({ id, url, title, description, icon: Icon }) => {
  const [isLoading, setIsLoading] = useState(false);

  const accentColor = ACCENT_COLORS[id] || 'var(--nb-yellow)';

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

    // Snappy physical button press feedback before navigation
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsLoading(false);
    }, 180);
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
        <div className="link-icon" style={{ backgroundColor: accentColor }}>
          {Icon ? <Icon sx={{ fontSize: 24, color: '#121316' }} /> : null}
        </div>
        <div className="link-content">
          <h2 className="link-title">{title}</h2>
          <p className="link-desc">{description}</p>
        </div>
        <div className="link-arrow-box">
          {isLoading ? (
            <CircularProgress size={18} sx={{ color: 'inherit' }} />
          ) : (
            <ArrowForward sx={{ fontSize: 20 }} />
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
