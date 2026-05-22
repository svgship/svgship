export interface SvgToPngOptions {
  width?: number;
  height?: number;
  scale?: number;
  background?: string;
}

export interface SvgToPngResult {
  success: boolean;
  data?: string;
  error?: string;
  originalWidth?: number;
  originalHeight?: number;
}

function getViewBoxDimensions(svgEl: SVGSVGElement): { width: number; height: number } {
  const viewBox = svgEl.getAttribute('viewBox');
  if (viewBox) {
    const parts = viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
      return { width: parts[2], height: parts[3] };
    }
  }
  const w = parseFloat(svgEl.getAttribute('width') ?? '');
  const h = parseFloat(svgEl.getAttribute('height') ?? '');
  if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
    return { width: w, height: h };
  }
  return { width: 300, height: 300 };
}

function sanitizeSvg(svgEl: SVGSVGElement): void {
  const dangerousTags = ['script', 'foreignObject', 'iframe', 'embed', 'object', 'applet'];
  dangerousTags.forEach((tag) => {
    svgEl.querySelectorAll(tag).forEach((el) => el.remove());
  });
  const eventAttrs = ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'];
  [svgEl, ...Array.from(svgEl.querySelectorAll('*'))].forEach((el) => {
    eventAttrs.forEach((attr) => el.removeAttribute(attr));
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load SVG as image'));
    img.src = src;
  });
}

export async function svgToPng(
  svgString: string,
  options: SvgToPngOptions = {}
): Promise<SvgToPngResult> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgEl = doc.querySelector('svg') as SVGSVGElement | null;

    if (!svgEl) {
      return { success: false, error: 'Invalid SVG: no <svg> element found' };
    }

    sanitizeSvg(svgEl);

    const { width: origW, height: origH } = getViewBoxDimensions(svgEl);

    const targetWidth = options.width && options.width > 0 ? options.width : origW;
    const targetHeight = options.height && options.height > 0 ? options.height : origH;
    const scale = options.scale ?? 1;

    const canvasW = Math.round(targetWidth * scale);
    const canvasH = Math.round(targetHeight * scale);

    if (!svgEl.getAttribute('viewBox')) {
      svgEl.setAttribute('viewBox', `0 0 ${origW} ${origH}`);
    }
    svgEl.setAttribute('width', String(canvasW));
    svgEl.setAttribute('height', String(canvasH));
    if (!svgEl.getAttribute('preserveAspectRatio')) {
      svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }
    if (!svgEl.getAttribute('xmlns')) {
      svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    // Serialize from the document root to preserve namespace
    const svgData = new XMLSerializer().serializeToString(doc.documentElement);

    // Use data URL instead of blob URL for broader compatibility
    const encodedSvg = btoa(unescape(encodeURIComponent(svgData)));
    const dataUrlSvg = `data:image/svg+xml;base64,${encodedSvg}`;

    const img = await loadImage(dataUrlSvg);

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return { success: false, error: 'Failed to get canvas context' };
    }

    if (options.background) {
      ctx.fillStyle = options.background;
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    ctx.drawImage(img, 0, 0, canvasW, canvasH);

    const pngDataUrl = canvas.toDataURL('image/png');

    // Validate output is not empty/corrupt
    if (!pngDataUrl || pngDataUrl.length < 100) {
      return { success: false, error: 'Render produced empty output' };
    }

    return {
      success: true,
      data: pngDataUrl,
      originalWidth: origW,
      originalHeight: origH,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Conversion failed',
    };
  }
}
