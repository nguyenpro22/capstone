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
     // New translations
     dashboardTitle: string
     inProgress: string
     pending: string
     cancelled: string
     completed: string
     statusBadges: {
       inProgress: string
       pending: string
       cancelled: string
       completed: string
     }
  }
  systemAdmin : {
    title: string
    timeSection: {
      time: string
      selectRange: string
      week: string
      month: string
      last7Days: string
      last30Days: string
      last3Months: string
      clear: string
      limitMessage: string
    }
    notifications: {
      noData: string
      partialData: string
    }
    stats: {
      totalRevenue: string
      systemRevenue: string
      clinicRevenue: string
      totalDoctors: string
      brands: string
      branches: string
      services: string
      pendingBrands: string
      bronzePackage: string
      silverPackage: string
      goldPackage: string
      comparedToPrevious: string
    }
    charts: {
      revenueChart: string
      totalRevenue: string
      systemRevenue: string
      clinicRevenue: string
      subscriptionChart: string
      bronzePackage: string
      silverPackage: string
      goldPackage: string
      growthChart: string
      totalBrands: string
      totalBranches: string
    }
    loading: string
    error: {
      title: string
      defaultMessage: string
    }
  }
  clinicManager :{
    loading: string
    title: string
    error: {
      title: string
      message: string
      tryAgain: string
    }
    rangeView: {
      title: string
      weekly: string
      monthly: string
      to: string
      noData: {
        title: string
        message: string
      }
    }
    dailyView: {
      title: string
      today: string
      noData: {
        title: string
        message: string
      }
    }
    charts: {
      customerOrders: string
      scheduleStatus: string
      revenuePerformance: string
      scheduleStatusDistribution: string
    }
    metrics: {
      customerMetrics: string
      orderCustomers: string
      scheduleCustomers: string
      customerSchedules: string
    }
    status: {
      pending: string
      inProgress: string
      completed: string
      canceled: string
    }
    revenue: {
      revenue: string
      normalRevenue: string
      liveStreamRevenue: string
    }
  }
};
