import {
  clinicAdminRoutes,
  clinicStaffRoutes,
  customerRoutes,
  doctorRoutes,
  ROLE,
  systemAdminRoutes,
  systemStaffRoutes,
} from "@/constants";

/**
 * Kiểm tra xem có đang ở trang xác thực không
 */
export const isOnAuthPage = (locale: string): boolean => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    return /^\/(login|auth|register|)$/.test(path.replace(`/${locale}/`, "/"));
  }
  return false;
};

/**
 * Chuyển hướng người dùng dựa trên vai trò
 */
export const handleRedirectByRole = (role: string, router: any): void => {
  // Ánh xạ vai trò với đường dẫn mặc định
  const roleRouteMap: Record<string, string | undefined> = {
    [ROLE.SYSTEM_ADMIN]: systemAdminRoutes.DEFAULT,
    [ROLE.DOCTOR]: doctorRoutes.DEFAULT,
    [ROLE.CUSTOMER]: customerRoutes.DEFAULT,
    [ROLE.CLINIC_STAFF]: clinicStaffRoutes.DEFAULT,
    [ROLE.CLINIC_ADMIN]: clinicAdminRoutes.DEFAULT,
    [ROLE.SYSTEM_STAFF]: systemStaffRoutes.DEFAULT,
  };

  // Lấy đường dẫn chuyển hướng dựa trên vai trò
  const redirectPath = roleRouteMap[role] || "/";

  console.log(`Redirecting to ${redirectPath} based on role ${role}`);

  // Thực hiện chuyển hướng
  router.push(redirectPath);
};
