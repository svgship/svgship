'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { svgToPng } from '@/lib/svg/svg-to-png';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { ToolPageLayout } from '@/components/ui/ToolPageLayout';
import { Download as DownloadIcon, CheckCircle } from 'lucide-react';

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
    <ToolPageLayout
      title={t('tools.svgToPng.title')}
      description={t('tools.svgToPng.description')}
      icon={<DownloadIcon className="h-6 w-6 text-white" />}
    >
      <FileDropzone
        accept={['.svg', 'image/svg+xml']}
        onFile={handleFile}
        label={t('tools.svgToPng.uploadHint')}
        sublabel={t('tools.svgToPng.uploadSubtext')}
        error={error}
      />

      {processing && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {t('tools.svgToPng.processing')}
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
              {t('tools.svgToPng.result')}
            </p>
          </div>

          <img
            src={result}
            alt="Converted PNG"
            className="mt-4 max-w-full rounded-xl border"
            style={{ borderColor: 'var(--color-outline-variant)' }}
          />

          <div className="mt-5">
            <DownloadButton data={result} filename="converted.png" mimeType="image/png">
              {t('tools.svgToPng.download')}
            </DownloadButton>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
