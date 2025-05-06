export type service = {
  // Service page messages
  services: string;
  ourServices: string;
  discoverServices: string;
  amazing: string;
  serviceDescription: string;
  searchServices: string;
  searchingServices: string;
  sortBy: string;
  mostPopular: string;
  priceLowToHigh: string;
  priceHighToLow: string;
  nameAZ: string;
  resultsCount: string;
  noServicesFound: string;
  tryDifferentFilters: string;
  clearFilters: string;
  clear: string;
  errorLoading: string;
  errorMessage: string;
  retry: string;
  noData: string;
  unableToLoadServices: string;
  serviceCategories: string;
  category: string;
  // Service card messages
  serviceCard: {
    book: string;
    quickView: string;
    premium: string;
    popular: string;
    locations: string;
    doctors: string;
    duration: string;
    time: {
      treatment: string;
      recovery: string;
    };
    clinics: {
      more: string;
    };
    doctorsMore: string;
  };

  // Footer messages
  footer: {
    newsletter: {
      title: string;
      description: string;
      emailPlaceholder: string;
      subscribe: string;
    };
    companyInfo: {
      description: string;
    };
    quickLinks: {
      title: string;
      home: string;
      about: string;
      services: string;
      pricing: string;
      contact: string;
    };
    ourServices: {
      title: string;
      allServices: string;
      faceSurgery: string;
      earSurgery: string;
      breastSurgery: string;
    };
    contactUs: {
      title: string;
      address: string;
      phone: string;
      email: string;
    };
    copyright: string;
  };

  // Pagination
  pagination: {
    previous: string;
    next: string;
  };

  // Category
  categories: {
    allServices: string;
    category: string;
  };

  // View modes
  viewMode: {
    grid: string;
    list: string;
  };

  // Filters
  filters: {
    serviceCategories: string;
    categories: string;
  };

  // Featured service
  featured: {
    title: string;
    featured: string;
    viewDetails: string;
  };
};
export type serviceMessages = {
  // Existing fields
  servicesList: string;
  no: string;
  addNewService: string;
  addFirstService: string;
  noServicesAvailable: string;
  serviceName: string;
  price: string;
  coverImage: string;
  category: string;
  percentDiscount: string;
  action: string;
  searchByName: string;
  active: string;
  inactive: string;
  viewServiceDetail: string;
  editService: string;
  deleteService: string;
  addProcedure: string;
  deleteServiceConfirmation: string;
  confirmDelete: string;
  cancel: string;
  branches: string;
  noAvailable: string;
  image: string;

  // Success messages
  success: {
    serviceAdded: string;
    serviceDeleted: string;
    serviceUpdated: string;
  };

  // Error messages
  errors: {
    fetchServiceFailed: string;
    deleteServiceFailed: string;
    refreshServiceFailed: string;
    updateServiceFailed: string;
  };
  // Modal tabs
  overview: string;
  clinics: string;
  procedures: string;
  doctors: string;

  // Overview tab
  serviceDescription: string;
  priceInfo: string;
  minPrice: string;
  maxPrice: string;
  discount: string;
  otherInfo: string;
  bookingTime: string;
  executionTime: string;
  rating: string;
  descriptionImages: string;
  coverImages: string;

  // Clinics tab
  noActiveClinics: string;
  noActiveClinicDescription: string;
  noClinics: string;
  noClinicDescription: string;

  // Procedures tab
  noProcedures: string;
  noProcedureDescription: string;
  step: string;
  editProcedure: string;
  save: string;
  procedureName: string;
  stepOrder: string;
  description: string;
  priceTypes: string;
  addPriceType: string;
  noPriceTypes: string;
  priceTypeName: string;
  priceValue: string;
  duration: string;
  setAsDefault: string;
  delete: string;
  seeMore: string;
  collapse: string;
  minutes: string;
  default: string;

  // Delete confirmation
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  deleting: string;
  deleteProcedure: string;

  // Common actions
  close: string;
  edit: string;

  // Toast messages
  deleteProcedureSuccess: string;
  deleteProcedureError: string;
  updateProcedureSuccess: string;
  updateProcedureError: string;

  // Validation messages
  procedureNameRequired: string;
  priceTypeRequired: string;
  defaultPriceTypeRequired: string;

  // Doctor tab
  doctor: {
    title: string;
    add: string;
    select: string;
    search: string;
    loading: string;
    notFound: string;
    processing: string;
    addButton: string;
    requiredDoctor: string;
    addSuccess: string;
    confirmRemove: string;
    removeSuccess: string;
    removeError: string;
    removeTooltip: string;
    noDoctors: string;
    addFirst: string;
    addError: string;
    alreadyHasService: string;
  };
  // Procedure form
  procedure: {
    addProcedure: string;
    adding: string;
    name: string;
    namePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    stepIndex: string;
    priceTypes: string;
    addPriceType: string;
    priceTypeName: string;
    priceTypeNamePlaceholder: string;
    duration: string;
    price: string;
    setAsDefault: string;
    removePriceType: string;
    success: {
      added: string;
    };
    errors: {
      nameRequired: string;
      nameMinLength: string;
      descriptionRequired: string;
      descriptionMinLength: string;
      priceTypeRequired: string;
      defaultPriceTypeRequired: string;
      stepIndexExists: string;
      addError: string;
      generalError: string;
    };
  };
  // Add service form
  addService: {
    title: string;
    subtitle: string;
    serviceName: string;
    serviceNamePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    category: string;
    categoryPlaceholder: string;
    branches: string;
    branchesPlaceholder: string;
    branchesRequired: string;
    noBranches: string;
    branchesSelected: string;
    branchesSelectedPlural: string;
    coverImages: string;
    noCoverImages: string;
    selectCoverImages: string;
    filesSelected: string;
    saving: string;
    save: string;
    depositPercent: string;
    depositPercentInfo: string;
    isRefundable: string;
    isRefundableInfo: string;
    requiredFields: string;
  };
  // Update service form
  updateService: {
    title: string;
    subtitle: string;
    serviceName: string;
    serviceNamePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    category: string;
    categoryPlaceholder: string;
    branches: string;
    branchesPlaceholder: string;
    branchesRequired: string;
    noBranches: string;
    branchesSelected: string;
    branchesSelectedPlural: string;
    coverImages: string;
    noCoverImages: string;
    imagesMarkedForDeletion: string;
    newlySelectedImages: string;
    selectCoverImages: string;
    filesSelected: string;
    saving: string;
    saveChanges: string;
    depositPercent: string;
    depositPercentInfo: string;
    isRefundable: string;
    isRefundableInfo: string;
  };
};
