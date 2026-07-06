import { describe, it, expect } from 'vitest';
import { resolveTag, getTagTranslation } from './tags';

describe('tags translation helper', () => {
  it('should resolve Chinese tags to localized strings', () => {
    expect(resolveTag('线性', 'zh')).toBe('线性');
    expect(resolveTag('线性', 'en')).toBe('Linear');
  });

  it('should fallback to the raw tag key if no translation is found', () => {
    expect(resolveTag('UnknownTag', 'en')).toBe('UnknownTag');
    expect(resolveTag('UnknownTag', 'zh')).toBe('UnknownTag');
  });

  it('should return translation object via getTagTranslation', () => {
    const translation = getTagTranslation('免费可商用');
    expect(translation).toEqual({ zh: '免费可商用', en: 'Free Commercial' });
  });

  it('should return undefined for non-existent tags via getTagTranslation', () => {
    expect(getTagTranslation('NotHere')).toBeUndefined();
  });
});
