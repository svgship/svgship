'use client';

import { useCallback, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-lg transition-all"
      style={{
        color: 'var(--color-on-surface-variant)',
        background: 'var(--color-surface-container)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-primary-container)';
        e.currentTarget.style.color = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-surface-container)';
        e.currentTarget.style.color = 'var(--color-on-surface-variant)';
      }}
    >
      <span
        className="transition-transform duration-300"
        style={{ transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
    </button>
  );
}
