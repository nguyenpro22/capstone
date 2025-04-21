export type registerSchedule = {
  // Page title and description
  title: string;
  description: string;

  // Calendar page
  doctorCalendar: string;
  calendarDescription: string;
  registerNewSchedule: string;

  // Main sections
  availableShifts: string;
  selectedShifts: string;

  // View modes
  calendarView: string;
  listView: string;
  monthView: string;
  filter: string;
  timeOfDay: string;
  selectTime: string;
  more: string;
  noShifts: string;

  // Calendar navigation
  today: string;

  // Shift selection
  shiftsSelected: string;
  noShiftsSelected: string;
  selectShiftsToRegister: string;
  clearAll: string;

  // Registration actions
  registerShifts: string;
  registering: string;

  // Search and filters
  searchShifts: string;
  dateFilter: string;
  timeFilter: string;
  allDates: string;
  allTimes: string;
  tomorrow: string;
  nextWeek: string;
  nextMonth: string;
  morning: string;
  afternoon: string;
  evening: string;
  upcomingShifts: string;
  allShifts: string;

  // List view labels
  shifts: string;
  shift: string;
  noShiftsFound: string;
  tryAdjustingFilters: string;

  // Toast notifications
  pleaseSelectShifts: string;
  shiftsRegisteredSuccessfully: string;
  errorRegisteringShifts: string;
  registrationSuccess: string;
  registrationFailed: string;
  shiftAdded: string;
  shiftRemoved: string;
  noteSaved: string;
  errorSavingNote: string;
  endDateBeforeStart: string;
  dateRangeLimited: string;
  shiftOverlapsWithRegistered: string;
  shiftOverlapsWithSelected: string;
  shiftsAddedCount: string;
  someShiftsOverlap: string;

  // Confirmation dialog
  confirmRegistration: string;
  confirmRegistrationDescription: string;
  confirmAndRegister: string;
  cancel: string;

  // Success animation
  registrationSuccessful: string;
  registrationSuccessDescription: string;
  viewCalendar: string;
  registerMore: string;
  autoRedirect: string;

  // Shift details modal
  shiftDetails: string;
  startTime: string;
  endTime: string;
  duration: string;
  hour: string;
  hours: string;
  minute: string;
  minutes: string;
  clinic: string;
  status: string;
  available: string;
  unavailable: string;
  close: string;
  details: string;
  selectShift: string;
  removeShift: string;
  shiftOverlapsWarning: string;

  // Appointment details
  appointmentDetails: string;
  service: string;
  notes: string;
  noNotes: string;
  edit: string;
  saveNotes: string;
  saving: string;
  enterNotes: string;
  currentProcedure: string;

  // Date range picker
  selectDateRange: string;
  selectEndDate: string;
  selectBothDates: string;
  apply: string;
  customDateRange: string;

  // Week view
  selected: string;
  select: string;
  viewShifts: string;
  shiftsForDate: string;
  noShiftsAvailable: string;
  shiftsAvailable: string;
  selectAll: string;
  remove: string;

  // Overlap validation
  overlapsWithRegistered: string;
  overlapsWithSelected: string;
  overlapsWithRegisteredTooltip: string;
  overlapsWithSelectedTooltip: string;

  // Extra
  selectDateFilter: string;
  selectTimeFilter: string;
  maxDateRangeInfo: string;
};
