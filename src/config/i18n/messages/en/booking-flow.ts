import type { Messages } from "../types"

export const bookingFlowMessages: Messages["bookingFlow"] = {
  // Common booking flow messages
  bookingService: "Book Service",
  bookingSuccessful: "Booking Successful",
  next: "Continue",
  back: "Back",
  cancel: "Cancel",
  close: "Close",
  complete: "Complete",
  loading: "Loading...",

  // Step titles
  selectClinicStep: "Select Clinic",
  selectDoctorDateStep: "Select Doctor & Date",
  selectServiceStep: "Select Service",
  confirmInfoStep: "Confirm Information",
  completeStep: "Complete",

  // Booking summary step
  bookingInfo: "Booking Information",
  pleaseReviewBooking: "Please review your booking information",
  serviceInfo: "Service Information",
  service: "Service",
  category: "Category",
  appointmentInfo: "Appointment Information",
  defaultPackage: "Use default service package (best price)",
  selectedProcedures: "Selected procedures",
  customerInfo: "Customer Information",
  pleaseUpdateInfo: "Please check and update your contact information if needed",

  // Booking success step
  thankYou: "Thank you for your booking. We have sent a confirmation to your email.",
  bookingCode: "Booking Code",
  clinic: "Clinic",
  doctor: "Doctor",
  time: "Time",
  customer: "Customer",
  addToCalendar: "Add to Calendar",
  download: "Download",
  share: "Share",
  finish: "Finish",

  // Select clinic step
  selectClinic: "Select Clinic",
  pleaseSelectClinic: "Please select the clinic where you want to receive the service",
  list: "List",
  map: "Map",
  clinicMap: "Clinics Map",
  loadingClinics: "Loading clinics list...",

  // Select date time step
  selectDateTime: "Select Date and Time",
  pleaseSelectTime: "Please select when you want to receive the service",
  missingInfo: "Missing Information",
  selectDoctorClinicFirst: "Please select a doctor and clinic before choosing a date and time.",
  selectDoctorFirst: "Please select a doctor before choosing a date and time.",
  selectClinicFirst: "Please select a clinic before choosing a date and time.",
  selectDate: "Select Date",
  selectTime: "Select Time",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  loadingTimeSlots: "Loading available time slots...",
  noAvailableSlots: "No available time slots for this date. Please select another date.",
  selectDateFirst: "Please select a date first",
  youSelected: "You selected:",
  errorOccurred: "An error occurred during booking",
  generalError: "An error occurred during booking. Please try again later.",
  connectionError: "Could not connect to the server. Please try again later.",

  // Select doctor step
  selectDoctor: "Select Doctor",
  pleaseSelectDoctor: "Please select the doctor you want to perform the service",
  loadingDoctorsAndClinics: "Loading doctors and clinics list...",
  loadingDoctors: "Loading doctors list...",

  // Select procedure step
  selectService: "Select Service",
  pleaseSelectServiceType: "Please select the service type for each procedure",
  useDefaultPackage: "Use default service package (automatically selects services with the best price)",
  estimatedTotalCost: "Estimated Total Cost",
  youSelectedDefaultPackage: "You have selected to use the default service package.",
  price: "Price",
  loadingServices: "Loading services list...",

  // Select doctor date step
  skipDoctorSelection: "Skip doctor selection (system will automatically select the highest rated doctor)",
  automaticallySelectedDoctor: "Automatically selected doctor",
  // Customer info form
  fullName: "Full Name",
  enterFullName: "Enter your full name",
  phoneNumber: "Phone Number",
  enterPhoneNumber: "Enter your phone number",
  email: "Email",
  enterEmailOptional: "Enter your email (optional)",
  notes: "Notes",
  enterNotesOptional: "Enter notes or special requests (optional)",

  // Select service step
  pleaseSelectServices: "Please select the services you want to receive",
  noProcedureDetails: "No procedure details available.",
  youSelectedDefaultPackageBestPrice: "You have selected to use the default service package with the best price.",

  // Booking confirmation
  thankYouForBooking: "Thank you for booking a service with us",
  pleaseKeepBookingCode: "Please keep this booking code for reference when needed",
  appointmentDate: "Appointment Date",
  appointmentTime: "Appointment Time",
  location: "Location",
  dateNotSelected: "Date not selected",
  timeNotSelected: "Time not selected",
  clinicNotSelected: "Clinic not selected",
  serviceDetails: "Service Details",
  totalIncludingVAT: "Total (including VAT)",
  saveInformation: "Save Information",
}
