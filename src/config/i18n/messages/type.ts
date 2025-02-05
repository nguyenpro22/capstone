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
  landing: {
    hero: {
      title: string;
      description: string;
      cta: string;
    };
    services: {
      title: string;
      facial: {
        title: string;
        description: string;
      };
      hair: {
        title: string;
        description: string;
      };
      makeup: {
        title: string;
        description: string;
      };
    };
    livestream: {
      title: string;
      cardTitle: string;
      description: string;
      cta: string;
    };
    testimonials: {
      title: string;
      [key: number]: {
        name: string;
        content: string;
      };
    };
    footer: {
      title: string;
      description: string;
      address: string;
      phone: string;
      quickLinks: string;
      services: string;
      livestream: string;
      testimonials: string;
      newsletter: string;
      newsletterDescription: string;
      emailPlaceholder: string;
      subscribe: string;
      copyright: string;
    };
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
      };
    };
  };
};
