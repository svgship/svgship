'use client';

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileDropzoneProps {
  accept: string[];
  maxSizeMB?: number;
  onFile: (file: File) => void;
  label?: string;
  sublabel?: string;
  error?: string | null;
}

export function FileDropzone({
  accept,
  maxSizeMB = 10,
  onFile,
  label = 'Drop file here',
  sublabel = 'or click to browse',
  error,
}: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!accept.some((a) => ext === a || file.type.startsWith(a.replace('*', '')))) {
        return `Unsupported format. Expected: ${accept.join(', ')}`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File exceeds ${maxSizeMB}MB limit.`;
      }
      return null;
    },
    [accept, maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      const err = validateFile(file);
      if (err) {
        // Let parent handle error via onFile
      }
      onFile(file);
    },
    [validateFile, onFile]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300"
      style={{
        borderColor: isDragActive ? 'var(--color-primary)' : 'var(--color-outline-variant)',
        background: isDragActive ? 'var(--color-primary-container)' : 'var(--gradient-card)',
        minHeight: '220px',
        boxShadow: isDragActive ? 'var(--shadow-glow)' : 'none',
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />

      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300"
        style={{
          background: isDragActive
            ? 'var(--gradient-primary)'
            : 'var(--color-surface-container-high)',
          transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <Upload
          className="h-7 w-7 transition-colors"
          style={{ color: isDragActive ? 'white' : 'var(--color-primary)' }}
        />
      </div>

      <p
        className="mt-4 text-base font-semibold transition-colors"
        style={{
          color: isDragActive ? 'var(--color-primary)' : 'var(--color-on-surface)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {isDragActive ? 'Drop file here' : label}
      </p>
      <p className="mt-1 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
        {sublabel}
      </p>
      <p className="mt-2 text-xs" style={{ color: 'var(--color-outline)' }}>
        Max {maxSizeMB}MB
      </p>
      {error && (
        <p className="mt-3 text-sm font-medium" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
