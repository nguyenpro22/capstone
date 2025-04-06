export type doctorMessages = {
    // Page titles and general
    doctorList: string
  addNewDoctor: string
  noDoctorsAvailable: string
  addYourFirstDoctor: string

  // Table headers
  no: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  branches: string
  branch: string
  address: string
  action: string

  // Actions and buttons
  viewDoctorDetail: string
  editDoctor: string
  deleteDoctor: string
  changeBranch: string
  save: string
  saving: string
  cancel: string
  close: string

  // Form fields and validation
  branchRequired: string
  selectBranch: string
  loadingBranches: string

  // Success and error messages
  doctorAddedSuccess: string
  doctorAddedFailed: string
  doctorUpdatedSuccess: string
  doctorUpdatedFailed: string
  doctorDeletedSuccess: string
  doctorDeletedFailed: string
  branchChangedSuccess: string
  branchChangeFailed: string
  clinicIdNotFound: string

  // Doctor details
  doctorDetails: string
  profilePicture: string

  // Branch related
  changingBranchFor: string
  currentBranch: string
  newBranch: string
  selectDestinationBranch: string
  noAvailableBranches: string
  processing: string
  viewAllBranches: string
  allBranches: string

  // Search
  searchByName: string

  // Edit doctor form tabs
  basicInfo: string
  certificates: string
  photo: string

  // Certificate related
  doctorCertificates: string
  expiryDate: string
  note: string
  viewCertificate: string
  expired: string
  noCertificates: string
  certificateNote: string

  // Address related
  city: string
  district: string
  ward: string
  fullAddress: string

  // Photo related
  uploadProfilePictureDesc: string
  uploadImage: string
  remove: string
  currentPhoto: string

  // Status messages
  editingBasicInfo: string
  viewingCertificates: string
  editingAddress: string
  editingPhoto: string
  updateDoctorInfo: string
  changeDoctorBranch: string
  updateDoctorBranch: string
  }