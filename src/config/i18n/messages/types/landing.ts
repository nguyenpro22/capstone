export type landingMessages = {
  form: {
    Name: string;
    Email: string;
    PhoneNumber: string;
    Address: string;
    TaxCode: string;
    BusinessLicense: string;
    OperatingLicense: string;
    OperatingLicenseExpiryDate: string;
    ProfilePictureUrl: string;
    title: string;
  };
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
