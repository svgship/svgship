'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { svgToPng } from '@/lib/svg/svg-to-png';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { ToolPageLayout } from '@/components/ui/ToolPageLayout';
import { Download as DownloadIcon, CheckCircle } from 'lucide-react';

const SCALE_OPTIONS = [
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 3, label: '3x' },
  { value: 4, label: '4x' },
];

export default function SvgToPngPage() {
  const { t } = useI18n();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scale, setScale] = useState(2);
  const [background, setBackground] = useState('');
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState('converted.png');

  const handleConvert = useCallback(
    async (svg: string, name?: string) => {
      setError(null);
      setResult(null);
      setProcessing(true);

      try {
        const converted = await svgToPng(svg, {
          scale,
          background: background || undefined,
        });

        if (!converted.success) {
          setError(converted.error ?? t('errors.processFailed'));
          return;
        }

        setResult(converted.data!);
        if (name) {
          setFileName(name.replace(/\.svg$/i, '.png'));
        }
      } catch {
        setError(t('errors.generic'));
      } finally {
        setProcessing(false);
      }
    },
    [scale, background, t]
  );

  const handleFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      setSvgContent(text);
      await handleConvert(text, file.name);
    },
    [handleConvert]
  );

  const handleReconvert = useCallback(async () => {
    if (svgContent) {
      await handleConvert(svgContent);
    }
  }, [svgContent, handleConvert]);

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

      {/* Options */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {t('tools.svgToPng.scale')}
          </span>
          <div className="flex gap-1">
            {SCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setScale(opt.value)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  background:
                    scale === opt.value ? 'var(--color-primary)' : 'var(--color-surface-container)',
                  color:
                    scale === opt.value
                      ? 'var(--color-on-primary)'
                      : 'var(--color-on-surface-variant)',
                  border: `1px solid ${scale === opt.value ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {t('tools.svgToPng.background')}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setBackground('')}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                background: !background ? 'var(--color-primary)' : 'var(--color-surface-container)',
                color: !background ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                border: `1px solid ${!background ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
              }}
            >
              {t('tools.svgToPng.transparent')}
            </button>
            <button
              onClick={() => setBackground('#ffffff')}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                background:
                  background === '#ffffff'
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-container)',
                color:
                  background === '#ffffff'
                    ? 'var(--color-on-primary)'
                    : 'var(--color-on-surface-variant)',
                border: `1px solid ${background === '#ffffff' ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
              }}
            >
              {t('tools.svgToPng.white')}
            </button>
            <button
              onClick={() => setBackground('#000000')}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                background:
                  background === '#000000'
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-container)',
                color:
                  background === '#000000'
                    ? 'var(--color-on-primary)'
                    : 'var(--color-on-surface-variant)',
                border: `1px solid ${background === '#000000' ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
              }}
            >
              {t('tools.svgToPng.black')}
            </button>
          </div>
        </div>
      </div>

      {svgContent && (
        <div className="mt-3">
          <button
            onClick={handleReconvert}
            disabled={processing}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background: 'var(--color-primary-container)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              opacity: processing ? 0.5 : 1,
            }}
          >
            {t('tools.svgToPng.reconvert')}
          </button>
        </div>
      )}

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
            <DownloadButton data={result} filename={fileName} mimeType="image/png">
              {t('tools.svgToPng.download')}
            </DownloadButton>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
