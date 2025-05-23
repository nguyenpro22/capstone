import { ROLE } from "./role.constant";
import { match } from "path-to-regexp";

// Path prefixes
const privateSystemAdminPath = "/systemAdmin";
const privateClinicAdminPath = "/clinicManager";
const privateDoctorPath = "/doctor";
const privateClinicStaffPath = "/clinicStaff";
const publicCustomerPath = "";
const privateSystemStaffPath = "/systemStaff";

// SYSTEM ADMIN ROUTES
export const systemAdminRoutes = {
  DEFAULT: `${privateSystemAdminPath}/dashboard`,
  DASHBOARD: `${privateSystemAdminPath}/dashboard`,
  CLINICS: `${privateSystemAdminPath}/clinic`,
  PARTNERSHIP: `${privateSystemAdminPath}/partnership`,
  BRANCHES: `${privateSystemAdminPath}/branch-request`,
  PACKAGE: `${privateSystemAdminPath}/package`,
  CATEGORIES: `${privateSystemAdminPath}/category-service`,
  SETTINGS: `${privateSystemAdminPath}/settings`,
  USERS: `${privateSystemAdminPath}/user`, // Sửa lỗi đường dẫn
  WITHDRAWS: `${privateSystemAdminPath}/withdrawal-approval`, // Sửa lỗi đường dẫn
  POLICIES: `${privateSystemAdminPath}/policy`, // Sửa lỗi đường dẫn
  PROFILE: `${privateSystemAdminPath}/profile`, // Sửa lỗi đường dẫn

};

// CLINIC ADMIN ROUTES
export const clinicAdminRoutes = {
  DEFAULT: `${privateClinicAdminPath}/dashboard`,
  DASHBOARD: `${privateClinicAdminPath}/dashboard`,
  STAFF: `${privateClinicAdminPath}/staff`,
  DOCTOR: `${privateClinicAdminPath}/doctor`,
  SERVICE: `${privateClinicAdminPath}/service`,
  PROFILE: `${privateClinicAdminPath}/profile`,
  BRANCH: `${privateClinicAdminPath}/branch`,
  PACKAGE: `${privateClinicAdminPath}/buy-package`,
  ORDER: `${privateClinicAdminPath}/order`,
  INBOX: `${privateClinicAdminPath}/inbox`,
  MANAGE_LIVESTREAM: `${privateClinicAdminPath}/live-stream`,
  LIVESTREAM: `${privateClinicAdminPath}/live-stream/host-page`,
  WALLET: `${privateClinicAdminPath}/wallet`,
  WITHDRAWS: `${privateClinicAdminPath}/withdrawal-approval`,
  POLICIES: `${privateClinicAdminPath}/policy`,
  CONFIGS: `${privateClinicAdminPath}/configuration`,
};

// DOCTOR ROUTES
export const doctorRoutes = {
  DEFAULT: `${privateDoctorPath}/calendar`,
  CALENDAR: `${privateDoctorPath}/calendar`,
  PROFILE: `${privateDoctorPath}/profile`,
  REGISTER_SCHEDULE: `${privateDoctorPath}/register-schedule`,
};

// CLINIC STAFF ROUTES
export const clinicStaffRoutes = {
  DEFAULT: `${privateClinicStaffPath}/dashboard`,
  DASHBOARD: `${privateClinicStaffPath}/dashboard`,
  CUSTOMER_SCHEDULE: `${privateClinicStaffPath}/customer-schedule`,
  APPOINTMENT: `${privateClinicStaffPath}/appointment`,
  DOCTOR: `${privateClinicStaffPath}/doctor`,
  ORDER: `${privateClinicStaffPath}/order`,
  SCHEDULE_APPROVAL: `${privateClinicStaffPath}/schedule-approval`,
  PROFILE: `${privateClinicStaffPath}/profile`,
  SERVICES: `${privateClinicStaffPath}/service`,
  INBOX: `${privateClinicStaffPath}/inbox`,
  WALLET: `${privateClinicStaffPath}/wallet`,
  WORKING_SCHEDULE: `${privateClinicStaffPath}/working-schedule`,
  POLICIES: `${privateClinicStaffPath}/policy`,
};

// CUSTOMER ROUTES
export const customerRoutes = {
  DEFAULT: `${publicCustomerPath}/`,
  HOME: `${publicCustomerPath}/home`,
  LIVESTREAM_VIEW: `${publicCustomerPath}/livestream-view`,
  PROFILE: `${publicCustomerPath}/profile`,
  CLINIC_VIEW: `${publicCustomerPath}/clinic-view`,
  CLINIC_DETAIL: `${publicCustomerPath}/clinic-view/[id]`,
  LIVESTREAM_ROOM: `${publicCustomerPath}/livestream-view/[id]`,
  ORDERS: `${publicCustomerPath}/orders`,
  SERVICES: `${publicCustomerPath}/services`,
  SERVICE_DETAIL: `${publicCustomerPath}/services/[id]`,
  INBOX: `${publicCustomerPath}/inbox`,
  REGISTER_CLINIC: "/registerClinic",
};

export const systemStaffRoutes = {
  DEFAULT: `${privateSystemStaffPath}/clinic`,
  PARTNERSHIP: `${privateSystemStaffPath}/partnership`,
  SETTINGS: `${privateSystemStaffPath}/setting`,
  CLINICS: `${privateSystemStaffPath}/clinic`,
  PROFILES: `${privateSystemStaffPath}/profile`,
  BRANCHES: `${privateSystemStaffPath}/branch-request`,
  POLICIES: `${privateSystemStaffPath}/policy`,
};

export const publicRoutes = {
  DEFAULT: "/",
  HOME: "/home",
  SERVICES: "/services",
  POLICY: "/policy",
  SERVICE_DETAIL: "/services/[id]",
  LIVESTREAM_VIEW: "/livestream-view",
  REGISTER_CLINIC: "/registerClinic",
  CLINIC_VIEW: "/clinic-view",
  CLINIC_DETAIL: "/clinic-view/[id]",
  ERROR_404: "/404",
  ERROR_403: "/403",
};

export const authRoutes = {
  REGISTER: "/register",
  LOGIN: "/login",
  PARTNER_LOGIN: "/login-partner",
  FORGOT_PASSWORD: "/forgot-password",
  POPUP_CALLBACK: "/popup-callback",
};

// Cache để lưu các matcher functions
const matcherCache = new Map<string, ReturnType<typeof match>>();

// Cache routes cho từng role
export const roleRoutesMap = {
  [ROLE.SYSTEM_ADMIN]: [...Object.values(systemAdminRoutes)],
  [ROLE.CLINIC_ADMIN]: [...Object.values(clinicAdminRoutes)],
  [ROLE.DOCTOR]: [...Object.values(doctorRoutes)],
  [ROLE.CLINIC_STAFF]: [...Object.values(clinicStaffRoutes)],
  [ROLE.CUSTOMER]: [...Object.values(customerRoutes)],
  [ROLE.SYSTEM_STAFF]: [...Object.values(systemStaffRoutes)],
  [ROLE.GUEST]: [...Object.values(publicRoutes)],
};

// Tạo và cache matcher function
function getMatcher(route: string): ReturnType<typeof match> {
  const normalizedRoute = route.replace(/\[([^\]]+)\]/g, ":$1");

  if (!matcherCache.has(normalizedRoute)) {
    matcherCache.set(
      normalizedRoute,
      match(normalizedRoute, { decode: decodeURIComponent })
    );
  }

  return matcherCache.get(normalizedRoute)!;
}

export const routeAccess = (
  path: string,
  role: string,
  isLoggedIn = false
): boolean => {
  console.log("Checking route access...");
  console.log("Requested path:", path);
  console.log("User role:", role);
  console.log("Is logged in:", isLoggedIn);

  // Đảm bảo path luôn bắt đầu bằng '/'
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Kiểm tra các auth routes - tất cả role đều có thể truy cập
  const authPaths = Object.values(authRoutes);
  for (const route of authPaths) {
    if (getMatcher(route)(normalizedPath)) {
      console.log("Path is an auth route, access granted.");
      return true;
    }
  }

  // Kiểm tra error pages (403, 404) - tất cả đều có thể truy cập
  if (normalizedPath === "/403" || normalizedPath === "/404") {
    console.log("Path is an error page, access granted.");
    return true;
  }

  // Lấy danh sách routes cho role
  const allowedRoutes = roleRoutesMap[role];
  if (!allowedRoutes) {
    console.log(`No routes found for role: ${role}`);
    return false;
  }

  // Kiểm tra path có thuộc các routes của role hay không
  for (const route of allowedRoutes) {
    const matcher = getMatcher(route);
    const matchResult = matcher(normalizedPath);

    if (matchResult !== false) {
      console.log("Access granted for path:", normalizedPath);
      return true;
    }
  }

  console.log("Access denied for path:", normalizedPath);
  return false;
};
