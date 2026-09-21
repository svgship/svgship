/**
 * Resolve a site's logo field to a usable <img> src.
 *
 * Supports:
 *   - Local filename (default): "svgrepo_favicon.ico" → "/logos/svgrepo_favicon.ico"
 *   - Absolute path:             "/logos/svgrepo_favicon.ico" → unchanged
 *   - Full URL:                  "https://example.com/logo.png" → unchanged
 */
export function getLogoSrc(logo: string): string {
  if (logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('/')) {
    return logo;
  }
  return `/logos/${logo}`;
}
