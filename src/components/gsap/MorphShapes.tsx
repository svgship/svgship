'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

gsap.registerPlugin(useGSAP);

// SVG path shapes for morphing cycle
const SHAPES = {
  circle:
    'M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20Z',
  star: 'M100,10 L120,75 L190,75 L132,115 L155,180 L100,142 L45,180 L68,115 L10,75 L80,75Z',
  diamond: 'M100,10 L190,100 L100,190 L10,100Z',
  heart:
    'M100,180 C60,140 0,100 0,60 C0,25 25,0 60,0 C80,0 95,15 100,25 C105,15 120,0 140,0 C175,0 200,25 200,60 C200,100 140,140 100,180Z',
  hexagon: 'M100,10 L180,50 L180,130 L100,170 L20,130 L20,50Z',
};

const SHAPE_KEYS = Object.keys(SHAPES) as (keyof typeof SHAPES)[];

interface MorphShapesProps {
  className?: string;
}

/**
 * Floating SVG shapes that continuously morph between geometric forms.
 * Decorative hero background element.
 */
export function MorphShapes({ className = '' }: MorphShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const paths = containerRef.current.querySelectorAll('.morph-path');

      paths.forEach((path, i) => {
        // Gentle floating animation
        gsap.to(path.parentElement, {
          y: `random(-20, 20)`,
          x: `random(-15, 15)`,
          rotation: `random(-10, 10)`,
          duration: `random(6, 12)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.5,
        });

        // Morphing cycle
        let idx = i % SHAPE_KEYS.length;
        const morphNext = () => {
          idx = (idx + 1) % SHAPE_KEYS.length;
          gsap.to(path, {
            duration: 3,
            attr: { d: SHAPES[SHAPE_KEYS[idx]] },
            ease: 'power2.inOut',
            onComplete: morphNext,
          });
        };

        // Start morphing with staggered delay
        gsap.delayedCall(2 + i * 1.5, morphNext);
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="morph-shape absolute opacity-[0.06]"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        style={{ top: '8%', left: '8%' }}
      >
        <path
          className="morph-path"
          d={SHAPES.circle}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="morph-shape absolute opacity-[0.05]"
        width="160"
        height="160"
        viewBox="0 0 200 200"
        style={{ top: '15%', right: '12%' }}
      >
        <path
          className="morph-path"
          d={SHAPES.diamond}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
      </svg>
      <svg
        className="morph-shape absolute opacity-[0.05]"
        width="120"
        height="120"
        viewBox="0 0 200 200"
        style={{ bottom: '25%', left: '15%' }}
      >
        <path
          className="morph-path"
          d={SHAPES.hexagon}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
