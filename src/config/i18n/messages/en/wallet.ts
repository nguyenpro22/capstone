import type { Messages } from "../types"

export const walletMessages: Messages["wallet"] = {
  clinicWallet: {
    title: "Clinic Wallet Management",
  actions: {
    refresh: "Refresh",
    export: "Export",
    requestWithdrawal: "Request Withdrawal",
    viewDetails: "View Details",
    close: "Close",
    approve: "Approve",
    reject: "Reject",
    confirmRejection: "Confirm Rejection",
    clearFilters: "Clear Filters",
  },
  summary: {
    title: "Total Clinic Finances",
    description: "Summary of all clinics financial data",
    totalBalance: "Total Balance",
    totalBalanceDesc: "Combined balance across all clinics",
    totalPendingWithdrawals: "Total Pending Withdrawals",
    totalPendingWithdrawalsDesc: "Pending withdrawals across all clinics",
    totalEarnings: "Total Earnings",
    totalEarningsDesc: "Lifetime earnings across all clinics",
  },
  clinic: {
    selectClinic: "Select clinic",
    selectClinicLabel: "Select Clinic",
    walletTitle: "{clinicName} Wallet",
    selectToManage: "Please select a clinic to manage wallet",
    manageWallet: "Manage wallet balance and withdrawals",
    currentBalance: "Current Balance",
    availableForWithdrawal: "Available for withdrawal",
    pendingWithdrawals: "Pending Withdrawals",
    beingProcessed: "Being processed",
    totalEarnings: "Total Earnings",
    lifetimeEarnings: "Lifetime earnings",
  },
  tabs: {
    withdrawalHistory: "Withdrawal History",
    transactionHistory: "Transaction History",
  },
  filters: {
    dateRange: "Date Range",
    status: "Status",
    statusAll: "All",
    statusCompleted: "Completed",
    statusPending: "Pending",
    statusRejected: "Rejected",
    statusWaitingForPayment: "Waiting For Payment",
    searchWithdrawal: "Search by transaction ID or notes...",
    searchTransaction: "Search by clinic name or description...",
  },
  table: {
    id: "Id",
    date: "Date",
    amount: "Amount",
    clinic: "Clinic",
    bankAccount: "Bank Account",
    transactionId: "Transaction ID",
    status: "Status",
    actions: "Actions",
    type: "Type",
    description: "Description",
    noWithdrawals: "No withdrawal records found.",
    noTransactions: "No transactions found",
    searchAdjust: "Try adjusting your search or filters",
    transactionsAppear: "Transactions will appear here when they are created",
    loading: "Loading transactions...",
  },
  transactionTypes: {
    withdrawal: "Withdrawal",
    deposit: "Deposit",
    payment: "Payment",
  },
  status: {
    completed: "Completed",
    pending: "Pending",
    rejected: "Rejected",
    waitingForPayment: "Waiting For Payment",
    waitingApproval:"Waiting Approval"
  },
  transactionDetails: {
    title: "Transaction Details",
    detailsFor: "Details for {type} transaction",
    amount: "Amount",
    dateTime: "Date & Time",
    clinic: "Clinic",
    description: "Description",
    createdBy: "Created By",
    system: "System",
    user: "User",
    rejectionReason: "Rejection Reason",
    rejectionPlaceholder: "Please provide a reason for rejection",
    approving: "Approving...",
    rejecting: "Rejecting...",
  },
  notifications: {
    processingApproval: "Processing approval...",
    approvalSuccess: "Withdrawal request approved successfully",
    approvalFailed: "Failed to approve withdrawal: {error}",
    processingRejection: "Processing rejection...",
    rejectionSuccess: "Withdrawal request rejected successfully",
    rejectionFailed: "Failed to reject withdrawal: {error}",
  },
  },
  branchWallet: {
    title: "Branch Wallet",
    description: "Manage financial transactions and withdrawals for {branchName}",
    loading: {
      branchWallet: "Loading branch wallet data...",
      transactions: "Loading transactions...",
    },
    summary: {
      currentBalance: "Current Balance",
      availableForWithdrawal: "Available for withdrawal",
      pendingWithdrawals: "Pending Withdrawals",
      beingProcessed: "Being processed",
      totalEarnings: "Total Earnings",
      lifetimeEarnings: "Lifetime earnings",
    },
    analytics: {
      title: "Wallet Analytics",
      description: "Financial performance over time",
    },
    financialActivity: {
      title: "Financial Activity",
      description: "View all financial activities for {branchName}",
    },
    tabs: {
      transactions: "Transactions",
      withdrawals: "Withdrawals",
    },
    filters: {
      dateRange: "Date Range",
      type: "Type",
      typeAll: "All",
      status: "Status",
      statusAll: "All",
      filterByType: "Filter by Type",
      filterByStatus: "Filter by Status",
      searchTransactions: "Search transactions...",
      searchWithdrawal: "Search by transaction ID or notes...",
    },
    table: {
      id: "Id",
      date: "Date",
      amount: "Amount",
      type: "Type",
      description: "Description",
      customer: "Customer",
      status: "Status",
      bankAccount: "Bank Account",
      transactionId: "Transaction ID",
      actions: "Actions",
      noTransactions: "No transactions found.",
      noWithdrawals: "No withdrawal records found.",
    },
    transactionTypes: {
      income: "Income",
      withdrawal: "Withdrawal",
    },
    status: {
      completed: "Completed",
      pending: "Pending",
      rejected: "Rejected",
      waitingPayment: "Waiting for payment",
      waitingApproval:"Waiting Approval"
    },
    actions: {
      refresh: "Refresh",
      export: "Export",
      requestWithdrawal: "Request Withdrawal",
      viewDetails: "View Details",
      clearFilters: "Clear Filters",
    },
    notifications: {
      error: "Error",
      branchDataUnavailable: "Cannot request withdrawal. Branch data is not available.",
      exportFunctionality: "Export functionality would be implemented here",
      exportSuccess: "Export Success"
    },
  }
  
}
