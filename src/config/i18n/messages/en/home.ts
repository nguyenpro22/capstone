import { Messages } from "../types";

export const homeMessages: Messages["home"] = {
  meta: {
    title: "Beauty Aesthetic Center",
    description:
      "Premium beauty and aesthetic center dedicated to enhancing your natural beauty",
  },
  hero: {
    badge: "Premium Beauty & Aesthetic Center",
    title: "Discover Your Natural Beauty",
    description:
      "Experience premium aesthetic treatments tailored to enhance your unique beauty, delivered by expert professionals in a luxurious environment.",
    buttons: {
      bookConsultation: "Book Consultation",
      exploreServices: "Explore Services",
    },
    stats: [
      { number: "15+", label: "Years Experience" },
      { number: "10k+", label: "Happy Clients" },
      { number: "30+", label: "Expert Doctors" },
    ],
    cards: {
      rating: {
        title: "Excellent Service",
        subtitle: "5.0 Rating",
      },
      experts: {
        title: "Certified Experts",
        subtitle: "Professional Team",
      },
    },
  },
  clinic: {
    // Clinic slider section
    ourPartners: "Our Partners",
    trustedClinics: "Trusted Clinics & Healthcare Centers",
    clinicsDescription:
      "Discover our network of certified clinics and healthcare centers providing high-quality services and exceptional patient care.",
    viewAllClinics: "View All Clinics",
    errorLoadingClinics:
      "There was an error loading clinics. Please try again later.",
    tryAgain: "Try Again",
    active: "Active",
    pending: "Pending",
    noBranches: "No branches",
    branchs: "branches",
    branch: "branch",
    viewDetails: "View Details",
    favorite: "Add to favorites",
  },
  services: {
    badge: "Our Services",
    title: "Premium Beauty Treatments",
    description:
      "Discover our range of luxury treatments designed to enhance your natural beauty",
    items: [
      {
        title: "Facial Treatments",
        description: "Advanced skincare solutions for radiant, youthful skin",
        price: "From $199",
      },
      {
        title: "Body Contouring",
        description: "Sculpt and define your body with non-invasive treatments",
        price: "From $299",
      },
      {
        title: "Laser Therapy",
        description: "State-of-the-art laser treatments for skin perfection",
        price: "From $249",
      },
    ],
    priceFrom: "Price from",
    learnMore: "Learn More",
    viewAll: "View All",
  },
  whyChooseUs: {
    badge: "Why Choose Us",
    title: "Elevate Your Beauty Experience",
    experience: {
      years: "15+",
      title: "Years of Excellence",
      description:
        "Providing premium beauty services with consistent quality and innovation",
    },
    reasons: [
      {
        title: "Expert Professionals",
        description:
          "Our team consists of certified specialists with years of experience in aesthetic treatments",
      },
      {
        title: "Cutting-Edge Technology",
        description:
          "We invest in the latest equipment and techniques to deliver superior results",
      },
      {
        title: "Personalized Approach",
        description:
          "Every treatment is tailored to your unique needs and beauty goals",
      },
      {
        title: "Luxurious Environment",
        description:
          "Experience treatments in our serene, spa-like setting designed for your comfort",
      },
    ],
    learnMore: "Learn About Our Approach",
  },
  testimonials: {
    badge: "Client Testimonials",
    title: "What Our Clients Say",
    description:
      "Hear from our satisfied clients about their transformative experiences",
    items: [
      {
        name: "Sophia Anderson",
        treatment: "Facial Rejuvenation",
        quote:
          "The facial treatment completely transformed my skin. I've never received so many compliments on my complexion before!",
      },
      {
        name: "Emma Thompson",
        treatment: "Body Contouring",
        quote:
          "After just three sessions, I saw remarkable results. The staff was professional and made me feel comfortable throughout the process.",
      },
      {
        name: "Michael Roberts",
        treatment: "Laser Hair Removal",
        quote:
          "I was hesitant at first, but the team was so knowledgeable and the results exceeded my expectations. Highly recommend!",
      },
    ],
  },
  gallery: {
    badge: "Transformation Gallery",
    title: "Real Results, Real People",
    description: "See the transformative results our clients have experienced",
    tabs: {
      facial: "Facial Treatments",
      body: "Body Contouring",
      skin: "Skin Rejuvenation",
    },
    labels: {
      before: "Before",
      after: "After",
    },
    items: {
      facial: [
        { title: "Facial Rejuvenation", sessions: "After 3 sessions" },
        { title: "Facial Rejuvenation", sessions: "After 3 sessions" },
        { title: "Facial Rejuvenation", sessions: "After 3 sessions" },
      ],
      body: [
        { title: "Body Contouring", sessions: "After 5 sessions" },
        { title: "Body Contouring", sessions: "After 5 sessions" },
        { title: "Body Contouring", sessions: "After 5 sessions" },
      ],
      skin: [
        { title: "Skin Rejuvenation", sessions: "After 4 sessions" },
        { title: "Skin Rejuvenation", sessions: "After 4 sessions" },
        { title: "Skin Rejuvenation", sessions: "After 4 sessions" },
      ],
    },
  },
  experts: {
    badge: "Our Team",
    title: "Meet Our Expert Specialists",
    description:
      "Our team of certified professionals is dedicated to providing you with exceptional care",
    team: [
      {
        name: "Dr. Sarah Johnson",
        role: "Medical Director",
        specialties: ["Facial Aesthetics", "Injectables"],
      },
      {
        name: "Dr. David Chen",
        role: "Aesthetic Physician",
        specialties: ["Laser Therapy", "Skin Rejuvenation"],
      },
      {
        name: "Emily Williams",
        role: "Senior Aesthetician",
        specialties: ["Advanced Facials", "Chemical Peels"],
      },
      {
        name: "Jessica Martinez",
        role: "Body Specialist",
        specialties: ["Body Contouring", "Cellulite Treatments"],
      },
    ],
    specialtiesLabel: "Specialties:",
  },
  offers: {
    badge: "Limited Time",
    title: "Special Offers & Packages",
    description:
      "Take advantage of our exclusive promotions and save on premium treatments",
    newClient: {
      discount: "30% OFF",
      title: "New Client Special",
      description:
        "First-time clients receive 30% off any facial treatment of your choice",
      features: [
        "Valid for all facial treatments",
        "Includes skin consultation",
        "Expires in 30 days",
      ],
      button: "Book Now",
    },
    summerPackage: {
      discount: "SAVE 25%",
      title: "Summer Glow Package",
      description:
        "Prepare for summer with our special package designed for radiant skin",
      features: [
        "3 Facial treatments",
        "1 Body contouring session",
        "Complimentary skincare kit",
      ],
      button: "Learn More",
    },
  },
  contact: {
    badge: "Get In Touch",
    title: "Book Your Consultation",
    description:
      "Schedule a consultation with our experts to discuss your beauty goals and create a personalized treatment plan.",
    info: {
      visit: {
        title: "Visit Us",
        content: "123 Beauty Lane, Suite 100, New York, NY 10001",
      },
      call: {
        title: "Call Us",
        content: "(555) 123-4567",
      },
      email: {
        title: "Email Us",
        content: "info@beautyaesthetic.com",
      },
      hours: {
        title: "Opening Hours",
        weekdays: "Monday - Saturday: 9am - 7pm",
        weekend: "Sunday: Closed",
      },
    },
    form: {
      title: "Request an Appointment",
      fields: {
        firstName: "First Name",
        firstNamePlaceholder: "Enter your first name",
        lastName: "Last Name",
        lastNamePlaceholder: "Enter your last name",
        email: "Email",
        emailPlaceholder: "Enter your email",
        phone: "Phone",
        phonePlaceholder: "Enter your phone number",
        service: "Service Interested In",
        servicePlaceholder: "Select a service",
        serviceOptions: {
          facial: "Facial Treatments",
          body: "Body Contouring",
          laser: "Laser Therapy",
          skin: "Skin Rejuvenation",
        },
        message: "Message (Optional)",
        messagePlaceholder: "Tell us more about what you're looking for",
      },
      button: "Request Appointment",
    },
  },
  footer: {
    about: {
      title: "Beauty Aesthetic",
      description:
        "Premium beauty and aesthetic center dedicated to enhancing your natural beauty with advanced treatments.",
    },
    quickLinks: {
      title: "Quick Links",
      links: [
        { label: "Home", href: "#" },
        { label: "Livestream Consultation", href: "#" },
        { label: "Services", href: "#" },
        { label: "Clinic Registration", href: "#" },
        { label: "Clinics", href: "#" },
      ],
    },
    services: {
      title: "Services",
      links: [
        { label: "Facial Treatments", href: "#" },
        { label: "Body Contouring", href: "#" },
        { label: "Laser Therapy", href: "#" },
        { label: "Skin Rejuvenation", href: "#" },
        { label: "Anti-Aging Solutions", href: "#" },
      ],
    },
    newsletter: {
      title: "Newsletter",
      description:
        "Subscribe to our newsletter for exclusive offers and beauty tips.",
      placeholder: "Your email",
      button: "Subscribe",
    },
    copyright: "© 2025 Beauty Aesthetic. All rights reserved.",
  },
  // Navigation items
  home: "Home",
  livestream: "Livestream",
  clinicView: "Clinic View",
  registerClinic: "Register Clinic",
  
  // User menu
  login: "Login",
  profile: "Profile",
  appointments: "Appointments",
  inbox: "Inbox",
  logout: "Logout",
  
  // Mobile menu
  menu: "Menu",
  close: "Close",
};
