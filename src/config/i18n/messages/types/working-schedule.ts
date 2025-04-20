export interface workingScheduleMessages {
    // Page title and descriptions
    pageTitle: string;
    setupTabTitle: string;
    viewTabTitle: string;
    setupDescription: string;
    viewDescription: string;
    
    // Calendar section
    selectDates: string;
    selectDatesDescription: string;
    totalSelectedDates: string;
    rangeMode: string;
    selectStartDate: string;
    selectEndDate: string;
    selectAllInMonth: string;
    clearAllDates: string;
    searchDate: string;
    searchDatePlaceholder: string;
    searchDateFormat: string;
    dateFound: string;
    dateNotFound: string;
    
    // Configuration section
    configTitle: string;
    configDescription: string;
    totalDoctorsPerDay: string;
    doctorsTooltip: string;
    workingHours: string;
    addTimeSlot: string;
    startTime: string;
    endTime: string;
    doctorsCount: string;
    noTimeSlots: string;
    
    // Warnings and errors
    serverError: string;
    validationError: string;
    validationErrorDescription: string;
    unusualTimeWarning: string;
    earlyStartWarning: string;
    lateEndWarning: string;
    longHoursWarning: string;
    confirm: string;
    
    // Actions
    saveSchedule: string;
    saving: string;
    scheduleUpdated: string;
    selectAtLeastOneDay: string;
    clinicIdNotFound: string;
    
    // View schedules tab
    search: string;
    display: string;
    loading: string;
    errorLoading: string;
    noSchedulesFound: string;
    showing: string;
    previous: string;
    next: string;
    page: string;
    
    // Table headers
    dateHeader: string;
    timeHeader: string;
    shiftGroupIdHeader: string;
    doctorsCountHeader: string;
    customersCountHeader: string;
    capacityHeader: string;
    statusHeader: string;
    
    // API limitations
    apiLimitWarning: string;
    
    // Time slot validation
    missingStartTime: string;
    missingEndTime: string;
    
    // Status
    undetermined: string;
    // Detail modal
  detailTitle: string
  detailDescription: string
  error: string
  detailLoadError: string
  date: string
  time: string
  capacity: string
  doctorsRegistered: string
  list: string
  doctors: string
  emptySlots: string
  doctor: string
  customer: string
  service: string
  status: string
  noName: string
  notRegistered: string
  noDetailData: string
  doctorNoName: string
  customersBooked: string
  customerNoName: string
  noCustomersBooked: string
  noDoctorsRegistered: string
  emptySlot: string
  canRegister: string
  noEmptySlotsLeft: string

  // Status badges
  statusUndetermined: string
  statusCompleted: string
  statusInProgress: string
  statusScheduled: string
  statusCancelled: string
  statusPending: string
  }