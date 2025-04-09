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
  deleteServiceConfirmation:
    "Are you sure you want to delete this service? This action cannot be undone.",
  confirmDelete: "Confirm Delete",
  cancel: "Cancel",
};
