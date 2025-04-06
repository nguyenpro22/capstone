import { Messages } from "../types";

export const doctorMessages: Messages["staffDoctor"] = {
  // Page titles and general
  doctorList: "Doctor List",
  addNewDoctor: "Add New Doctor",
  noDoctorsAvailable: "No doctors available",
  addYourFirstDoctor: "Add your first doctor",

  // Table headers
  no: "No.",
  fullName: "Full Name",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phoneNumber: "Phone Number",
  role: "Role",
  branches: "Branches",
  branch: "Branch",
  address: "Address",
  action: "Action",

  // Actions and buttons
  viewDoctorDetail: "View Doctor Detail",
  editDoctor: "Edit Doctor",
  deleteDoctor: "Delete Doctor",
  changeBranch: "Change Branch",
  save: "Save",
  saving: "Saving...",
  cancel: "Cancel",
  close: "Close",

  // Form fields and validation
  branchRequired: "Branch is required",
  selectBranch: "Select branch",
  loadingBranches: "Loading branches...",

  // Success and error messages
  doctorAddedSuccess: "Doctor added successfully!",
  doctorAddedFailed: "Failed to add doctor. Please try again.",
  doctorUpdatedSuccess: "Doctor updated successfully!",
  doctorUpdatedFailed: "Failed to update doctor. Please try again.",
  doctorDeletedSuccess: "Doctor deleted successfully!",
  doctorDeletedFailed: "Failed to delete doctor!",
  branchChangedSuccess: "Doctor's branch changed successfully!",
  branchChangeFailed: "Failed to change doctor's branch. Please try again.",
  clinicIdNotFound: "Clinic ID not found. Please try again or contact support.",

  // Doctor details
  doctorDetails: "Doctor Details",
  profilePicture: "Profile Picture",

  // Branch related
  changingBranchFor: "Changing branch for",
  currentBranch: "Current Branch",
  newBranch: "New Branch",
  selectDestinationBranch: "Select Destination Branch",
  noAvailableBranches: "No available branches to transfer to",
  processing: "Processing...",
  viewAllBranches: "View all",
  allBranches: "All Branches",

  // Search
  searchByName: "Search by name",

  // Edit doctor form tabs
  basicInfo: "Basic Info",
  certificates: "Certificates",
  photo: "Photo",

  // Certificate related
  doctorCertificates: "Doctor Certificates",
  expiryDate: "Expiry Date",
  note: "Note",
  viewCertificate: "View Certificate",
  expired: "Expired",
  noCertificates: "No certificates available",
  certificateNote:
    "Certificates can be added or updated through the doctor management section. Changes made here will only update the doctor's basic information.",

  // Address related
  city: "Province/City",
  district: "District",
  ward: "Ward",
  fullAddress: "Full Address",

  // Photo related
  uploadProfilePictureDesc: "Upload a profile picture for this doctor",
  uploadImage: "Upload Image",
  remove: "Remove",
  currentPhoto: "Current photo",

  // Status messages
  editingBasicInfo: "Editing basic information",
  viewingCertificates: "Viewing certificates",
  editingAddress: "Editing address information",
  editingPhoto: "Editing profile photo",
  updateDoctorInfo: "Update doctor information",
  changeDoctorBranch: "Change Doctor's Branch",
  updateDoctorBranch: "Update the branch assignment for this doctor",
}