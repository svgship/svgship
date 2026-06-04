'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useI18n } from '@/lib/i18n/context';
import { ThemeToggle } from './ThemeToggle';
import { Search, Grid3X3, Paintbrush, Wrench, BookOpen, Lightbulb, X } from 'lucide-react';
import type { CategorySlug } from '@/types';

gsap.registerPlugin(ScrollToPlugin);

const navItems: { slug: CategorySlug; icon: typeof Grid3X3; labelKey: string }[] = [
  { slug: 'icons', icon: Grid3X3, labelKey: 'nav.icons' },
  { slug: 'illustrations', icon: Paintbrush, labelKey: 'nav.illustrations' },
  { slug: 'tools', icon: Wrench, labelKey: 'nav.tools' },
  { slug: 'tutorials', icon: BookOpen, labelKey: 'nav.tutorials' },
  { slug: 'inspiration', icon: Lightbulb, labelKey: 'nav.inspiration' },
];

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const scrollToCategory = (slug: string) => {
    const basePath = `/${locale}`;
    const isHomePage = pathname === basePath || pathname === `${basePath}/`;

    if (isHomePage) {
      // On home page: smooth scroll to the section
      const target = `#category-${slug}`;
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 80 },
        ease: 'power2.inOut',
      });
    } else {
      // On other pages: navigate to home page with hash
      router.push(`${basePath}/#category-${slug}`);
    }
  };

  // Detect when hero section is scrolled past — show header search
  const [showSearch, setShowSearch] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hero = document.querySelector('[data-hero-section]');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show header search when hero is NOT intersecting viewport
        setShowSearch(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Focus search input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6"
        style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(99,102,241,0.04)',
        }}
      >
        <Link
          href={`/${locale}`}
          className="flex cursor-pointer items-center gap-2.5 text-xl font-bold transition-all duration-200 hover:scale-[1.02]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <img src="/logo.svg" alt="SVGShip Logo" className="h-7 w-7" />
          <span className="gradient-text">SVGShip</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.slug}
                onClick={() => scrollToCategory(item.slug)}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
                style={{ color: 'var(--color-on-surface-variant)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                  e.currentTarget.style.background = 'var(--color-primary-container)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>

        {/* Desktop search — appears on scroll past hero */}
        <div
          className="hidden transition-all duration-300 ease-in-out lg:block"
          style={{
            opacity: showSearch ? 1 : 0,
            transform: `translateY(${showSearch ? 0 : '4px'})`,
            pointerEvents: showSearch ? 'auto' : 'none',
          }}
        >
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--color-on-surface-variant)' }}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className="w-48 rounded-lg py-1.5 pr-3 pl-9 text-sm transition-all duration-200 outline-none focus:w-56"
              style={{
                background: 'var(--color-surface-container)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--glass-border)',
                fontFamily: 'var(--font-body)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/about`}
            className="rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
            style={{ color: 'var(--color-on-surface-variant)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.background = 'var(--color-primary-container)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-on-surface-variant)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {t('nav.about')}
          </Link>
          <Link
            href={`/${locale}/submit`}
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {t('nav.submit')}
          </Link>
          <ThemeToggle />
          {/* Mobile search toggle */}
          <button
            aria-label="Search"
            className="flex cursor-pointer items-center justify-center rounded-xl p-2 transition-all duration-200 lg:hidden"
            style={{ color: 'var(--color-on-surface-variant)' }}
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.background = 'var(--color-primary-container)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-on-surface-variant)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <button
            aria-label={t('nav.language')}
            className="rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
            style={{
              color: 'var(--color-on-surface-variant)',
              background: 'var(--color-surface-container)',
              border: '1px solid var(--glass-border)',
            }}
            onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-container-high)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-container)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.color = 'var(--color-on-surface-variant)';
            }}
          >
            {locale === 'en' ? '中文' : 'EN'}
          </button>
        </div>
      </header>

      {/* Mobile search overlay */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          mobileSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div className="border-t px-6 py-3" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="relative mx-auto max-w-lg">
            <Search
              className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
              style={{ color: 'var(--color-on-surface-variant)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className="w-full rounded-xl py-3 pr-4 pl-11 text-sm transition-all duration-200 outline-none"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--glass-border)',
                fontFamily: 'var(--font-body)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
