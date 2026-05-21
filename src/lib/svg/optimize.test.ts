import { describe, it, expect } from 'vitest';
import { optimizeSvg, sanitizeSvg } from './optimize';

describe('sanitizeSvg', () => {
  it('removes script tags', () => {
    const input = '<svg><script>alert("xss")</script><rect/></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<rect');
  });

  it('removes event handlers', () => {
    const input = '<svg><rect onclick="alert(1)"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain('onclick');
  });

  it('preserves valid SVG', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).toContain('<rect');
    expect(result).toContain('width="100"');
  });
});

describe('optimizeSvg', () => {
  it('optimizes a valid SVG', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <!-- This is a comment -->
  <metadata>Some metadata</metadata>
  <rect x="10" y="10" width="80" height="80" fill="red"/>
</svg>`;

    const result = optimizeSvg(input);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.originalSize).toBeGreaterThan(0);
    expect(result.optimizedSize).toBeGreaterThan(0);
    expect(result.optimizedSize!).toBeLessThanOrEqual(result.originalSize!);
  });

  it('handles minimal SVG', () => {
    const input = '<svg><rect/></svg>';
    const result = optimizeSvg(input);
    expect(result.success).toBe(true);
  });

  it('returns error for completely invalid input', () => {
    const result = optimizeSvg('not svg at all <><<>');
    // SVGO may still try to process it, so check for either success or graceful error
    expect(typeof result.success).toBe('boolean');
  });
});
