import { CookieStorageKey } from "@/constants";
import { clearCookieStorage, getCookie, setCookie } from "./cookieStorageUtils";
export const clearToken = () => {
  // clearLocalStorage();
  // clearSessionStorage();
  clearCookieStorage();
};

export const getAccessToken = (): string | null => {
  return getCookie(CookieStorageKey.ACCESS_TOKEN) == "undefined"
    ? null
    : getCookie(CookieStorageKey.ACCESS_TOKEN);
};

export const setAccessToken = (value: unknown) => {
  console.log("setAccessToken", value);

  return setCookie(CookieStorageKey.ACCESS_TOKEN, value as string, 1);
};

export const getRefreshToken = () => {
  return getCookie(CookieStorageKey.REFRESH_TOKEN);
};

export const setRefreshToken = (value: unknown) => {
  return setCookie(CookieStorageKey.REFRESH_TOKEN, value as string, 1);
};

export const getRefreshTokenExpiryTime = () => {
  return getCookie(CookieStorageKey.REFRESH_TOKEN_EXPIRY_TIME);
};

export const setRefreshTokenExpiryTime = (value: unknown) => {
  return setCookie(
    CookieStorageKey.REFRESH_TOKEN_EXPIRY_TIME,
    value as string,
    1
  );
};

export const decodeJwt = (token: string | null) => {
  if (token === "undefined" || !token) {
    return null;
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  // Giải mã base64 an toàn cho Unicode
  try {
    // Chuyển base64 thành binary string
    const binaryString = atob(base64);

    // Chuyển binary string thành mảng bytes
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Chuyển mảng bytes thành string UTF-8
    const decodedString = new TextDecoder("utf-8").decode(bytes);

    // Parse JSON
    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};
export const GetDataByToken = (token: string): TokenData | null => {
  const decoded = decodeJwt(token);
  const roleName = decoded?.RoleName;
  const roleId = decoded?.RoleId;
  const userId = decoded?.UserId;
  const clinicId = decoded?.ClinicId;
  const phone = decoded?.PhoneNumber;
  const name = decoded?.Name;
  const email = decoded?.Email;
  const subscriptionPackageId = decoded?.SubscriptionPackageId;
  const isFirstLogin = decoded?.IsFirstLogin;
  const isRejected = decoded?.IsRejected;
  const dateJoined = decoded?.DateJoined;
  return {
    roleName,
    roleId,
    userId,
    clinicId,
    name,
    email,
    subscriptionPackageId,
    isFirstLogin,
    phone,
    isRejected,
    dateJoined
  };
};

export type TokenData = {
  roleName: string;
  roleId: string;
  userId: string;
  clinicId?: string;
  name?: string;
  email?: string;
  phone?: string;
  subscriptionPackageId?: string;
  isFirstLogin: string;
  isRejected: string;
  dateJoined: string;
};

export const rememberMe = (token: string, refreshToken: string): void => {
  setCookie(CookieStorageKey.REMEMBER_ME, "true", 30);
  setCookie(CookieStorageKey.ACCESS_TOKEN, token, 30);
  setCookie(CookieStorageKey.REFRESH_TOKEN, refreshToken, 30);
};
export const isRememberMe = (): boolean => {
  return getCookie(CookieStorageKey.REMEMBER_ME) ? true : false;
};

export const isTokenExpired = (): boolean => {
  const expiryTime = getRefreshTokenExpiryTime();
  if (!expiryTime) {
    return true;
  }
  const timeRemaining = new Date(expiryTime).getTime() - Date.now();
  const threshold = 30 * 1000;

  return timeRemaining <= threshold;
};
