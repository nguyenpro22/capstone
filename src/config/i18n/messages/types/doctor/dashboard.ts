export type DashboardMessages = {
  title: string;
  subtitle: string;
  cards: {
    todayAppointments: string;
    pendingConfirmations: string;
    totalPatients: string;
    completedToday: string;
    compared: string;
    new: string;
    remaining: string;
  };
  tabs: {
    upcoming: string;
    today: string;
    summary: string;
  };
  upcomingAppointments: {
    title: string;
    description: string;
    viewAll: string;
    noAppointments: string;
    details: string;
  };
  todaySchedule: {
    title: string;
    description: string;
    available: string;
    details: string;
  };
  appointmentSummary: {
    title: string;
    description: string;
    confirmed: string;
    pending: string;
    completed: string;
    cancelled: string;
  };
};
