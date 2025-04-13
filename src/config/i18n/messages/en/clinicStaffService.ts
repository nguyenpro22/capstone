import type { Messages } from "../types"

export const clinicStaffServicePageMessages: Messages["clinicStaffService"] = {
  // Page header
  pageTitle: "Service Management",
  pageDescription:
    "Browse and manage all services offered at your clinic. View detailed information, procedures, and assigned doctors.",

  // Search and filters
  searchPlaceholder: "Search services...",
  filter: "Filter",
  addService: "Add Service",

  // Loading states
  loading: "Loading services...",
  loadingDetails: "Loading service details...",

  // Error states
  errorLoadingServices: "Failed to load services",
  errorLoadingDetails: "Failed to load service details",
  errorTryAgain: "Please try again later or contact support.",
  retry: "Retry",

  // Empty states
  noServicesFound: "No services found",
  noServicesFoundDescription: "Try adjusting your search or filters.",
  noServiceDetails: "No service details available",
  noServiceDetailsDescription: "The requested service information could not be found.",

  // Service card
  priceRange: "Price Range",
  discount: "Discount",
  viewDetails: "View Details",

  // Table headers
  name: "Name",
  category: "Category",
  price: "Price",
  actions: "Actions",
  viewDetail: "View Detail",
  noDiscount: "No discount",
  uncategorized: "Uncategorized",

  // Service details dialog
  overview: "Overview",
  procedures: "Procedures",
  doctors: "Doctors",

  // Overview tab
  pricingInformation: "Pricing Information",
  priceRangeLabel: "Price Range:",
  discountLabel: "Discount:",
  serviceInformation: "Service Information",
  categoryLabel: "Category:",
  brandingLabel: "Branding:",
  descriptionTitle: "Description",
  noDescription: "No description available.",

  // Procedures tab
  noProcedures: "No procedures available",
  noProceduresDescription: "This service does not have any defined procedures.",
  priceOptions: "Price Options:",
  default: "Default",
  durationLabel: "Duration:",
  priceLabel: "Price:",
  duration: "Duration",

  // Doctors tab
  noDoctors: "No doctors available",
  noDoctorsDescription: "This service does not have any assigned doctors.",
  phoneLabel: "Phone:",
  certificatesLabel: "Certificates:",
  certificate: "Certificate",
}