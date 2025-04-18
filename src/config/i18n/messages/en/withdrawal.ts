import type { Messages } from "../types";

export const withdrawalMessages: Messages["withdrawal"] = {
  // Page titles and descriptions
  walletTransactions: "Wallet Transactions",
  transactionHistory: "Transaction History",
  viewAndManageTransactions: "View and manage all clinic wallet transactions",

  // Button labels
  refresh: "Refresh",
  export: "Export",
  close: "Close",
  approve: "Approve",
  reject: "Reject",
  confirmRejection: "Confirm Rejection",
  approving: "Approving...",
  rejecting: "Rejecting...",
  tryAgain: "Try Again",
  viewTransactions: "View Transactions",

  // Tab labels
  allTransactions: "All Transactions",
  withdrawals: "Withdrawals",
  deposits: "Deposits",
  payments: "Payments",

  // Filter and search
  dateRange: "Date Range",
  clearFilters: "Clear Filters",
  searchPlaceholder: "Search by clinic name or description...",

  // Table headers
  date: "Date",
  clinic: "Clinic",
  amount: "Amount",
  type: "Type",
  status: "Status",
  description: "Description",
  actions: "Actions",

  // Transaction types
  withdrawal: "Withdrawal",
  deposit: "Deposit",
  payment: "Payment",

  // Transaction statuses
  completed: "Completed",
  pending: "Pending",
  rejected: "Rejected",
  waitingForPayment: "Waiting For Payment",
  waitingApproval: "Waiting Approval",

  // Loading states
  loadingTransactions: "Loading transactions...",
  loadingQRCode: "Loading QR Code...",

  // Empty states
  noTransactionsFound: "No transactions found",
  adjustSearchOrFilters: "Try adjusting your search or filters",
  transactionsWillAppearHere: "Transactions will appear here when they are created.",

  // Transaction details
  transactionDetails: "Transaction Details",
  detailsFor: "Details for",
  transaction: "transaction",
  transactionID: "Transaction ID",
  dateAndTime: "Date & Time",
  createdBy: "Created By",
  system: "System",
  user: "User",
  rejectionReason: "Rejection Reason",
  provideRejectionReason: "Please provide a reason for rejection",

  // QR code and payment
  paymentQRCode: "Payment QR Code",
  scanQRToCompleteWithdrawal: "Scan this QR code to complete the withdrawal payment",
  scanWithBankingApp: "Scan with your banking app",
  qrCodeExpires: "QR code expires in 15 minutes",
  paymentSuccessful: "Payment Successful",
  paymentFailed: "Payment Failed",
  withdrawalPaymentProcessed: "The withdrawal payment of {amount} has been processed successfully.",
  transactionTime: "Transaction time",
  paymentProcessingIssue: "There was an issue processing the payment. Please try again.",

  // Toast messages
  processingApproval: "Processing approval...",
  processingRejection: "Processing rejection...",
  withdrawalApprovedCompletePayment: "Withdrawal approved. Please complete the payment.",
  withdrawalRequestApproved: "Withdrawal request approved successfully",
  withdrawalRequestRejected: "Withdrawal request rejected successfully",
  failedToApproveWithdrawal: "Failed to approve withdrawal",
  failedToRejectWithdrawal: "Failed to reject withdrawal",
  failedToConnectPayment: "Failed to connect to payment service",
  failedToConnectPaymentTryAgain: "Failed to connect to payment service. Please try again.",
  qrCodeNotAvailable: "QR code not available for this transaction",
  paymentFailedTryAgain: "Payment failed. Please try again.",

  // Misc
  viewQR: "View QR",
  exportFunctionalityMessage: "Export functionality would be implemented here",
}
