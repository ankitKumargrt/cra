import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup" || path === "/forgot-password" || path === "/"

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value

  // Check for RSC requests and bypass authentication for those
  const isRSCRequest = request.nextUrl.search?.includes("_rsc=")
  if (isRSCRequest) {
    return NextResponse.next()
  }

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on a public path but has a token, don't redirect
    // Let the client-side auth handle the redirection based on role
    return NextResponse.next()
  }

  if (!isPublicPath && !token) {
    // If user is on a protected path but has no token, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/l1/dashboard/:path*",
    "/l2/dashboard/:path*",
    "/l3/dashboard/:path*",
  ],
}
