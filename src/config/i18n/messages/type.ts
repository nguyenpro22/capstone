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
  dashboard: {
    totalUsers: string;
    totalClinics: string;
    totalRevenue: string;
    totalPending: string;
    revenueDetails: string;
    approvalHistory: string;
    clinicName: string;
    location: string;
    dateTime: string;
    piece: string;
    amount: string;
    status: string;
    accepted: string;
    pending: string;
    upFromYesterday: string;
    upFromLastWeek: string;
    downFromYesterday: string;
  };
  voucher: {
    voucherLists: string;
    addNewVoucher: string;
    filterBy: string;
    voucherType: string;
    voucherStatus: string;
    resetFilter: string;
    id: string;
    voucherCode: string;
    validFrom: string;
    validTo: string;
    type: string;
    status: string;
    completed: string;
    processing: string;
    rejected: string;
    prevDate: string;
    nextDate: string;
    rowsPerPage: string;
  };
};
