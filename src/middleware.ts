import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'zh'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 根路径是语言选择页（hreflang x-default 落地页），直接放行返回 200。
  // 不做任何语言协商：Googlebot 请求不带 Accept-Language 头。
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Extract locale from path prefix if present
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1];
    const response = NextResponse.next();
    response.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // Skip internal paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return;
  }

  // 无 locale 前缀的路径固定 308 到默认语言版本。
  // 刻意不按 Accept-Language 协商：Google 官方明确不建议按语言自动重定向，
  // 协商会让重定向目的地对用户与爬虫不一致。
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl, 308);
  response.cookies.set('locale', defaultLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  // og-image 是无 locale 前缀的根级路由（src/app/og-image/route.tsx），必须排除。
  // 否则中间件会把它改写成 /{locale}/og-image → 404，导致全站 og:image / twitter:image 失效。
  // 它没有点号，兜不住 `.*\\..*`，只能在这里显式排除。
  matcher: ['/((?!_next|api|og-image|favicon.ico|.*\\..*).*)'],
};
