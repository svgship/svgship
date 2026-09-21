import { describe, it, expect } from 'vitest';
import { getLogoSrc } from './logo';

describe('getLogoSrc', () => {
  it('resolves a bare filename to /logos/', () => {
    expect(getLogoSrc('svgrepo_favicon.ico')).toBe('/logos/svgrepo_favicon.ico');
  });

  it('passes through absolute paths unchanged', () => {
    expect(getLogoSrc('/logos/svgrepo_favicon.ico')).toBe('/logos/svgrepo_favicon.ico');
    expect(getLogoSrc('/custom/path/logo.svg')).toBe('/custom/path/logo.svg');
  });

  it('passes through full https URLs unchanged', () => {
    expect(getLogoSrc('https://example.com/logo.png')).toBe('https://example.com/logo.png');
  });

  it('passes through full http URLs unchanged', () => {
    expect(getLogoSrc('http://example.com/logo.png')).toBe('http://example.com/logo.png');
  });
});
