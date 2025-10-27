import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware - Protects routes that require authentication
 * 
 * This runs before pages are rendered to check user authentication
 */

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require auth
  const publicRoutes = ['/', '/api/auth', '/api/webhooks', '/paywall'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!userId) {
    // Redirect to login
    const loginUrl = new URL('/api/auth/whop', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // TODO: Add membership verification here if needed
  // const user = await verifyMembership(userId);
  // if (!user.membershipId) {
  //   return NextResponse.redirect(new URL('/paywall', request.url));
  // }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
