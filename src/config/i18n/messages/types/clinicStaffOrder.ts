export type clinicStaffOrderMessages = {
    // Page header
    pageTitle: string
    pageDescription: string
    
    // Search and filters
    searchPlaceholder: string
    filter: string
    addOrder: string
    
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
    email: string
    phone: string
    livestream: string
    noName: string
    
    // Payment information
    paymentInformation: string
    totalServiceAmount: string
    discount: string
    finalAmount: string
    
    // Actions
    close: string
    printInvoice: string
    
    // Print related
    invoice: string
    date: string
    notAvailable: string
    thankYouMessage: string
    legalNotice: string
    allowPopups: string
    
    // Status
    statusCompleted: string
    statusPending: string
    statusCancelled: string
  }