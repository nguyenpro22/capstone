export type CalendarMessages = {
  title: string;
  subtitle: string;
  calendar: {
    title: string;
    appointmentTypes: string;
    consultation: string;
    treatment: string;
    followUp: string;
  };
  navigation: {
    today: string;
  };
  views: {
    day: string;
    week: string;
    month: string;
  };
  filter: {
    byStatus: string;
    all: string;
    confirmed: string;
    pending: string;
    completed: string;
    cancelled: string;
  };
  schedule: {
    available: string;
    details: string;
    more: string;
  };
};
