import { Messages } from "../types";

export const registerSchedule: Messages["registerSchedule"] = {
  // Page title and description
  title: "Register Working Schedule",
  description:
    "Select available shifts at the clinic to register for your working schedule.",

  // Calendar page
  doctorCalendar: "My Calendar",
  calendarDescription:
    "View and manage your scheduled appointments and registered shifts.",

  // Main sections
  availableShifts: "Available Shifts",
  selectedShifts: "Selected Shifts",

  // View modes
  calendarView: "Calendar View",
  listView: "List View",

  // Calendar navigation
  today: "Today",

  // Shift selection
  shiftsSelected: "shifts selected",
  noShiftsSelected: "No Shifts Selected",
  selectShiftsToRegister:
    "Please select shifts from the available options to register.",
  clearAll: "Clear All",

  // Registration actions
  registerShifts: "Register Shifts",
  registering: "Registering...",

  // Search and filters
  searchShifts: "Search shifts...",
  dateFilter: "Date Filter",
  timeFilter: "Time Filter",
  allDates: "All Dates",
  allTimes: "All Times",
  tomorrow: "Tomorrow",
  nextWeek: "Next 7 Days",
  nextMonth: "Next 30 Days",
  morning: "Morning (6AM-12PM)",
  afternoon: "Afternoon (12PM-5PM)",
  evening: "Evening (5PM-11PM)",

  // List view labels
  shifts: "shifts",
  noShiftsFound: "No Shifts Found",
  tryAdjustingFilters:
    "Try adjusting your filters or search criteria to find available shifts.",

  // Toast notifications
  pleaseSelectShifts: "Please select at least one shift to register.",
  shiftsRegisteredSuccessfully:
    "Your shifts have been registered successfully!",
  errorRegisteringShifts:
    "There was an error registering your shifts. Please try again.",
  registrationSuccess: "Registration Successful",
  registrationFailed: "Registration Failed",
  shiftAdded: "Shift added to selection",
  shiftRemoved: "Shift removed from selection",

  // Confirmation dialog
  confirmRegistration: "Confirm Registration",
  confirmRegistrationDescription:
    "Are you sure you want to register for {count} shifts? This action cannot be undone.",
  confirmAndRegister: "Confirm & Register",
  cancel: "Cancel",

  // Success animation
  registrationSuccessful: "Registration Successful!",
  registrationSuccessDescription:
    "Your shifts have been registered successfully. You can view them in your calendar.",
  viewCalendar: "View Calendar",
  registerMore: "Register More Shifts",
  autoRedirect: "You will be redirected to your calendar in 5 seconds...",

  // Shift details modal
  shiftDetails: "Shift Details",
  startTime: "Start Time",
  endTime: "End Time",
  duration: "Duration",
  hour: "hour",
  hours: "hours",
  minute: "minute",
  minutes: "minutes",
  clinic: "Clinic",
  status: "Status",
  available: "Available",
  close: "Close",
  details: "Details",
  selectShift: "Select Shift",
  removeShift: "Remove Shift",

  // Appointment details
  appointmentDetails: "Appointment Details",
  service: "Service",
  notes: "Notes",
  noNotes: "No notes available",
  edit: "Edit",
  saveNotes: "Save Notes",
  saving: "Saving...",
  noteSaved: "Notes saved successfully",
  errorSavingNote: "Error saving notes. Please try again.",
  enterNotes: "Enter your notes here...",
  currentProcedure: "Current Procedure",
};
