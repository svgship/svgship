'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { pngToSvg } from '@/lib/svg/png-to-svg';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { ToolPageLayout } from '@/components/ui/ToolPageLayout';
import { Image, CheckCircle } from 'lucide-react';

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
    <ToolPageLayout
      title={t('tools.pngToSvg.title')}
      description={t('tools.pngToSvg.description')}
      icon={<Image className="h-6 w-6 text-white" />}
    >
      <FileDropzone
        accept={['.png', '.jpg', '.jpeg', 'image/png', 'image/jpeg']}
        onFile={handleFile}
        label={t('tools.pngToSvg.uploadHint')}
        sublabel={t('tools.pngToSvg.uploadSubtext')}
        error={error}
      />

      {processing && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {t('tools.pngToSvg.processing')}
          </span>
        </div>
      )}

      {result && (
        <div
          className="animate-slide-up mt-6 rounded-2xl p-6"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-outline-variant)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'var(--color-success-container)' }}
            >
              <CheckCircle className="h-5 w-5" style={{ color: 'var(--color-success)' }} />
            </div>
            <p
              className="text-lg font-bold"
              style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
            >
              {t('tools.pngToSvg.result')}
            </p>
          </div>

          <div
            className="mt-4 overflow-hidden rounded-xl border p-4"
            style={{
              borderColor: 'var(--color-outline-variant)',
              background: 'var(--color-surface-container-low)',
            }}
            dangerouslySetInnerHTML={{ __html: result }}
          />

          <div className="mt-5">
            <DownloadButton data={result} filename="converted.svg">
              {t('tools.pngToSvg.download')}
            </DownloadButton>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
