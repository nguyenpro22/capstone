import type { Messages } from "../types"

export const workingScheduleMessages: Messages["workingSchedule"] = {
  // Page title and descriptions
  pageTitle: "Clinic Working Schedule",
  setupTabTitle: "Setup Working Schedule",
  viewTabTitle: "View Working Schedule",
  setupDescription: "Set up doctor availability and working hours",
  viewDescription: "List of doctor working schedules at the clinic",
  
  // Calendar section
  selectDates: "Select Working Dates",
  selectDatesDescription: "Choose the days when the clinic will operate",
  totalSelectedDates: "Selected {count} days",
  rangeMode: "Range Selection Mode",
  selectStartDate: "Select start date",
  selectEndDate: "Select end date to complete range selection",
  selectAllInMonth: "Select All in Month",
  clearAllDates: "Clear All",
  searchDate: "Search Date",
  searchDatePlaceholder: "yyyy-MM-dd",
  searchDateFormat: "Enter date in yyyy-MM-dd format to search",
  dateFound: "Found date {date}",
  dateNotFound: "Date {date} not found in working schedule",
  
  // Configuration section
  configTitle: "Working Schedule Configuration",
  configDescription: "Set up the number of doctors who can register and working hours",
  totalDoctorsPerDay: "Total number of shifts per day",
  doctorsTooltip: "This is the total number of shifts which can register across all time slots for this day",
  workingHours: "Working Hours",
  addTimeSlot: "Add Time Slot",
  startTime: "Start Time",
  endTime: "End Time",
  doctorsCount: "Number of Shifts",
  noTimeSlots: "No time slots have been set up",
  
  // Warnings and errors
  serverError: "Server Error",
  validationError: "Validation Error",
  validationErrorDescription: "There are errors in the working schedule data. Please check the fields marked in red.",
  unusualTimeWarning: "Unusual Working Hours Warning",
  earlyStartWarning: "Start time {time} is quite early. Confirm if this is your intention.",
  lateEndWarning: "End time {time} is quite late. Confirm if this is your intention.",
  longHoursWarning: "Working hours appear to be longer than 12 hours. Confirm if this is your intention.",
  confirm: "Confirm",
  
  // Actions
  saveSchedule: "Save Working Schedule",
  saving: "Saving...",
  scheduleUpdated: "Clinic working schedule has been updated",
  selectAtLeastOneDay: "Please select at least one working day",
  clinicIdNotFound: "Clinic ID not found. Please log in again.",
  
  // View schedules tab
  search: "Search",
  display: "Display:",
  loading: "Loading working schedule data...",
  errorLoading: "An error occurred while loading data. Please try again later.",
  noSchedulesFound: "No working schedules found.",
  showing: "Showing {shown} of {total} results",
  previous: "Previous",
  next: "Next",
  page: "Page {current} / {total}",
  
  // Table headers
  dateHeader: "Date",
  timeHeader: "Time",
  shiftGroupIdHeader: "Shift Group ID",
  doctorsCountHeader: "Number of Doctors",
  customersCountHeader: "Number of Customers",
  capacityHeader: "Capacity",
  statusHeader: "Status",
  
  // API limitations
  apiLimitWarning: "API only supports one time slot per day. Only the first time slot will be saved.",
  
  // Time slot validation
  missingStartTime: "Day {date}: Time slot {index} missing start time",
  missingEndTime: "Day {date}: Time slot {index} missing end time",
  
  // Status
  undetermined: "Undetermined",
    // Detail modal
    detailTitle: "Working Schedule Details",
    detailDescription: "Detailed information about the working schedule on {date} from {startTime} to {endTime}",
    error: "Error",
    detailLoadError: "Could not load detailed information. Please try again later.",
    date: "Date",
    time: "Time",
    capacity: "Capacity",
    doctorsRegistered: "{registered}/{total} doctors registered",
    list: "List",
    doctors: "Doctors ({count})",
    emptySlots: "Empty Slots ({count})",
    doctor: "Doctor",
    customer: "Customer",
    service: "Service",
    status: "Status",
    noName: "No name",
    notRegistered: "Not Registered",
    noDetailData: "No detailed data for this working schedule",
    doctorNoName: "Doctor with no name",
    customersBooked: "Customers who have booked",
    customerNoName: "Customer with no name",
    noCustomersBooked: "No customers have booked yet",
    noDoctorsRegistered: "No doctors have registered for this working schedule yet",
    emptySlot: "Empty Slot",
    canRegister: "Available for registration",
    noEmptySlotsLeft: "No empty slots left in this working schedule",
  
    // Status badges
    statusUndetermined: "Undetermined",
    statusCompleted: "Completed",
    statusInProgress: "In Progress",
    statusScheduled: "Scheduled",
    statusCancelled: "Cancelled",
    statusPending: "Pending",
}