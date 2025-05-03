export type withdrawalMessages = {
    // Page titles and descriptions
  walletTransactions: string
  transactionHistory: string
  viewAndManageTransactions: string
  // Button labels
  refresh: string
  export: string
  close: string
  approve: string
  reject: string
  confirmRejection: string
  approving: string
  rejecting: string
  tryAgain: string
  viewTransactions: string

  // Tab labels
  allTransactions: string
  withdrawals: string
  deposits: string
  payments: string

  // Filter and search
  dateRange: string
  clearFilters: string
  searchPlaceholder: string

  // Table headers
  date: string
  clinic: string
  amount: string
  type: string
  status: string
  description: string
  actions: string

  // Transaction types
  withdrawal: string
  deposit: string
  payment: string

  // Transaction statuses
  completed: string
  pending: string
  rejected: string
  waitingForPayment: string
  waitingApproval: string

  // Loading states
  loadingTransactions: string
  loadingQRCode: string

  // Empty states
  noTransactionsFound: string
  adjustSearchOrFilters: string
  transactionsWillAppearHere: string

  // Transaction details
  transactionDetails: string
  detailsFor: string
  transaction: string
  transactionID: string
  dateAndTime: string
  createdBy: string
  system: string
  user: string
  rejectionReason: string
  provideRejectionReason: string

  // QR code and payment
  paymentQRCode: string
  scanQRToCompleteWithdrawal: string
  scanWithBankingApp: string
  qrCodeExpires: string
  paymentSuccessful: string
  paymentFailed: string
  withdrawalPaymentProcessed: string
  transactionTime: string
  paymentProcessingIssue: string

  // Toast messages
  processingApproval: string
  processingRejection: string
  processingConfirmation: string
  withdrawalApprovedCompletePayment: string
  withdrawalRequestApproved: string
  withdrawalRequestRejected: string
  failedToApproveWithdrawal: string
  failedToRejectWithdrawal: string
  failedToConnectPayment: string
  failedToConnectPaymentTryAgain: string
  qrCodeNotAvailable: string
  paymentFailedTryAgain: string
  transferConfirmed: string
  failedToConfirmTransfer: string
  confirming: string
  qrCodeInvalid: string

  // Misc
  viewQR: string
  exportFunctionalityMessage: string
  confirmTransfer: string
  }
  