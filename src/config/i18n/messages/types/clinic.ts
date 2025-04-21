export type clinicMessages = {
  clinicsList: string
  fullName: string
  email: string
  address: string
  totalBranches: string
  status: string
  action: string
  exportExcel: string
  searchByName: string
  active: string
  inactive: string
  viewClinicDetail: string
  editClinic: string
  deleteClinic: string
  previous: string
  next: string

  // Added keys for ClinicDetailModal
  clinicDetails: string
  clinicName: string
  phoneNumber: string
  taxCode: string
  businessLicense: string
  viewBusinessLicense: string
  operatingLicense: string
  viewOperatingLicense: string
  operatingLicenseExpiryDate: string
  profilePicture: string
  viewProfilePicture: string
  close: string

  // Added keys for clinic-form
  updateClinicInfo: string
  basicInfo: string
  bankingInfo: string
  bankName: string
  bankAccountNumber: string
  addressDetails: string
  provinceCity: string
  district: string
  ward: string
  streetAddress: string
  fullAddress: string
  optional: string
  acceptedFormats: string
  currentImage: string
  cancel: string
  saveChanges: string
  saving: string
  enterClinicName: string
  enterEmail: string
  enterPhoneNumber: string
  enterBankName: string
  enterAccountNumber: string
  selectProvinceCity: string
  selectDistrict: string
  selectWard: string
  enterStreetAddress: string
  loadingProvinces: string
  loadingDistricts: string
  loadingWards: string
  selectProvinceFirst: string
  selectDistrictFirst: string
  current: string
  clinicIdMissing: string
  updateSuccess: string
  updateFailed: string
  fixErrors: string

  // Added keys for bank selection
  loadingBanks: string
  searchBank: string
  noBanksFound: string
  bankingInfoHelp: string
  copyToClipboard: string
  
  // New fields for partnership request component
  partnershipRequests: string
  totalRequests: string
  searchByNameOrEmail: string
  loadingPartnershipRequests: string
  errorLoadingData: string
  retry: string
  noPartnershipRequestsFound: string
  stt: string
  totalApply: string
  viewDetail: string
  actions: string
  accept: string
  reject: string
  ban: string
  processing: string
  rejectRequest: string
  banRequest: string
  provideRejectReason: string
  provideBanReason: string
  enterRejectReason: string
  enterBanReason: string
  rejectRequestButton: string
  banRequestButton: string
  partnershipRequestAccepted: string
  partnershipRequestRejected: string
  partnershipRequestBanned: string
  failedToUpdateRequest: string
  
  // New fields for branch request component
  branchName: string
  requestDate: string
  parentEmail: string
  branchRequests: string
  
  // New fields for branch request detail component
  partnershipRequestDetails: string
  detailedInformationAboutRequest: string
  information: string
  branchInformation: string
  createdOn: string
  rejectReason: string
  parentClinicInformation: string

  addressInformation: string
  city: string
  noDetailsAvailable: string
  branchRequestsTitle: string
}
