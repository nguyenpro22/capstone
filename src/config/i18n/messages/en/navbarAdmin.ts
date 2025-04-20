import type { Messages } from "../types"

export const navbarAdminMessages: Messages["navbarAdmin"] = {
  // Search
  searchPlaceholder: "Search anything...",

  // Theme toggle
  toggleTheme: "Toggle theme",

  // Notifications
  notifications: "Notifications",
  unreadMessages: "You have {count} unread messages",

  // User profile
  myAccount: "My Account",
  profile: "Profile",
  settings: "Settings",
  support: "Support",
  logout: "Log out",

  // Notification items
  newAppointment: "New Appointment",
  newAppointmentMessage: "You have a new appointment request",
  treatmentComplete: "Treatment Complete",
  treatmentCompleteMessage: "Treatment session completed successfully",
  reviewReceived: "Review Received",
  reviewReceivedMessage: "New customer review received",
  timeAgo: {
    minutesAgo: "{count} minutes ago",
    hourAgo: "1 hour ago",
    hoursAgo: "{count} hours ago",
  },
   // New translations for mobile
   search: "Search",
   language: "Language",
   recentSearches: "Recent Searches",
   exampleSearch1: "Patient appointments",
   exampleSearch2: "Treatment schedules",
    // Logout dialog
  logoutConfirmTitle: "Are you sure you want to logout?",
  logoutConfirmDescription: "This will end your session and log you out of the system.",
  cancel: "Cancel",
}
