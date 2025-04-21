import type { Messages } from "../types"

export const sidebarMessages: Messages["sidebar"] = {
  // Common sidebar items
  dashboard: "Dashboard",
  settings: "Settings",
  logout: "Logout",
  profile: "Profile",
  inbox: "Inbox",
  order: "Order",
  service: "Service",

  // System Admin items
  voucher: "Voucher",
  package: "Package",
  categoryServices: "Category Services",
  withdrawalApproval: "Withdrawal Approval",

  // System Staff items
  user: "User",
  clinic: "Clinic",
  partnership: "Partnership",

  // Clinic Manager items
  branchManagement: "Branch Management",
  staffManagement: "Staff Management",
  doctorManagement: "Doctor Management",
  buyPackage: "Buy Package",
  liveStream: "Live Stream",

  // Clinic Staff items
  scheduleApproval: "Schedule Approval",
  customerSchedule: "Customer Schedules",
  appointment: "Appointment",
  branchDoctor: "Branch Doctors",
  setting: "Setting",

  // User items
  home: "Home",

  // UI elements
  closeSidebar: "Close sidebar",
  openSidebar: "Open sidebar",

  // Logout dialog
  logoutConfirmTitle: "Are you sure you want to logout?",
  logoutConfirmDescription: "This will end your session and log you out of the system.",
  cancel: "Cancel",

  // Clinic Manager items
  wallet: "Wallet",

  // Clinic Staff items
  walletAttachment: "Wallet Attachment",
  // New translations for mobile sidebar
  lightMode: "Light Mode",
  darkMode: "Dark Mode",
  workingSchedule:" Working Schedule",
  branchRequest: "Branch Request"
}
