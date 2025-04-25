import { Messages } from "../types";

export const livestreamMessages: Messages["livestreamMessages"] = {
  header: {
    title: "Phát Trực Tiếp Beautify",
  },
  loading: {
    text: "Đang tải phòng phát trực tiếp...",
  },
  error: {
    title: "Không có luồng nào đang phát trực tiếp",
    noStreams: "Không có phát trực tiếp nào đang hoạt động",
    retry: "Thử Lại",
  },
  noLivestreams: {
    title: "Không Có Phát Trực Tiếp Nào",
    description:
      "Hiện tại không có phát trực tiếp nào. Vui lòng quay lại sau để xem các buổi làm đẹp thú vị từ các chuyên gia của chúng tôi.",
    refresh: "Làm Mới",
  },
  preview: {
    title: "Xem trước:",
    viewers: "{count} người xem",
    joinRoom: "Tham Gia Phòng",
    live: "TRỰC TIẾP",
    otherStreams: "Phát Trực Tiếp Khác",
    noOtherStreams: "Không Có Phát Trực Tiếp Khác",
    noOtherStreamsDesc: "Không có phát trực tiếp bổ sung nào.",
    preview: "Xem Trước",
    join: "Tham Gia",
  },
  streamCard: {
    live: "TRỰC TIẾP",
    viewers: "người xem",
    timeAgo: {
      seconds: "{count} giây trước",
      minutes: "{count} phút trước",
      hours: "{count} giờ trước",
      days: "{count} ngày trước",
    },
  },
  allStreams: {
    title: "Tất Cả Phát Trực Tiếp",
  },
  footer: {
    copyright: "© {year} Beautify. Đã đăng ký bản quyền.",
    terms: "Điều Khoản Dịch Vụ",
    privacy: "Chính Sách Bảo Mật",
    contact: "Liên Hệ",
  },
};
