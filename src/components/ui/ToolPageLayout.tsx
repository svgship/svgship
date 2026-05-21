'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function ToolPageLayout({ title, description, icon, children }: ToolPageLayoutProps) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="animate-slide-up w-full max-w-2xl">
          {/* Page header */}
          <div className="mb-8 flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {icon}
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {title}
              </h1>
              <p className="mt-1 text-base" style={{ color: 'var(--color-on-surface-variant)' }}>
                {description}
              </p>
            </div>
          </div>

          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
