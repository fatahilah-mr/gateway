import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Loader2 } from 'lucide-react';

const LinkCard = ({ url, title, description, icon: Icon }) => {
  const cardRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseMove = (e) => {
    if (isLoading || !cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25; 
    const y = (e.clientY - top - height / 2) / 25;

    gsap.to(cardRef.current, {
      rotationY: x,
      rotationX: -y,
      ease: 'power2.out',
      transformPerspective: 900,
      transformOrigin: 'center'
    });
  };

  const handleMouseLeave = () => {
    if (isLoading || !cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      ease: 'elastic.out(1, 0.3)',
      duration: 1
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);

    // Touch feedback / Push down animation
    gsap.to(cardRef.current, {
      scale: 0.95,
      rotationY: 0,
      rotationX: 0,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        // Wait a bit to simulate loading processing, then open link
        setTimeout(() => {
          // Bounce back
          gsap.to(cardRef.current, {
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
          });
          
          window.open(url, '_blank', 'noopener,noreferrer');
          setIsLoading(false);
        }, 500); // 500ms loading delay
      }
    });
  };

  return (
    <a 
      href={url} 
      target="_blank"
      rel="me noopener noreferrer"
      aria-label={`${title}: ${description}`}
      onClick={handleClick}
      className={`glass link-card ${isLoading ? 'is-loading' : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="link-card-inner">
        <div className="link-icon">
          <Icon size={24} />
        </div>
        <div className="link-content">
          <h2 className="link-title">{title}</h2>
          <p className="link-desc">{description}</p>
        </div>
        {isLoading ? (
           <Loader2 className="link-arrow spin-icon" size={20} />
        ) : (
           <ArrowRight className="link-arrow" size={20} />
        )}
      </div>
    </a>
  );
};

export default LinkCard;
