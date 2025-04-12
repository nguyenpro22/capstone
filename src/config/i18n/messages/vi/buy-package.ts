import type { Messages } from "../types"

export const buyPackageMessages: Messages["buyPackage"] = {
    // Header Section
    premiumBeautyPackages: "Gói Dịch Vụ Làm Đẹp Cao Cấp",
    enhanceYourBeautyServices: "Nâng Cao Dịch Vụ Làm Đẹp Của Bạn",
    chooseFromExclusiveRange: "Lựa chọn từ các gói dịch vụ độc quyền được thiết kế để nâng cao dịch vụ của phòng khám và mang lại giá trị vượt trội cho khách hàng",
    searchPackages: "Tìm kiếm gói dịch vụ...",
    
    // Features Section
    premiumQuality: "Chất Lượng Cao Cấp",
    premiumQualityDesc: "Tất cả các gói được tuyển chọn cẩn thận để đảm bảo chất lượng dịch vụ cao nhất",
    instantActivation: "Kích Hoạt Ngay Lập Tức",
    instantActivationDesc: "Bắt đầu sử dụng gói dịch vụ ngay sau khi thanh toán thành công",
    flexibleDuration: "Thời Hạn Linh Hoạt",
    flexibleDurationDesc: "Lựa chọn gói với thời hạn phù hợp với nhu cầu kinh doanh của bạn",
    
    // Package Card
    active: "Hoạt động",
    inactive: "Không hoạt động",
    duration: "Thời hạn",
    durationDays: "Thời hạn: {duration} ngày",
    liveStreams: "Phát trực tiếp: {count}",
    branches: "Chi nhánh: {count}",
    enhancedViewers: "Người xem nâng cao: {count}",
    oneTimePayment: "Thanh toán một lần",
    purchaseNow: "Mua Ngay",
    processing: "Đang xử lý...",
    
    // Payment Dialog
    paymentQrCode: "Mã QR Thanh Toán",
    scanQrCode: "Quét mã QR này để hoàn tất việc mua {packageName}",
    scanWithBankingApp: "Quét bằng ứng dụng ngân hàng để hoàn tất thanh toán",
    qrCodeExpires: "Mã QR hết hạn trong 15:00 phút",
    waitingForPayment: "Đang chờ thanh toán...",
    paymentSuccessful: "Thanh toán thành công!",
    paymentFailed: "Thanh toán thất bại. Vui lòng thử lại.",
    
    // Payment Result Dialog
    paymentSuccessTitle: "Thanh Toán Thành Công",
    paymentFailedTitle: "Thanh Toán Thất Bại",
    paymentSuccessMessage: "Thanh Toán Thành Công!",
    paymentSuccessDesc: "Thanh toán của bạn với số tiền {amount} đã được xử lý thành công.",
    transactionTime: "Thời gian giao dịch: {time}",
    paymentFailedMessage: "Thanh Toán Thất Bại",
    paymentFailedDesc: "Chúng tôi không thể xử lý thanh toán của bạn. Vui lòng thử lại.",
    close: "Đóng",
    goToDashboard: "Đến Trang Quản Lý",
    tryAgain: "Thử Lại",
    
    // Error Messages
    failedToLoadPackages: "Không Thể Tải Gói Dịch Vụ",
    tryAgainLater: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
    retry: "Thử Lại",
    clinicNotActivated: "Không thể thanh toán: Phòng khám chưa được kích hoạt",
    failedToGenerateQr: "Không thể tạo mã QR thanh toán",
    failedToInitiatePayment: "Không thể bắt đầu thanh toán",
    failedToConnectPayment: "Không thể kết nối đến dịch vụ thanh toán"
  }