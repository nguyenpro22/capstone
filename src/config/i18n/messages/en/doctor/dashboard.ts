import { Messages } from "../../types";

export const dashboard: Messages["doctorDashboard"] = {
  title: "Dashboard",
  subtitle: "Overview of your schedule and appointments",
  cards: {
    todayAppointments: "Today's Appointments",
    pendingConfirmations: "Pending Confirmations",
    totalPatients: "Total Patients",
    completedToday: "Completed Today",
    compared: "+{number} compared to yesterday",
    new: "+{number} new this week",
    remaining: "{number} remaining for today",
  },
  tabs: {
    upcoming: "Upcoming",
    today: "Today's Schedule",
    summary: "Weekly Summary",
  },
  upcomingAppointments: {
    title: "Upcoming Appointments",
    description: "Your next 5 scheduled appointments",
    viewAll: "View all",
    noAppointments: "No upcoming appointments",
    details: "Details",
  },
  todaySchedule: {
    title: "Today's Schedule",
    description: "Your appointments for {date}",
    available: "Available",
    details: "Details",
  },
  appointmentSummary: {
    title: "Weekly Appointment Summary",
    description: "Overview of appointments for the current week",
    confirmed: "Confirmed",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
  },
};
