'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Cursor glow follower — a soft radial gradient that follows the mouse.
 * Purely decorative, pointer-events: none.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Only enable on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      glow.style.display = 'none';
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(glow, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.6,
        ease: 'power1.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-[1] hidden h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        background:
          'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
        willChange: 'left, top',
      }}
    />
  );
}
