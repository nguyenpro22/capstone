// middleware/auth.ts - Bổ sung kiểm tra đã đăng nhập
import { ROLE } from "@/constants/role.constant";
import { GetDataByToken, TokenData } from "@/utils";
import { NextRequest } from "next/server";

// Cache để tránh lặp lại việc giải mã JWT
const tokenCache = new Map<string, TokenData>();

export function getUserAuth(request: NextRequest): {
  role: string;
  isLoggedIn: boolean;
} {
  const token = request.cookies.get("jwt-access-token")?.value;

  if (!token) return { role: ROLE.GUEST, isLoggedIn: false };

  // Sử dụng cache nếu có
  if (tokenCache.has(token)) {
    const data = tokenCache.get(token);
    return {
      role: data?.roleName || ROLE.GUEST,
      isLoggedIn: true,
    };
  }

  // Giải mã token và cache kết quả
  const userData = GetDataByToken(token);
  if (userData) {
    tokenCache.set(token, userData);
    return {
      role: userData.roleName,
      isLoggedIn: true,
    };
  }

  return { role: ROLE.GUEST, isLoggedIn: false };
}
