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
      loginSuccess: string;
      registerSuccess: string;
      logoutSuccess: string;
      loginError: string;
      registerError: string;
      logoutError: string;
    };
  };
};
