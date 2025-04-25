export type PolicyMessages = {
  metadata: {
    title: string;
    description: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  navigation: {
    tableOfContents: string;
    backToTop: string;
    needHelp: {
      title: string;
      description: string;
      contactButton: string;
    };
    quickNavigation: string;
    sections: {
      privacy: string;
      terms: string;
      guidelines: string;
      standards: string;
      disputes: string;
      safety: string;
    };
  };
  introduction: {
    welcome: string;
    lastUpdated: string;
    date: string;
  };
  privacyPolicy: {
    title: string;
    introduction: string;
    informationWeCollect: {
      title: string;
      introduction: string;
      items: {
        personal: string;
        profile: string;
        payment: string;
        communication: string;
        serviceHistory: string;
      };
      priorityNote: string;
    };
    howWeUse: {
      title: string;
      introduction: string;
      items: string[];
    };
    dataSharing: {
      title: string;
      content: string;
    };
    yourRights: {
      title: string;
      content: string;
      importantRights: {
        title: string;
        access: string;
        rectification: string;
        erasure: string;
        restrictProcessing: string;
      };
    };
  };
  termsOfService: {
    title: string;
    introduction: string;
    importantNote: string;
    platformDescription: {
      title: string;
      content: string;
    };
    userAccounts: {
      title: string;
      content: string;
    };
    usage: {
      acceptable: {
        title: string;
        items: string[];
      };
      prohibited: {
        title: string;
        items: string[];
      };
    };
    bookingsAndPayments: {
      title: string;
      content: string;
    };
    intellectualProperty: {
      title: string;
      content: string;
    };
    limitationOfLiability: {
      title: string;
      content: string;
    };
  };
  userGuidelines: {
    title: string;
    introduction: string;
    communityValues: {
      title: string;
      content: string;
    };
    clientResponsibilities: {
      title: string;
      items: string[];
    };
    clinicResponsibilities: {
      title: string;
      items: string[];
    };
    prohibitedActivities: {
      title: string;
      introduction: string;
      items: string[];
    };
    violationNote: string;
  };
  clinicStandards: {
    title: string;
    introduction: string;
    qualityAssurance: {
      title: string;
      content: string;
    };
    qualificationRequirements: {
      title: string;
      introduction: string;
      items: string[];
    };
    facilityStandards: {
      title: string;
      introduction: string;
      items: {
        regulations: string;
        equipment: string;
        sanitation: string;
        environment: string;
      };
    };
    serviceQuality: {
      title: string;
      introduction: string;
      items: string[];
    };
    verificationProcess: {
      title: string;
      content: string;
    };
  };
  disputeResolution: {
    title: string;
    introduction: string;
    commitment: {
      title: string;
      content: string;
    };
    reportingDispute: {
      title: string;
      introduction: string;
      steps: string[];
    };
    resolutionProcess: {
      title: string;
      introduction: string;
      steps: {
        initialReview: {
          title: string;
          description: string;
        };
        informationGathering: {
          title: string;
          description: string;
        };
        mediation: {
          title: string;
          description: string;
        };
        finalDetermination: {
          title: string;
          description: string;
        };
      };
    };
    refundsAndCompensation: {
      title: string;
      content: string;
    };
    appeals: {
      title: string;
      content: string;
    };
  };
  safetyAndSecurity: {
    title: string;
    introduction: string;
    importantNotice: string;
    dataSecurity: {
      title: string;
      introduction: string;
      items: string[];
    };
    userVerification: {
      title: string;
      content: string;
    };
    treatmentSafety: {
      title: string;
      content: string;
    };
    measures: {
      safetyMeasures: {
        title: string;
        items: string[];
      };
      clientResources: {
        title: string;
        items: string[];
      };
    };
    reportingConcerns: {
      title: string;
      content: string;
      howToReport: {
        title: string;
        steps: string[];
      };
    };
  };
  downloadDocuments: {
    title: string;
    documents: {
      privacy: string;
      terms: string;
      guidelines: string;
      standards: string;
      disputes: string;
      safety: string;
    };
  };
  footer: {
    lastUpdated: string;
    date: string;
    contactUs: string;
    links: {
      terms: string;
      privacy: string;
      cookies: string;
      legal: string;
    };
  };
};
