import { NextResponse } from 'next/server';

import { auth } from './auth';

const publicUrls = ['/login', '/signup', '/'];

export default auth((req) => {
  if (!req.auth && !publicUrls.includes(req.url)) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
