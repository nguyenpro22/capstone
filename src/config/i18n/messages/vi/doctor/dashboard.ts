import { Messages } from "../../types";

export const dashboard: Messages["doctorDashboard"] = {
  title: "Trang Chính",
  subtitle: "Tổng quan về lịch trình và cuộc hẹn của bạn",
  cards: {
    todayAppointments: "Cuộc Hẹn Hôm Nay",
    pendingConfirmations: "Chờ Xác Nhận",
    totalPatients: "Tổng Số Bệnh Nhân",
    completedToday: "Đã Hoàn Thành Hôm Nay",
    compared: "+{number} so với hôm qua",
    new: "+{number} mới trong tuần này",
    remaining: "{number} còn lại cho hôm nay",
  },
  tabs: {
    upcoming: "Sắp Tới",
    today: "Lịch Trình Hôm Nay",
    summary: "Tổng Kết Tuần",
  },
  upcomingAppointments: {
    title: "Cuộc Hẹn Sắp Tới",
    description: "5 cuộc hẹn tiếp theo của bạn",
    viewAll: "Xem tất cả",
    noAppointments: "Không có cuộc hẹn sắp tới",
    details: "Chi Tiết",
  },
  todaySchedule: {
    title: "Lịch Trình Hôm Nay",
    description: "Cuộc hẹn của bạn cho ngày {date}",
    available: "Còn Trống",
    details: "Chi Tiết",
  },
  appointmentSummary: {
    title: "Tổng Kết Cuộc Hẹn Trong Tuần",
    description: "Tổng quan về cuộc hẹn trong tuần hiện tại",
    confirmed: "Đã Xác Nhận",
    pending: "Đang Chờ",
    completed: "Đã Hoàn Thành",
    cancelled: "Đã Hủy",
  },
};
