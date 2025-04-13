import type { Messages } from "../types"

export const clinicStaffAppointmentMessages: Messages["clinicStaffAppointment"] = {
  // Page header
  pageTitle: "Lịch hẹn",

  // Dashboard cards
  totalAppointments: "Tổng số lịch hẹn",
  pendingAppointments: "Đang chờ",
  inProgressAppointments: "Đang thực hiện",
  completedAppointments: "Đã hoàn thành",
  cancelledAppointments: "Đã hủy",

  // Calendar
  calendar: "Lịch",
  sunday: "CN",
  monday: "T2",
  tuesday: "T3",
  wednesday: "T4",
  thursday: "T5",
  friday: "T6",
  saturday: "T7",

  // Status labels
  completed: "hoàn thành",
  inProgress: "đang h.thành",
  pending: "đang chờ",
  cancelled: "đã hủy",
  statusCompleted: "Đã hoàn thành",
  statusInProgress: "Đang thực hiện",
  statusPending: "Đang chờ",
  statusCancelled: "Đã hủy",

  // Appointment details
  appointments: "Lịch hẹn",
  add: "Thêm mới",
  doctor: "Bác sĩ",
  duration: "Thời gian",
  reschedule: "Đổi lịch",
  confirm: "Xác nhận",
  confirming: "Đang xác nhận...",
  confirmed: "Đã xác nhận",

  // Empty states
  loadingAppointments: "Đang tải lịch hẹn...",
  noAppointmentsForDay: "Không có lịch hẹn nào cho ngày này",
  noAppointmentsScheduled: "Không có lịch hẹn nào được đặt cho ngày này.",
  addAppointment: "Thêm lịch hẹn",

  // Notifications
  confirmSuccess: "Lịch hẹn đã được xác nhận thành công.",
  confirmError: "Đã xảy ra lỗi khi xác nhận lịch hẹn. Vui lòng thử lại.",
}
