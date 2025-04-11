import { Messages } from "../types";

export const serviceMessages: Messages["serviceMessage"] = {
  servicesList: "Danh sách dịch vụ",
  no: "STT",
  addNewService: "Thêm dịch vụ mới",
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
  deleteService: "Xóa phòng dịch vụ",
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
};

export const service: Messages["service"] = {
  serviceMessage: {
    // Banner section
    ourServices: "Dịch Vụ Của Chúng Tôi",
    discoverServices: "Khám phá các",
    amazing: "dịch vụ tuyệt vời",
    serviceDescription:
      "Trải nghiệm các dịch vụ làm đẹp và chăm sóc sức khỏe cao cấp được thiết kế riêng cho nhu cầu của bạn. Đội ngũ chuyên gia của chúng tôi luôn tận tâm mang đến sự chăm sóc và kết quả đặc biệt.",
    exploreNow: "Khám Phá Ngay",
    beautyServices: "Dịch Vụ Làm Đẹp",

    // Search and filters
    searchServices: "Tìm kiếm dịch vụ...",
    sortBy: "Sắp xếp theo",
    mostPopular: "Phổ biến nhất",
    priceLowToHigh: "Giá: Thấp đến Cao",
    priceHighToLow: "Giá: Cao đến Thấp",
    nameAZ: "Tên: A-Z",
    clear: "Xóa",
    clearFilters: "Xóa Bộ Lọc",

    // Results
    services: "Dịch Vụ",
    resultsCount: "Tìm thấy {count} kết quả",
    noServicesFound: "Không tìm thấy dịch vụ nào",
    tryDifferentFilters:
      "Hãy thử các từ khóa tìm kiếm hoặc bộ lọc khác để tìm những gì bạn đang tìm kiếm.",

    // Error messages
    noData: "Không Có Dữ Liệu",
    unableToLoadServices:
      "Không thể tải dịch vụ vào lúc này. Vui lòng thử lại sau.",
    retry: "Thử Lại",
    errorLoading: "Lỗi Khi Tải Dữ Liệu",
    errorMessage: "Đã xảy ra sự cố khi tải dịch vụ. Vui lòng thử lại.",

    // Footer
    readyToStart: "Sẵn sàng bắt đầu?",
    findPerfectService: "Tìm dịch vụ hoàn hảo cho bạn ngay hôm nay",
    bookingDescription:
      "Đặt lịch hẹn ngay hôm nay và trải nghiệm các dịch vụ cao cấp với đội ngũ chuyên gia của chúng tôi.",
    bookNow: "Đặt Lịch Ngay",
    satisfiedCustomers: "Khách Hàng Hài Lòng",
    averageRating: "Đánh Giá Trung Bình",
    yearsExperience: "Năm Kinh Nghiệm",
  },

  // Category names
  Categories: {
    all: "Tất Cả Dịch Vụ",
    facialSurgery: "Phẫu Thuật Vùng Mặt",
    earSurgery: "Phẫu Thuật Tạo Hình Tai",
    breastSurgery: "Phẫu Thuật Ngực",
  },

  // Service card translations
  Services: {
    viewDetails: "Xem Chi Tiết",
    bookNow: "Đặt Lịch Ngay",
    startingFrom: "Bắt đầu từ",
    contact: "Liên Hệ",
    errorLoading: "Lỗi Khi Tải Dữ Liệu",
    errorMessage: "Đã xảy ra sự cố khi tải dịch vụ. Vui lòng thử lại.",
    retry: "Thử Lại",
  },
};
