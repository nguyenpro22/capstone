import { Messages } from "../types";

export const livestreamRoomMessages: Messages["livestreamRoomMessages"] = {
  header: {
    viewers: "{count} người xem",
  },
  connection: {
    connecting: "Đang kết nối đến phát trực tiếp...",
    status: "Trạng thái: {status}",
    error: {
      title: "Lỗi Kết Nối",
      message: "Không thể kết nối đến phát trực tiếp. Vui lòng thử lại sau.",
      security: {
        title: "Lỗi Bảo Mật",
        message: "Kết nối bị chặn vì máy chủ API không sử dụng HTTPS.",
      },
      backButton: "Quay Lại Danh Sách",
    },
  },
  livestreamInfo: {
    startedAt: "Bắt đầu: {date}",
    name: "Tên phát trực tiếp: {name}",
    clinic: "Phòng khám: {clinic}",
    description: "Mô tả: {description}",
  },
  chat: {
    title: "Trò Chuyện Trực Tiếp",
    noMessages: {
      title: "Chưa có tin nhắn",
      subtitle: "Hãy là người đầu tiên gửi tin nhắn!",
    },
    input: {
      placeholder: "Nhập tin nhắn của bạn...",
    },
    sender: "Khách",
    reactions: {
      title: "Phản Ứng Nhanh:",
      types: {
        thumbsUp: "Tuyệt vời!",
        heart: "Yêu thích!",
        fire: "Bùng nổ!",
        amazing: "Tuyệt đỉnh!",
        beautiful: "Đẹp quá!",
      },
    },
  },
  services: {
    hidden: {
      title: "Dịch Vụ Đã Ẩn",
      restoreAll: "Khôi Phục Tất Cả",
      show: "Hiện dịch vụ đã ẩn",
      hide: "Ẩn dịch vụ đã ẩn",
      count: "({count})",
    },
    actions: {
      hide: "Ẩn dịch vụ này",
      restore: "Khôi phục dịch vụ",
      book: "Đặt Ngay",
    },
    price: {
      range: "Khoảng giá: {min} - {max}",
      from: "Từ",
    },
    discount: "-{percent}%",
  },
};
