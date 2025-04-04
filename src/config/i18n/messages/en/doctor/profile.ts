import { Messages } from "../../types";

export const profile: Messages["doctorProfile"] = {
  title: "Profile",
  subtitle: "Manage your account settings and preferences",
  tabs: {
    general: "General",
    password: "Password",
    notifications: "Notifications",
  },
  general: {
    title: "Profile",
    description: "Manage your personal information",
    name: {
      label: "Name",
      placeholder: "Your name",
    },
    email: {
      label: "Email",
      placeholder: "Your email",
    },
    phone: {
      label: "Phone",
      placeholder: "Your phone number",
    },
    specialization: {
      label: "Specialization",
      placeholder: "Your specialization",
    },
    saveButton: "Save changes",
    saving: "Saving...",
    successTitle: "Profile updated",
    successMessage: "Your profile has been updated successfully.",
  },
  password: {
    title: "Change Password",
    description: "Update your password to keep your account secure",
    currentPassword: {
      label: "Current Password",
      placeholder: "Enter your current password",
    },
    newPassword: {
      label: "New Password",
      placeholder: "Enter your new password",
      description: "Password must be at least 8 characters long.",
    },
    confirmPassword: {
      label: "Confirm New Password",
      placeholder: "Confirm your new password",
    },
    updateButton: "Update Password",
    updating: "Updating...",
    successTitle: "Password updated",
    successMessage: "Your password has been updated successfully.",
  },
  notifications: {
    title: "Notifications",
    description: "Manage how you receive notifications",
    emailNotifications: {
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    pushNotifications: {
      label: "Push Notifications",
      description: "Receive push notifications on your device",
    },
    appointmentReminders: {
      label: "Appointment Reminders",
      description: "Receive reminders about upcoming appointments",
    },
    marketingEmails: {
      label: "Marketing Emails",
      description: "Receive emails about new features and promotions",
    },
    saveButton: "Save preferences",
    saving: "Saving...",
    successTitle: "Notification settings updated",
    successMessage:
      "Your notification settings have been updated successfully.",
  },
};
