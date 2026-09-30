import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'zh'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  if (acceptLanguage.includes('zh')) return 'zh';
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from path prefix if present
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const locale = pathnameHasLocale ? pathname.split('/')[1] : getLocale(request);

  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // Skip internal paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return;
  }

  // Redirect to locale-prefixed path
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl, 308);
  response.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  // og-image 是无 locale 前缀的根级路由（src/app/og-image/route.tsx），必须排除。
  // 否则中间件会把它改写成 /{locale}/og-image → 404，导致全站 og:image / twitter:image 失效。
  // 它没有点号，兜不住 `.*\\..*`，只能在这里显式排除。
  matcher: ['/((?!_next|api|og-image|favicon.ico|.*\\..*).*)'],
};
