import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./config/i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Main middleware function
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle root and locale-specific root paths
  if (pathname === "/" || pathname === "/vi" || pathname === "/en") {
    // Determine the locale
    const locale = pathname === "/en" ? "en" : "vi";
    // Redirect to the home page with the appropriate locale
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  // Handle all other routes with next-intl middleware
  return intlMiddleware(request);
}

// Middleware config
export const config = {
  // Match all routes except for static files, API routes, and other excluded paths
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

export { middleware as default };
