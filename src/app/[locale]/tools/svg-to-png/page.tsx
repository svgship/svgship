'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { svgToPng } from '@/lib/svg/svg-to-png';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function SvgToPngPage() {
  const { t } = useI18n();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setResult(null);
      setProcessing(true);

      try {
        const text = await file.text();
        const converted = await svgToPng(text);

        if (!converted.success) {
          setError(converted.error ?? t('errors.processFailed'));
          return;
        }

        setResult(converted.data!);
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
            {t('tools.svgToPng.title')}
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('tools.svgToPng.description')}
          </p>

          <div className="mt-8">
            <FileDropzone
              accept={['.svg', 'image/svg+xml']}
              onFile={handleFile}
              label={t('tools.svgToPng.uploadHint')}
              sublabel={t('tools.svgToPng.uploadSubtext')}
              error={error}
            />
          </div>

          {processing && (
            <p className="mt-4 text-center" style={{ color: 'var(--color-primary)' }}>
              {t('tools.svgToPng.processing')}
            </p>
          )}

          {result && (
            <div
              className="mt-6 rounded-lg p-6"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              <p className="text-lg font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                {t('tools.svgToPng.result')}
              </p>
              <img
                src={result}
                alt="Converted PNG"
                className="mt-3 max-w-full rounded border"
                style={{ borderColor: 'var(--color-outline-variant)' }}
              />
              <div className="mt-4">
                <DownloadButton data={result} filename="converted.png" mimeType="image/png">
                  {t('tools.svgToPng.download')}
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
