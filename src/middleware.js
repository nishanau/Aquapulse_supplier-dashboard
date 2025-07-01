import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't need authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/verify-email" ||
    path === "/reset-password" ||
    path === "/forgot-password" ||
    path === "/" || // Landing page is public
    path.startsWith("/api/auth/"); // Auth API routes need to be accessible

  // Check for authentication cookies
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // User is authenticated if they have either token
  // The backend will handle token validation and refresh
  const isAuthenticated = !!accessToken || !!refreshToken;

  // If trying to access a protected route without being logged in
  if (!isPublicPath && !isAuthenticated) {
    // Save the requested URL to redirect back after login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);

    // Redirect to login page
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access login/register pages
  if (
    isPublicPath &&
    isAuthenticated &&
    path !== "/" && // Don't redirect from landing page
    !path.startsWith("/api/")
  ) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For all other cases, continue with the request
  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    // Base routes
    "/dashboard",
    "/profile",
    "/forgot-password",
    // Protected routes that require authentication
    "/dashboard/:path*",
    "/profile/:path*",
    "/verify-email",

    // Auth-related routes (to redirect if already logged in)
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",

    // Exclude static files and images from middleware processing for better performance
   // "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
