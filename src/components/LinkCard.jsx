import React, { useState } from 'react';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';

const LinkCard = ({ id, url, title, description, icon: Icon }) => {
  const [isLoading, setIsLoading] = useState(false);

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
      data-link-id={id}
    >
      <div className="link-card-inner">
        <div className="link-icon">
          {Icon ? <Icon sx={{ fontSize: 20, color: 'inherit' }} /> : null}
        </div>
        <div className="link-content">
          <h2 className="link-title">{title}</h2>
          <p className="link-desc">{description}</p>
        </div>
        <div className="link-arrow-box">
          {isLoading ? (
            <CircularProgress size={14} sx={{ color: 'inherit' }} />
          ) : (
            <ArrowForward sx={{ fontSize: 16 }} />
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
