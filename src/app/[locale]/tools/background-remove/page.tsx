'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { removeBackground } from '@/lib/svg/background-remove';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { ToolPageLayout } from '@/components/ui/ToolPageLayout';
import { Eraser, CheckCircle, AlertCircle } from 'lucide-react';

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
    <ToolPageLayout
      title={t('tools.backgroundRemove.title')}
      description={t('tools.backgroundRemove.description')}
      icon={<Eraser className="h-6 w-6 text-white" />}
    >
      <FileDropzone
        accept={['.svg', 'image/svg+xml']}
        onFile={handleFile}
        label={t('tools.backgroundRemove.uploadHint')}
        sublabel={t('tools.backgroundRemove.uploadSubtext')}
        error={error}
      />

      {processing && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {t('tools.backgroundRemove.processing')}
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
              style={{
                background: result.removed
                  ? 'var(--color-success-container)'
                  : 'var(--color-error-container)',
              }}
            >
              {result.removed ? (
                <CheckCircle className="h-5 w-5" style={{ color: 'var(--color-success)' }} />
              ) : (
                <AlertCircle className="h-5 w-5" style={{ color: 'var(--color-error)' }} />
              )}
            </div>
            <p
              className="text-lg font-bold"
              style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
            >
              {result.removed
                ? t('tools.backgroundRemove.result')
                : 'No background detected to remove.'}
            </p>
          </div>

          <div className="mt-5">
            <DownloadButton data={result.data} filename="no-bg.svg">
              {t('tools.backgroundRemove.download')}
            </DownloadButton>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
