import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Protect API courses routes
  if (req.nextUrl.pathname.startsWith('/api/courses') && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'], // apply middleware to all routes except system ones
};






