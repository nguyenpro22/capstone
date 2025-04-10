import { ROLE } from "./role.constant";
import { match } from "path-to-regexp";
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
  PACKAGE: `${privateSystemAdminPath}/package`,
  CLINICS: `${privateSystemAdminPath}/clinics`,
  CATEGORIES: `${privateSystemAdminPath}/categories`,
  SERVICES: `${privateSystemAdminPath}/services`,
  SETTINGS: `${privateSystemAdminPath}/settings`,
};

// CLINIC ADMIN ROUTES
export const clinicAdminRoutes = {
  DEFAULT: `${privateClinicAdminPath}/dashboard`,
  DASHBOARD: `${privateClinicAdminPath}/dashboard`,
  STAFFS: `${privateClinicAdminPath}/staffs`,
  DOCTORS: `${privateClinicAdminPath}/doctors`,
  SERVICES: `${privateClinicAdminPath}/services`,
  BOOKINGS: `${privateClinicAdminPath}/bookings`,
  CUSTOMERS: `${privateClinicAdminPath}/customers`,
  REPORTS: `${privateClinicAdminPath}/reports`,
};

// DOCTOR ROUTES
export const doctorRoutes = {
  DEFAULT: `${privateDoctorPath}/calendar`,
  CALENDAR: `${privateDoctorPath}/calendar`,
  PROFILE: `${privateDoctorPath}/profile`,
};

// CLINIC STAFF ROUTES
export const clinicStaffRoutes = {
  DEFAULT: `${privateClinicStaffPath}/dashboard`,
  DASHBOARD: `${privateClinicStaffPath}/dashboard`,
  BOOKINGS: `${privateClinicStaffPath}/bookings`,
  CUSTOMERS: `${privateClinicStaffPath}/customers`,
};

// CUSTOMER ROUTES
export const customerRoutes = {
  DEFAULT: `${publicCustomerPath}/`,
  HOME: `${publicCustomerPath}/home`,
  LIVESTREAM_VIEW: `${publicCustomerPath}/livestream-view`,
  LIVESTREAM_ROOM: `${publicCustomerPath}/livestream-view/[id]`, // for testing only
  ORDERS: `${publicCustomerPath}/orders`,
  SERVICES: `${publicCustomerPath}/services`,
  SERVICE_DETAIL: `${publicCustomerPath}/services/[id]`,
  PROFILE: `${publicCustomerPath}/profile`,
};
export const systemStaffRoutes = {
  DEFAULT: `${privateSystemStaffPath}/clinic`,
  DASHBOARD: `${privateSystemStaffPath}/dashboard`,
  BOOKINGS: `${privateSystemStaffPath}/bookings`,
  CUSTOMERS: `${privateSystemStaffPath}/customers`,
  CLINICS: `${privateSystemStaffPath}/clinics`,
};

export const publicRoutes = {
  DEFAULT: "/",
  HOME: "/home",
  SERVICES: "/services",
  SERVICE_DETAIL: "/services/[id]",
  LIVESTREAM_VIEW: "/livestream-view",
  REGISTER_CLINIC: "/registerClinic",
};
export const authRoutes = {
  REGISTER: "/register",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  POPUP_CALLBACK: "/popup-callback",
};
export const routeAccess = (path: string, role: string): boolean => {
  const roleRoutes = {
    [ROLE.SYSTEM_ADMIN]: systemAdminRoutes,
    [ROLE.CLINIC_ADMIN]: clinicAdminRoutes,
    [ROLE.DOCTOR]: doctorRoutes,
    [ROLE.CLINIC_STAFF]: clinicStaffRoutes,
    [ROLE.CUSTOMER]: customerRoutes,
    [ROLE.SYSTEM_STAFF]: systemStaffRoutes,
    [ROLE.GUEST]: publicRoutes,
  };

  // ✅ Cho phép tất cả role truy cập authRoutes
  const authRoutePaths = Object.values(authRoutes).map((route) =>
    route.replace(/\[([^\]]+)\]/g, ":$1")
  );
  if (
    authRoutePaths.some((route) => {
      const isMatch = match(route, { decode: decodeURIComponent });
      return isMatch(path);
    })
  ) {
    return true;
  }

  const routes = roleRoutes[role];
  if (!routes) return false;

  return Object.values(routes).some((route) => {
    const normalized = route.replace(/\[([^\]]+)\]/g, ":$1");
    const isMatch = match(normalized, { decode: decodeURIComponent });
    return isMatch(path) !== false;
  });
};
