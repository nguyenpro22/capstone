import type { Messages } from "../types";

export const bookingFlowMessages: Messages["bookingFlow"] = {
  // General
  loadingClinics: "Loading clinics...",
  loadingDoctors: "Loading doctors...",
  loadingServices: "Loading services...",
  loadingTimeSlots: "Loading available time slots...",
  errorOccurred: "An error occurred",
  generalError: "Something went wrong. Please try again.",
  connectionError: "Connection error. Please check your internet connection.",
  bookingService: "Booking Services",
  // Navigation and steps
  next: "Next",
  back: "Back",
  cancel: "Cancel",
  close: "Close",
  finish: "Finish",
  complete: "Complete Booking",
  loading: "Loading...",
  selectClinicStep: "Select Clinic",
  selectDoctorDateStep: "Select Doctor & Date",
  selectServiceStep: "Select Services",
  confirmInfoStep: "Confirm Information",
  completeStep: "Complete",

  // Clinic selection
  selectClinic: "Select a Clinic",
  pleaseSelectClinic: "Please select a clinic for your appointment",
  noActiveClinicWarning: "There are no active clinics available at the moment",
  list: "List",
  map: "Map",
  clinicMap: "Clinic locations map will be displayed here",
  active: "Active",
  inactive: "Inactive",
  clinicUnavailable: "This clinic is currently unavailable",

  // Doctor selection
  selectDoctor: "Select a Doctor",
  skipDoctorSelection:
    "Skip doctor selection (we'll assign our highest rated doctor)",
  automaticallySelectedDoctor:
    "We've automatically selected our highest rated doctor for you",
  doctorSelect: "Doctor",

  // Date and time selection
  selectDateTime: "Select Date and Time",
  pleaseSelectTime: "Please select a date and time for your appointment",
  selectDate: "Select Date",
  selectTime: "Select Time",
  selectDateFirst: "Please select a date first",
  noAvailableSlots: "No available time slots for this date",
  youSelected: "You selected:",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",

  // Missing information alerts
  missingInfo: "Missing Information",
  selectDoctorClinicFirst: "Please select a doctor and clinic first",
  selectDoctorFirst: "Please select a doctor first",
  selectClinicFirst: "Please select a clinic first",

  // Service selection
  selectService: "Select Services",
  pleaseSelectServices: "Please select the services you would like to book",
  useDefaultPackage: "Use default package (best price)",
  noProcedureDetails: "No procedure details available for this service",
  estimatedTotalCost: "Estimated Total Cost",
  youSelectedDefaultPackageBestPrice:
    "You've selected the default package with the best price options",
  noServiceSelection: "No Service selection",
  selectServiceType: "Select service type:",
  // Booking summary
  bookingInfo: "Booking Information",
  pleaseReviewBooking:
    "Please review your booking information before confirming",
  serviceInfo: "Service Information",
  service: "Service",
  category: "Category",
  defaultPackage: "Default Package Selected",
  selectedProcedures: "Selected Procedures",
  appointmentInfo: "Appointment Information",
  subtotal: "Subtotal",
  vatTax: "VAT Tax (10%)",
  total: "Total",
  // Customer information
  customerInfo: "Customer Information",
  pleaseUpdateInfo: "Please update your information if needed",
  fullName: "Full Name",
  enterFullName: "Enter your full name",
  phoneNumber: "Phone Number",
  enterPhoneNumber: "Enter your phone number",
  email: "Email",
  enterEmailOptional: "Enter your email (optional)",
  notes: "Notes",
  enterNotesOptional: "Enter any additional notes (optional)",

  // Booking success
  bookingSuccessful: "Booking Successful!",
  thankYou: "Thank you for your booking. We've sent the details to your phone.",
  bookingCode: "Booking Code",
  clinic: "Clinic",
  doctor: "Doctor",
  time: "Time",
  depositRequired: "Deposit Required",
  depositInfo: "Deposit required:",
  customer: {
    customer: "Customer",
    name: "Customer Name",
    phone: "Customer Phone",
    email: "Email",
  },
  backToHome: "Back to Home",
  viewAppointments: "View Appointments",
  formattedDate: "{month} {date}, {year}",
  months: {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  },
};
