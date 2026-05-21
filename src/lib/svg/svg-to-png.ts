import DOMPurify from 'dompurify';

export interface SvgToPngOptions {
  width?: number;
  height?: number;
  quality?: number;
  background?: string;
}

export interface SvgToPngResult {
  success: boolean;
  data?: string; // data:image/png;base64,...
  error?: string;
}

export async function svgToPng(
  svgString: string,
  options: SvgToPngOptions = {}
): Promise<SvgToPngResult> {
  try {
    const sanitized = DOMPurify.sanitize(svgString, {
      USE_PROFILES: { svg: true },
      FORBID_TAGS: ['script', 'foreignObject'],
      FORBID_ATTR: ['onerror', 'onclick', 'onload'],
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');

    if (!svgEl) {
      return { success: false, error: 'Invalid SVG: no <svg> element found' };
    }

    // Get original dimensions
    const origWidth = parseFloat(svgEl.getAttribute('width') ?? '300');
    const origHeight = parseFloat(svgEl.getAttribute('height') ?? '300');

    const targetWidth = options.width ?? origWidth;
    const targetHeight = options.height ?? origHeight;

    // Set explicit dimensions for rendering
    svgEl.setAttribute('width', String(targetWidth));
    svgEl.setAttribute('height', String(targetHeight));

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG as image'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      URL.revokeObjectURL(url);
      return { success: false, error: 'Failed to get canvas context' };
    }

    if (options.background) {
      ctx.fillStyle = options.background;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    URL.revokeObjectURL(url);

    const dataUrl = canvas.toDataURL('image/png', options.quality ?? 1);

    return { success: true, data: dataUrl };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Conversion failed',
    };
  }
}
