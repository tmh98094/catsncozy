import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Check } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.set(contentRef.current, { scale: 0.8, autoAlpha: 0, y: 50 });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 })
        .to(contentRef.current, { 
          scale: 1, 
          autoAlpha: 1, 
          y: 0, 
          duration: 0.4, 
          ease: "back.out(1.7)" 
        }, "-=0.1");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div 
        ref={contentRef}
        className="relative bg-white border-4 border-cat-black rounded-3xl w-full max-w-lg overflow-hidden shadow-[12px_12px_0px_0px_#1a1a1a]"
      >
        <div className="bg-cat-yellow border-b-4 border-cat-black p-4 flex justify-between items-center">
          <h3 className="text-2xl font-black uppercase">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
