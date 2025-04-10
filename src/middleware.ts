import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./config/i18n/routing";
import { routeAccess } from "./constants";
import { GetDataByToken, TokenData } from "./utils";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Main middleware function
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const localeMatch = pathname.match(/^\/(vi|en)(\/|$)/);
  const locale = localeMatch?.[1];
  const cleanedPathname = locale
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname;
  const token = request.cookies.get("jwt-access-token")?.value as string;
  let { roleName } = GetDataByToken(token) as TokenData;
  if (!token) {
    roleName = "Guest";
  }
  console.log("roleName", roleName);
  console.log("pathname", pathname);

  const access = routeAccess(cleanedPathname, roleName as string);

  if (!access) {
    // Redirect to the 404 page if the route is not accessible
    return NextResponse.rewrite(new URL("/404", request.url));
  }

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
