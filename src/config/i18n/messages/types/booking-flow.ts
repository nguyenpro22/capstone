export type BookingFlowMessages = {
    // Common booking flow messages
    bookingService: string
    bookingSuccessful: string
    next: string
    back: string
    cancel: string
    close: string
    complete: string
    loading: string
  
    // Step titles
    selectClinicStep: string
    selectDoctorDateStep: string
    selectServiceStep: string
    confirmInfoStep: string
    completeStep: string
  
    // Booking summary step
    bookingInfo: string
    pleaseReviewBooking: string
    serviceInfo: string
    service: string
    category: string
    appointmentInfo: string
    defaultPackage: string
    selectedProcedures: string
    customerInfo: string
    pleaseUpdateInfo: string
  
    // Booking success step
    thankYou: string
    bookingCode: string
    clinic: string
    doctor: string
    time: string
    customer: string
    addToCalendar: string
    download: string
    share: string
    finish: string
  
    // Select clinic step
    selectClinic: string
    pleaseSelectClinic: string
    list: string
    map: string
    clinicMap: string
    loadingClinics: string
  
    // Select date time step
    selectDateTime: string
    pleaseSelectTime: string
    missingInfo: string
    selectDoctorClinicFirst: string
    selectDoctorFirst: string
    selectClinicFirst: string
    selectDate: string
    selectTime: string
    morning: string
    afternoon: string
    evening: string
    loadingTimeSlots: string
    noAvailableSlots: string
    selectDateFirst: string
    youSelected: string
    errorOccurred: string
    generalError: string
    connectionError: string
  
    // Select doctor step
    selectDoctor: string
    pleaseSelectDoctor: string
    loadingDoctorsAndClinics: string
    loadingDoctors: string
  
    // Select procedure step
    selectService: string
    pleaseSelectServiceType: string
    useDefaultPackage: string
    estimatedTotalCost: string
    youSelectedDefaultPackage: string
    price: string
    loadingServices: string
  
    // Select doctor date step
    skipDoctorSelection: string
    automaticallySelectedDoctor: string
     // Customer info form
  fullName: string
  enterFullName: string
  phoneNumber: string
  enterPhoneNumber: string
  email: string
  enterEmailOptional: string
  notes: string
  enterNotesOptional: string

  // Select service step
  pleaseSelectServices: string
  noProcedureDetails: string
  youSelectedDefaultPackageBestPrice: string

  // Booking confirmation
  thankYouForBooking: string
  pleaseKeepBookingCode: string
  appointmentDate: string
  appointmentTime: string
  location: string
  dateNotSelected: string
  timeNotSelected: string
  clinicNotSelected: string
  serviceDetails: string
  totalIncludingVAT: string
  saveInformation: string
  active: string
  inactive : string
  clinicUnavailable: string
  noActiveClinicWarning: string
  }
  