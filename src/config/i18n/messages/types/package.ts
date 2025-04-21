export type packageMessages = {
  packageLists: string
    searchByPackageName: string
    addNewPackage: string
    loadingPackages: string
    failedToLoad: string
    noPackagesAvailable: string
    packageName: string
    description: string
    price: string
    duration: string
    status: string
    action: string
    active: string
    inactive: string
    viewPackageInfo: string
    editPackageInfo: string
    deletePackage: string
    confirmDeletePackage: string
    packageAddedSuccess: string
    packageDeletedSuccess: string
    packageDeleteFailed: string
    statusUpdated: string
    errorOccurred: string
    cannotGetPackageInfo: string
    close: string
    no: string
    day: string
    days: string
    branch: string
    branches: string
    streams: string
    viewers: string
    branchLimit: string
    liveStreamLimit: string
    enhancedViewerCapacity: string
    additionalLivestreamPrice: string
    additionalBranchPrice: string
    
    // New fields for premium packages
    premiumBeautyPackages: string
    enhanceYourBeautyServices: string
    purchaseAdditionalSlots: string
    chooseFromExclusiveRange: string
    addMoreBranchesAndLivestreams: string
    packages: string
    additionalSlots: string
    searchPackages: string
    premiumQuality: string
    premiumQualityDesc: string
    instantActivation: string
    instantActivationDesc: string
    flexibleDuration: string
    flexibleDurationDesc: string
    currentPackage: string
    currentBranches: string
    currentLivestreams: string
    perBranch: string
    perLivestream: string
    totalPrice: string
    processing: string
    purchaseAddons: string
    pleaseSelectAddons: string
    oneTimePayment: string
    purchaseNow: string
    paymentQrCode: string
    scanQrCode: string
    scanQrCodeAddons: string
    scanWithBankingApp: string
    qrCodeExpires: string
    waitingForPayment: string
    paymentSuccessful: string
    paymentFailed: string
    paymentSuccessTitle: string
    paymentFailedTitle: string
    paymentSuccessMessage: string
    paymentSuccessDesc: string
    paymentFailedMessage: string
    paymentFailedDesc: string
    transactionTime: string
    goToDashboard: string
    tryAgain: string
    failedToLoadPackages: string
    tryAgainLater: string
    retry: string
    failedToGenerateQr: string
    failedToInitiatePayment: string
    clinicNotActivated: string
    noActiveSubscription: string
    purchasePackageFirst: string
    viewPackages: string
    durationDays: string
    liveStreams: string
    enhancedViewers: string
    
    // Additional fields needed for edit-package-form
    editPackage: string
    saving: string
    saveChanges: string
    savePackage: string
    cancel: string
    packageUpdated: string
    invalidData: string
    
    // Fields structure for form fields
    fields: {
      packageName: string
      description: string
      price: string
      duration: string
      limitBranches: string
      limitLiveStream: string
      priceBranchAddition: string
      priceLiveStreamAddition: string
      enhancedView: string
    }
    
    // Placeholders for form inputs
    placeholders: {
      enterPackageName: string
      enterDescription: string
      enterPrice: string
      enterDuration: string
      enterLimitBranches: string
      enterLimitLiveStream: string
      enterPriceBranchAddition: string
      enterPriceLiveStreamAddition: string
      enterEnhancedView: string
    }
    
    // Notifications for form actions
    notifications: {
      packageAdded: string
      packageAddFailed: string
      packageUpdated: string
      packageUpdateFailed: string
      invalidData: string
      errorOccurred: string
      unexpectedError: string
    }
}
