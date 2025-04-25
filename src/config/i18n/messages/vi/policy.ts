import { Messages } from "../types";

export const policy: Messages["policyMessages"] = {
  metadata: {
    title: "Chính sách | Nền tảng Dịch vụ Làm đẹp",
    description:
      "Chính sách nền tảng của chúng tôi để kết nối khách hàng và phòng khám thẩm mỹ",
  },
  header: {
    title: "Chính sách Nền tảng",
    subtitle:
      "Cam kết của chúng tôi về tính minh bạch, an toàn và chất lượng dịch vụ",
  },
  navigation: {
    tableOfContents: "Mục lục",
    backToTop: "Trở lại đầu trang",
    needHelp: {
      title: "Cần trợ giúp?",
      description:
        "Nếu bạn có thắc mắc về chính sách của chúng tôi, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ.",
      contactButton: "Liên hệ Hỗ trợ",
    },
    quickNavigation: "Điều hướng nhanh",
    sections: {
      privacy: "Chính sách Bảo mật",
      terms: "Điều khoản Dịch vụ",
      guidelines: "Hướng dẫn Người dùng",
      standards: "Tiêu chuẩn Phòng khám",
      disputes: "Giải quyết Tranh chấp",
      safety: "An toàn & Bảo mật",
    },
  },
  introduction: {
    welcome:
      "Chào mừng đến với trung tâm chính sách của nền tảng chúng tôi. Những chính sách này quy định việc sử dụng nền tảng dịch vụ làm đẹp của chúng tôi, kết nối khách hàng với các phòng khám thẩm mỹ. Chúng tôi đã thiết kế các chính sách này để đảm bảo trải nghiệm an toàn, minh bạch và chất lượng cao cho tất cả người dùng. Vui lòng dành thời gian làm quen với những hướng dẫn quan trọng này.",
    lastUpdated: "Cập nhật lần cuối:",
    date: "Ngày 19 tháng 4 năm 2025. Các chính sách này được xem xét và cập nhật thường xuyên để đảm bảo tuân thủ các quy định và thông lệ tốt nhất.",
  },
  privacyPolicy: {
    title: "Chính sách Bảo mật",
    introduction:
      "Nền tảng của chúng tôi cam kết bảo vệ quyền riêng tư của bạn và đảm bảo an toàn thông tin cá nhân của bạn. Chính sách Bảo mật này nêu rõ cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ dữ liệu của bạn khi bạn sử dụng nền tảng dịch vụ làm đẹp của chúng tôi.",
    informationWeCollect: {
      title: "Thông tin Chúng tôi Thu thập",
      introduction:
        "Chúng tôi thu thập thông tin mà bạn cung cấp trực tiếp cho chúng tôi, bao gồm:",
      items: {
        personal:
          "Thông tin nhận dạng cá nhân (tên, địa chỉ email, số điện thoại)",
        profile: "Thông tin hồ sơ (ảnh hồ sơ, sở thích làm đẹp)",
        payment:
          "Thông tin thanh toán (được xử lý thông qua các bên xử lý thanh toán an toàn)",
        communication:
          "Dữ liệu giao tiếp (tin nhắn giữa khách hàng và phòng khám)",
        serviceHistory: "Lịch sử dịch vụ và chi tiết cuộc hẹn",
      },
      priorityNote:
        "Chúng tôi ưu tiên giảm thiểu dữ liệu và chỉ thu thập thông tin cần thiết để cung cấp dịch vụ của chúng tôi.",
    },
    howWeUse: {
      title: "Cách Chúng tôi Sử dụng Thông tin của Bạn",
      introduction: "Chúng tôi sử dụng thông tin thu thập được để:",
      items: [
        "Cung cấp, duy trì và cải thiện dịch vụ nền tảng của chúng tôi",
        "Xử lý giao dịch và gửi thông tin liên quan",
        "Kết nối khách hàng với các phòng khám thẩm mỹ phù hợp",
        "Gửi thông báo, cập nhật và tin nhắn hỗ trợ",
        "Cá nhân hóa trải nghiệm của bạn và cung cấp nội dung phù hợp",
      ],
    },
    dataSharing: {
      title: "Chia sẻ và Tiết lộ Dữ liệu",
      content:
        "Chúng tôi có thể chia sẻ thông tin của bạn với các phòng khám thẩm mỹ mà bạn chọn kết nối thông qua nền tảng của chúng tôi. Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi có thể chia sẻ dữ liệu với các nhà cung cấp dịch vụ giúp chúng tôi vận hành nền tảng, luôn theo các thỏa thuận bảo mật nghiêm ngặt.",
    },
    yourRights: {
      title: "Quyền và Lựa chọn của Bạn",
      content:
        "Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Bạn có thể quản lý tùy chọn giao tiếp và từ chối nhận thông tin tiếp thị bất cứ lúc nào.",
      importantRights: {
        title: "Quyền Bảo mật Quan trọng:",
        access:
          "Quyền Truy cập: Bạn có thể yêu cầu bản sao dữ liệu cá nhân của mình",
        rectification:
          "Quyền Chỉnh sửa: Bạn có thể sửa thông tin không chính xác",
        erasure: "Quyền Xóa: Bạn có thể yêu cầu xóa dữ liệu của mình",
        restrictProcessing:
          "Quyền Hạn chế Xử lý: Bạn có thể giới hạn cách chúng tôi sử dụng dữ liệu của bạn",
      },
    },
  },
  termsOfService: {
    title: "Điều khoản Dịch vụ",
    introduction:
      "Các Điều khoản Dịch vụ này quy định việc bạn sử dụng nền tảng dịch vụ làm đẹp của chúng tôi. Bằng cách truy cập hoặc sử dụng nền tảng của chúng tôi, bạn đồng ý bị ràng buộc bởi các điều khoản này.",
    importantNote:
      "Quan trọng: Bằng cách sử dụng nền tảng của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này.",
    platformDescription: {
      title: "Mô tả Nền tảng",
      content:
        "Nền tảng của chúng tôi kết nối khách hàng tìm kiếm dịch vụ thẩm mỹ với các phòng khám đủ điều kiện. Chúng tôi tạo điều kiện cho việc khám phá, đặt lịch và quản lý dịch vụ làm đẹp nhưng không chịu trách nhiệm trực tiếp về các dịch vụ do phòng khám cung cấp.",
    },
    userAccounts: {
      title: "Tài khoản Người dùng",
      content:
        "Bạn phải tạo tài khoản để sử dụng một số tính năng nhất định của nền tảng chúng tôi. Bạn chịu trách nhiệm duy trì tính bảo mật của thông tin đăng nhập tài khoản của bạn và cho tất cả các hoạt động xảy ra dưới tài khoản của bạn.",
    },
    usage: {
      acceptable: {
        title: "Sử dụng Được chấp nhận",
        items: [
          "Cung cấp thông tin chính xác",
          "Tôn trọng người dùng khác",
          "Tuân thủ quy trình đặt lịch",
          "Duy trì bảo mật tài khoản",
        ],
      },
      prohibited: {
        title: "Hoạt động Bị cấm",
        items: [
          "Tạo tài khoản giả mạo",
          "Chia sẻ thông tin đăng nhập tài khoản",
          "Cố gắng truy cập trái phép",
          "Giả mạo danh tính",
        ],
      },
    },
    bookingsAndPayments: {
      title: "Đặt lịch và Thanh toán Dịch vụ",
      content:
        "Khi bạn đặt dịch vụ thông qua nền tảng của chúng tôi, bạn tham gia vào thỏa thuận trực tiếp với phòng khám. Điều khoản thanh toán, chính sách hủy và chi tiết dịch vụ được thiết lập bởi từng phòng khám và nên được xem xét trước khi đặt lịch.",
    },
    intellectualProperty: {
      title: "Sở hữu Trí tuệ",
      content:
        "Tất cả nội dung, tính năng và chức năng của nền tảng chúng tôi, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo và phần mềm, thuộc sở hữu của công ty chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ.",
    },
    limitationOfLiability: {
      title: "Giới hạn Trách nhiệm",
      content:
        "Chúng tôi cố gắng cung cấp nền tảng đáng tin cậy nhưng không thể đảm bảo truy cập không bị gián đoạn hoặc độ chính xác của thông tin do phòng khám cung cấp. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc bạn sử dụng, hoặc không thể sử dụng, nền tảng của chúng tôi.",
    },
  },
  userGuidelines: {
    title: "Hướng dẫn Người dùng",
    introduction:
      "Hướng dẫn người dùng của chúng tôi được thiết kế để đảm bảo trải nghiệm tích cực, tôn trọng và an toàn cho tất cả người dùng nền tảng. Tuân thủ các hướng dẫn này là điều cần thiết để duy trì tính toàn vẹn của cộng đồng chúng tôi.",
    communityValues: {
      title: "Giá trị Cộng đồng",
      content:
        "Nền tảng của chúng tôi được xây dựng trên sự tin tưởng, tôn trọng và chuyên nghiệp. Chúng tôi mong đợi tất cả người dùng duy trì các giá trị này trong mọi tương tác.",
    },
    clientResponsibilities: {
      title: "Trách nhiệm của Khách hàng",
      items: [
        "Cung cấp thông tin cá nhân chính xác",
        "Tham dự các cuộc hẹn đã lên lịch hoặc hủy trong thời gian hủy của phòng khám",
        "Giao tiếp tôn trọng với phòng khám",
        "Cung cấp phản hồi trung thực và mang tính xây dựng",
        "Báo cáo mọi lo ngại hoặc vấn đề kịp thời",
      ],
    },
    clinicResponsibilities: {
      title: "Trách nhiệm của Phòng khám",
      items: [
        "Duy trì danh sách dịch vụ và tình trạng sẵn có chính xác",
        "Cung cấp dịch vụ như đã mô tả",
        "Duy trì giấy phép và trình độ chuyên môn phù hợp",
        "Phản hồi các yêu cầu của khách hàng kịp thời",
        "Xử lý thông tin khách hàng với tính bảo mật",
      ],
    },
    prohibitedActivities: {
      title: "Hoạt động Bị cấm",
      introduction:
        "Các hoạt động sau đây bị nghiêm cấm trên nền tảng của chúng tôi:",
      items: [
        "Quấy rối hoặc hành vi phân biệt đối xử dưới bất kỳ hình thức nào",
        "Hoạt động gian lận hoặc xuyên tạc về chứng chỉ hoặc dịch vụ",
        "Chia sẻ nội dung không phù hợp hoặc gây khó chịu",
        "Tạo nhiều tài khoản cho mục đích lừa đảo",
        "Bất kỳ hoạt động bất hợp pháp hoặc quảng bá dịch vụ bất hợp pháp",
      ],
    },
    violationNote:
      "Vi phạm các hướng dẫn này có thể dẫn đến việc tạm ngưng hoặc chấm dứt tài khoản. Chúng tôi thường xuyên xem xét hoạt động của người dùng để đảm bảo tuân thủ các tiêu chuẩn cộng đồng của chúng tôi.",
  },
  clinicStandards: {
    title: "Tiêu chuẩn Phòng khám",
    introduction:
      "Chúng tôi duy trì tiêu chuẩn cao cho các phòng khám thẩm mỹ trên nền tảng của chúng tôi để đảm bảo chất lượng, an toàn và tính chuyên nghiệp. Tất cả phòng khám phải đáp ứng các tiêu chuẩn này để tham gia vào mạng lưới của chúng tôi.",
    qualityAssurance: {
      title: "Đảm bảo Chất lượng",
      content:
        "Mỗi phòng khám trên nền tảng của chúng tôi đều trải qua quá trình xác minh kỹ lưỡng trước khi được phê duyệt. Chúng tôi liên tục giám sát chất lượng dịch vụ thông qua phản hồi của khách hàng và đánh giá thường xuyên.",
    },
    qualificationRequirements: {
      title: "Yêu cầu về Trình độ",
      introduction: "Tất cả phòng khám trên nền tảng của chúng tôi phải:",
      items: [
        "Có giấy phép và giấy tờ hợp lệ theo quy định địa phương",
        "Thuê chuyên gia có trình độ với chứng chỉ phù hợp",
        "Duy trì bảo hiểm đầy đủ",
        "Chứng minh lịch sử thực hành an toàn",
      ],
    },
    facilityStandards: {
      title: "Tiêu chuẩn Cơ sở",
      introduction: "Phòng khám phải duy trì cơ sở:",
      items: {
        regulations: "Đáp ứng quy định về sức khỏe và an toàn",
        equipment: "Sử dụng thiết bị và sản phẩm được phê duyệt",
        sanitation: "Thực hiện quy trình vệ sinh đúng cách",
        environment: "Cung cấp môi trường thoải mái và dễ tiếp cận",
      },
    },
    serviceQuality: {
      title: "Chất lượng Dịch vụ",
      introduction: "Chúng tôi mong đợi phòng khám:",
      items: [
        "Cung cấp mô tả chính xác về dịch vụ",
        "Cung cấp chất lượng chăm sóc nhất quán",
        "Tiến hành tư vấn kỹ lưỡng trước khi điều trị",
        "Cung cấp hướng dẫn chăm sóc sau phù hợp",
        "Duy trì đánh giá hài lòng khách hàng cao",
      ],
    },
    verificationProcess: {
      title: "Quy trình Xác minh",
      content:
        "Tất cả phòng khám đều trải qua quy trình xác minh trước khi tham gia nền tảng của chúng tôi, bao gồm xem xét tài liệu, kiểm tra lý lịch và có thể kiểm tra trực tiếp. Chúng tôi cũng tiến hành đánh giá định kỳ để đảm bảo tuân thủ liên tục.",
    },
  },
  disputeResolution: {
    title: "Giải quyết Tranh chấp",
    introduction:
      "Chúng tôi hiểu rằng bất đồng có thể phát sinh giữa khách hàng và phòng khám. Quy trình giải quyết tranh chấp của chúng tôi được thiết kế để giải quyết các vấn đề một cách công bằng và hiệu quả.",
    commitment: {
      title: "Cam kết của Chúng tôi",
      content:
        "Chúng tôi cam kết giải quyết tranh chấp công bằng và minh bạch. Mục tiêu của chúng tôi là đảm bảo cả khách hàng và phòng khám đều được đối xử công bằng và tất cả các vấn đề được giải quyết kịp thời.",
    },
    reportingDispute: {
      title: "Báo cáo Tranh chấp",
      introduction: "Nếu bạn gặp vấn đề với dịch vụ hoặc người dùng, bạn nên:",
      steps: [
        "Trước tiên cố gắng giải quyết vấn đề trực tiếp với bên kia",
        "Nếu không thành công, báo cáo vấn đề thông qua hệ thống hỗ trợ của nền tảng chúng tôi",
        "Cung cấp tất cả chi tiết liên quan, bao gồm ngày tháng, giao tiếp và các vấn đề cụ thể",
        "Gửi bất kỳ tài liệu hỗ trợ hoặc bằng chứng",
      ],
    },
    resolutionProcess: {
      title: "Quy trình Giải quyết",
      introduction:
        "Quy trình giải quyết tranh chấp của chúng tôi thường theo các bước sau:",
      steps: {
        initialReview: {
          title: "Đánh giá Ban đầu",
          description:
            "Đội hỗ trợ của chúng tôi xem xét vấn đề được báo cáo và xác định các bước tiếp theo phù hợp.",
        },
        informationGathering: {
          title: "Thu thập Thông tin",
          description:
            "Chúng tôi thu thập thông tin từ tất cả các bên liên quan để hiểu đầy đủ bối cảnh của tranh chấp.",
        },
        mediation: {
          title: "Hòa giải",
          description:
            "Chúng tôi tạo điều kiện giao tiếp giữa các bên để đạt được giải pháp được cả hai bên chấp nhận.",
        },
        finalDetermination: {
          title: "Quyết định Cuối cùng",
          description:
            "Nếu cần thiết, chúng tôi đưa ra quyết định cuối cùng dựa trên chính sách của chúng tôi và bằng chứng được cung cấp.",
        },
      },
    },
    refundsAndCompensation: {
      title: "Hoàn tiền và Bồi thường",
      content:
        "Chính sách hoàn tiền được thiết lập bởi từng phòng khám và nên được xem xét trước khi đặt lịch. Trong trường hợp phòng khám rõ ràng vi phạm chính sách của chúng tôi hoặc không cung cấp dịch vụ đã thỏa thuận, chúng tôi có thể tạo điều kiện hoàn tiền hoặc các biện pháp khắc phục phù hợp khác.",
    },
    appeals: {
      title: "Kháng nghị",
      content:
        "Nếu bạn không đồng ý với kết quả giải quyết tranh chấp, bạn có thể gửi kháng nghị để được xem xét bởi thành viên cấp cao trong đội ngũ của chúng tôi. Kháng nghị phải được gửi trong vòng 14 ngày kể từ quyết định ban đầu.",
    },
  },
  safetyAndSecurity: {
    title: "An toàn & Bảo mật",
    introduction:
      "An toàn và bảo mật của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi thực hiện nhiều biện pháp để bảo vệ người dùng và duy trì tính toàn vẹn của nền tảng chúng tôi.",
    importantNotice:
      "Thông báo An toàn Quan trọng: Trong trường hợp khẩn cấp y tế liên quan đến điều trị, hãy tìm kiếm sự chăm sóc y tế ngay lập tức trước, sau đó báo cáo sự cố cho đội hỗ trợ của chúng tôi.",
    dataSecurity: {
      title: "Bảo mật Dữ liệu",
      introduction: "Chúng tôi bảo vệ dữ liệu của bạn thông qua:",
      items: [
        "Mã hóa thông tin nhạy cảm",
        "Xử lý thanh toán an toàn",
        "Kiểm tra và cập nhật bảo mật thường xuyên",
        "Kiểm soát truy cập nghiêm ngặt cho nhân viên của chúng tôi",
        "Tuân thủ quy định bảo vệ dữ liệu",
      ],
    },
    userVerification: {
      title: "Xác minh Người dùng",
      content:
        "Chúng tôi thực hiện quy trình xác minh cho cả khách hàng và phòng khám để giảm nguy cơ hoạt động gian lận và đảm bảo tính xác thực của người dùng nền tảng.",
    },
    treatmentSafety: {
      title: "An toàn Điều trị",
      content:
        "Mặc dù chúng tôi không thể đảm bảo an toàn cho mọi điều trị, chúng tôi yêu cầu phòng khám tuân theo thông lệ tốt nhất trong ngành, duy trì trình độ chuyên môn phù hợp và cung cấp tư vấn thích hợp trước khi thực hiện thủ thuật.",
    },
    measures: {
      safetyMeasures: {
        title: "Biện pháp An toàn",
        items: [
          "Quy trình xác minh phòng khám",
          "Kiểm tra trình độ chuyên môn",
          "Kiểm tra an toàn thường xuyên",
          "Giám sát phản hồi của khách hàng",
        ],
      },
      clientResources: {
        title: "Tài nguyên cho Khách hàng",
        items: [
          "Hướng dẫn an toàn điều trị",
          "Danh sách kiểm tra trước điều trị",
          "Hướng dẫn chăm sóc sau",
          "Thông tin liên hệ khẩn cấp",
        ],
      },
    },
    reportingConcerns: {
      title: "Báo cáo Vấn đề An toàn",
      content:
        "Nếu bạn gặp bất kỳ vấn đề an toàn hoặc hoạt động đáng ngờ nào trên nền tảng của chúng tôi, vui lòng báo cáo ngay lập tức thông qua hệ thống hỗ trợ của chúng tôi. Chúng tôi điều tra tất cả các báo cáo kịp thời và thực hiện hành động thích hợp để duy trì môi trường an toàn.",
      howToReport: {
        title: "Cách Báo cáo Vấn đề An toàn:",
        steps: [
          'Sử dụng nút "Báo cáo" trên trang hồ sơ phòng khám hoặc trang dịch vụ',
          "Liên hệ với đội hỗ trợ của chúng tôi thông qua Trung tâm Trợ giúp",
          "Gửi email cho chúng tôi tại safety@beautyplatform.com",
          "Đối với trường hợp khẩn cấp, sử dụng tính năng liên hệ khẩn cấp trong ứng dụng của chúng tôi",
        ],
      },
    },
  },
  downloadDocuments: {
    title: "Tải xuống Tài liệu Chính sách",
    documents: {
      privacy: "Chính sách Bảo mật",
      terms: "Điều khoản Dịch vụ",
      guidelines: "Hướng dẫn Người dùng",
      standards: "Tiêu chuẩn Phòng khám",
      disputes: "Giải quyết Tranh chấp",
      safety: "An toàn & Bảo mật",
    },
  },
  footer: {
    lastUpdated: "Cập nhật lần cuối:",
    date: "Ngày 19 tháng 4 năm 2025. Đối với câu hỏi về chính sách của chúng tôi, vui lòng",
    contactUs: "liên hệ với chúng tôi",
    links: {
      terms: "Điều khoản",
      privacy: "Quyền riêng tư",
      cookies: "Cookie",
      legal: "Pháp lý",
    },
  },
};
