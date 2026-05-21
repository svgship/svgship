'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { optimizeSvg } from '@/lib/svg/optimize';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function OptimizePage() {
  const { t } = useI18n();
  const [result, setResult] = useState<{
    data: string;
    originalSize: number;
    optimizedSize: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setResult(null);
      setProcessing(true);

      try {
        const text = await file.text();
        const optimized = optimizeSvg(text);

        if (!optimized.success) {
          setError(optimized.error ?? t('errors.processFailed'));
          return;
        }

        setResult({
          data: optimized.data!,
          originalSize: optimized.originalSize!,
          optimizedSize: optimized.optimizedSize!,
        });
      } catch {
        setError(t('errors.generic'));
      } finally {
        setProcessing(false);
      }
    },
    [t]
  );

  const savedPercent = result
    ? Math.round((1 - result.optimizedSize / result.originalSize) * 100)
    : 0;

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {t('tools.optimize.title')}
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('tools.optimize.description')}
          </p>

          <div className="mt-8">
            <FileDropzone
              accept={['.svg', 'image/svg+xml']}
              onFile={handleFile}
              label={t('tools.optimize.uploadHint')}
              sublabel={t('tools.optimize.uploadSubtext')}
              error={error}
            />
          </div>

          {processing && (
            <p className="mt-4 text-center" style={{ color: 'var(--color-primary)' }}>
              {t('tools.optimize.processing')}
            </p>
          )}

          {result && (
            <div
              className="mt-6 rounded-lg p-6"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              <p className="text-lg font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                {t('tools.optimize.result', { saved: String(savedPercent) })}
              </p>
              <div
                className="mt-3 flex gap-4 text-sm"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <span>Original: {(result.originalSize / 1024).toFixed(1)} KB</span>
                <span>→</span>
                <span>Optimized: {(result.optimizedSize / 1024).toFixed(1)} KB</span>
              </div>
              <div className="mt-4">
                <DownloadButton data={result.data} filename="optimized.svg">
                  {t('tools.optimize.download')}
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
