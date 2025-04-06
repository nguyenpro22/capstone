export type doctor = {
  sidebar: {
    dashboard: string;
    calendar: string;
    patients: string;
    profile: string;
    settings: string;
    mainMenu: string;
    Settings: string;
    appearance: string;
    language: string;
    signout: string;
    viewProfile: string;
    accountSettings: string;
    logout: string;
    logoutSuccess: string;
  };
  calendar: {
    title: string;
    loading: string;
    error: string;
    noAppointments: string;
    noAppointmentsToday: string;
    todayAppointments: string;
    appointmentSummary: string;
    month: string;
    week: string;
    time: string;
    today: string;
    more: string;
  };
  appointment: {
    details: string;
    patient: string;
    date: string;
    time: string;
    status: string;
    service: string;
    procedure: string;
    notes: string;
    addNotes: string;
    notesRestriction: string;
    cancel: string;
    save: string;
    saving: string;
    noteSaved: string;
    noteSuccess: string;
    noteError: string;
  };
  status: {
    pending: string;
    inProgress: string;
    completed: string;
    uncompleted: string;
  };
  language: {
    en: string;
    vi: string;
  };
};
