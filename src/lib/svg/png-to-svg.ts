import DOMPurify from 'dompurify';

export interface PngToSvgOptions {
  threshold?: number;
  turdSize?: number;
  colorMode?: 'black' | 'color';
}

export interface PngToSvgResult {
  success: boolean;
  data?: string;
  error?: string;
}

interface Point {
  x: number;
  y: number;
}

// Convert RGBA ImageData to grayscale bitmap
function toGrayscale(data: Uint8ClampedArray, threshold: number): Uint8Array {
  const len = data.length / 4;
  const bitmap = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const offset = i * 4;
    const gray = data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114;
    const alpha = data[offset + 3] / 255;
    bitmap[i] = gray * alpha < threshold ? 1 : 0;
  }
  return bitmap;
}

// Marching squares contour tracing
function traceContours(bitmap: Uint8Array, w: number, h: number): Point[][] {
  const visited = new Uint8Array(w * h);
  const contours: Point[][] = [];

  // Direction offsets for marching squares: [dx, dy]
  const dirs: [number, number][] = [
    [1, 0], // right
    [0, 1], // down
    [-1, 0], // left
    [0, -1], // up
  ];

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const idx = y * w + x;
      if (visited[idx] || bitmap[idx] === 0) continue;

      // Found an unvisited foreground pixel — trace its contour
      const contour: Point[] = [];
      let cx = x;
      let cy = y;
      let dir = 0; // start going right
      const startX = x;
      const startY = y;
      let steps = 0;
      const maxSteps = w * h; // safety limit

      do {
        contour.push({ x: cx, y: cy });
        visited[cy * w + cx] = 1;

        // Try to turn left first (follow left wall), then straight, then right, then back
        let turned = false;
        for (let turn = 0; turn < 4; turn++) {
          const newDir = (dir + 3 + turn) % 4; // left, straight, right, back
          const [dx, dy] = dirs[newDir];
          const nx = cx + dx;
          const ny = cy + dy;

          if (nx >= 0 && nx < w && ny >= 0 && ny < h && bitmap[ny * w + nx] === 1) {
            cx = nx;
            cy = ny;
            dir = newDir;
            turned = true;
            break;
          }
        }

        if (!turned) break;
        steps++;
      } while ((cx !== startX || cy !== startY) && steps < maxSteps);

      if (contour.length >= 2) {
        contours.push(contour);
      }
    }
  }

  return contours;
}

// Ramer-Douglas-Peucker path simplification
function simplifyPath(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let maxIdx = 0;
  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = simplifyPath(points.slice(0, maxIdx + 1), epsilon);
    const right = simplifyPath(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
  return (
    Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / len
  );
}

// Convert points to SVG path data with smooth curves
function pointsToPathD(points: Point[]): string {
  if (points.length < 2) return '';

  let d = `M${points[0].x},${points[0].y}`;

  if (points.length === 2) {
    d += `L${points[1].x},${points[1].y}`;
  } else {
    // Use quadratic bezier curves for smoothing
    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      d += `Q${points[i].x},${points[i].y},${midX},${midY}`;
    }
    const last = points[points.length - 1];
    d += `L${last.x},${last.y}`;
  }

  d += 'Z';
  return d;
}

export async function pngToSvg(
  imageData: ImageData,
  options: PngToSvgOptions = {}
): Promise<PngToSvgResult> {
  try {
    const { threshold = 128, turdSize = 10 } = options;
    const { width, height, data } = imageData;

    // Step 1: Convert to binary bitmap
    const bitmap = toGrayscale(data, threshold);

    // Step 2: Trace contours using marching squares
    const rawContours = traceContours(bitmap, width, height);

    // Step 3: Filter small contours (noise) and simplify paths
    const pathDataList: string[] = [];
    for (const contour of rawContours) {
      if (contour.length < turdSize) continue;

      // Simplify: epsilon controls smoothness (higher = smoother but less accurate)
      const epsilon = Math.max(1, Math.sqrt(contour.length) * 0.3);
      const simplified = simplifyPath(contour, epsilon);

      if (simplified.length >= 3) {
        pathDataList.push(pointsToPathD(simplified));
      }
    }

    if (pathDataList.length === 0) {
      return {
        success: true,
        data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"></svg>`,
      };
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <path d="${pathDataList.join(' ')}" fill="black"/>
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
