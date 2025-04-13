export type scheduleApprovalMessages = {
    // Page header
    pageTitle: string
    pageDescription: string
  
    // Table headers
    customer: string
    contact: string
    date: string
    time: string
    service: string
    status: string
    actions: string
  
    // Status
    waitingApproval: string
    approved: string
    rejected: string
  
    // Actions
    approve: string
    reject: string
  
    // Notifications
    approveSuccess: string
    rejectSuccess: string
    error: string
    approveError: string
    rejectError: string
  
    // Loading states
    loadError: string
    tryAgain: string
    retry: string
    noSchedules: string
    notAvailable: string
  }