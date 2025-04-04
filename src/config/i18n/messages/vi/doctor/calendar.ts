import { Messages } from "../../types";

export const calendar: Messages["doctorCalendar"] = {
  title: "Lịch",
  subtitle: "Quản lý lịch trình và cuộc hẹn của bạn",
  calendar: {
    title: "Lịch",
    appointmentTypes: "Loại Cuộc Hẹn",
    consultation: "Tư Vấn",
    treatment: "Điều Trị",
    followUp: "Tái Khám",
  },
  navigation: {
    today: "Hôm Nay",
  },
  views: {
    day: "Ngày",
    week: "Tuần",
    month: "Tháng",
  },
  filter: {
    byStatus: "Lọc theo trạng thái",
    all: "Tất Cả",
    confirmed: "Đã Xác Nhận",
    pending: "Đang Chờ",
    completed: "Đã Hoàn Thành",
    cancelled: "Đã Hủy",
  },
  schedule: {
    available: "Còn Trống",
    details: "Chi Tiết",
    more: "+{number} khác",
  },
};
