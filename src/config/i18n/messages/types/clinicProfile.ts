export type clinicProfileMessages = {
  clinicDetails: string
  clinicStaffDetails: string
  address: string
  taxCode: string
  businessLicense: string
  viewBusinessLicense: string
  noBusinessLicense: string
  statistics: string
  branches: string
  bankInformation: string
  bankDetails: string
  bankName: string
  accountNumber: string
  paymentInformation: string
  paymentDescription: string
  noBranchesAvailable: string
  noBranchesDescription: string
  editProfile: string
  active: string
  inactive: string
  authRequired: string
  failedToLoad: string
  currentSubscription: string
  days: string
  livestreams: string
  price: string
  purchaseDate: string
  expiryDate: string
  daysRemaining: string
  // New password change translations
  changePassword: string
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
  passwordChangedSuccessfully: string
  passwordChangeError: string
  changing: string
  // Specific error messages
  passwordsDoNotMatch: string
  passwordTooShort: string
  failedToChangePassword: string
    // Redirect message
    redirectingToLogin: string
    pleaseLoginAgain: string
    loginNow: string
    workingHours: string

  updateProfile :{
    editClinic: string
    updateClinicInfo: string
    close: string
    fixErrors: string
    basicInfo: string
    clinicName: string
    enterClinicName: string
    email: string
    enterEmail: string
    phoneNumber: string
    enterPhoneNumber: string
    validPhoneNumber: string
    bankingInfo: string
    bankName: string
    loadingBanks: string
    searchBank: string
    noBanksFound: string
    bankAccountNumber: string
    enterAccountNumber: string
    workingHours: string
    openingTime: string
    closingTime: string
    addressDetails: string
    provinceCity: string
    loadingProvinces: string
    selectProvinceCity: string
    current: string
    district: string
    selectProvinceFirst: string
    loadingDistricts: string
    selectDistrict: string
    ward: string
    selectDistrictFirst: string
    loadingWards: string
    selectWard: string
    streetAddress: string
    enterStreetAddress: string
    fullAddress: string
    profilePicture: string
    optional: string
    acceptedFormats: string
    currentImage: string
    cancel: string
    saving: string
    saveChanges: string
  }
}