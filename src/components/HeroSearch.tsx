'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useI18n } from '@/lib/i18n/context';
import { Search } from 'lucide-react';
import { MorphShapes } from '@/components/gsap/MorphShapes';

gsap.registerPlugin(useGSAP);

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HeroSearch({ searchQuery, onSearchChange }: HeroSearchProps) {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeholder, setPlaceholder] = useState('');

  // Scramble placeholder effect
  const scrambleTo = useCallback((target: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let frame = 0;
    const totalFrames = 15;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const visibleLen = Math.floor(target.length * progress);
      const scrambled =
        target.substring(0, visibleLen) +
        Array.from(
          { length: Math.min(4, target.length - visibleLen) },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join('');
      setPlaceholder(scrambled);

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setPlaceholder(target);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // Hero entrance animation
  useGSAP(
    () => {
      if (!sectionRef.current || !titleRef.current) return;

      const tl = gsap.timeline({ delay: 0.2 });

      // Split title into characters for animation
      const titleEl = titleRef.current;
      const titleText = titleEl.textContent || '';
      titleEl.innerHTML = '';

      const chars: HTMLSpanElement[] = [];
      titleText.split('').forEach((char) => {
        const span = document.createElement('span');
        span.className = 'gsap-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        titleEl.appendChild(span);
        chars.push(span);
      });

      // Set initial states
      gsap.set(chars, { opacity: 0, y: 50, rotateX: -90, scale: 0.5 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 25 });
      gsap.set(searchWrapRef.current, { opacity: 0, y: 25, scale: 0.96 });

      // Animate title chars from center outward
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(2)',
        stagger: { amount: 0.6, from: 'center' },
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        .to(
          searchWrapRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        );

      // Start scramble placeholder cycle
      const placeholderTexts = [
        t('hero.searchPlaceholder'),
        'Lucide, Phosphor, Heroicons...',
        'unDraw, Storyset, Humaaans...',
        'SVGOMG, Method Draw...',
      ];

      let phIndex = 0;
      scrambleTo(placeholderTexts[0]);

      const interval = setInterval(() => {
        phIndex = (phIndex + 1) % placeholderTexts.length;
        scrambleTo(placeholderTexts[phIndex]);
      }, 4500);

      return () => clearInterval(interval);
    },
    { scope: sectionRef }
  );

  // Hero parallax on scroll
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -80,
        opacity: 0.3,
        ease: 'none',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-hero-section
      className="relative flex flex-col items-center px-4 py-20 text-center"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Morphing SVG shapes */}
      <MorphShapes />

      <div className="relative z-10">
        <h1
          ref={titleRef}
          className="mx-auto max-w-3xl text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl"
          style={{ fontFamily: 'var(--font-heading)', perspective: '600px' }}
        >
          {t('hero.title')}
        </h1>
        <p
          ref={subtitleRef}
          className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.75)' }}
        >
          {t('hero.subtitle')}
        </p>

        <div ref={searchWrapRef} className="relative mx-auto mt-8 max-w-lg">
          <Search
            className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
            style={{ color: 'var(--color-on-surface-variant)' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl py-3.5 pr-4 pl-12 text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-on-surface)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
