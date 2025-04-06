export type apiMessages = {
  auth: {
    login: {
      loginSuccess: string;
      loginError: string;
      requiredEmail: string;
      minPassword: string;
      maxPassword: string;
      invalidEmail: string;
      providerLoginSuccess: string;
      logoutError: string;
      invalidCredentials: string;
      userNotFound: string;
      generalError: string;
      logoutSuccess: string;
      providerLoginError: string;
      popupBlocked: string;
      authTimeout: string;
      authCancelled: string;
    };
  };
};
