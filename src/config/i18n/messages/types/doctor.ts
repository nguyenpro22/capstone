type Calendar = {
  title: string;
  subtitle: string;
  today: string;
  schedule: string;
  month: string;
  week: string;
  noAppointments: string;
  noAppointmentsDesc: string;
  moreShifts: string;
  appointments: string;
  details: string;
  appointmentDetails: string;
  patientInfo: string;
  close: string;
  edit: string;
  save: string;
  saving: string;
  cancel: string;
  noNotes: string;
  enterNotes: string;
  noteAdded: string;
};

type Time = {
  startTime: string;
  endTime: string;
  duration: string;
  hour: string;
  hours: string;
  minute: string;
  minutes: string;
};

type Appointment = {
  service: string;
  notes: string;
  currentProcedure: string;
  step: string;
  status: {
    active: string;
    confirmed: string;
    pending: string;
    inProgress: string;
    completed: string;
    cancelled: string;
    uncompleted: string;
    empty: string;
    mixed: string;
  };
  serviceHistory: string;
  currentService: string;
  appointmentStatus: string;
  customerScheduleId: string;
  patientId: string;
};
type Shift = {
  shifts: string;
  doctor: string;
  shiftDetails: string;
  shiftTime: string;
};
type Sidebar = {
  calendar: string;
  accountSettings: string;
  refreshProfile: string;
  notifications: string;
  mainMenu: string;
  registerSchedule: string;
  appearance: string;
  language: string;
  signout: string;
  settings: string;
  configs: string;
};
type ClinicStaff = {
  title: string;
  search: {
    placeholder: string;
    filter: string;
  };
  loading: string;
  error: string;
  noData: string;
  card: {
    doctor: string;
    email: string;
    phone: string;
    branches: string;
    noBranches: string;
    viewSchedule: string;
    edit: string;
  };
  table: {
    title: string;
    description: string;
    columns: {
      doctor: string;
      email: string;
      phone: string;
      branches: string;
      actions: string;
    };
    actions: {
      view: string;
      editProfile: string;
      editSchedule: string;
      assignToBranch: string;
      deactivate: string;
    };
  };
};

type DateTime = {
  weekdays: {
    long: {
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
    short: {
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
  };
  months: {
    long: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
    short: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
  };
  formats: {
    date: string;
    monthYear: string;
    week: string;
    weekDifferentMonths: string;
  };
  timeFormats: {
    week: string;
    weekWithMonth: string;
    weekWithDifferentMonths: string;
    time12h: string;
    time24h: string;
  };
};

export type doctor = {
  calendar: Calendar;
  time: Time;
  appointment: Appointment;
  shift: Shift;
  sidebar: Sidebar;
  clinicStaff: ClinicStaff;
  datetime: DateTime;
};
