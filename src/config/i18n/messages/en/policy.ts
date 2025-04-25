import { Messages } from "../types";

export const policy: Messages["policyMessages"] = {
  metadata: {
    title: "Policies | Beauty Service Platform",
    description:
      "Our platform policies for connecting clients and aesthetic clinics",
  },
  header: {
    title: "Platform Policies",
    subtitle: "Our commitment to transparency, safety, and quality service",
  },
  navigation: {
    tableOfContents: "Table of Contents",
    backToTop: "Back to top",
    needHelp: {
      title: "Need Help?",
      description:
        "If you have questions about our policies, our support team is here to help.",
      contactButton: "Contact Support",
    },
    quickNavigation: "Quick Navigation",
    sections: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      guidelines: "User Guidelines",
      standards: "Clinic Standards",
      disputes: "Dispute Resolution",
      safety: "Safety & Security",
    },
  },
  introduction: {
    welcome:
      "Welcome to our platform's policy center. These policies govern your use of our beauty service platform that connects clients with aesthetic clinics. We've designed these policies to ensure a safe, transparent, and high-quality experience for all users. Please take the time to familiarize yourself with these important guidelines.",
    lastUpdated: "Last Updated:",
    date: "April 19, 2025. These policies are regularly reviewed and updated to ensure compliance with regulations and best practices.",
  },
  privacyPolicy: {
    title: "Privacy Policy",
    introduction:
      "Our platform is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our beauty service platform.",
    informationWeCollect: {
      title: "Information We Collect",
      introduction:
        "We collect information that you provide directly to us, including:",
      items: {
        personal:
          "Personal identification information (name, email address, phone number)",
        profile: "Profile information (profile picture, beauty preferences)",
        payment:
          "Payment information (processed through secure third-party payment processors)",
        communication:
          "Communication data (messages between clients and clinics)",
        serviceHistory: "Service history and appointment details",
      },
      priorityNote:
        "We prioritize data minimization and only collect information necessary to provide our services.",
    },
    howWeUse: {
      title: "How We Use Your Information",
      introduction: "We use the information we collect to:",
      items: [
        "Provide, maintain, and improve our platform services",
        "Process transactions and send related information",
        "Connect clients with appropriate aesthetic clinics",
        "Send notifications, updates, and support messages",
        "Personalize your experience and provide tailored content",
      ],
    },
    dataSharing: {
      title: "Data Sharing and Disclosure",
      content:
        "We may share your information with aesthetic clinics you choose to connect with through our platform. We do not sell your personal information to third parties. We may share data with service providers who help us operate our platform, always under strict confidentiality agreements.",
    },
    yourRights: {
      title: "Your Rights and Choices",
      content:
        "You have the right to access, correct, or delete your personal information. You can manage your communication preferences and opt out of marketing communications at any time.",
      importantRights: {
        title: "Important Privacy Rights:",
        access: "Right to Access: You can request a copy of your personal data",
        rectification:
          "Right to Rectification: You can correct inaccurate information",
        erasure: "Right to Erasure: You can request deletion of your data",
        restrictProcessing:
          "Right to Restrict Processing: You can limit how we use your data",
      },
    },
  },
  termsOfService: {
    title: "Terms of Service",
    introduction:
      "These Terms of Service govern your use of our beauty service platform. By accessing or using our platform, you agree to be bound by these terms.",
    importantNote:
      "Important: By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
    platformDescription: {
      title: "Platform Description",
      content:
        "Our platform connects clients seeking aesthetic services with qualified clinics. We facilitate the discovery, booking, and management of beauty services but are not directly responsible for the services provided by the clinics.",
    },
    userAccounts: {
      title: "User Accounts",
      content:
        "You must create an account to use certain features of our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
    },
    usage: {
      acceptable: {
        title: "Acceptable Use",
        items: [
          "Providing accurate information",
          "Respecting other users",
          "Following booking procedures",
          "Maintaining account security",
        ],
      },
      prohibited: {
        title: "Prohibited Activities",
        items: [
          "Creating false accounts",
          "Sharing account credentials",
          "Unauthorized access attempts",
          "Misrepresenting identity",
        ],
      },
    },
    bookingsAndPayments: {
      title: "Service Bookings and Payments",
      content:
        "When you book a service through our platform, you enter into a direct agreement with the clinic. Payment terms, cancellation policies, and service details are set by individual clinics and should be reviewed before booking.",
    },
    intellectualProperty: {
      title: "Intellectual Property",
      content:
        "All content, features, and functionality of our platform, including but not limited to text, graphics, logos, and software, are owned by our company and protected by intellectual property laws.",
    },
    limitationOfLiability: {
      title: "Limitation of Liability",
      content:
        "We strive to provide a reliable platform but cannot guarantee uninterrupted access or the accuracy of information provided by clinics. We are not liable for any damages arising from your use of, or inability to use, our platform.",
    },
  },
  userGuidelines: {
    title: "User Guidelines",
    introduction:
      "Our user guidelines are designed to ensure a positive, respectful, and safe experience for all platform users. Following these guidelines is essential for maintaining the integrity of our community.",
    communityValues: {
      title: "Community Values",
      content:
        "Our platform is built on trust, respect, and professionalism. We expect all users to uphold these values in every interaction.",
    },
    clientResponsibilities: {
      title: "Client Responsibilities",
      items: [
        "Provide accurate personal information",
        "Attend scheduled appointments or cancel within the clinic's cancellation window",
        "Communicate respectfully with clinics",
        "Provide honest and constructive feedback",
        "Report any concerns or issues promptly",
      ],
    },
    clinicResponsibilities: {
      title: "Clinic Responsibilities",
      items: [
        "Maintain accurate service listings and availability",
        "Provide services as described",
        "Maintain appropriate licensing and qualifications",
        "Respond to client inquiries in a timely manner",
        "Handle client information with confidentiality",
      ],
    },
    prohibitedActivities: {
      title: "Prohibited Activities",
      introduction:
        "The following activities are strictly prohibited on our platform:",
      items: [
        "Harassment or discriminatory behavior of any kind",
        "Fraudulent activities or misrepresentation of credentials or services",
        "Sharing inappropriate or offensive content",
        "Creating multiple accounts for deceptive purposes",
        "Any illegal activities or promotion of illegal services",
      ],
    },
    violationNote:
      "Violation of these guidelines may result in account suspension or termination. We regularly review user activity to ensure compliance with our community standards.",
  },
  clinicStandards: {
    title: "Clinic Standards",
    introduction:
      "We maintain high standards for the aesthetic clinics on our platform to ensure quality, safety, and professionalism. All clinics must meet these standards to participate in our network.",
    qualityAssurance: {
      title: "Quality Assurance",
      content:
        "Every clinic on our platform undergoes a thorough verification process before being approved. We continuously monitor service quality through client feedback and regular reviews.",
    },
    qualificationRequirements: {
      title: "Qualification Requirements",
      introduction: "All clinics on our platform must:",
      items: [
        "Hold valid licenses and permits required by local regulations",
        "Employ qualified professionals with appropriate certifications",
        "Maintain proper insurance coverage",
        "Demonstrate a history of safe practice",
      ],
    },
    facilityStandards: {
      title: "Facility Standards",
      introduction: "Clinics must maintain facilities that:",
      items: {
        regulations: "Meet health and safety regulations",
        equipment: "Use approved equipment and products",
        sanitation: "Implement proper sanitation protocols",
        environment: "Provide comfortable and accessible environments",
      },
    },
    serviceQuality: {
      title: "Service Quality",
      introduction: "We expect clinics to:",
      items: [
        "Provide accurate descriptions of services",
        "Deliver consistent quality of care",
        "Conduct thorough consultations before treatments",
        "Offer appropriate aftercare instructions",
        "Maintain high customer satisfaction ratings",
      ],
    },
    verificationProcess: {
      title: "Verification Process",
      content:
        "All clinics undergo a verification process before joining our platform, which includes document review, background checks, and potentially in-person inspections. We also conduct periodic reviews to ensure ongoing compliance.",
    },
  },
  disputeResolution: {
    title: "Dispute Resolution",
    introduction:
      "We understand that disagreements may arise between clients and clinics. Our dispute resolution process is designed to address concerns fairly and efficiently.",
    commitment: {
      title: "Our Commitment",
      content:
        "We are committed to fair and transparent dispute resolution. Our goal is to ensure both clients and clinics are treated equitably and that all concerns are addressed promptly.",
    },
    reportingDispute: {
      title: "Reporting a Dispute",
      introduction:
        "If you encounter an issue with a service or user, you should:",
      steps: [
        "First attempt to resolve the issue directly with the other party",
        "If unsuccessful, report the issue through our platform's support system",
        "Provide all relevant details, including dates, communications, and specific concerns",
        "Submit any supporting documentation or evidence",
      ],
    },
    resolutionProcess: {
      title: "Resolution Process",
      introduction:
        "Our dispute resolution process typically follows these steps:",
      steps: {
        initialReview: {
          title: "Initial Review",
          description:
            "Our support team reviews the reported issue and determines the appropriate next steps.",
        },
        informationGathering: {
          title: "Information Gathering",
          description:
            "We collect information from all involved parties to understand the full context of the dispute.",
        },
        mediation: {
          title: "Mediation",
          description:
            "We facilitate communication between parties to reach a mutually acceptable solution.",
        },
        finalDetermination: {
          title: "Final Determination",
          description:
            "If necessary, we make a final determination based on our policies and the evidence provided.",
        },
      },
    },
    refundsAndCompensation: {
      title: "Refunds and Compensation",
      content:
        "Refund policies are set by individual clinics and should be reviewed before booking. In cases where a clinic has clearly violated our policies or failed to provide the agreed-upon service, we may facilitate refunds or other appropriate remedies.",
    },
    appeals: {
      title: "Appeals",
      content:
        "If you disagree with the outcome of a dispute resolution, you may submit an appeal for review by a senior member of our team. Appeals must be submitted within 14 days of the initial decision.",
    },
  },
  safetyAndSecurity: {
    title: "Safety & Security",
    introduction:
      "Your safety and security are our top priorities. We implement various measures to protect our users and maintain the integrity of our platform.",
    importantNotice:
      "Important Safety Notice: In case of a medical emergency related to a treatment, seek immediate medical attention first, then report the incident to our support team.",
    dataSecurity: {
      title: "Data Security",
      introduction: "We protect your data through:",
      items: [
        "Encryption of sensitive information",
        "Secure payment processing",
        "Regular security audits and updates",
        "Strict access controls for our staff",
        "Compliance with data protection regulations",
      ],
    },
    userVerification: {
      title: "User Verification",
      content:
        "We implement verification processes for both clients and clinics to reduce the risk of fraudulent activities and ensure the authenticity of platform users.",
    },
    treatmentSafety: {
      title: "Treatment Safety",
      content:
        "While we cannot guarantee the safety of every treatment, we require clinics to follow industry best practices, maintain proper qualifications, and provide appropriate consultations before procedures.",
    },
    measures: {
      safetyMeasures: {
        title: "Safety Measures",
        items: [
          "Clinic verification process",
          "Professional qualification checks",
          "Regular safety audits",
          "Client feedback monitoring",
        ],
      },
      clientResources: {
        title: "Client Resources",
        items: [
          "Treatment safety guides",
          "Pre-treatment checklists",
          "Aftercare instructions",
          "Emergency contact information",
        ],
      },
    },
    reportingConcerns: {
      title: "Reporting Safety Concerns",
      content:
        "If you encounter any safety concerns or suspicious activities on our platform, please report them immediately through our support system. We investigate all reports promptly and take appropriate action to maintain a safe environment.",
      howToReport: {
        title: "How to Report a Safety Concern:",
        steps: [
          'Use the "Report" button on the clinic profile or service page',
          "Contact our support team through the Help Center",
          "Email us at safety@beautyplatform.com",
          "For emergencies, use the emergency contact feature in our app",
        ],
      },
    },
  },
  downloadDocuments: {
    title: "Download Policy Documents",
    documents: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      guidelines: "User Guidelines",
      standards: "Clinic Standards",
      disputes: "Dispute Resolution",
      safety: "Safety & Security",
    },
  },
  footer: {
    lastUpdated: "Last updated:",
    date: "April 19, 2025. For questions about our policies, please",
    contactUs: "contact us",
    links: {
      terms: "Terms",
      privacy: "Privacy",
      cookies: "Cookies",
      legal: "Legal",
    },
  },
};
