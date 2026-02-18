import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'ar';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // i18n & Redirection
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale && !pathname.startsWith('/api')) {
    const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const acceptLanguage = request.headers.get('accept-language');
    let locale = defaultLocale;

    if (savedLocale && locales.includes(savedLocale)) {
      locale = savedLocale;
    } else if (acceptLanguage?.toLowerCase().includes('ar')) {
      locale = 'ar';
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  // Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = user?.app_metadata?.role;

  if (!pathname.startsWith('/api')) {
    // skip redirects for server actions
    const isServerAction =
      request.method === 'POST' && request.headers.has('next-action');
    if (isServerAction) return supabaseResponse;

    const segments = pathname.split('/').filter(Boolean);
    const locale =
      segments[0] === 'en' || segments[0] === 'ar'
        ? segments[0]
        : defaultLocale;

    const isProtected =
      pathname.includes('/admin') ||
      pathname.includes('/muazzin') ||
      pathname.includes('/restaurant');

    const isAuthPage = pathname.includes('/login');

    // Basic Auth Check
    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    if (isAuthPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }

    // Role-Based Access Control (RBAC)
    if (user && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;

      if (pathname.includes('/admin') && userRole !== 'super_admin') {
        return NextResponse.redirect(url);
      }
      if (pathname.includes('/muazzin') && userRole !== 'muazzin') {
        return NextResponse.redirect(url);
      }
      if (pathname.includes('/restaurant') && userRole !== 'restaurant_admin') {
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
