import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isComingSoonEnabled } from '@/shared/lib/coming-soon';

const PREVIEW_COOKIE = 'coming_soon_preview';
const PREVIEW_QUERY = 'preview';

export function proxy(request: NextRequest) {
  if (!isComingSoonEnabled()) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  if (searchParams.get(PREVIEW_QUERY) === '1') {
    const response = NextResponse.next();
    response.cookies.set(PREVIEW_COOKIE, '1', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  if (request.cookies.get(PREVIEW_COOKIE)?.value === '1') {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
