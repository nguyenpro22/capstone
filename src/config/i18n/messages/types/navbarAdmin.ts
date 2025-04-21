export type navbarAdminMessages = {
    // Search
    searchPlaceholder: string;
    
    // Theme toggle
    toggleTheme: string;
    
    // Notifications
    notifications: string;
    unreadMessages: string;
    
    // User profile
    myAccount: string;
    profile: string;
    settings: string;
    support: string;
    logout: string;
    
    // Notification items (could be dynamic in a real app)
    newAppointment: string;
    newAppointmentMessage: string;
    treatmentComplete: string;
    treatmentCompleteMessage: string;
    reviewReceived: string;
    reviewReceivedMessage: string;
    timeAgo: {
      minutesAgo: string;
      hourAgo: string;
      hoursAgo: string;
    };
     // New translations for mobile
    search: string
    language: string
    recentSearches: string
    exampleSearch1: string
    exampleSearch2: string
    
    // Logout dialog
    logoutConfirmTitle: string
    logoutConfirmDescription: string
    cancel: string
    platformPolicies: string
  }
  