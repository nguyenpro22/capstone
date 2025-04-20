import type { Messages } from "../types"

export const sidebarMessages: Messages["sidebar"] = {
  // Common sidebar items
  dashboard: "Thống Kê",
  settings: "Cài Đặt",
  logout: "Đăng Xuất",
  profile: "Hồ Sơ",
  inbox: "Hộp Thoại",
  order: "Đơn Hàng",
  service: "Dịch Vụ",

  // System Admin items
  voucher: "Phiếu Giảm Giá",
  package: "Gói Dịch Vụ",
  categoryServices: "Danh Mục Dịch Vụ",
  withdrawalApproval: "Lệnh Rút Tiền" ,

  // System Staff items
  user: "Người Dùng",
  clinic: "Phòng Khám",
  partnership: "Đối Tác",

  // Clinic Manager items
  branchManagement: "Quản Lý Chi Nhánh",
  staffManagement: "Quản Lý Nhân Viên",
  doctorManagement: "Quản Lý Bác Sĩ",
  buyPackage: "Mua Gói Dịch Vụ",
  liveStream: "Phát Trực Tiếp",

  // Clinic Staff items
  scheduleApproval: "Lịch Trình Phê Duyệt",
  customerSchedule: "Lịch Trình Khách Hàng",
  appointment: "Lịch Hẹn",
  branchDoctor: "Bác Sĩ Chi Nhánh",
  setting: "Cài Đặt",

  // User items
  home: "Trang Chủ",

  // UI elements
  closeSidebar: "Đóng thanh bên",
  openSidebar: "Mở thanh bên",

  // Logout dialog
  logoutConfirmTitle: "Bạn có chắc chắn muốn đăng xuất?",
  logoutConfirmDescription: "Điều này sẽ kết thúc phiên của bạn và đăng xuất bạn khỏi hệ thống.",
  cancel: "Hủy",
  
  // Clinic Manager items
  wallet: "Ví Tiền",

  // Clinic Staff items
  walletAttachment: "Đính Kèm Ví",
  // New translations for mobile sidebar
  lightMode: "Chế độ sáng",
  darkMode: "Chế độ tối",
  workingSchedule: "Khung Giờ Hoạt Động"
}
