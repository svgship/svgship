'use client';

import { useCallback } from 'react';

interface DownloadButtonProps {
  data: string;
  filename: string;
  mimeType?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function DownloadButton({
  data,
  filename,
  mimeType = 'image/svg+xml',
  disabled = false,
  children,
}: DownloadButtonProps) {
  const handleDownload = useCallback(() => {
    if (disabled) return;

    // Handle both data URLs and raw strings
    const blob = data.startsWith('data:')
      ? (() => {
          const [header, content] = data.split(',');
          const isBase64 = header.includes('base64');
          const bytes = isBase64 ? atob(content) : decodeURIComponent(content);
          return new Blob([bytes], { type: mimeType });
        })()
      : new Blob([data], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data, filename, mimeType, disabled]);

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all"
      style={{
        background: disabled ? 'var(--color-surface-container)' : 'var(--color-primary)',
        color: disabled ? 'var(--color-outline)' : 'var(--color-on-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: '44px',
      }}
    >
      <span className="material-symbols-outlined text-lg">download</span>
      {children}
    </button>
  );
}
