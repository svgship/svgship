import { describe, it, expect } from 'vitest';

describe('svgToPng', () => {
  it('is a module with expected exports', async () => {
    const mod = await import('./svg-to-png');
    expect(mod.svgToPng).toBeDefined();
    expect(typeof mod.svgToPng).toBe('function');
  });
});
