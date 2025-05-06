import type { Messages } from "../types"

export const clinicStaffOrderMessages: Messages["clinicStaffOrder"] = {
    // Page header
    pageTitle: "Quản lý đơn hàng",
    pageDescription: "Duyệt và quản lý tất cả đơn hàng của khách hàng. Xem thông tin chi tiết và xử lý thanh toán.",
    // Search and filters
    searchPlaceholder: "Tìm kiếm đơn hàng...",
    filter: "Lọc",
    addOrder: "Thêm đơn hàng",
    resetFilters: "Bỏ bộ lọc",
    // Loading states
    loading: "Đang tải đơn hàng...",
    loadingDetails: "Đang tải chi tiết đơn hàng...",
    // Error states
    errorLoadingOrders: "Không thể tải đơn hàng",
    errorLoadingDetails: "Không thể tải chi tiết đơn hàng",
    errorTryAgain: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
    retry: "Thử lại",
    // Empty states
    noOrdersFound: "Không tìm thấy đơn hàng nào",
    noOrdersFoundDescription: "Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn.",
    // Order details
    orderDetails: "Chi tiết đơn hàng",
    orderId: "Mã đơn hàng",
    orderInformation: "Thông tin đơn hàng",
    orderDate: "Ngày đặt hàng",
    service: "Dịch vụ",
    customerInformation: "Thông tin khách hàng",
    customerName: "Tên khách hàng",
    customerPhone: "SĐT khách hàng",
    email: "Email",
    phone: "Số điện thoại",
    livestream: "Livestream",
    noName: "Không có tên",
    // Payment information
    paymentInformation: "Thông tin thanh toán",
    totalServiceAmount: "Tổng tiền dịch vụ",
    discount: "Giảm giá",
    finalAmount: "Thành tiền",
    // Table information
    rowsPerPage: "Số dòng mỗi trang",
    showingResults: "Hiển thị {start} đến {end} của {total} kết quả",
    // Actions
    close: "Đóng",
    printInvoice: "In hóa đơn",
    updateStatus: "Cập nhật trạng thái",
    cancelOrder: "Hủy đơn hàng",
    viewDetails: "Xem chi tiết",
    // Sort information
    sort: "Sắp xếp",
    ascending: "tăng dần",
    descending: "giảm dần",
    // Print related
    invoice: "Hóa đơn",
    date: "Ngày",
    notAvailable: "Không có",
    thankYouMessage: "Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!",
    legalNotice: "Hóa đơn này được tạo tự động và có giá trị pháp lý.",
    allowPopups: "Vui lòng cho phép cửa sổ pop-up để in hóa đơn",
    
    // Status
    status: "Trạng thái",
    statusCompleted: "Hoàn thành",
    statusPending: "Đang xử lý",
    statusCancelled: "Đã hủy",
    depositAmount: "Tiền đặt cọc",
    remainingAmount: "Số tiền còn lại",
    actions:"Hành Động",
    columns: "Cột",
    columnDisplay: "Cột Hiển Thị",
    // Booking type
  bookingType: "Loại đặt hàng",
  livestreamBooking: "Livestream",
  webBooking: "Website",
}