// middleware/locale.ts - Tách logic xử lý locale
import { NextRequest } from "next/server";

export interface LocaleInfo {
  locale: string;
  cleanedPathname: string;
  isRootPath: boolean;
}

export function getLocaleInfo(request: NextRequest): LocaleInfo {
  const pathname = request.nextUrl.pathname;

  // Đọc locale từ cookie trước
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  // Nếu không có cookie, fallback từ pathname
  const localeMatch = pathname.match(/^\/(vi|en)(\/|$)/);
  const locale = cookieLocale || localeMatch?.[1] || "vi";

  const cleanedPathname = localeMatch
    ? pathname.replace(`/${localeMatch[1]}`, "") || "/"
    : pathname;

  const isRootPath =
    pathname === "/" || pathname === "/vi" || pathname === "/en";

  return { locale, cleanedPathname, isRootPath };
}
