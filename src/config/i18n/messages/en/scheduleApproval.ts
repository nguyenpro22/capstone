import { Messages } from "../types";

export const scheduleApprovalMessages: Messages["scheduleApproval"] = {
    // Page header
    pageTitle: "Schedule Approval",
    pageDescription: "Review and manage schedules waiting for approval",
  
    // Table headers
    customer: "Customer",
    contact: "Contact",
    date: "Date",
    time: "Time",
    service: "Service",
    status: "Status",
    actions: "Actions",
  
    // Status
    waitingApproval: "Waiting Approval",
    approved: "Approved",
    rejected: "Rejected",
  
    // Actions
    approve: "Approve",
    reject: "Reject",
  
    // Notifications
    approveSuccess: "Schedule Approved successfully",
    rejectSuccess: "Schedule Rejected successfully",
    error: "Error",
    approveError: "Failed to approve schedule",
    rejectError: "Failed to reject schedule",
  
    // Loading states
    loadError: "Failed to load schedules.",
    tryAgain: "Please try again.",
    retry: "Retry",
    noSchedules: "No schedules waiting for approval",
    notAvailable: "N/A",
  }