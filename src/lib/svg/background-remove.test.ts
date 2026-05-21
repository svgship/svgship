import { describe, it, expect } from 'vitest';
import { removeBackground } from './background-remove';

describe('removeBackground', () => {
  it('removes white background from SVG', () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#ffffff"/>
      <circle cx="50" cy="50" r="30" fill="red"/>
    </svg>`;

    const result = removeBackground(input);
    expect(result.success).toBe(true);
    expect(result.removed).toBe(true);
  });

  it('does not remove non-white fills', () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#ff0000"/>
    </svg>`;

    const result = removeBackground(input);
    expect(result.success).toBe(true);
    expect(result.removed).toBe(false);
  });

  it('handles SVG without backgrounds', () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <circle cx="50" cy="50" r="30" fill="blue"/>
    </svg>`;

    const result = removeBackground(input);
    expect(result.success).toBe(true);
    expect(result.removed).toBe(false);
  });

  it('respects custom threshold', () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#f0f0f0"/>
    </svg>`;

    // With high threshold, near-white should be removed
    const result1 = removeBackground(input, { threshold: 100 });
    expect(result1.success).toBe(true);
    expect(result1.removed).toBe(true);

    // With low threshold, near-white should not be removed
    const result2 = removeBackground(input, { threshold: 5 });
    expect(result2.success).toBe(true);
    expect(result2.removed).toBe(false);
  });
});
