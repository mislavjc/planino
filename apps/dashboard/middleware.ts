import { NextResponse } from 'next/server';

import { auth } from './auth';

const publicUrls = ['/prijava', '/'];

export default auth((req) => {
  if (!req.auth && !publicUrls.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/prijava', req.url));
  }

  if (req.auth && req.nextUrl.pathname === '/prijava') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
