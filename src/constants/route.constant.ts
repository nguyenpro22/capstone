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
  HOME: `${publicCustomerPath}/`,
  LIVESTREAM_VIEW: `${publicCustomerPath}/livestream-view`,
  LIVESTREAM_ROME: `${publicCustomerPath}/livestream-view/[id]`, // for testing only
  ORDERS: `${publicCustomerPath}/orders`,
  SERVICES: `${publicCustomerPath}/services`,
  SERVICE_DETAIL: `${publicCustomerPath}/services/[id]`,
};
export const systemStaffRoutes = {
  DEFAULT: `${privateSystemStaffPath}/clinic`,
  DASHBOARD: `${privateSystemStaffPath}/dashboard`,
  BOOKINGS: `${privateSystemStaffPath}/bookings`,
  CUSTOMERS: `${privateSystemStaffPath}/customers`,
  CLINICS: `${privateSystemStaffPath}/clinics`,
};
