import { Messages } from "../types";
export const serviceMessages: Messages["serviceMessage"] = {
  // Existing fields
  servicesList: "Danh sách dịch vụ",
  no: "STT",
  addNewService: "Thêm dịch vụ mới",
  addFirstService: "Thêm dịch vụ đầu tiên",
  noServicesAvailable: "Không có dịch vụ nào có sẵn",
  serviceName: "Tên Dịch Vụ",
  price: "Giá",
  coverImage: "Ảnh",
  action: "Hành Động",
  category: "Loại",
  percentDiscount: "̀% Giảm giá",
  searchByName: "Tìm kiếm theo tên",
  active: "Hoạt động",
  inactive: "Ngưng hoạt động",
  viewServiceDetail: "Xem chi tiết dịch vụ",
  editService: "Chỉnh sửa thông tin dịch vụ",
  deleteService: "Xóa dịch vụ",
  addProcedure: " Thêm giai đoạn",
  deleteServiceConfirmation:
    "Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.",
  confirmDelete: "Xác nhận xóa",
  cancel: "Hủy",
  description: "Mô tả",
  branches: "Chi nhánh",
  noAvailable: "Không có chi nhánh nào, hãy tạo chi nhánh trước",
  image: "Hình ảnh",
  save: "Lưu..",
  // Success messages
  success: {
    serviceAdded: "Thêm dịch vụ thành công!",
    serviceDeleted: "Đã xóa dịch vụ thành công!",
    serviceUpdated: "Cập nhật dịch vụ thành công!",
  },

  // Error messages
  errors: {
    fetchServiceFailed: "Không thể lấy thông tin dịch vụ!",
    deleteServiceFailed: "Xóa dịch vụ thất bại!",
    refreshServiceFailed: "Không thể cập nhật thông tin dịch vụ!",
    updateServiceFailed: "Cập nhật dịch vụ thất bại!",
  },
  // Modal tabs
  overview: "Tổng quan",
  clinics: "Phòng khám",
  procedures: "Giai đoạn",
  doctors: "Bác sĩ",

  // Overview tab
  serviceDescription: "Mô tả dịch vụ",
  priceInfo: "Thông tin giá",
  minPrice: "Giá thấp nhất:",
  maxPrice: "Giá cao nhất:",
  discount: "Giảm giá:",
  otherInfo: "Thông tin khác",
  bookingTime: "Thời gian đặt lịch: 30-60 phút",
  executionTime: "Thời gian thực hiện: 1-2 giờ",
  rating: "Đánh giá: 4.8/5 (120 đánh giá)",
  descriptionImages: "Hình ảnh mô tả",
  coverImages: "Hình ảnh bìa",

  // Clinics tab
  noActiveClinics: "Không có phòng khám hoạt động",
  noActiveClinicDescription:
    "Dịch vụ này hiện chưa có phòng khám nào đang hoạt động.",
  noClinics: "Không có phòng khám",
  noClinicDescription: "Dịch vụ này hiện chưa có phòng khám nào cung cấp.",

  // Procedures tab
  noProcedures: "Không có giai đoạn",
  noProcedureDescription:
    "Dịch vụ này hiện chưa có giai đoạn nào được định nghĩa.",
  step: "Bước",
  editProcedure: "Chỉnh sửa giai đoạn",
  procedureName: "Tên giai đoạn",
  stepOrder: "Thứ tự bước",
  priceTypes: "Các loại giá",
  addPriceType: "Thêm loại giá",
  noPriceTypes: "Chưa có loại giá nào. Nhấn Thêm loại giá để bắt đầu.",
  priceTypeName: "Tên loại giá",
  priceValue: "Giá (VNĐ)",
  duration: "Thời gian (phút)",
  setAsDefault: "Đặt làm mặc định",
  delete: "Xóa",
  seeMore: "Xem thêm",
  collapse: "Thu gọn",
  minutes: "phút",
  default: "Mặc định",

  // Delete confirmation
  deleteConfirmTitle: "Xác nhận xóa",
  deleteConfirmDescription:
    "Bạn có chắc chắn muốn xóa giai đoạn này? Hành động này không thể hoàn tác.",
  deleting: "Đang xóa...",
  deleteProcedure: "Xóa giai đoạn",

  // Common actions
  close: "Đóng",
  edit: "Chỉnh sửa",

  // Toast messages
  deleteProcedureSuccess: "Đã xóa giai đoạn thành công",
  deleteProcedureError: "Không thể xóa giai đoạn. Vui lòng thử lại sau.",
  updateProcedureSuccess: "Cập nhật giai đoạn thành công",
  updateProcedureError: "Không thể cập nhật giai đoạn. Vui lòng thử lại sau.",

  // Validation messages
  procedureNameRequired: "Tên giai đoạn không được để trống!",
  priceTypeRequired: "Phải có ít nhất một loại giá!",
  defaultPriceTypeRequired:
    "Phải có ít nhất một loại giá được đặt làm mặc định!",

  // Doctor tab
  doctor: {
    title: "Bác sĩ thực hiện dịch vụ",
    add: "Thêm bác sĩ",
    select: "Chọn bác sĩ",
    search: "Tìm kiếm bác sĩ...",
    loading: "Đang tải danh sách bác sĩ...",
    notFound: "Không tìm thấy bác sĩ",
    processing: "Đang xử lý...",
    addButton: "Thêm bác sĩ",
    requiredDoctor: "Vui lòng chọn ít nhất một bác sĩ",
    addSuccess: "Thêm bác sĩ thành công",
    confirmRemove: "Bạn có chắc chắn muốn xóa bác sĩ này khỏi dịch vụ?",
    removeSuccess: "Đã xóa bác sĩ khỏi dịch vụ",
    removeError: "Có lỗi xảy ra khi xóa bác sĩ",
    removeTooltip: "Xóa bác sĩ khỏi dịch vụ",
    noDoctors: "Chưa có bác sĩ nào được gán cho dịch vụ này",
    addFirst: "Thêm bác sĩ đầu tiên",
    addError: "Không thể thêm bác sĩ vào dịch vụ",
    alreadyHasService:
      "Bác sĩ {doctors} đã được thêm vào dịch vụ này trước đó.",
  },
  // Procedure form
  procedure: {
    addProcedure: "Thêm Giai Đoạn",
    adding: "Đang thêm...",
    name: "Tên Giai Đoạn",
    namePlaceholder: "Nhập tên giai đoạn",
    description: "Mô Tả",
    descriptionPlaceholder: "Nhập mô tả chi tiết về giai đoạn",
    stepIndex: "Thứ tự bước",
    priceTypes: "Loại Giá Dịch Vụ",
    addPriceType: "Thêm Loại Giá",
    priceTypeName: "Tên",
    priceTypeNamePlaceholder: "VD: Cơ bản",
    duration: "Thời gian (phút)",
    price: "Giá (VND)",
    setAsDefault: "Đặt làm mặc định",
    removePriceType: "Xóa loại giá này",
    success: {
      added: "Thêm giai đoạn thành công!",
    },
    errors: {
      nameRequired: "Tên giai đoạn không được để trống!",
      nameMinLength: "Tên giai đoạn phải có ít nhất 2 ký tự!",
      descriptionRequired: "Mô tả không được để trống!",
      descriptionMinLength: "Mô tả phải có ít nhất 2 ký tự!",
      priceTypeRequired: "Phải có ít nhất một loại giá!",
      defaultPriceTypeRequired:
        "Phải có ít nhất một loại giá được đặt làm mặc định!",
      stepIndexExists: "Thứ tự bước này đã tồn tại!",
      addError: "Lỗi khi thêm Procedure:",
      generalError: "Thêm thất bại, vui lòng thử lại.",
    },
  },
  // Add new service form
  addService: {
    title: "Thêm dịch vụ mới",
    subtitle: "Nhập thông tin và tải lên hình ảnh dịch vụ",
    serviceName: "Tên Dịch vụ",
    serviceNamePlaceholder: "Nhập tên dịch vụ",
    description: "Mô tả",
    descriptionPlaceholder: "Nhập mô tả dịch vụ",
    category: "Danh mục",
    categoryPlaceholder: "Chọn danh mục",
    branches: "Chi nhánh",
    branchesPlaceholder: "Chọn chi nhánh",
    branchesRequired: "Phải chọn ít nhất một chi nhánh",
    noBranches: "Không có chi nhánh nào. Vui lòng tạo chi nhánh trước.",
    branchesSelected: "{count} chi nhánh được chọn",
    branchesSelectedPlural: "{count} chi nhánh được chọn",
    coverImages: "Hình ảnh bìa",
    noCoverImages: "Vui lòng tải lên ít nhất một hình ảnh bìa",
    selectCoverImages: "Chọn hình ảnh bìa",
    filesSelected: "{count} tệp đã chọn - Nhấp để thay đổi",
    saving: "Đang lưu...",
    save: "Lưu",
    depositPercent: "Phần trăm đặt cọc (%)",
    depositPercentInfo:
      "Số tiền khách hàng phải đặt cọc khi đặt dịch vụ (0-100%)",
    isRefundable: "Cho phép hoàn tiền",
    isRefundableInfo: "Khách hàng có thể được hoàn tiền cho dịch vụ này",
    requiredFields:
      "Vui lòng điền vào tất cả các trường bắt buộc, bao gồm ít nhất một chi nhánh và một hình ảnh",
  },
  // Update service form
  updateService: {
    title: "Cập nhật Dịch vụ",
    subtitle: "Cập nhật thông tin và hình ảnh dịch vụ",
    serviceName: "Tên Dịch vụ",
    serviceNamePlaceholder: "Nhập tên dịch vụ",
    description: "Mô tả",
    descriptionPlaceholder: "Nhập mô tả dịch vụ",
    category: "Danh mục",
    categoryPlaceholder: "Chọn danh mục",
    branches: "Chi nhánh",
    branchesPlaceholder: "Chọn chi nhánh",
    branchesRequired: "Phải chọn ít nhất một chi nhánh",
    noBranches: "Không có chi nhánh nào. Vui lòng tạo chi nhánh trước.",
    branchesSelected: "{count} chi nhánh được chọn",
    branchesSelectedPlural: "{count} chi nhánh được chọn",
    coverImages: "Hình ảnh bìa",
    noCoverImages: "Không có hình ảnh bìa nào",
    imagesMarkedForDeletion: "{count} hình ảnh đã đánh dấu để xóa",
    newlySelectedImages: "Hình ảnh bìa mới đã chọn:",
    selectCoverImages: "Chọn hình ảnh bìa",
    filesSelected: "{count} tệp đã chọn - Nhấp để thay đổi",
    saving: "Đang lưu...",
    saveChanges: "Lưu thay đổi",
    depositPercent: "Phần trăm đặt cọc (%)",
    depositPercentInfo:
      "Số tiền khách hàng phải đặt cọc khi đặt dịch vụ (0-100%)",
    isRefundable: "Cho phép hoàn tiền",
    isRefundableInfo: "Khách hàng có thể được hoàn tiền cho dịch vụ này",
  },
};

export const service: Messages["service"] = {
  // Service page messages
  services: "Dịch vụ",
  ourServices: "Dịch vụ của chúng tôi",
  discoverServices: "Khám phá các",
  amazing: "dịch vụ tuyệt vời",
  serviceDescription:
    "Khám phá các dịch vụ làm đẹp và chăm sóc sức khỏe cao cấp được thiết kế nhằm nâng cao sức khỏe và sự tự tin của bạn.",
  searchServices: "Tìm kiếm dịch vụ...",
  searchingServices: "Đang tìm kiếm dịch vụ...",
  sortBy: "Sắp xếp theo",
  mostPopular: "Phổ biến nhất",
  priceLowToHigh: "Giá: Thấp đến Cao",
  priceHighToLow: "Giá: Cao đến Thấp",
  nameAZ: "Tên: A-Z",
  resultsCount: "{count} kết quả",
  noServicesFound: "Không tìm thấy dịch vụ nào",
  tryDifferentFilters:
    "Hãy thử tiêu chí tìm kiếm khác hoặc duyệt tất cả dịch vụ",
  clearFilters: "Xóa bộ lọc",
  clear: "Xóa",
  errorLoading: "Lỗi khi tải dịch vụ",
  errorMessage: "Chúng tôi gặp sự cố khi tải dịch vụ. Vui lòng thử lại.",
  retry: "Thử lại",
  noData: "Không có dữ liệu",
  unableToLoadServices: "Không thể tải dịch vụ vào lúc này",

  // Service card messages
  serviceCard: {
    book: "Đặt ngay",
    quickView: "Xem nhanh",
    premium: "Cao cấp",
    popular: "Nổi bật",
    locations: "Có tại",
    doctors: "Bác sĩ",
    duration: "Thời gian",
    time: {
      treatment: "{duration} phút điều trị",
      recovery: "{duration} ngày hồi phục",
    },
    clinics: {
      more: "cơ sở khác",
    },
    doctorsMore: "bác sĩ khác",
  },

  // Footer messages
  footer: {
    newsletter: {
      title: "Đăng ký nhận thông tin",
      description:
        "Nhận thông tin về các dịch vụ mới và ưu đãi đặc biệt từ chúng tôi.",
      emailPlaceholder: "Email của bạn",
      subscribe: "Đăng ký",
    },
    companyInfo: {
      description:
        "Dịch vụ làm đẹp và chăm sóc sức khỏe cao cấp được thiết kế riêng cho nhu cầu của bạn. Trải nghiệm sự khác biệt với đội ngũ chuyên gia của chúng tôi.",
    },
    quickLinks: {
      title: "Liên kết nhanh",
      home: "Trang chủ",
      about: "Về chúng tôi",
      services: "Dịch vụ",
      pricing: "Bảng giá",
      contact: "Liên hệ",
    },
    ourServices: {
      title: "Dịch vụ của chúng tôi",
      allServices: "Tất cả dịch vụ",
      faceSurgery: "Phẫu Thuật Vùng Mặt",
      earSurgery: "Phẫu Thuật Tạo Hình Tai",
      breastSurgery: "Phẫu Thuật Ngực",
    },
    contactUs: {
      title: "Liên hệ với chúng tôi",
      address: "123 Beauty Street, Spa City, SC 12345",
      phone: "+1 (555) 123-4567",
      email: "info@beautyspa.com",
    },
    copyright: "© {year} Beauty & Spa. Đã đăng ký bản quyền.",
  },

  // Pagination
  pagination: {
    previous: "Trước",
    next: "Tiếp",
  },

  // Category
  categories: {
    allServices: "Tất cả dịch vụ",
    category: "Danh mục",
  },

  // View modes
  viewMode: {
    grid: "Lưới",
    list: "Danh sách",
  },

  // Filters
  filters: {
    serviceCategories: "Danh mục dịch vụ",
    categories: "Danh mục",
  },

  // Featured service
  featured: {
    title: "Dịch vụ nổi bật",
    featured: "Nổi bật",
    viewDetails: "Xem chi tiết",
  },
};
