import { Messages } from "../types";

export const homeMessages: Messages["home"] = {
  meta: {
    title: "Trung Tâm Thẩm Mỹ",
    description:
      "Trung tâm thẩm mỹ cao cấp chuyên nâng cao vẻ đẹp tự nhiên của bạn",
  },
  hero: {
    badge: "Trung Tâm Thẩm Mỹ & Làm Đẹp Cao Cấp",
    title: "Khám Phá Vẻ Đẹp Tự Nhiên Của Bạn",
    description:
      "Trải nghiệm các liệu pháp thẩm mỹ cao cấp được thiết kế riêng để nâng cao vẻ đẹp độc đáo của bạn, được thực hiện bởi các chuyên gia trong môi trường sang trọng.",
    buttons: {
      bookConsultation: "Đặt Lịch Tư Vấn",
      exploreServices: "Khám Phá Dịch Vụ",
    },
    stats: [
      { number: "15+", label: "Năm Kinh Nghiệm" },
      { number: "10k+", label: "Khách Hàng Hài Lòng" },
      { number: "30+", label: "Bác Sĩ Chuyên Gia" },
    ],
    cards: {
      rating: {
        title: "Dịch Vụ Xuất Sắc",
        subtitle: "Đánh Giá 5.0",
      },
      experts: {
        title: "Chuyên Gia Được Chứng Nhận",
        subtitle: "Đội Ngũ Chuyên Nghiệp",
      },
    },
  },
  services: {
    badge: "Dịch Vụ Của Chúng Tôi",
    title: "Các Liệu Pháp Làm Đẹp Cao Cấp",
    description:
      "Khám phá các liệu pháp cao cấp của chúng tôi được thiết kế để nâng cao vẻ đẹp tự nhiên của bạn",
    items: [
      {
        title: "Điều Trị Da Mặt",
        description:
          "Giải pháp chăm sóc da tiên tiến cho làn da rạng rỡ, trẻ trung",
        price: "Từ 199$",
      },
      {
        title: "Tạo Hình Cơ Thể",
        description:
          "Điêu khắc và định hình cơ thể với các liệu pháp không xâm lấn",
        price: "Từ 299$",
      },
      {
        title: "Liệu Pháp Laser",
        description: "Điều trị laser hiện đại cho làn da hoàn hảo",
        price: "Từ 249$",
      },
    ],
    learnMore: "Tìm Hiểu Thêm",
  },
  whyChooseUs: {
    badge: "Tại Sao Chọn Chúng Tôi",
    title: "Nâng Cao Trải Nghiệm Làm Đẹp Của Bạn",
    experience: {
      years: "15+",
      title: "Năm Xuất Sắc",
      description:
        "Cung cấp dịch vụ làm đẹp cao cấp với chất lượng và đổi mới nhất quán",
    },
    reasons: [
      {
        title: "Chuyên Gia Hàng Đầu",
        description:
          "Đội ngũ của chúng tôi bao gồm các chuyên gia được chứng nhận với nhiều năm kinh nghiệm trong điều trị thẩm mỹ",
      },
      {
        title: "Công Nghệ Tiên Tiến",
        description:
          "Chúng tôi đầu tư vào thiết bị và kỹ thuật mới nhất để mang lại kết quả vượt trội",
      },
      {
        title: "Phương Pháp Cá Nhân Hóa",
        description:
          "Mỗi liệu pháp được điều chỉnh theo nhu cầu và mục tiêu làm đẹp độc đáo của bạn",
      },
      {
        title: "Môi Trường Sang Trọng",
        description:
          "Trải nghiệm các liệu pháp trong không gian thanh bình, giống như spa được thiết kế cho sự thoải mái của bạn",
      },
    ],
    learnMore: "Tìm Hiểu Về Phương Pháp Của Chúng Tôi",
  },
  testimonials: {
    badge: "Đánh Giá Của Khách Hàng",
    title: "Khách Hàng Nói Gì Về Chúng Tôi",
    description:
      "Lắng nghe từ các khách hàng hài lòng về trải nghiệm chuyển đổi của họ",
    items: [
      {
        name: "Sophia Anderson",
        treatment: "Trẻ Hóa Da Mặt",
        quote:
          "Liệu pháp điều trị da mặt đã hoàn toàn thay đổi làn da của tôi. Tôi chưa bao giờ nhận được nhiều lời khen về làn da của mình như vậy!",
      },
      {
        name: "Emma Thompson",
        treatment: "Tạo Hình Cơ Thể",
        quote:
          "Sau chỉ ba buổi điều trị, tôi đã thấy kết quả đáng kinh ngạc. Nhân viên rất chuyên nghiệp và khiến tôi cảm thấy thoải mái trong suốt quá trình.",
      },
      {
        name: "Michael Roberts",
        treatment: "Triệt Lông Bằng Laser",
        quote:
          "Ban đầu tôi còn do dự, nhưng đội ngũ rất am hiểu và kết quả vượt quá mong đợi của tôi. Rất đáng để thử!",
      },
    ],
  },
  gallery: {
    badge: "Thư Viện Chuyển Đổi",
    title: "Kết Quả Thực, Người Thực",
    description:
      "Xem các kết quả chuyển đổi mà khách hàng của chúng tôi đã trải nghiệm",
    tabs: {
      facial: "Điều Trị Da Mặt",
      body: "Tạo Hình Cơ Thể",
      skin: "Trẻ Hóa Da",
    },
    labels: {
      before: "Trước",
      after: "Sau",
    },
    items: {
      facial: [
        { title: "Trẻ Hóa Da Mặt", sessions: "Sau 3 buổi" },
        { title: "Trẻ Hóa Da Mặt", sessions: "Sau 3 buổi" },
        { title: "Trẻ Hóa Da Mặt", sessions: "Sau 3 buổi" },
      ],
      body: [
        { title: "Tạo Hình Cơ Thể", sessions: "Sau 5 buổi" },
        { title: "Tạo Hình Cơ Thể", sessions: "Sau 5 buổi" },
        { title: "Tạo Hình Cơ Thể", sessions: "Sau 5 buổi" },
      ],
      skin: [
        { title: "Trẻ Hóa Da", sessions: "Sau 4 buổi" },
        { title: "Trẻ Hóa Da", sessions: "Sau 4 buổi" },
        { title: "Trẻ Hóa Da", sessions: "Sau 4 buổi" },
      ],
    },
  },
  experts: {
    badge: "Đội Ngũ Của Chúng Tôi",
    title: "Gặp Gỡ Các Chuyên Gia Của Chúng Tôi",
    description:
      "Đội ngũ chuyên gia được chứng nhận của chúng tôi luôn tận tâm cung cấp dịch vụ chăm sóc đặc biệt cho bạn",
    team: [
      {
        name: "Bác sĩ Sarah Johnson",
        role: "Giám Đốc Y Khoa",
        specialties: ["Thẩm Mỹ Khuôn Mặt", "Tiêm Chất Làm Đầy"],
      },
      {
        name: "Bác sĩ David Chen",
        role: "Bác Sĩ Thẩm Mỹ",
        specialties: ["Liệu Pháp Laser", "Trẻ Hóa Da"],
      },
      {
        name: "Emily Williams",
        role: "Chuyên Viên Thẩm Mỹ Cao Cấp",
        specialties: ["Điều Trị Da Mặt Nâng Cao", "Peel Hóa Học"],
      },
      {
        name: "Jessica Martinez",
        role: "Chuyên Gia Cơ Thể",
        specialties: ["Tạo Hình Cơ Thể", "Điều Trị Mô Mỡ"],
      },
    ],
    specialtiesLabel: "Chuyên môn:",
  },
  offers: {
    badge: "Thời Gian Có Hạn",
    title: "Ưu Đãi & Gói Dịch Vụ Đặc Biệt",
    description:
      "Tận dụng các chương trình khuyến mãi độc quyền và tiết kiệm cho các liệu pháp cao cấp",
    newClient: {
      discount: "GIẢM 30%",
      title: "Ưu Đãi Khách Hàng Mới",
      description:
        "Khách hàng lần đầu nhận giảm giá 30% cho bất kỳ liệu pháp điều trị da mặt nào bạn chọn",
      features: [
        "Áp dụng cho tất cả các liệu pháp điều trị da mặt",
        "Bao gồm tư vấn da",
        "Hết hạn trong 30 ngày",
      ],
      button: "Đặt Lịch Ngay",
    },
    summerPackage: {
      discount: "TIẾT KIỆM 25%",
      title: "Gói Rạng Rỡ Mùa Hè",
      description:
        "Chuẩn bị cho mùa hè với gói đặc biệt của chúng tôi được thiết kế cho làn da rạng rỡ",
      features: [
        "3 Liệu pháp điều trị da mặt",
        "1 Buổi tạo hình cơ thể",
        "Bộ sản phẩm chăm sóc da miễn phí",
      ],
      button: "Tìm Hiểu Thêm",
    },
  },
  contact: {
    badge: "Liên Hệ",
    title: "Đặt Lịch Tư Vấn",
    description:
      "Lên lịch tư vấn với các chuyên gia của chúng tôi để thảo luận về mục tiêu làm đẹp của bạn và tạo kế hoạch điều trị cá nhân hóa.",
    info: {
      visit: {
        title: "Ghé Thăm",
        content: "123 Beauty Lane, Suite 100, New York, NY 10001",
      },
      call: {
        title: "Gọi Cho Chúng Tôi",
        content: "(555) 123-4567",
      },
      email: {
        title: "Email",
        content: "info@beautyaesthetic.com",
      },
      hours: {
        title: "Giờ Mở Cửa",
        weekdays: "Thứ Hai - Thứ Bảy: 9:00 - 19:00",
        weekend: "Chủ Nhật: Đóng Cửa",
      },
    },
    form: {
      title: "Yêu Cầu Cuộc Hẹn",
      fields: {
        firstName: "Tên",
        firstNamePlaceholder: "Nhập tên của bạn",
        lastName: "Họ",
        lastNamePlaceholder: "Nhập họ của bạn",
        email: "Email",
        emailPlaceholder: "Nhập email của bạn",
        phone: "Điện Thoại",
        phonePlaceholder: "Nhập số điện thoại của bạn",
        service: "Dịch Vụ Quan Tâm",
        servicePlaceholder: "Chọn một dịch vụ",
        serviceOptions: {
          facial: "Điều Trị Da Mặt",
          body: "Tạo Hình Cơ Thể",
          laser: "Liệu Pháp Laser",
          skin: "Trẻ Hóa Da",
        },
        message: "Tin Nhắn (Tùy Chọn)",
        messagePlaceholder:
          "Cho chúng tôi biết thêm về những gì bạn đang tìm kiếm",
      },
      button: "Yêu Cầu Cuộc Hẹn",
    },
  },
  footer: {
    about: {
      title: "Trung Tâm Thẩm Mỹ",
      description:
        "Trung tâm thẩm mỹ cao cấp chuyên nâng cao vẻ đẹp tự nhiên của bạn với các liệu pháp tiên tiến.",
    },
    quickLinks: {
      title: "Liên Kết Nhanh",
      links: [
        { label: "Trang Chủ", href: "#" },
        { label: "Về Chúng Tôi", href: "#" },
        { label: "Dịch Vụ", href: "#" },
        { label: "Thư Viện", href: "#" },
        { label: "Liên Hệ", href: "#" },
      ],
    },
    services: {
      title: "Dịch Vụ",
      links: [
        { label: "Điều Trị Da Mặt", href: "#" },
        { label: "Tạo Hình Cơ Thể", href: "#" },
        { label: "Liệu Pháp Laser", href: "#" },
        { label: "Trẻ Hóa Da", href: "#" },
        { label: "Giải Pháp Chống Lão Hóa", href: "#" },
      ],
    },
    newsletter: {
      title: "Bản Tin",
      description:
        "Đăng ký nhận bản tin của chúng tôi để nhận các ưu đãi độc quyền và mẹo làm đẹp.",
      placeholder: "Email của bạn",
      button: "Đăng Ký",
    },
    copyright: "© {year} Trung Tâm Thẩm Mỹ. Đã đăng ký bản quyền.",
  },
};
