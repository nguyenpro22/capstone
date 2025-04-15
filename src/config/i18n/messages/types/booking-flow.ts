export type BookingFlowMessages = {
  // General
  loadingClinics: string;
  loadingDoctors: string;
  loadingServices: string;
  loadingTimeSlots: string;
  errorOccurred: string;
  generalError: string;
  connectionError: string;
  bookingService: string;

  // Navigation and steps
  next: string;
  back: string;
  cancel: string;
  close: string;
  finish: string;
  complete: string;
  loading: string;
  selectClinicStep: string;
  selectDoctorDateStep: string;
  selectServiceStep: string;
  confirmInfoStep: string;
  completeStep: string;

  // Clinic selection
  selectClinic: string;
  pleaseSelectClinic: string;
  noActiveClinicWarning: string;
  list: string;
  map: string;
  clinicMap: string;
  active: string;
  inactive: string;
  clinicUnavailable: string;

  // Doctor selection
  selectDoctor: string;
  skipDoctorSelection: string;
  automaticallySelectedDoctor: string;
  doctorSelect: string;

  // Date and time selection
  selectDateTime: string;
  pleaseSelectTime: string;
  selectDate: string;
  selectTime: string;
  selectDateFirst: string;
  noAvailableSlots: string;
  youSelected: string;
  morning: string;
  afternoon: string;
  evening: string;

  // Missing information alerts
  missingInfo: string;
  selectDoctorClinicFirst: string;
  selectDoctorFirst: string;
  selectClinicFirst: string;

  // Service selection
  selectService: string;
  pleaseSelectServices: string;
  useDefaultPackage: string;
  noProcedureDetails: string;
  estimatedTotalCost: string;
  youSelectedDefaultPackageBestPrice: string;
  noServiceSelection: string;
  selectServiceType: string;
  // Booking summary
  bookingInfo: string;
  pleaseReviewBooking: string;
  serviceInfo: string;
  service: string;
  category: string;
  defaultPackage: string;
  selectedProcedures: string;
  appointmentInfo: string;
  subtotal: string;
  vatTax: string;
  total: string;

  // Customer information
  customerInfo: string;
  pleaseUpdateInfo: string;
  fullName: string;
  enterFullName: string;
  phoneNumber: string;
  enterPhoneNumber: string;
  email: string;
  enterEmailOptional: string;
  notes: string;
  enterNotesOptional: string;

  // Booking success
  bookingSuccessful: string;
  thankYou: string;
  bookingCode: string;
  clinic: string;
  doctor: string;
  time: string;
  customer: string;
  formattedDate: string;
  months: {
    [key: number]: string; // Key là số tháng từ 0 đến 11
  };
};
