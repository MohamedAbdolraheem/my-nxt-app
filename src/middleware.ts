import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll();
          console.log('Middleware getting cookies:', cookies.map(c => c.name));
          return cookies;
        },
        setAll(cookiesToSet) {
          console.log('Middleware setting cookies:', cookiesToSet.map(c => c.name));
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get the session
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Debug logging
  console.log('Middleware - Path:', request.nextUrl.pathname, 'User:', user ? 'Authenticated' : 'Not authenticated', 'Session:', !!session);
  console.log('All cookies:', request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })));

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/expenses', '/categories'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // Temporarily disable redirects to test session
  console.log('Middleware - Path:', request.nextUrl.pathname, 'User:', user ? 'Authenticated' : 'Not authenticated', 'Session:', !!session);
  console.log('All cookies:', request.cookies.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })));

  // Only redirect if accessing protected route without authentication
  // if (isProtectedRoute && !user) {
  //   // Redirect to login if accessing protected route without authentication
  //   console.log('Redirecting to login - no user found');
  //   const redirectUrl = new URL('/login', request.url);
  //   return NextResponse.redirect(redirectUrl);
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 