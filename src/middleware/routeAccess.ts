//src\middleware\routeAccess.ts
import { match } from "path-to-regexp";
import {
  authRoutes,
  publicRoutes,
  roleRoutesMap,
} from "@/constants/route.constant";
import { ROLE } from "@/constants/role.constant";

// Cache matcher functions
const matcherCache = new Map<string, ReturnType<typeof match>>();

function getMatcher(pattern: string) {
  const normalized = pattern.replace(/\[([^\]]+)\]/g, ":$1");

  if (!matcherCache.has(normalized)) {
    matcherCache.set(
      normalized,
      match(normalized, { decode: decodeURIComponent })
    );
  }

  return matcherCache.get(normalized)!;
}

export enum RouteAccessResult {
  ALLOWED = "allowed",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
}

export function checkRouteAccessFull(
  path: string,
  role: string
): RouteAccessResult {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // ✅ Ai cũng vào được các route auth hoặc lỗi
  const openRoutes = [...Object.values(authRoutes), "/403", "/404"];
  for (const route of openRoutes) {
    if (getMatcher(route)(normalizedPath)) return RouteAccessResult.ALLOWED;
  }

  // ✅ Lấy danh sách toàn bộ route hợp lệ (cho tất cả role)
  const allDefinedRoutes = new Set<string>();
  Object.values(roleRoutesMap).forEach((routes) =>
    routes.forEach((r) => allDefinedRoutes.add(r))
  );

  const isDefined = [...allDefinedRoutes].some((route) =>
    getMatcher(route)(normalizedPath)
  );

  if (!isDefined) {
    return RouteAccessResult.NOT_FOUND;
  }

  // ✅ Nếu path hợp lệ nhưng không thuộc quyền role này → FORBIDDEN
  const allowedRoutes = roleRoutesMap[role];
  if (!allowedRoutes) return RouteAccessResult.FORBIDDEN;

  const isAllowed = allowedRoutes.some((route) =>
    getMatcher(route)(normalizedPath)
  );

  return isAllowed ? RouteAccessResult.ALLOWED : RouteAccessResult.FORBIDDEN;
}
