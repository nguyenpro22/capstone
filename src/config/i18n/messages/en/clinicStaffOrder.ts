import type { Messages } from "../types"

export const clinicStaffOrderMessages: Messages["clinicStaffOrder"] = {
    // Page header
    pageTitle: "Order Management",
    pageDescription: "Browse and manage all customer orders. View detailed information and process payments.",
    
    // Search and filters
    searchPlaceholder: "Search orders...",
    filter: "Filter",
    addOrder: "Add Order",
    
    // Loading states
    loading: "Loading orders...",
    loadingDetails: "Loading order details...",
    
    // Error states
    errorLoadingOrders: "Failed to load orders",
    errorLoadingDetails: "Failed to load order details",
    errorTryAgain: "Please try again later or contact support.",
    retry: "Retry",
    
    // Empty states
    noOrdersFound: "No orders found",
    noOrdersFoundDescription: "Try adjusting your search or filters.",
    
    // Order details
    orderDetails: "Order Details",
    orderId: "Order ID",
    orderInformation: "Order Information",
    orderDate: "Order Date",
    service: "Service",
    customerInformation: "Customer Information",
    customerName: "Customer Name",
    email: "Email",
    phone: "Phone",
    livestream: "Livestream",
    noName: "No Name",
    
    // Payment information
    paymentInformation: "Payment Information",
    totalServiceAmount: "Total Service Amount",
    discount: "Discount",
    finalAmount: "Final Amount",
    
    // Actions
    close: "Close",
    printInvoice: "Print Invoice",
    
    // Print related
    invoice: "Invoice",
    date: "Date",
    notAvailable: "N/A",
    thankYouMessage: "Thank you for using our services!",
    legalNotice: "This invoice is automatically generated and has legal value.",
    allowPopups: "Please allow pop-ups to print the invoice",
    
    // Status
    statusCompleted: "Completed",
    statusPending: "Pending",
    statusCancelled: "Cancelled"
  }