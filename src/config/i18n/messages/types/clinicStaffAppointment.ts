export type clinicStaffAppointmentMessages = {
    // Page header
    pageTitle: string
  
    // Dashboard cards
    totalAppointments: string
    pendingAppointments: string
    inProgressAppointments: string
    completedAppointments: string
    cancelledAppointments: string
  
    // Calendar
    calendar: string
    sunday: string
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
  
    // Status labels
    completed: string
    inProgress: string
    pending: string
    cancelled: string
    statusCompleted: string
    statusInProgress: string
    statusPending: string
    statusCancelled: string
  
    // Appointment details
    appointments: string
    add: string
    doctor: string
    duration: string
    reschedule: string
    confirm: string
    confirming: string
    confirmed: string
  
    // Empty states
    loadingAppointments: string
    noAppointmentsForDay: string
    noAppointmentsScheduled: string
    addAppointment: string
  
    // Notifications
    confirmSuccess: string
    confirmError: string
  }