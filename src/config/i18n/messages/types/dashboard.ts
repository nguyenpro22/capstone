export type dashboardMessages = {
  totalUsers: string;
  totalClinics: string;
  totalRevenue: string;
  totalPending: string;
  revenueDetails: string;
  approvalHistory: string;
  clinicName: string;
  location: string;
  dateTime: string;
  piece: string;
  amount: string;
  status: string;
  accepted: string;
  pending: string;
  upFromYesterday: string;
  upFromLastWeek: string;
  downFromYesterday: string;
   // Add the clinicStaff section
   clinicStaff: {
    totalAppointments: string;
    confirmedAppointments: string;
    availableDoctors: string;
    todaySchedule: string;
    customer: string;
    service: string;
    time: string;
    doctor: string;
    status: string;
    noAppointments: string;
    loading: string;
    atThisClinic: string;
    confirmationRate: string;
    fromYesterday: string;
    viewDetails: string;
    editAppointment: string;
    cancel: string;
  }
};
