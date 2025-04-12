import type { Messages } from "../types"

export const buyPackageMessages: Messages["buyPackage"] = {
  // Header Section
  premiumBeautyPackages: "Premium Beauty Packages",
  enhanceYourBeautyServices: "Enhance Your Beauty Services",
  chooseFromExclusiveRange: "Choose from our exclusive range of packages designed to elevate your clinics offerings and provide exceptional value to your customers",
  searchPackages: "Search packages...",
  
  // Features Section
  premiumQuality: "Premium Quality",
  premiumQualityDesc: "All packages are carefully curated to ensure the highest quality of service",
  instantActivation: "Instant Activation",
  instantActivationDesc: "Start using your package immediately after successful payment",
  flexibleDuration: "Flexible Duration",
  flexibleDurationDesc: "Choose packages with durations that suit your business needs",
  
  // Package Card
  active: "Active",
  inactive: "Inactive",
  duration: "Duration",
  durationDays: "Duration: {duration} days",
  liveStreams: "Live Streams: {count}",
  branches: "Branches: {count}",
  enhancedViewers: "Enhanced Viewers: {count}",
  oneTimePayment: "One-time payment",
  purchaseNow: "Purchase Now",
  processing: "Processing...",
  
  // Payment Dialog
  paymentQrCode: "Payment QR Code",
  scanQrCode: "Scan this QR code to complete your purchase of {packageName}",
  scanWithBankingApp: "Scan with your banking app to complete the payment",
  qrCodeExpires: "QR code expires in 15:00 minutes",
  waitingForPayment: "Waiting for payment...",
  paymentSuccessful: "Payment successful!",
  paymentFailed: "Payment failed. Please try again.",
  
  // Payment Result Dialog
  paymentSuccessTitle: "Payment Successful",
  paymentFailedTitle: "Payment Failed",
  paymentSuccessMessage: "Payment Successful!",
  paymentSuccessDesc: "Your payment of {amount} has been processed successfully.",
  transactionTime: "Transaction time: {time}",
  paymentFailedMessage: "Payment Failed",
  paymentFailedDesc: "We couldn't process your payment. Please try again.",
  close: "Close",
  goToDashboard: "Go to Dashboard",
  tryAgain: "Try Again",
  
  // Error Messages
  failedToLoadPackages: "Failed to Load Packages",
  tryAgainLater: "Please try again later or contact support.",
  retry: "Retry",
  clinicNotActivated: "Không thể thanh toán: Phòng khám chưa được kích hoạt",
  failedToGenerateQr: "Failed to generate payment QR code",
  failedToInitiatePayment: "Failed to initiate payment",
  failedToConnectPayment: "Failed to connect to payment service"
}