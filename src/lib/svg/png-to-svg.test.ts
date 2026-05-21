import { describe, it, expect } from 'vitest';

describe('pngToSvg', () => {
  it('is a module with expected exports', async () => {
    const mod = await import('./png-to-svg');
    expect(mod.pngToSvg).toBeDefined();
    expect(typeof mod.pngToSvg).toBe('function');
  });
});
