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
  registerNewSchedule: "Register New Schedule",

  // Main sections
  availableShifts: "Available Shifts",
  selectedShifts: "Selected Shifts",

  // View modes
  calendarView: "Calendar View",
  listView: "List View",
  monthView: "Month",
  filter: "Filter",
  timeOfDay: "Time of Day",
  selectTime: "Select time",
  more: "more",
  noShifts: "No shifts available",

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
  upcomingShifts: "Upcoming Shifts",
  allShifts: "All Shifts",

  // List view labels
  shifts: "shifts",
  shift: "shift",
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
  noteSaved: "Notes saved successfully",
  errorSavingNote: "Error saving notes. Please try again.",
  endDateBeforeStart: "End date cannot be before start date",
  dateRangeLimited: "Date range limited to {days} days maximum",
  shiftOverlapsWithRegistered:
    "This shift overlaps with a shift you've already registered",
  shiftOverlapsWithSelected:
    "This shift overlaps with another shift you've selected",
  shiftsAddedCount: "{count} shifts added to selection",
  someShiftsOverlap: "{count} shifts couldn't be selected due to overlaps",

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
  unavailable: "Unavailable",
  close: "Close",
  details: "Details",
  selectShift: "Select Shift",
  removeShift: "Remove Shift",
  shiftOverlapsWarning: "This shift overlaps with your schedule",

  // Appointment details
  appointmentDetails: "Appointment Details",
  service: "Service",
  notes: "Notes",
  noNotes: "No notes available",
  edit: "Edit",
  saveNotes: "Save Notes",
  saving: "Saving...",
  enterNotes: "Enter your notes here...",
  currentProcedure: "Current Procedure",

  // Add new translations for date range picker
  selectDateRange: "Select date range",
  selectEndDate: "Select end date",
  selectBothDates: "Select start and end dates",
  apply: "Apply",
  customDateRange: "Custom Date Range",

  // Add new translations for the week view
  selected: "Selected",
  select: "Select",
  viewShifts: "View Shifts",
  shiftsForDate: "Shifts for {date}",
  noShiftsAvailable: "No shifts available for this day",
  shiftsAvailable: "shifts available",
  selectAll: "Select All",
  remove: "Remove",

  // Overlap validation
  overlapsWithRegistered: "Overlaps with registered shift",
  overlapsWithSelected: "Overlaps with selected shift",
  overlapsWithRegisteredTooltip:
    "You've already registered for a shift during this time",
  overlapsWithSelectedTooltip:
    "You've already selected another shift during this time",

  // Thêm các bản dịch mới
  selectDateFilter: "Select date range",
  selectTimeFilter: "Select time of day",
  maxDateRangeInfo: "Maximum {days} days allowed",
};
