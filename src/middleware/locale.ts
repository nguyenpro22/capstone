// middleware/locale.ts - Tách logic xử lý locale
import { NextRequest } from "next/server";

export interface LocaleInfo {
  locale: string;
  cleanedPathname: string;
  isRootPath: boolean;
}

export function getLocaleInfo(request: NextRequest): LocaleInfo {
  const pathname = request.nextUrl.pathname;

  // Kiểm tra xem có phải là root path
  const isRootPath =
    pathname === "/" || pathname === "/vi" || pathname === "/en";

  // Phân tích locale
  const localeMatch = pathname.match(/^\/(vi|en)(\/|$)/);
  const locale = localeMatch?.[1] || "vi"; // Mặc định locale là vi

  // Làm sạch đường dẫn
  const cleanedPathname = localeMatch
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname;

  return { locale, cleanedPathname, isRootPath };
}
