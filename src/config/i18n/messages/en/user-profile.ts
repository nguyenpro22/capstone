import { Messages } from "../types";

export const userProfileMessages: Messages["userProfileMessages"] = {
  header: {
    profile: {
      title: "Personal Information",
      description: "View and manage your personal information",
    },
    wallet: {
      title: "My Wallet",
      description: "Manage your wallet and view balance",
    },
  },
  sidebar: {
    balance: "Wallet Balance",
    navigation: {
      profile: "Personal Information",
      wallet: "My Wallet",
      deposit: "Deposit",
      withdraw: "Withdraw",
      history: "Transaction History",
    },
    backHome: "Back to Home",
  },
  profile: {
    actions: {
      edit: "Edit",
      cancel: "Cancel",
      save: "Save Changes",
      saving: "Saving...",
    },
    sections: {
      personal: {
        title: "Personal Information",
        fullName: "Full Name",
        firstName: "First Name",
        lastName: "Last Name",
        dateOfBirth: "Date of Birth",
        avatar: "Profile Picture",
      },
      contact: {
        title: "Contact Information",
        email: "Email",
        phone: "Phone Number",
      },
      address: {
        title: "Address Information",
        province: "Province/City",
        district: "District",
        ward: "Ward",
        detail: "Address Detail",
        fullAddress: "Full Address",
        area: "Area",
        selectProvince: "Select Province/City",
        selectDistrict: "Select District",
        selectWard: "Select Ward",
        selectDistrictFirst: "Please select district first",
        selectWardFirst: "Please select ward first",
        placeholder: "House number, street name, area...",
      },
    },
  },
  wallet: {
    balance: {
      title: "Current Balance",
      current: "Current Balance",
      lastUpdate: "Last updated: {date}",
    },
    actions: {
      deposit: "Deposit to Wallet",
      withdraw: "Withdraw from Wallet",
    },
  },
  messages: {
    success: "Profile updated successfully",
    error: "Failed to update profile. Please try again later.",
    imageSize: "Image size exceeds 5MB.",
  },
};
