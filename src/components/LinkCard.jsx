import React from 'react';
import ArrowForward from '@mui/icons-material/ArrowForward';

const LinkCard = ({ id, url, title, description, icon: Icon }) => {
  const handleClick = () => {
    // Track click asynchronously via Cloudflare D1 with keepalive (never blocks navigation)
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
  };

  return (
    <a 
      href={url} 
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}: ${description}`}
      onClick={handleClick}
      className="link-card"
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
          <ArrowForward sx={{ fontSize: 16 }} />
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
