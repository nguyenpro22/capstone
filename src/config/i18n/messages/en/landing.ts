import { Messages } from "../types";

export const landingMessages: Messages["landing"] = {
  form: {
    Name: "Clinic Name",
    Email: "Email",
    PhoneNumber: "Phone Number",
    Address: "Address",
    TaxCode: "Tax Code",
    BusinessLicense: "Business License",
    OperatingLicense: "Operating License",
    OperatingLicenseExpiryDate: "Operating License Expiry Date",
    ProfilePictureUrl: "Profile Picture",
    title: "Registration Form",
  },
  hero: {
    title: "Discover Your True Beauty",
    description:
      "Experience the ultimate in beauty and wellness at Beautify Clinic. Our expert team is dedicated to helping you look and feel your best.",
    cta: "Explore Our Services",
  },
  services: {
    title: "Our Services",
    facial: {
      title: "Facial Treatments",
      description: "Rejuvenate your skin with our advanced facial treatments.",
    },
    hair: {
      title: "Hair Styling",
      description:
        "Get the perfect look with our expert hair styling services.",
    },
    makeup: {
      title: "Makeup Services",
      description:
        "Enhance your natural beauty with our professional makeup services.",
    },
  },
  livestream: {
    title: "Live Beauty Tips",
    cardTitle: "Watch Our Live Beauty Session",
    description:
      "Join us for live beauty tips, tutorials, and Q&A sessions with our expert beauticians.",
    cta: "Join the Chat",
  },
  testimonials: {
    title: "What Our Clients Say",
    1: {
      name: "Sarah Johnson",
      content:
        "I love the results of my facial treatment! The staff was so friendly and professional.",
    },
    2: {
      name: "Mike Thompson",
      content:
        "The hair styling service was top-notch. I'll definitely be coming back!",
    },
    3: {
      name: "Emily Davis",
      content:
        "The makeup artist did an amazing job for my wedding day. I felt beautiful and confident.",
    },
  },
  footer: {
    title: "Beautify Clinic",
    description: "Your destination for beauty and wellness.",
    address: "123 Beauty Street, Cityville, State 12345",
    phone: "Phone: (123) 456-7890",
    quickLinks: "Quick Links",
    services: "Services",
    livestream: "Livestream",
    testimonials: "Testimonials",
    newsletter: "Newsletter",
    newsletterDescription: "Stay updated with our latest offers and news.",
    emailPlaceholder: "Your email",
    subscribe: "Subscribe",
    copyright: "© {year} Beautify Clinic. All rights reserved.",
  },
};
