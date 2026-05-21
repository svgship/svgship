import DOMPurify from 'dompurify';

export interface PotraceOptions {
  threshold?: number;
  turdSize?: number;
  alphaMax?: number;
  optCurve?: number;
  optTolerance?: number;
}

export interface PngToSvgResult {
  success: boolean;
  data?: string;
  error?: string;
}

export async function pngToSvg(
  imageData: ImageData,
  options: PotraceOptions = {}
): Promise<PngToSvgResult> {
  try {
    const {
      threshold = 128,
      turdSize = 2,
      alphaMax = 1,
      optCurve = 1,
      optTolerance = 0.2,
    } = options;

    const { width, height, data } = imageData;

    // Convert to grayscale bitmap
    const bitmap: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const gray = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);
      bitmap.push(gray < threshold ? 1 : 0);
    }

    // Simple contour tracing (Potrace-like)
    const paths = traceContours(bitmap, width, height, turdSize);

    // Generate SVG
    const pathData = paths.map((p) => pathToSvgD(p)).join(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <path d="${pathData}" fill="black"/>
</svg>`;

    const sanitized = DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true },
      FORBID_TAGS: ['script'],
    });

    return { success: true, data: sanitized };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Conversion failed',
    };
  }
}

interface Point {
  x: number;
  y: number;
}

function traceContours(bitmap: number[], w: number, h: number, minSize: number): Point[][] {
  const visited = new Uint8Array(w * h);
  const paths: Point[][] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (bitmap[idx] === 1 && visited[idx] === 0) {
        const path: Point[] = [];
        floodFill(bitmap, visited, w, h, x, y, path, minSize);
        if (path.length >= minSize) {
          paths.push(path);
        }
      }
    }
  }

  return paths;
}

function floodFill(
  bitmap: number[],
  visited: Uint8Array,
  w: number,
  h: number,
  startX: number,
  startY: number,
  path: Point[],
  _minSize: number
) {
  const stack: [number, number][] = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * w + x;

    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    if (bitmap[idx] !== 1 || visited[idx] === 1) continue;

    visited[idx] = 1;
    path.push({ x, y });

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
}

function pathToSvgD(points: Point[]): string {
  if (points.length === 0) return '';

  // Sort points to form a path
  const sorted = sortPointsForPath(points);
  if (sorted.length === 0) return '';

  let d = `M${sorted[0].x},${sorted[0].y}`;
  for (let i = 1; i < sorted.length; i++) {
    d += `L${sorted[i].x},${sorted[i].y}`;
  }
  d += 'Z';
  return d;
}

function sortPointsForPath(points: Point[]): Point[] {
  if (points.length < 2) return points;

  // Use a simple nearest-neighbor approach for path ordering
  const sorted: Point[] = [points[0]];
  const remaining = new Set(points.slice(1));

  while (remaining.size > 0) {
    const last = sorted[sorted.length - 1];
    let nearest: Point | null = null;
    let minDist = Infinity;

    for (const p of remaining) {
      const dist = (p.x - last.x) ** 2 + (p.y - last.y) ** 2;
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }

    if (nearest) {
      sorted.push(nearest);
      remaining.delete(nearest);
    }
  }

  return sorted;
}
