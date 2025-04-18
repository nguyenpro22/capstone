export type doctor = {
  sidebar: {
    dashboard: string;
    calendar: string;
    appointment: string;
    settings: string;
    mainMenu: string;
    Settings: string;
    appearance: string;
    language: string;
    signout: string;
    viewProfile: string;
    accountSettings: string;
    logout: string;
    profileRefreshed: string;
  };
  calendar: {
    today: string;
    month: string;
    week: string;
    newAppointment: string;
    schedule: string;
    noAppointments: string;
    noAppointmentsDesc: string;
    addAppointment: string;
    loading: string;
    appointments: string;
    more: string;
    time: string;
  };
  status: {
    pending: string;
    inProgress: string;
    completed: string;
    uncompleted: string;
  };
  appointment: {
    details: string;
    dateTime: string;
    date: string;
    time: string;
    serviceDetails: string;
    service: string;
    procedure: string;
    notes: string;
    notesRestriction: string;
    addNotes: string;
    cancel: string;
    save: string;
    saving: string;
    noteSaved: string;
    noteError: string;
  };
  sidebarList: {
    title: string;
    dayOfWeek: string;
    timeRange: string;
    detailsButton: string;
    emptyTitle: string;
    emptyDesc: string;
    addButton: string;
  };
  clinicStaff: {
    title: string
    search: {
      placeholder: string
      filter: string
    }
    loading: string
    error: string
    noData: string
    card: {
      doctor: string
      email: string
      phone: string
      branches: string
      noBranches: string
      viewSchedule: string
      edit: string
    }
    table: {
      title: string
      description: string
      columns: {
        doctor: string
        email: string
        phone: string
        branches: string
        actions: string
      }
      actions: {
        view: string
        editProfile: string
        editSchedule: string
        assignToBranch: string
        deactivate: string
      }
    }
  
  }
};
