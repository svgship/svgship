'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

let registered = false;

/**
 * Register all GSAP plugins once on the client.
 * Call this in a top-level client component (e.g. layout or provider).
 */
export function useGsapInit() {
  useEffect(() => {
    if (registered) return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Project-wide defaults
    gsap.defaults({
      duration: 0.6,
      ease: 'power2.out',
    });

    registered = true;
  }, []);
}

/**
 * Smooth scroll to an element using GSAP ScrollToPlugin.
 * Replaces native scrollIntoView for buttery smooth feel.
 */
export function gsapScrollTo(target: string | HTMLElement, offsetY = 80) {
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: target, offsetY },
    ease: 'power2.inOut',
  });
}
