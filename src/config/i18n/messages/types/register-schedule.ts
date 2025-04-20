export type registerSchedule = {
  // Page title and description
  title: string;
  description: string;

  // Calendar page
  doctorCalendar: string;
  calendarDescription: string;

  // Main sections
  availableShifts: string;
  selectedShifts: string;

  // View modes
  calendarView: string;
  listView: string;

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

  // List view labels
  shifts: string;
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
  close: string;
  details: string;
  selectShift: string;
  removeShift: string;

  // Appointment details
  appointmentDetails: string;
  service: string;
  notes: string;
  noNotes: string;
  edit: string;
  saveNotes: string;
  saving: string;
  noteSaved: string;
  errorSavingNote: string;
  enterNotes: string;
  currentProcedure: string;
};
