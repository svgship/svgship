'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { pngToSvg } from '@/lib/svg/png-to-svg';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PngToSvgPage() {
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
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const converted = await pngToSvg(imageData);

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
            {t('tools.pngToSvg.title')}
          </h1>
          <p className="mt-2" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('tools.pngToSvg.description')}
          </p>

          <div className="mt-8">
            <FileDropzone
              accept={['.png', '.jpg', '.jpeg', 'image/png', 'image/jpeg']}
              onFile={handleFile}
              label={t('tools.pngToSvg.uploadHint')}
              sublabel={t('tools.pngToSvg.uploadSubtext')}
              error={error}
            />
          </div>

          {processing && (
            <p className="mt-4 text-center" style={{ color: 'var(--color-primary)' }}>
              {t('tools.pngToSvg.processing')}
            </p>
          )}

          {result && (
            <div
              className="mt-6 rounded-lg p-6"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              <p className="text-lg font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                {t('tools.pngToSvg.result')}
              </p>
              <div
                className="mt-3 rounded border p-4"
                style={{ borderColor: 'var(--color-outline-variant)' }}
                dangerouslySetInnerHTML={{ __html: result }}
              />
              <div className="mt-4">
                <DownloadButton data={result} filename="converted.svg">
                  {t('tools.pngToSvg.download')}
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
