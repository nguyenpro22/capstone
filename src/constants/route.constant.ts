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
  CATEGORIES: `${privateSystemAdminPath}/category-service`,
  SETTINGS: `${privateSystemAdminPath}/settings`,
  VOUCHER: `${privateSystemAdminPath}/voucher`,
  USERS: `${privateSystemAdminPath}/voucher`,
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
  CUSTOMER_SCHEDULE: `${privateClinicStaffPath}/customer-schedule`,
  APPOINTMENT: `${privateClinicStaffPath}/appointment`,
  DOCTOR: `${privateClinicStaffPath}/doctor`,
  ORDER: `${privateClinicStaffPath}/order`,
  SCHEDULE_APPROVAL: `${privateClinicStaffPath}/schedule-approval`,
  PROFILE: `${privateClinicStaffPath}/profile`,
  SERVICES: `${privateClinicStaffPath}/service`,
};

// CUSTOMER ROUTES
export const customerRoutes = {
  DEFAULT: `${publicCustomerPath}/`,
  HOME: `${publicCustomerPath}/home`,
  LIVESTREAM_VIEW: `${publicCustomerPath}/livestream-view`,
  PROFILE: `${publicCustomerPath}/profile`,
  CLINIC_VIEW: `${publicCustomerPath}/clinic-view`,
  CLINIC_DETAIL: `${publicCustomerPath}/clinic-view/[id]`,
  LIVESTREAM_ROOM: `${publicCustomerPath}/livestream-view/[id]`, // for testing only
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
  USERS: `${privateSystemStaffPath}/user`,
  CLINICS: `${privateSystemStaffPath}/clinic`,
};

export const publicRoutes = {
  DEFAULT: "/",
  HOME: "/home",
  SERVICES: "/services",
  SERVICE_DETAIL: "/services/[id]",
  LIVESTREAM_VIEW: "/livestream-view",
  REGISTER_CLINIC: "/registerClinic",
  CLINIC_VIEW: `${publicCustomerPath}/clinic-view`,
  CLINIC_DETAIL: `${publicCustomerPath}/clinic-view/[id]`,
};
export const authRoutes = {
  REGISTER: "/register",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  POPUP_CALLBACK: "/popup-callback",
};

export const routeAccess = (path: string, role: string): boolean => {
  console.log("Checking route access...");
  console.log("Requested path:", path);
  console.log("User role:", role);

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

  // Kiểm tra xem path có phải là authRoute hay không
  if (
    authRoutePaths.some((route) => {
      const isMatch = match(route, { decode: decodeURIComponent });
      return isMatch(path);
    })
  ) {
    console.log("Path is an auth route, access granted.");
    return true;
  }

  // Kiểm tra role có hợp lệ hay không
  const routes = roleRoutes[role];
  if (!routes) {
    console.log(`No routes found for role: ${role}`);
    return false;
  }

  // Kiểm tra path có thuộc các routes của role hay không
  const isAllowed = Object.values(routes).some((route) => {
    const normalized = route.replace(/\[([^\]]+)\]/g, ":$1");
    console.log("Normalized route:", normalized);

    const isMatch = match(normalized, { decode: decodeURIComponent });
    const matchResult = isMatch(path);

    console.log("Match result for path:", matchResult);

    return matchResult !== false;
  });

  console.log("Access granted:", isAllowed);
  return isAllowed;
};
