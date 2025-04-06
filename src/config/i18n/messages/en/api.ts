import { Messages } from "../types";

export const apiMessages: Messages["api"] = {
  auth: {
    login: {
      loginSuccess: "Login successful",
      loginError: "Login error",
      requiredEmail: "Email or username is required",
      minPassword: "Password must be at least 6 characters",
      maxPassword: "Password must not exceed 50 characters",
      invalidEmail: "Invalid email format",
      providerLoginSuccess: "Login with Google successful",
      logoutError: "An error occurred while logging out.",
      invalidCredentials: "Invalid login credentials.",
      userNotFound: "User not found.",
      generalError: "An error occurred. Please try again later.",
      logoutSuccess: "Logged out successfully.",
      providerLoginError: "Login error with provider.",
      popupBlocked: "Popup is blocked. Please check your browser settings.",
      authTimeout: "Authentication session has expired.",
      authCancelled: "Authentication was cancelled.",
    },
  },
};
