'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { optimizeSvg } from '@/lib/svg/optimize';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { ToolPageLayout } from '@/components/ui/ToolPageLayout';
import { Zap, CheckCircle } from 'lucide-react';

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
    <ToolPageLayout
      title={t('tools.optimize.title')}
      description={t('tools.optimize.description')}
      icon={<Zap className="h-6 w-6 text-white" />}
    >
      <FileDropzone
        accept={['.svg', 'image/svg+xml']}
        onFile={handleFile}
        label={t('tools.optimize.uploadHint')}
        sublabel={t('tools.optimize.uploadSubtext')}
        error={error}
      />

      {processing && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
            {t('tools.optimize.processing')}
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
              {t('tools.optimize.result', { saved: String(savedPercent) })}
            </p>
          </div>

          <div
            className="mt-4 flex items-center gap-4 rounded-xl p-4 text-sm"
            style={{ background: 'var(--color-surface-container-low)' }}
          >
            <div className="text-center">
              <p style={{ color: 'var(--color-on-surface-variant)' }}>Original</p>
              <p
                className="mt-1 font-semibold"
                style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-heading)' }}
              >
                {(result.originalSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="text-2xl" style={{ color: 'var(--color-primary)' }}>
              →
            </div>
            <div className="text-center">
              <p style={{ color: 'var(--color-on-surface-variant)' }}>Optimized</p>
              <p
                className="mt-1 font-semibold"
                style={{ color: 'var(--color-success)', fontFamily: 'var(--font-heading)' }}
              >
                {(result.optimizedSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <div className="mt-5">
            <DownloadButton data={result.data} filename="optimized.svg">
              {t('tools.optimize.download')}
            </DownloadButton>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
