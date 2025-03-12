import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login" || path === "/signup"

  // Check if user is authenticated by looking for the token in cookies
  const isAuthenticated = request.cookies.has("finflow_auth_token")

  // Redirect logic
  if (isPublicPath && isAuthenticated) {
    // If user is on a public path but is authenticated, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicPath && !isAuthenticated) {
    // If user is on a protected path but is not authenticated, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Specify the paths that should trigger this middleware
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/invoices/:path*",
    "/expenses/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
}

