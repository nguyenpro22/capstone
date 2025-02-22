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
    },
  },
};
