'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { removeBackground } from '@/lib/svg/background-remove';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function BackgroundRemovePage() {
  const { t } = useI18n();
  const [result, setResult] = useState<{ data: string; removed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setResult(null);
      setProcessing(true);

      try {
        const text = await file.text();
        const processed = removeBackground(text);

        if (!processed.success) {
          setError(processed.error ?? t('errors.processFailed'));
          return;
        }

        setResult({ data: processed.data!, removed: processed.removed! });
      } catch {
        setError(t('errors.generic'));
      } finally {
        setProcessing(false);
      }
    },
    [t]
  );

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {t('tools.backgroundRemove.title')}
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('tools.backgroundRemove.description')}
          </p>

          <div className="mt-8">
            <FileDropzone
              accept={['.svg', 'image/svg+xml']}
              onFile={handleFile}
              label={t('tools.backgroundRemove.uploadHint')}
              sublabel={t('tools.backgroundRemove.uploadSubtext')}
              error={error}
            />
          </div>

          {processing && (
            <p className="mt-4 text-center" style={{ color: 'var(--color-primary)' }}>
              {t('tools.backgroundRemove.processing')}
            </p>
          )}

          {result && (
            <div
              className="mt-6 rounded-lg p-6"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              <p className="text-lg font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                {result.removed
                  ? t('tools.backgroundRemove.result')
                  : 'No background detected to remove.'}
              </p>
              <div className="mt-4">
                <DownloadButton data={result.data} filename="no-bg.svg">
                  {t('tools.backgroundRemove.download')}
                </DownloadButton>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
