// middleware.ts - Cập nhật middleware chính
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./config/i18n/routing";
import { getUserAuth } from "./middleware/auth";
import { getLocaleInfo } from "./middleware/locale";
import {
  checkRouteAccessFull,
  RouteAccessResult,
} from "./middleware/routeAccess";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Main middleware function
export async function middleware(request: NextRequest) {
  // Lấy thông tin locale
  const { locale, cleanedPathname, isRootPath } = getLocaleInfo(request);

  // Xử lý nhanh cho root paths
  if (isRootPath) {
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
  }

  // Lấy thông tin xác thực người dùng
  const { role, isLoggedIn } = getUserAuth(request);

  // Kiểm tra quyền truy cập
  const access = checkRouteAccessFull(cleanedPathname, role);
  // Nếu đã đăng nhập và không có quyền -> 403 Forbidden

  if (access === RouteAccessResult.FORBIDDEN) {
    console.log("403");
    return NextResponse.rewrite(new URL(`/${locale}/403`, request.url));
  }

  if (access === RouteAccessResult.NOT_FOUND) {
    console.log("404");
    return NextResponse.rewrite(new URL(`/${locale}/404`, request.url));
  }

  // Xử lý middleware i18n
  return intlMiddleware(request);
}

// Middleware config không thay đổi
export const config = {
  matcher: [
    "/",
    "/vi",
    "/en",
    "/(vi|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

export { middleware as default };
