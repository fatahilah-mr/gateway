import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Loader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Fake loading progress
      const tl = gsap.timeline({
        onComplete: () => {
          // Slide out up
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete
          });
        }
      });

      tl.to({ val: 0 }, {
        val: 100,
        duration: 2,
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
      <div ref={counterRef} className="loader-counter">
        {progress}%
      </div>
    </div>
  );
};

export default Loader;
