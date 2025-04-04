export type AppointmentMessages = {
  title: string;
  subtitle: string;
  details: {
    title: string;
    goBack: string;
    notFound: string;
    notFoundDesc: string;
  };
  patient: {
    information: string;
    details: string;
    id: string;
    dateOfBirth: string;
  };
  appointment: {
    information: string;
    details: string;
    date: string;
    time: string;
    service: string;
    notes: string;
    noNotes: string;
    markCompleted: string;
  };
  tabs: {
    details: string;
    history: string;
    treatment: string;
  };
  appointmentDetails: {
    title: string;
    description: string;
    serviceDetails: string;
    duration: string;
    price: string;
    appointmentHistory: string;
    created: string;
    lastUpdated: string;
    statusChanges: string;
    createdWithStatus: string;
    changedTo: string;
    additionalNotes: string;
    noAdditionalNotes: string;
  };
  patientHistory: {
    title: string;
    description: string;
    treatmentHistory: string;
    upcomingAppointments: string;
    noTreatmentHistory: string;
    noUpcomingAppointments: string;
    viewDetails: string;
    treatmentNotes: string;
    noTreatmentNotes: string;
    recommendations: string;
    treatmentImages: string;
  };
  treatmentForm: {
    title: string;
    description: string;
    notes: {
      label: string;
      placeholder: string;
      description: string;
    };
    recommendations: {
      label: string;
      placeholder: string;
      description: string;
    };
    followUpDate: {
      label: string;
      description: string;
    };
    images: {
      label: string;
      addImages: string;
      uploading: string;
      description: string;
    };
    saveButton: string;
    saving: string;
    successTitle: string;
    successMessage: string;
  };
};
