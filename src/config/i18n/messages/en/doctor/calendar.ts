import { Messages } from "../../types";

export const calendar :Messages["doctorCalendar"]= {
  title: "Calendar",
  subtitle: "Manage your schedule and appointments",
  calendar: {
    title: "Calendar",
    appointmentTypes: "Appointment Types",
    consultation: "Consultation",
    treatment: "Treatment",
    followUp: "Follow-up",
  },
  navigation: {
    today: "Today",
  },
  views: {
    day: "Day",
    week: "Week",
    month: "Month",
  },
  filter: {
    byStatus: "Filter by status",
    all: "All",
    confirmed: "Confirmed",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
  },
  schedule: {
    available: "Available",
    details: "Details",
    more: "+{number} more",
  },
}

