
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
  imageUrl?: string;
}

const Loader: React.FC<LoaderProps> = ({ onComplete, imageUrl }) => {
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Preload image if provided
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = () => {
        // Fallback if image fails, just proceed
        setImageLoaded(true);
      };
    } else {
      setImageLoaded(true);
    }
  }, [imageUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        // If image not loaded yet, cap at 95% to avoid jumping
        if (!imageLoaded && prev >= 95) {
          return 95;
        }
        
        // If image loaded, allow going to 100%
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Calculate next progress
        const increment = Math.floor(Math.random() * 5) + 2;
        const next = prev + increment;
        
        // If image not loaded, don't exceed 95%
        if (!imageLoaded) {
          return Math.min(next, 95);
        }
        
        return Math.min(next, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [imageLoaded]);

  useEffect(() => {
    if (progress >= 100) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.to(textRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.7)"
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut"
      });
    }
  }, [progress, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cat-red text-white"
    >
      <div className="relative">
        <h1 ref={textRef} className="text-6xl md:text-9xl font-black tracking-tighter">
          LOADING {Math.min(progress, 100)}%
        </h1>
        {/* Bouncing ball decorative element */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-cat-yellow rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Loader;
