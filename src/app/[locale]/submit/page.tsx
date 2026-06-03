'use client';

import { useState, type FormEvent } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Send, Info, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { categories } from '@/data/categories';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function SubmitPage() {
  const { locale, t } = useI18n();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('icons');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [issueUrl, setIssueUrl] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState('submitting');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, category, description, tags, email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setState('success');
        setIssueUrl(data.issueUrl);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  const resetForm = () => {
    setName('');
    setUrl('');
    setCategory('icons');
    setDescription('');
    setTags('');
    setEmail('');
    setState('idle');
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section
          className="relative flex flex-col items-center px-4 py-16 text-center"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <div className="animate-slide-up relative z-10">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
            >
              <Send className="h-8 w-8 text-white" />
            </div>
            <h1
              className="text-4xl font-bold tracking-tight text-white md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('submit.title')}
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-lg leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              {t('submit.subtitle')}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
            {/* Form */}
            <div
              className="glass-card rounded-2xl p-8"
              style={{ background: 'var(--color-surface)' }}
            >
              {state === 'success' ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: 'rgba(34,197,94,0.15)' }}
                  >
                    <CheckCircle className="h-8 w-8" style={{ color: '#22c55e' }} />
                  </div>
                  <p className="text-lg font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                    {t('submit.successMessage')}
                  </p>
                  {issueUrl && (
                    <a
                      href={issueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                      style={{
                        background: 'var(--color-primary-container)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <Globe className="h-4 w-4" />
                      View Issue #{issueUrl.split('/').pop()}
                    </a>
                  )}
                  <button
                    onClick={resetForm}
                    className="mt-6 rounded-xl px-6 py-2 text-sm font-medium transition-all duration-200"
                    style={{
                      background: 'var(--color-surface-container)',
                      color: 'var(--color-on-surface-variant)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    {t('submit.submitButton')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      {t('submit.nameLabel')}{' '}
                      <span style={{ color: 'var(--color-error, #ef4444)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('submit.namePlaceholder')}
                      required
                      className="w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none"
                      style={{
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      {t('submit.urlLabel')}{' '}
                      <span style={{ color: 'var(--color-error, #ef4444)' }}>*</span>
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={t('submit.urlPlaceholder')}
                      required
                      className="w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none"
                      style={{
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      {t('submit.categoryLabel')}{' '}
                      <span style={{ color: 'var(--color-error, #ef4444)' }}>*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none"
                      style={{
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name[locale as 'zh' | 'en']}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      {t('submit.descriptionLabel')}{' '}
                      <span style={{ color: 'var(--color-error, #ef4444)' }}>*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('submit.descriptionPlaceholder')}
                      required
                      rows={3}
                      className="w-full resize-none rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none"
                      style={{
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
                    />
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-outline)' }}>
                      {t('submit.descriptionHint')}
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      {t('submit.tagsLabel')}
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder={t('submit.tagsHint')}
                      className="w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none"
                      style={{
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      {t('submit.emailLabel')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('submit.emailPlaceholder')}
                      className="w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none"
                      style={{
                        background: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface)',
                        border: '1px solid var(--glass-border)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
                    />
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-outline)' }}>
                      {t('submit.emailHint')}
                    </p>
                  </div>

                  {/* Error message */}
                  {state === 'error' && (
                    <div
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        color: 'var(--color-error, #ef4444)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {t('submit.errorMessage')}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={state === 'submitting'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-60"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Send className="h-4 w-4" />
                    {state === 'submitting'
                      ? t('submit.submittingButton')
                      : t('submit.submitButton')}
                  </button>
                </form>
              )}
            </div>

            {/* Info sidebar */}
            <div
              className="glass-card h-fit rounded-2xl p-6"
              style={{ background: 'var(--color-surface)' }}
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                <h3
                  className="text-sm font-bold"
                  style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
                >
                  {t('submit.infoTitle')}
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                {t('submit.infoRules')
                  .split('\n')
                  .map((rule: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm leading-relaxed"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          background: 'var(--color-primary-container)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {i + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
