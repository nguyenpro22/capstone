import { Messages } from "../types";

export const dashboardMessages: Messages["dashboard"] = {
  totalUsers: "Total Users",
  totalClinics: "Total Clinics",
  totalRevenue: "Total Revenue",
  totalPending: "Total Pending",
  revenueDetails: "Revenue Details",
  approvalHistory: "Approval History",
  clinicName: "Clinic Name",
  location: "Location",
  dateTime: "Date - Time",
  piece: "Piece",
  amount: "Amount",
  status: "Status",
  accepted: "Accepted",
  pending: "Pending",
  upFromYesterday: "▲ {percent}% Up from yesterday",
  upFromLastWeek: "▲ {percent}% Up from last week",
  downFromYesterday: "▼ {percent}% Down from yesterday",
  clinicStaff: {
    totalAppointments: "Total Appointments",
    confirmedAppointments: "Confirmed Appointments",
    availableDoctors: "Available Doctors",
    todaySchedule: "Today's Schedule",
    customer: "Customer",
    service: "Service",
    time: "Time",
    doctor: "Doctor",
    status: "Status",
    noAppointments: "No appointments scheduled for today",
    loading: "Loading...",
    atThisClinic: "At this clinic",
    confirmationRate: "confirmation rate",
    fromYesterday: "from yesterday",
    viewDetails: "View Details",
    editAppointment: "Edit Appointment",
    cancel: "Cancel",
    // New missing translations
    dashboardTitle: "Dashboard",
    inProgress: "In Progress",
    pending: "Pending",
    cancelled: "Cancelled",
    completed: "Completed",
    statusBadges: {
      inProgress: "In Progress",
      pending: "Pending",
      cancelled: "Cancelled",
      completed: "Completed",
    },
  },
  systemAdmin: {
    title: "Admin Dashboard",
    timeSection: {  
      time: "Time Period",
      selectRange: "Select date range",
      week: "Week",
      month: "Month",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last3Months: "Last 3 months",
      clear: "Clear",
      limitMessage: "Only allows selection of the last 6 months",
    },
    notifications: {
      noData: "No data available for the selected time period. Try selecting a different time range or add new data.",
      partialData:
        "Data is only available for some time periods. The dashboard displays data for periods with information.",
    },
    stats: {
      totalRevenue: "Total Revenue",
      systemRevenue: "System Revenue",
      clinicRevenue: "Clinic Revenue",
      totalDoctors: "Total Doctors",
      brands: "Brands",
      branches: "Branches",
      services: "Services",
      pendingBrands: "Pending Brands",
      bronzePackage: "Bronze Package",
      silverPackage: "Silver Package",
      goldPackage: "Gold Package",
      comparedToPrevious: "compared to previous period",
    },
    charts: {
      revenueChart: "Revenue Chart",
      totalRevenue: "Total Revenue",
      systemRevenue: "System Revenue",
      clinicRevenue: "Clinic Revenue",
      subscriptionChart: "Subscription Chart",
      bronzePackage: "Bronze Package",
      silverPackage: "Silver Package",
      goldPackage: "Gold Package",
      growthChart: "Brand and Branch Growth",
      totalBrands: "Total Brands",
      totalBranches: "Total Branches",
    },
    loading: "Loading...",
    error: {
      title: "Error loading data",
      defaultMessage: "An error occurred while loading data",
    },
  },
  clinicManager : {
    loading: "Loading dashboard data...",
    title: "Dashboard",
    error: {
      title: "An error occurred",
      message: "Failed to fetch dashboard data. Please try again later.",
      tryAgain: "Try Again"
    },
    rangeView: {
      title: "Range View",
      weekly: "Weekly",
      monthly: "Monthly",
      to: "to",
      noData: {
        title: "No Range Data Available",
        message: "No data is available for the selected time period. Try selecting a different date range."
      }
    },
    dailyView: {
      title: "Daily View",
      today: "Today",
      noData: {
        title: "No Daily Data Available",
        message: "No data is available for the selected date. Try selecting a different date."
      }
    },
    charts: {
      customerOrders: "Customer Orders",
      scheduleStatus: "Schedule Status",
      revenuePerformance: "Revenue Performance",
      scheduleStatusDistribution: "Schedule Status Distribution"
      
    },
    metrics: {
      customerMetrics: "Customer Metrics",
      orderCustomers: "Order Customers",
      scheduleCustomers: "Schedule Customers",
      customerSchedules: "Customer Schedules"
    },
    status: {
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      canceled: "Canceled"
    },
    revenue: {
      revenue: "Revenue",
      normalRevenue: "Normal Revenue",
      liveStreamRevenue: "LiveStream Revenue"
    }
  }

};
