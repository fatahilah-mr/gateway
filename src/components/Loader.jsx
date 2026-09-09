import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Loader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.7,
            ease: 'power3.inOut',
            onComplete
          });
        }
      });

      tl.to({ val: 0 }, {
        val: 100,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: function() {
          setProgress(Math.floor(this.targets()[0].val));
        }
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loader-container">
      <div className="loader-box">
        <div className="loader-badge">GATEWAY // INITIALIZING</div>
        <div className="loader-counter">
          {progress}%
        </div>
        <div className="loader-progress-bar">
          <div className="loader-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
