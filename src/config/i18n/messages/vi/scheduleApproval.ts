import type { Messages } from "../types"

export const scheduleApprovalMessages: Messages["scheduleApproval"] = {
  // Page header
  pageTitle: "Phê duyệt lịch hẹn",
  pageDescription: "Xem xét và quản lý các lịch hẹn đang chờ phê duyệt",

  // Table headers
  customer: "Khách hàng",
  contact: "Liên hệ",
  date: "Ngày",
  time: "Giờ",
  service: "Dịch vụ",
  status: "Trạng thái",
  actions: "Thao tác",

  // Status
  waitingApproval: "Đang chờ phê duyệt",
  approved: "Đã phê duyệt",
  rejected: "Đã từ chối",

  // Actions
  approve: "Phê duyệt",
  reject: "Từ chối",

  // Notifications
  approveSuccess: "Lịch hẹn đã được phê duyệt thành công",
  rejectSuccess: "Lịch hẹn đã bị từ chối",
  error: "Lỗi",
  approveError: "Không thể phê duyệt lịch hẹn",
  rejectError: "Không thể từ chối lịch hẹn",

  // Loading states
  loadError: "Không thể tải danh sách lịch hẹn.",
  tryAgain: "Vui lòng thử lại.",
  retry: "Thử lại",
  noSchedules: "Không có lịch hẹn nào đang chờ phê duyệt",
  notAvailable: "Không có",
}
