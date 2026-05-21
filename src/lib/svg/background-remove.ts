import DOMPurify from 'dompurify';

export interface BackgroundRemoveOptions {
  threshold?: number; // 0-255, how close to white the color needs to be
  targetColor?: [number, number, number]; // RGB of the color to remove (default: white)
}

export interface BackgroundRemoveResult {
  success: boolean;
  data?: string;
  removed?: boolean; // whether any background was actually removed
  error?: string;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
}

function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}

export function removeBackground(
  svgString: string,
  options: BackgroundRemoveOptions = {}
): BackgroundRemoveResult {
  try {
    const { threshold = 50, targetColor = [255, 255, 255] } = options;

    const sanitized = DOMPurify.sanitize(svgString, {
      USE_PROFILES: { svg: true },
      FORBID_TAGS: ['script', 'foreignObject'],
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, 'image/svg+xml');
    let removed = false;

    // Process all elements with fill or background colors
    const elements = doc.querySelectorAll('[fill], [style], rect, path, circle, ellipse, polygon');

    elements.forEach((el) => {
      const fill = el.getAttribute('fill');
      const style = el.getAttribute('style');

      // Check fill attribute
      if (fill) {
        const rgb = hexToRgb(fill);
        if (rgb && colorDistance(rgb, targetColor) < threshold) {
          el.setAttribute('fill', 'none');
          removed = true;
        }
      }

      // Check style attribute for background-color or fill
      if (style) {
        const bgMatch = style.match(/background-color:\s*([^;]+)/);
        if (bgMatch) {
          const rgb = hexToRgb(bgMatch[1].trim());
          if (rgb && colorDistance(rgb, targetColor) < threshold) {
            const newStyle = style.replace(
              /background-color:\s*[^;]+/,
              'background-color: transparent'
            );
            el.setAttribute('style', newStyle);
            removed = true;
          }
        }

        const fillMatch = style.match(/fill:\s*([^;]+)/);
        if (fillMatch) {
          const rgb = hexToRgb(fillMatch[1].trim());
          if (rgb && colorDistance(rgb, targetColor) < threshold) {
            const newStyle = style.replace(/fill:\s*[^;]+/, 'fill: none');
            el.setAttribute('style', newStyle);
            removed = true;
          }
        }
      }

      // Check if this is a full-size background rect
      if (el.tagName === 'rect') {
        const width = el.getAttribute('width');
        const height = el.getAttribute('height');
        const svg = doc.querySelector('svg');
        const svgWidth = svg?.getAttribute('width');
        const svgHeight = svg?.getAttribute('height');

        if (
          width &&
          height &&
          svgWidth &&
          svgHeight &&
          (width === '100%' || width === svgWidth) &&
          (height === '100%' || height === svgHeight)
        ) {
          const fillRgb = hexToRgb(fill ?? '');
          if (fillRgb && colorDistance(fillRgb, targetColor) < threshold) {
            el.remove();
            removed = true;
          }
        }
      }
    });

    const result = new XMLSerializer().serializeToString(doc.documentElement);

    return {
      success: true,
      data: result,
      removed,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Background removal failed',
    };
  }
}
