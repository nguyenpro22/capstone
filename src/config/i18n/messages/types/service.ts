export type service = {
  serviceMessage: {
    // Banner section
    ourServices: string;
    discoverServices: string;
    amazing: string;
    serviceDescription: string;
    exploreNow: string;
    beautyServices: string;

    // Search and filters
    searchServices: string;
    sortBy: string;
    mostPopular: string;
    priceLowToHigh: string;
    priceHighToLow: string;
    nameAZ: string;
    clear: string;
    clearFilters: string;

    // Results
    services: string;
    resultsCount: string;
    noServicesFound: string;
    tryDifferentFilters: string;

    // Error messages
    noData: string;
    unableToLoadServices: string;
    retry: string;
    errorLoading: string;
    errorMessage: string;

    // Footer
    readyToStart: string;
    findPerfectService: string;
    bookingDescription: string;
    bookNow: string;
    satisfiedCustomers: string;
    averageRating: string;
    yearsExperience: string;
  };

  Categories: {
    all: string;
    facialSurgery: string;
    earSurgery: string;
    breastSurgery: string;
  };

  Services: {
    viewDetails: string;
    bookNow: string;
    startingFrom: string;
    contact: string;
    errorLoading: string;
    errorMessage: string;
    retry: string;
  };
};
export type serviceMessages = {
  // Existing fields
  servicesList: string
  no: string
  addNewService: string
  serviceName: string
  price: string
  coverImage: string
  category: string
  percentDiscount: string
  action: string
  searchByName: string
  active: string
  inactive: string
  viewServiceDetail: string
  editService: string
  deleteService: string
  addProcedure: string
  deleteServiceConfirmation: string
  confirmDelete: string
  cancel: string

  // Modal tabs
  overview: string
  clinics: string
  procedures: string
  doctors: string

  // Overview tab
  serviceDescription: string
  priceInfo: string
  minPrice: string
  maxPrice: string
  discount: string
  otherInfo: string
  bookingTime: string
  executionTime: string
  rating: string
  descriptionImages: string
  coverImages: string

  // Clinics tab
  noActiveClinics: string
  noActiveClinicDescription: string
  noClinics: string
  noClinicDescription: string

  // Procedures tab
  noProcedures: string
  noProcedureDescription: string
  step: string
  editProcedure: string
  save: string
  procedureName: string
  stepOrder: string
  description: string
  priceTypes: string
  addPriceType: string
  noPriceTypes: string
  priceTypeName: string
  priceValue: string
  duration: string
  setAsDefault: string
  delete: string
  seeMore: string
  collapse: string
  minutes: string
  default: string

  // Delete confirmation
  deleteConfirmTitle: string
  deleteConfirmDescription: string
  deleting: string
  deleteProcedure: string

  // Common actions
  close: string
  edit: string

  // Toast messages
  deleteProcedureSuccess: string
  deleteProcedureError: string
  updateProcedureSuccess: string
  updateProcedureError: string

  // Validation messages
  procedureNameRequired: string
  priceTypeRequired: string
  defaultPriceTypeRequired: string
}

