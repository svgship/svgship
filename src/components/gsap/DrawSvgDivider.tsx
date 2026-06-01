'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Animated SVG divider line that draws itself on scroll.
 * Sits between Hero and content sections.
 */
export function DrawSvgDivider() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const paths = containerRef.current.querySelectorAll('path');

      paths.forEach((path, i) => {
        const length = (path as SVGPathElement).getTotalLength();

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          delay: i * 0.3,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative z-10 flex w-full justify-center px-4 py-2">
      <svg
        viewBox="0 0 1000 60"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[60px] w-full max-w-5xl overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gsap-div-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0 }} />
            <stop offset="30%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: 'var(--color-secondary)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-secondary)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path
          d="M0,30 C150,30 200,8 350,8 C500,8 550,52 700,52 C850,52 900,30 1000,30"
          fill="none"
          stroke="url(#gsap-div-grad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M0,38 C200,38 250,15 400,15 C550,15 600,48 750,48 C900,48 950,38 1000,38"
          fill="none"
          stroke="url(#gsap-div-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
