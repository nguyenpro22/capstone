import type { Messages } from "../types"

export const clinicMessages: Messages["clinic"] = {
  clinicsList: "Clinics List",
  fullName: "Full Name",
  email: "Email",
  address: "Address",
  totalBranches: "Total Branches",
  status: "Status",
  action: "Action",
  exportExcel: "Export Excel",
  searchByName: "Search by name",
  active: "Active",
  inactive: "Inactive",
  viewClinicDetail: "View clinic detail",
  editClinic: "Edit clinic",
  deleteClinic: "Delete clinic",
  previous: "Previous",
  next: "Next",

  // Added keys for ClinicDetailModal
  clinicDetails: "Clinic Details",
  clinicName: "Clinic Name",
  phoneNumber: "Phone Number",
  taxCode: "Tax Code",
  businessLicense: "Business License",
  viewBusinessLicense: "View Business License",
  operatingLicense: "Operating License",
  viewOperatingLicense: "View Operating License",
  operatingLicenseExpiryDate: "Operating License Expiry Date",
  profilePicture: "Profile Picture",
  viewProfilePicture: "View Profile Picture",
  close: "Close",

  // Added keys for clinic-form
  updateClinicInfo: "Update your clinic information",
  basicInfo: "Basic Information",
  bankingInfo: "Banking Information",
  bankName: "Bank Name",
  bankAccountNumber: "Bank Account Number",
  addressDetails: "Address Details",
  provinceCity: "Province/City",
  district: "District",
  ward: "Ward",
  streetAddress: "Street Address",
  fullAddress: "Full Address",
  optional: "Optional",
  acceptedFormats: "Accepted formats: JPG, PNG (max 5MB)",
  currentImage: "Current image",
  cancel: "Cancel",
  saveChanges: "Save Changes",
  saving: "Saving...",
  enterClinicName: "Enter clinic name",
  enterEmail: "Enter email",
  enterPhoneNumber: "Enter phone number",
  enterBankName: "Enter bank name",
  enterAccountNumber: "Enter account number",
  selectProvinceCity: "Select Province/City",
  selectDistrict: "Select District",
  selectWard: "Select Ward",
  enterStreetAddress: "Enter street address",
  loadingProvinces: "Loading provinces...",
  loadingDistricts: "Loading districts...",
  loadingWards: "Loading wards...",
  selectProvinceFirst: "Select province first",
  selectDistrictFirst: "Select district first",
  current: "Current",
  clinicIdMissing: "Clinic ID is missing",
  updateSuccess: "Clinic updated successfully!",
  updateFailed: "Failed to update clinic. Please try again.",
  fixErrors: "Please fix the following errors:",

  // Added keys for bank selection
  loadingBanks: "Loading banks...",
  searchBank: "Search bank",
  noBanksFound: "No banks found",
  bankingInfoHelp:
    "Banking information will be used for financial transactions with your clinic. Please ensure the information is accurate.",
  copyToClipboard: "Copy to clipboard",

  // New keys for partnership request component
  partnershipRequests: "Partnership Requests",
  totalRequests: "Total",
  searchByNameOrEmail: "Search by name or email...",
  loadingPartnershipRequests: "Loading partnership requests...",
  errorLoadingData: "Error loading data. Please try again later.",
  retry: "Retry",
  noPartnershipRequestsFound: "No partnership requests found",
  stt: "STT",
  totalApply: "Total Apply",
  viewDetail: "View Detail",
  actions: "Actions",
  accept: "Accept",
  reject: "Reject",
  ban: "Ban",
  processing: "Processing...",
  rejectRequest: "Reject Request",
  banRequest: "Ban Request",
  provideRejectReason: "Please provide a reason for rejecting this partnership request:",
  provideBanReason: "Please provide a reason for banning this partnership request:",
  enterRejectReason: "Enter reason for reject...",
  enterBanReason: "Enter reason for ban...",
  rejectRequestButton: "Reject Request",
  banRequestButton: "Ban Request",
  partnershipRequestAccepted: "Partnership request accepted successfully",
  partnershipRequestRejected: "Partnership request rejected successfully",
  partnershipRequestBanned: "Partnership request banned successfully",
  failedToUpdateRequest: "Failed to update the request",

  // New keys for branch request component
  branchName: "Branch Name",
  requestDate: "Request Date",
  parentEmail: "Clinic Email",
  branchRequests: "Branch Requests",
   // New keys for branch request detail component
   partnershipRequestDetails: "Partnership Request Details",
   detailedInformationAboutRequest: "Detailed information about this partnership request",
   information: "Information",
   branchInformation: "Branch Information",
   createdOn: "Created On",
   rejectReason: "Reject Reason",
   parentClinicInformation: "Parent Clinic Information",
   addressInformation: "Address Information",
   city: "City",
   noDetailsAvailable: "No details available for this request",
   branchRequestsTitle: " Branch Requests List",
   dateApplied: "Date Applied",
   // Rejection reason translations
   selectReasons: "Select reasons",
   otherReason: "Other reason",
   enterCustomRejectReason: "Enter custom rejection reason",
   enterCustomBanReason: "Enter custom ban reason",
   defaultRejectReason: "Your request has been rejected",
   defaultBanReason: "Your request has been banned",
   expiredLicense: "Expired license",
   invalidTaxCode: "Invalid tax code",
   invalidBusinessLicense: "Invalid business license",
   invalidOperatingLicense: "Invalid operating license",
   invalidContactInfo: "Invalid contact information (name, phone, email)",
   otherReasonLabel: "Other reason"
}
