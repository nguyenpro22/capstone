export type clinicStaffOrderMessages = {
  // Page header
  pageTitle: string
  pageDescription: string
  
  // Search and filters
  searchPlaceholder: string
  filter: string
  addOrder: string
  resetFilters: string
  
  // Loading states
  loading: string
  loadingDetails: string
  
  // Error states
  errorLoadingOrders: string
  errorLoadingDetails: string
  errorTryAgain: string
  retry: string
  
  // Empty states
  noOrdersFound: string
  noOrdersFoundDescription: string
  
  // Order details
  orderDetails: string
  orderId: string
  orderInformation: string
  orderDate: string
  service: string
  customerInformation: string
  customerName: string
  customerPhone: string
  email: string
  phone: string
  livestream: string
  noName: string
  
  // Payment information
  paymentInformation: string
  totalServiceAmount: string
  discount: string
  finalAmount: string
  
  // Table information
  rowsPerPage: string
  showingResults: string
  
  // Actions
  close: string
  printInvoice: string
  updateStatus: string
  cancelOrder: string
  viewDetails: string
  
  // Sort information
  sort: string
  ascending: string
  descending: string
  
  // Print related
  invoice: string
  date: string
  notAvailable: string
  thankYouMessage: string
  legalNotice: string
  allowPopups: string
  
  // Status
  status: string
  statusCompleted: string
  statusPending: string
  statusCancelled: string
  depositAmount: string
  remainingAmount: string
  actions: string
  columns: string
  columnDisplay: string
  // Booking type
  bookingType: string
  livestreamBooking: string
  webBooking: string
}