
import { useEffect, useRef } from 'react';

interface StarFieldProps {
  starCount?: number;
}

const StarField = ({ starCount = 100 }: StarFieldProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing stars
    container.innerHTML = '';

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2;
      
      star.className = 'star absolute';
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.opacity = `${Math.random() * 0.8 + 0.2}`;
      star.style.animation = `twinkle ${(Math.random() * 3 + 2)}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(star);
    }
  }, [starCount]);

  return (
    <div ref={containerRef} className="starfield" aria-hidden="true" />
  );
};

export default StarField;
