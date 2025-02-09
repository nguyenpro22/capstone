import { Messages } from "./type";

const vi: Messages = {
  home: {
    header: "Tiêu đề",
    currentTheme: "Chủ đề hiện tại",
    primaryAction: "Hành động chính",
    secondaryAction: "Hành động phụ",
    mutedBackground: "Tắt nền",
    light: "Sáng",
    dark: "Tối",
    login: "Đăng nhập",
    register: "Đăng ký",
    logout: "Đăng xuất",
  },
  landing: {
    form: {
      Name: "Tên Phòng Khám",
      Email: "Email Phòng Khám",
      PhoneNumber: "Số Điện Thoại",
      Address: "Địa Chỉ",
      TaxCode: "Mã Số Thuế",
      BusinessLicense: "Chứng Nhận Kinh Doanh",
      OperatingLicense: "Giấy Phép Hoạt Động",
      OperatingLicenseExpiryDate: "Ngày Hết Hạn Giấy Phép Hoạt Động",
      ProfilePictureUrl: "Ảnh Đại Diện",
      title: "Đăng Ký Phòng Khám",
    },
    hero: {
      title: "Khám Phá Vẻ Đẹp Đích Thực Của Bạn",
      description:
        "Trải nghiệm dịch vụ làm đẹp và chăm sóc sức khỏe tuyệt vời tại Beautify Clinic. Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giúp bạn trở nên rạng rỡ và tự tin hơn.",
      cta: "Khám Phá Dịch Vụ Của Chúng Tôi",
    },
    services: {
      title: "Dịch Vụ Của Chúng Tôi",
      facial: {
        title: "Chăm Sóc Da Mặt",
        description:
          "Làm mới làn da của bạn với các liệu trình chăm sóc da mặt tiên tiến của chúng tôi.",
      },
      hair: {
        title: "Tạo Kiểu Tóc",
        description:
          "Có được phong cách hoàn hảo với dịch vụ tạo kiểu tóc chuyên nghiệp của chúng tôi.",
      },
      makeup: {
        title: "Dịch Vụ Trang Điểm",
        description:
          "Tôn vinh vẻ đẹp tự nhiên của bạn với dịch vụ trang điểm chuyên nghiệp.",
      },
    },
    livestream: {
      title: "Mẹo Làm Đẹp Trực Tiếp",
      cardTitle: "Xem Phiên Trực Tiếp Về Làm Đẹp",
      description:
        "Tham gia cùng chúng tôi để nhận mẹo làm đẹp, hướng dẫn và hỏi đáp trực tiếp với các chuyên gia làm đẹp.",
      cta: "Tham Gia Trò Chuyện",
    },
    testimonials: {
      title: "Khách Hàng Nói Gì Về Chúng Tôi",
      1: {
        name: "Sarah Johnson",
        content:
          "Tôi rất hài lòng với kết quả của liệu trình chăm sóc da mặt! Nhân viên rất thân thiện và chuyên nghiệp.",
      },
      2: {
        name: "Mike Thompson",
        content:
          "Dịch vụ tạo kiểu tóc thật tuyệt vời. Tôi chắc chắn sẽ quay lại!",
      },
      3: {
        name: "Emily Davis",
        content:
          "Chuyên viên trang điểm đã làm rất tốt vào ngày cưới của tôi. Tôi cảm thấy thật xinh đẹp và tự tin.",
      },
    },
    footer: {
      title: "Beautify Clinic",
      description: "Điểm đến lý tưởng cho sắc đẹp và sức khỏe của bạn.",
      address: "123 Đường Sắc Đẹp, Thành Phố X, Bang Y 12345",
      phone: "Điện thoại: (123) 456-7890",
      quickLinks: "Liên Kết Nhanh",
      services: "Dịch Vụ",
      livestream: "Trực Tiếp",
      testimonials: "Đánh Giá Khách Hàng",
      newsletter: "Bản Tin",
      newsletterDescription:
        "Cập nhật những ưu đãi và tin tức mới nhất từ chúng tôi.",
      emailPlaceholder: "Email của bạn",
      subscribe: "Đăng Ký",
      copyright: "© {year} Beautify Clinic. Mọi quyền được bảo lưu.",
    },
  },
  navbar: {
    home: "Trang chủ",
    about: "Giới thiệu",
    contact: "Liên hệ",
  },
  api: {
    auth: {
      login: {
        loginSuccess: "Đăng nhập thành công",
        loginError: "Đăng nhập thất bại",
        requiredEmail: "Email hoặc tên đăng nhập là bắt buộc",
        minPassword: "Mật khẩu phải có ít nhất 6 ký tự",
        maxPassword: "Mật khẩu không được vượt quá 50 ký tự",
        invalidEmail: "Email không hợp lệ",
      },
    },
  },
  dashboard: {
    totalUsers: "Tổng số người dùng",
    totalClinics: "Tổng số phòng khám",
    totalRevenue: "Tổng doanh thu",
    totalPending: "Tổng chờ xử lý",
    revenueDetails: "Chi tiết doanh thu",
    approvalHistory: "Lịch sử phê duyệt",
    clinicName: "Tên phòng khám",
    location: "Vị trí",
    dateTime: "Ngày - Giờ",
    piece: "Số lượng",
    amount: "Số tiền",
    status: "Trạng thái",
    accepted: "Chấp nhận",
    pending: "Đang chờ",
    upFromYesterday: "▲ {percent}% Tăng so với hôm qua",
    upFromLastWeek: "▲ {percent}% Tăng so với tuần trước",
    downFromYesterday: "▼ {percent}% Giảm so với hôm qua",
  },
  voucher: {
    voucherLists: "Danh sách Voucher",
    addNewVoucher: "Thêm Voucher mới",
    filterBy: "Lọc theo",
    voucherType: "Loại Voucher",
    voucherStatus: "Trạng thái Voucher",
    resetFilter: "Đặt lại bộ lọc",
    id: "ID",
    voucherCode: "Mã Voucher",
    validFrom: "Có hiệu lực từ",
    validTo: "Có hiệu lực đến",
    type: "Loại",
    status: "Trạng thái",
    completed: "Hoàn thành",
    processing: "Đang xử lý",
    rejected: "Bị từ chối",
    prevDate: "Ngày trước",
    nextDate: "Ngày sau",
    rowsPerPage: "Số dòng trên trang",
},

};

export default vi;
