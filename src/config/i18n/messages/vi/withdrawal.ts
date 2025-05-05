import type { Messages } from "../types"

export const withdrawalMessages: Messages["withdrawal"] = {
  // Page titles and descriptions
  walletTransactions: "Giao dịch ví",
  transactionHistory: "Lịch sử giao dịch",
  viewAndManageTransactions: "Xem và quản lý tất cả giao dịch ví phòng khám",

  // Button labels
  refresh: "Làm mới",
  export: "Xuất",
  close: "Đóng",
  approve: "Phê duyệt",
  reject: "Từ chối",
  confirmRejection: "Xác nhận từ chối",
  approving: "Đang phê duyệt...",
  rejecting: "Đang từ chối...",
  tryAgain: "Thử lại",
  viewTransactions: "Xem giao dịch",

  // Tab labels
  allTransactions: "Tất cả giao dịch",
  withdrawals: "Rút tiền",
  deposits: "Nạp tiền",
  payments: "Thanh toán",

  // Filter and search
  dateRange: "Khoảng thời gian",
  clearFilters: "Xóa bộ lọc",
  searchPlaceholder: "Tìm kiếm theo tên phòng khám hoặc mô tả...",

  // Table headers
  date: "Ngày",
  clinic: "Phòng khám",
  amount: "Số tiền",
  type: "Loại",
  status: "Trạng thái",
  description: "Mô tả",
  actions: "Hành động",

  // Transaction types
  withdrawal: "Rút tiền",
  deposit: "Nạp tiền",
  payment: "Thanh toán",

  // Transaction statuses
  completed: "Hoàn thành",
  pending: "Đang xử lý",
  rejected: "Từ chối",
  waitingForPayment: "Chờ thanh toán",
  waitingApproval: "Chờ phê duyệt",

  // Loading states
  loadingTransactions: "Đang tải giao dịch...",
  loadingQRCode: "Đang tải mã QR...",

  // Empty states
  noTransactionsFound: "Không tìm thấy giao dịch nào",
  adjustSearchOrFilters: "Hãy điều chỉnh tìm kiếm hoặc bộ lọc",
  transactionsWillAppearHere: "Giao dịch sẽ xuất hiện ở đây khi chúng được tạo.",

  // Transaction details
  transactionDetails: "Chi tiết giao dịch",
  detailsFor: "Chi tiết cho",
  transaction: "giao dịch",
  transactionID: "ID giao dịch",
  dateAndTime: "Ngày & Giờ",
  createdBy: "Tạo bởi",
  system: "Hệ thống",
  user: "Người dùng",
  rejectionReason: "Lý do từ chối",
  provideRejectionReason: "Vui lòng cung cấp lý do từ chối",

  // QR code and payment
  paymentQRCode: "Mã QR thanh toán",
  scanQRToCompleteWithdrawal: "Quét mã QR này để hoàn tất thanh toán rút tiền",
  scanWithBankingApp: "Quét bằng ứng dụng ngân hàng của bạn",
  qrCodeExpires: "Mã QR hết hạn sau 15 phút",
  paymentSuccessful: "Thanh toán thành công",
  paymentFailed: "Thanh toán thất bại",
  withdrawalPaymentProcessed: "Thanh toán rút tiền {amount} đã được xử lý thành công.",
  transactionTime: "Thời gian giao dịch",
  paymentProcessingIssue: "Đã xảy ra sự cố khi xử lý thanh toán. Vui lòng thử lại.",

  // Toast messages
  processingApproval: "Đang xử lý phê duyệt...",
  processingRejection: "Đang xử lý từ chối...",
  processingConfirmation: "Đang xử lý xác nhận...",
  withdrawalApprovedCompletePayment: "Rút tiền đã được phê duyệt. Vui lòng hoàn tất thanh toán.",
  withdrawalRequestApproved: "Yêu cầu rút tiền đã được phê duyệt thành công",
  withdrawalRequestRejected: "Yêu cầu rút tiền đã bị từ chối thành công",
  failedToApproveWithdrawal: "Không thể phê duyệt rút tiền",
  failedToRejectWithdrawal: "Không thể từ chối rút tiền",
  failedToConnectPayment: "Không thể kết nối với dịch vụ thanh toán",
  failedToConnectPaymentTryAgain: "Không thể kết nối với dịch vụ thanh toán. Vui lòng thử lại.",
  qrCodeNotAvailable: "Mã QR không có sẵn cho giao dịch này",
  paymentFailedTryAgain: "Thanh toán thất bại. Vui lòng thử lại.",
  transferConfirmed: "Chuyển khoản đã được xác nhận",
  failedToConfirmTransfer: "Không thể xác nhận chuyển khoản",
  confirming: "Đang xác nhận...",
  qrCodeInvalid: "Mã QR không hợp lệ",

  // Misc
  viewQR: "Xem QR",
  exportFunctionalityMessage: "Chức năng xuất sẽ được triển khai tại đây",
  confirmTransfer: "Xác nhận chuyển khoản",
}
