import { CookieStorageKey } from "@/constants";

// utils.ts
type CookieKey = string;

// Get the value of a cookie
export function getCookie(key: CookieKey): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${key}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

// Set a cookie
export function setCookie(key: CookieKey, value: string, day: number): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + day * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/`;
}

// Remove a cookie
export function removeCookie(key: CookieKey): void {
  if (typeof document === "undefined") return;

  document.cookie = `${key}=; Max-Age=-99999999;path=/`;
}

export function clearCookieStorage(): void {
  removeCookie(CookieStorageKey.ACCESS_TOKEN);
  removeCookie(CookieStorageKey.REFRESH_TOKEN);
  removeCookie(CookieStorageKey.REFRESH_TOKEN_EXPIRY_TIME);
}
