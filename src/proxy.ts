import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // 1. Check for cookie
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');

  let locale = defaultLocale;

  if (savedLocale && locales.includes(savedLocale)) {
    locale = savedLocale;
  } else if (acceptLanguage) {
    if (acceptLanguage.toLowerCase().includes('ar')) {
      locale = 'ar';
    }
  }

  // 3. Absolute URL Redirect
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  return NextResponse.redirect(url);
}

// 4. Matcher configuration
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
