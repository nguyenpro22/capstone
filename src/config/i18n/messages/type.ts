export type Messages = {
  home: {
    header: string;
    currentTheme: string;
    primaryAction: string;
    secondaryAction: string;
    mutedBackground: string;
    light: string;
    dark: string;
    login: string;
    register: string;
    logout: string;
  };
  navbar: {
    home: string;
    about: string;
    contact: string;
  };
  api: {
    auth: {
      login: {
        loginSuccess: string;
        loginError: string;
        requiredEmail: string;
        minPassword: string;
        maxPassword: string;
        invalidEmail: string;
        userNotFoundError: string;
        providerLoginError: string;
        providerLoginSuccess: string;
      };
    };
  };
};
