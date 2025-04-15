import type { Messages } from "../types"

export const buyPackageMessages: Messages["buyPackage"] = {
  // Header Section
  premiumBeautyPackages: "Premium Beauty Packages",
  enhanceYourBeautyServices: "Enhance Your Beauty Services",
  chooseFromExclusiveRange:
    "Choose from our exclusive range of packages designed to elevate your clinics offerings and provide exceptional value to your customers",
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
  clinicNotActivated: "Cannot process payment: Clinic is not activated",
  failedToGenerateQr: "Failed to generate payment QR code",
  failedToInitiatePayment: "Failed to initiate payment",
  failedToConnectPayment: "Failed to connect to payment service",
  additionalLivestreamPrice: "Additional Livestream Price: {price}",
  additionalBranchPrice: "Additional Branch Price: {price}",

  // Tab Labels
  packages: "Packages",
  additionalSlots: "Additional Slots",

  // Add-ons Tab
  purchaseAdditionalSlots: "Purchase Additional Slots",
  addMoreBranchesAndLivestreams: "Add more branches and livestreams to your current subscription package",
  noActiveSubscription: "No Active Subscription",
  purchasePackageFirst: "Please purchase a package before adding additional slots",
  viewPackages: "View Packages",
  currentPackage: "Current Package",

  // Additional Branches and Livestreams
  additionalBranches: "Additional Branches",
  currentBranches: "Current branches",
  perBranch: "per branch",
  additionalLivestreams: "Additional Livestreams",
  currentLivestreams: "Current livestreams",
  perLivestream: "per livestream",

  // Pricing and Purchase
  totalPrice: "Total Price",
  purchaseAddons: "Purchase Add-ons",
  pleaseSelectAddons: "Please select at least one add-on",
  scanQrCodeAddons: "Scan this QR code to complete your purchase of additional slots",
}
