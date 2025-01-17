import { Messages } from "./type";

const en: Messages = {
  home: {
    header: "Header",
    currentTheme: "Current Theme",
    primaryAction: "Primary Action",
    secondaryAction: "Secondary Action",
    mutedBackground: "Muted Background",
    light: "Light",
    dark: "Dark",
    login: "Login",
    register: "Register",
    logout: "Logout",
  },
  navbar: {
    home: "Home",
    about: "About",
    contact: "Contact",
  },
  api: {
    auth: {
      login: {
        loginSuccess: "Login successful",
        loginError: "Login error",
        requiredEmail: "Email or username is required",
        minPassword: "Password must be at least 6 characters",
        maxPassword: "Password must not exceed 50 characters",
        invalidEmail: "Invalid email format",
        userNotFoundError: "User not found",
        providerLoginError: "Provider login error",
        providerLoginSuccess: "Login success",
      },
    },
  },
};

export default en;
