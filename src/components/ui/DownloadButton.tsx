'use client';

import { useCallback } from 'react';
import { Download } from 'lucide-react';

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

    const blob = data.startsWith('data:')
      ? (() => {
          const [header, content] = data.split(',');
          const isBase64 = header.includes('base64');
          if (isBase64) {
            const binary = atob(content);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            return new Blob([bytes], { type: mimeType });
          }
          return new Blob([decodeURIComponent(content)], { type: mimeType });
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
      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200"
      style={{
        background: disabled ? 'var(--color-surface-container)' : 'var(--gradient-primary)',
        color: disabled ? 'var(--color-outline)' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: '44px',
        opacity: disabled ? 0.5 : 1,
        boxShadow: disabled ? 'none' : 'var(--shadow-md)',
        fontFamily: 'var(--font-heading)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
    >
      <Download className="h-4 w-4" />
      {children}
    </button>
  );
}
