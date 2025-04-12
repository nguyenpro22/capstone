import { Messages } from "../types";

export const service: Messages["service"] = {
  serviceMessage: {
    // Banner section
    ourServices: "Our Services",
    discoverServices: "Discover our",
    amazing: "amazing services",
    serviceDescription:
      "Experience premium beauty and wellness services tailored to your needs. Our expert team is dedicated to providing exceptional care and results.",
    exploreNow: "Explore Now",
    beautyServices: "Beauty Services",

    // Search and filters
    searchServices: "Search services...",
    sortBy: "Sort by",
    mostPopular: "Most Popular",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
    nameAZ: "Name: A-Z",
    clear: "Clear",
    clearFilters: "Clear Filters",

    // Results
    services: "Services",
    resultsCount: "{count} results found",
    noServicesFound: "No services found",
    tryDifferentFilters:
      "Try different search terms or filters to find what you're looking for.",

    // Error messages
    noData: "No Data Available",
    unableToLoadServices:
      "Unable to load services at this time. Please try again later.",
    retry: "Retry",
    errorLoading: "Error Loading Data",
    errorMessage: "There was a problem loading the services. Please try again.",

    // Footer
    readyToStart: "Ready to start?",
    findPerfectService: "Find your perfect service today",
    bookingDescription:
      "Book your appointment today and experience our premium services with our expert team.",
    bookNow: "Book Now",
    satisfiedCustomers: "Satisfied Customers",
    averageRating: "Average Rating",
    yearsExperience: "Years Experience",
  },

  // Category names
  Categories: {
    all: "All Services",
    facialSurgery: "Facial Surgery",
    earSurgery: "Ear Plastic Surgery",
    breastSurgery: "Breast Surgery",
  },

  // Service card translations
  Services: {
    viewDetails: "View Details",
    bookNow: "Book Now",
    startingFrom: "Starting from",
    contact: "Contact",
    errorLoading: "Error Loading Data",
    errorMessage: "There was a problem loading the services. Please try again.",
    retry: "Retry",
  },
};
export const serviceMessages: Messages["serviceMessage"] = {
  // Existing fields
  servicesList: "Services List",
  no: "No.",
  addNewService: "Add new Service",
  serviceName: "Service Name",
  price: "Price",
  coverImage: "Cover Image",
  action: "Action",
  category: "Category",
  percentDiscount: "Percent Discount",
  searchByName: "Search By Name",
  active: "Active",
  inactive: "Inactive",
  viewServiceDetail: "View service detail",
  editService: "Edit service",
  deleteService: "Delete service",
  addProcedure: "Add Procedure",
  deleteServiceConfirmation: "Are you sure you want to delete this service? This action cannot be undone.",
  confirmDelete: "Confirm Delete",
  cancel: "Cancel",

  // Modal tabs
  overview: "Overview",
  clinics: "Clinics",
  procedures: "Procedures",
  doctors: "Doctors",

  // Overview tab
  serviceDescription: "Service Description",
  priceInfo: "Price Information",
  minPrice: "Minimum Price:",
  maxPrice: "Maximum Price:",
  discount: "Discount:",
  otherInfo: "Other Information",
  bookingTime: "Booking Time: 30-60 minutes",
  executionTime: "Execution Time: 1-2 hours",
  rating: "Rating: 4.8/5 (120 reviews)",
  descriptionImages: "Description Images",
  coverImages: "Cover Images",

  // Clinics tab
  noActiveClinics: "No Active Clinics",
  noActiveClinicDescription: "This service currently has no active clinics.",
  noClinics: "No Clinics",
  noClinicDescription: "This service currently has no clinics.",

  // Procedures tab
  noProcedures: "No Procedures",
  noProcedureDescription: "This service currently has no defined procedures.",
  step: "Step",
  editProcedure: "Edit Procedure",
  save: "Save",
  procedureName: "Procedure Name",
  stepOrder: "Step Order",
  description: "Description",
  priceTypes: "Price Types",
  addPriceType: "Add Price Type",
  noPriceTypes: "No price types yet. Click Add Price Type to start.",
  priceTypeName: "Price Type Name",
  priceValue: "Price (VND)",
  duration: "Duration (minutes)",
  setAsDefault: "Set as default",
  delete: "Delete",
  seeMore: "See more",
  collapse: "Collapse",
  minutes: "minutes",
  default: "Default",

  // Delete confirmation
  deleteConfirmTitle: "Confirm Delete",
  deleteConfirmDescription: "Are you sure you want to delete this procedure? This action cannot be undone.",
  deleting: "Deleting...",
  deleteProcedure: "Delete Procedure",

  // Common actions
  close: "Close",
  edit: "Edit",

  // Toast messages
  deleteProcedureSuccess: "Procedure deleted successfully",
  deleteProcedureError: "Could not delete procedure. Please try again later.",
  updateProcedureSuccess: "Procedure updated successfully",
  updateProcedureError: "Could not update procedure. Please try again later.",

  // Validation messages
  procedureNameRequired: "Procedure name cannot be empty!",
  priceTypeRequired: "At least one price type is required!",
  defaultPriceTypeRequired: "At least one price type must be set as default!",
}
