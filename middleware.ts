import { NextRequest, NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/'];

// Define routes that should be accessible with authentication
const protectedRoutes = ['/dashboard', '/profile'];

// Define public API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/otp-confirmation',
  '/api/auth/resend-otp'
];

// Define API routes that require authentication
const protectedApiRoutes = [
  '/api/profile/create-profile',
  '/api/profile/get-profile'
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for public routes, static assets, and public API routes
  if (publicRoutes.some(route => path.startsWith(route)) ||
      publicApiRoutes.some(route => path === route) ||
      path.includes('/_next') ||
      path.includes('/favicon.ico') ||
      path.includes('.png')) {
    return NextResponse.next();
  }

  // Check for access token in cookies
  const token = request.cookies.get('access_token')?.value;

  // Redirect to sign-in if no token is found
  if (!token) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // Check if the user is trying to access a protected route or API
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => path.startsWith(route));

  // Allow access to protected routes with a valid token
  if (isProtectedRoute || isProtectedApiRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};