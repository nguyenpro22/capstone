export type apiMessages = {
  auth: {
    login: {
      loginSuccess: string;
      loginError: string;
      requiredEmail: string;
      minPassword: string;
      maxPassword: string;
      invalidEmail: string;
    };
  };
};
