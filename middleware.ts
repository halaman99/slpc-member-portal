import { type NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/schedule',
  '/attendance',
  '/formation',
  '/events',
  '/members',
  '/announcements',
  '/settings',
]

// Auth routes that shouldn't be redirected (includes callback)
const authRoutes = ['/auth/login', '/auth/signup', '/auth/callback', '/auth/forgot-password', '/auth/reset-password']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Get the auth token from cookies (Supabase stores it as sb-{project-id}-auth-token)
  const authToken = request.cookies.get('sb-lgktylgxcfpfshkixdur-auth-token')?.value

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if accessing auth routes with valid auth
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}

