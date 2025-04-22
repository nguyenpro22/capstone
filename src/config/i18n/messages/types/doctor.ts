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

export type doctor = {
  calendar: Calendar;
  time: Time;
  appointment: Appointment;
  shift: Shift;
  sidebar: Sidebar;
  clinicStaff: ClinicStaff // Add this new type

};
