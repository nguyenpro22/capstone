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
  description: "Description",
  deleteServiceConfirmation: "Are you sure you want to delete this service? This action cannot be undone.",
  confirmDelete: "Confirm Delete",
  cancel: "Cancel",
  branches: "Branches",
  noAvailable: "No branches available. Please create a branch first.",
  image: "Images",
  save: "Save...",
    // Success messages
    success: {
      serviceAdded: "Service added successfully!",
      serviceDeleted: "Service has been deleted successfully!",
      serviceUpdated: "Service updated successfully!",
    },
  
    // Error messages
    errors: {
      fetchServiceFailed: "Failed to fetch service information!",
      deleteServiceFailed: "Failed to delete service!",
      refreshServiceFailed: "Failed to update service information!",
    },
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
  procedureName: "Procedure Name",
  stepOrder: "Step Order",
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
    // Doctor tab
    doctor: {
      title: "Service Doctors",
      add: "Add Doctor",
      select: "Select Doctors",
      search: "Search doctors...",
      loading: "Loading doctors list...",
      notFound: "No doctors found",
      processing: "Processing...",
      addButton: "Add Doctors",
      requiredDoctor: "Please select at least one doctor",
      addSuccess: "Doctors added successfully",
      confirmRemove: "Are you sure you want to remove this doctor from the service?",
      removeSuccess: "Doctor removed from service successfully",
      removeError: "An error occurred while removing the doctor",
      removeTooltip: "Remove doctor from service",
      noDoctors: "No doctors have been assigned to this service yet",
      addFirst: "Add your first doctor",
      addError: "Failed to add doctors to the service",
      alreadyHasService: "These doctors already have this service: {doctors}",
    },
     // Procedure form
  procedure: {
    addProcedure: "Add Procedure",
    adding: "Adding...",
    name: "Procedure Name",
    namePlaceholder: "Enter procedure name",
    description: "Description",
    descriptionPlaceholder: "Enter detailed description of the procedure",
    stepIndex: "Step Order",
    priceTypes: "Service Price Types",
    addPriceType: "Add Price Type",
    priceTypeName: "Name",
    priceTypeNamePlaceholder: "E.g. Basic",
    duration: "Duration (minutes)",
    price: "Price (VND)",
    setAsDefault: "Set as default",
    removePriceType: "Remove this price type",
    success: {
      added: "Procedure added successfully!",
    },
    errors: {
      nameRequired: "Procedure name cannot be empty!",
      nameMinLength: "Procedure name must have at least 2 characters!",
      descriptionRequired: "Description cannot be empty!",
      descriptionMinLength: "Description must have at least 2 characters!",
      priceTypeRequired: "At least one price type is required!",
      defaultPriceTypeRequired: "At least one price type must be set as default!",
      stepIndexExists: "This step order already exists!",
      addError: "Error adding procedure:",
      generalError: "Failed to add, please try again.",
    },
  },
  // Update service form
  updateService: {
    title: "Update Service",
    subtitle: "Update your service details and images",
    serviceName: "Service Name",
    serviceNamePlaceholder: "Enter service name",
    description: "Description",
    descriptionPlaceholder: "Enter service description",
    category: "Category",
    categoryPlaceholder: "Select a category",
    branches: "Branches",
    branchesPlaceholder: "Select Branches",
    branchesRequired: "At least one branch must be selected",
    noBranches: "No branches available. Please create a branch first.",
    branchesSelected: "{count} branch selected",
    branchesSelectedPlural: "{count} branches selected",
    coverImages: "Cover Images",
    noCoverImages: "No existing cover images",
    imagesMarkedForDeletion: "{count} image(s) marked for deletion",
    newlySelectedImages: "Newly Selected Cover Images:",
    selectCoverImages: "Select Cover Images",
    filesSelected: "{count} files selected - Click to change",
    saving: "Saving...",
    saveChanges: "Save Changes",
  },
  
}
