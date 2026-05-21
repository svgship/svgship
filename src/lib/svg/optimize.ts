import { optimize as svgoOptimize } from 'svgo';
import DOMPurify from 'dompurify';

export function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true },
    FORBID_TAGS: ['script', 'foreignObject'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
  });
}

export interface OptimizeResult {
  success: boolean;
  data?: string;
  originalSize?: number;
  optimizedSize?: number;
  error?: string;
}

export function optimizeSvg(svg: string): OptimizeResult {
  try {
    const sanitized = sanitizeSvg(svg);
    const originalSize = new Blob([svg]).size;

    const result = svgoOptimize(sanitized, {
      multipass: true,
      plugins: [
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeEditorsNSData',
        'cleanupAttrs',
        'mergeStyles',
        'minifyStyles',
        'removeUselessDefs',
        'cleanupNumericValues',
        'convertColors',
        'removeUnknownsAndDefaults',
        'removeNonInheritableGroupAttrs',
        'removeUselessStrokeAndFill',
        'cleanupEnableBackground',
        'removeHiddenElems',
        'removeEmptyText',
        'convertShapeToPath',
        'convertEllipseToCircle',
        'moveGroupAttrsToElems',
        'collapseGroups',
        'convertPathData',
        'convertTransform',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'removeUnusedNS',
        'sortDefsChildren',
        'removeTitle',
        'removeDesc',
      ],
    });

    const optimizedSize = new Blob([result.data]).size;

    return {
      success: true,
      data: result.data,
      originalSize,
      optimizedSize,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Optimization failed',
    };
  }
}
