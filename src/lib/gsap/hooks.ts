'use client';

import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Custom hook for GSAP animations with automatic cleanup.
 * Wraps useGSAP with scope ref management.
 */
export function useGsapScope() {
  const scope = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      // Plugin registration is handled in useGsapInit
    },
    { scope }
  );

  return { scope, contextSafe };
}

/**
 * Hook for scroll-triggered reveal animations.
 * Elements with data-reveal attribute animate in when scrolled into view.
 */
export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll('[data-reveal]');

      elements.forEach((el) => {
        const direction = el.getAttribute('data-reveal') || 'up';
        const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0');

        const fromVars: gsap.TweenVars = {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay,
        };

        switch (direction) {
          case 'up':
            fromVars.y = 40;
            break;
          case 'down':
            fromVars.y = -40;
            break;
          case 'left':
            fromVars.x = -40;
            break;
          case 'right':
            fromVars.x = 40;
            break;
          case 'scale':
            fromVars.scale = 0.9;
            break;
        }

        gsap.from(el, {
          ...fromVars,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}

/**
 * Hook for magnetic 3D card hover effect.
 * Returns onMouseMove/onMouseLeave handlers.
 */
export function useMagneticCard() {
  const cardRef = useRef<HTMLElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 800,
      scale: 1.02,
      duration: 0.3,
      ease: 'power1.out',
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  return { cardRef, onMouseMove, onMouseLeave };
}
