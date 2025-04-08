import { Messages } from "../types";

export const staffMessages: Messages["staff"] = {
  // Page titles and general
  staffList: "Staff List",
  addNewStaff: "Add New Staff",
  noStaffAvailable: "No staffs available",
  addYourFirstStaff: "Add your first staff",

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
  viewStaffDetail: "View Staff Detail",
  editStaff: "Edit Staff",
  deleteStaff: "Delete Staff",
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
  staffAddedSuccess: "Staff added successfully!",
  staffAddedFailed: "Failed to add staff. Please try again.",
  staffUpdatedSuccess: "Staff updated successfully!",
  staffUpdatedFailed: "Failed to update staff. Please try again.",
  staffDeletedSuccess: "Staff deleted successfully!",
  staffDeletedFailed: "Failed to delete staff!",
  branchChangedSuccess: "Staff's branch changed successfully!",
  branchChangeFailed: "Failed to change staff's branch. Please try again.",
  clinicIdNotFound: "Clinic ID not found. Please try again or contact support.",

  // Staff details
  staffDetails: "Staff Details",
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

  // Edit staff form tabs
  basicInfo: "Basic Info",
  certificates: "Certificates",
  photo: "Photo",



  // Address related
  city: "Province/City",
  district: "District",
  ward: "Ward",
  fullAddress: "Full Address",

  // Photo related
  uploadProfilePictureDesc: "Upload a profile picture for this staff",
  uploadImage: "Upload Image",
  remove: "Remove",
  currentPhoto: "Current photo",

  // Status messages
  editingBasicInfo: "Editing basic information",
  viewingCertificates: "Viewing certificates",
  editingAddress: "Editing address information",
  editingPhoto: "Editing profile photo",
  updateStaffInfo: "Update staff information",
  changeStaffBranch: "Change Staff's Branch",
  updateStaffBranch: "Update the branch assignment for this staff",
  deleteStaffConfirmation:"Are you sure you want to delete this staff? This action cannot be undone.",
  confirmDelete: "Confirm Delete",

}