export interface homeMessages {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    badge: string;
    title: string;
    description: string;
    buttons: {
      bookConsultation: string;
      exploreServices: string;
    };
    stats: Array<{
      number: string;
      label: string;
    }>;
    cards: {
      rating: {
        title: string;
        subtitle: string;
      };
      experts: {
        title: string;
        subtitle: string;
      };
    };
  };
  services: {
    badge: string;
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      price: string;
    }>;
    priceFrom: string;
    learnMore: string;
    viewAll: string;
  };
  whyChooseUs: {
    badge: string;
    title: string;
    experience: {
      years: string;
      title: string;
      description: string;
    };
    reasons: Array<{
      title: string;
      description: string;
    }>;
    learnMore: string;
  };
  testimonials: {
    badge: string;
    title: string;
    description: string;
    items: Array<{
      name: string;
      treatment: string;
      quote: string;
    }>;
  };
  gallery: {
    badge: string;
    title: string;
    description: string;
    tabs: {
      facial: string;
      body: string;
      skin: string;
    };
    labels: {
      before: string;
      after: string;
    };
    items: {
      facial: Array<{
        title: string;
        sessions: string;
      }>;
      body: Array<{
        title: string;
        sessions: string;
      }>;
      skin: Array<{
        title: string;
        sessions: string;
      }>;
    };
  };
  experts: {
    badge: string;
    title: string;
    description: string;
    team: Array<{
      name: string;
      role: string;
      specialties: string[];
    }>;
    specialtiesLabel: string;
  };
  offers: {
    badge: string;
    title: string;
    description: string;
    newClient: {
      discount: string;
      title: string;
      description: string;
      features: string[];
      button: string;
    };
    summerPackage: {
      discount: string;
      title: string;
      description: string;
      features: string[];
      button: string;
    };
  };
  clinic: {
    // Clinic slider section
    ourPartners: string;
    trustedClinics: string;
    clinicsDescription: string;
    viewAllClinics: string;
    errorLoadingClinics: string;
    tryAgain: string;
    active: string;
    pending: string;
    noBranches: string;
    branch: string;
    branchs: string;
    viewDetails: string;
    favorite: string;
  };
  contact: {
    badge: string;
    title: string;
    description: string;
    info: {
      visit: {
        title: string;
        content: string;
      };
      call: {
        title: string;
        content: string;
      };
      email: {
        title: string;
        content: string;
      };
      hours: {
        title: string;
        weekdays: string;
        weekend: string;
      };
    };
    form: {
      title: string;
      fields: {
        firstName: string;
        firstNamePlaceholder: string;
        lastName: string;
        lastNamePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        service: string;
        servicePlaceholder: string;
        serviceOptions: {
          facial: string;
          body: string;
          laser: string;
          skin: string;
        };
        message: string;
        messagePlaceholder: string;
      };
      button: string;
    };
  };
  footer: {
    about: {
      title: string;
      description: string;
    };
    quickLinks: {
      title: string;
      links: Array<{
        label: string;
        href: string;
      }>;
    };
    services: {
      title: string;
      links: Array<{
        label: string;
        href: string;
      }>;
    };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      button: string;
    };
    copyright: string;
  };
}
