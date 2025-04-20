import type { Messages } from "../types"

export const clinicStaffServicePageMessages: Messages["clinicStaffService"] = {
  // Page header
  pageTitle: "Quản lý Dịch vụ",
  pageDescription:
    "Duyệt và quản lý tất cả các dịch vụ được cung cấp tại phòng khám của bạn. Xem thông tin chi tiết, quy trình và bác sĩ được phân công.",

  // Search and filters
  searchPlaceholder: "Tìm kiếm dịch vụ...",
  filter: "Lọc",
  addService: "Thêm Dịch vụ",

  // Loading states
  loading: "Đang tải dịch vụ...",
  loadingDetails: "Đang tải chi tiết dịch vụ...",

  // Error states
  errorLoadingServices: "Không thể tải dịch vụ",
  errorLoadingDetails: "Không thể tải chi tiết dịch vụ",
  errorTryAgain: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
  retry: "Thử lại",

  // Empty states
  noServicesFound: "Không tìm thấy dịch vụ nào",
  noServicesFoundDescription: "Hãy điều chỉnh tìm kiếm hoặc bộ lọc của bạn.",
  noServiceDetails: "Không có thông tin chi tiết dịch vụ",
  noServiceDetailsDescription: "Không thể tìm thấy thông tin dịch vụ được yêu cầu.",

  // Service card
  priceRange: "Phạm vi Giá",
  discount: "Giảm giá",
  viewDetails: "Xem Chi tiết",

  // Table headers
  name: "Tên",
  category: "Danh mục",
  price: "Giá",
  actions: "Thao tác",
  viewDetail: "Xem Chi tiết",
  noDiscount: "Không giảm giá",
  uncategorized: "Chưa phân loại",

  // Service details dialog
  overview: "Tổng quan",
  procedures: "Quy trình",
  doctors: "Bác sĩ",

 

  // Overview tab
  pricingInformation: "Thông tin Giá",
  priceRangeLabel: "Phạm vi Giá:",
  discountLabel: "Giảm giá:",
  serviceInformation: "Thông tin Dịch vụ",
  categoryLabel: "Danh mục:",
  brandingLabel: "Thương hiệu:",
  descriptionTitle: "Mô tả",
  noDescription: "Không có mô tả.",
  duration: "Thời gian",

  // Procedures tab
  noProcedures: "Không có quy trình nào",
  noProceduresDescription: "Dịch vụ này không có quy trình nào được định nghĩa.",
  priceOptions: "Tùy chọn Giá:",
  default: "Mặc định",
  durationLabel: "Thời gian:",
  priceLabel: "Giá:",

  // Doctors tab
  noDoctors: "Không có bác sĩ nào",
  noDoctorsDescription: "Dịch vụ này không có bác sĩ nào được phân công.",
  phoneLabel: "Điện thoại:",
  certificatesLabel: "Chứng chỉ:",
  certificate: "Chứng chỉ",
  noServiceDetailsTitle:"không có Chi tiết dịch vụ",
  description: "Mô tả",
  certificates: "Chứng chỉ"
  
}
