import { Messages } from "../../types";

export const profile: Messages["doctorProfile"] = {
  title: "Hồ Sơ",
  subtitle: "Quản lý cài đặt tài khoản và tùy chọn của bạn",
  tabs: {
    general: "Chung",
    password: "Mật Khẩu",
    notifications: "Thông Báo",
  },
  general: {
    title: "Hồ Sơ",
    description: "Quản lý thông tin cá nhân của bạn",
    name: {
      label: "Tên",
      placeholder: "Tên của bạn",
    },
    email: {
      label: "Email",
      placeholder: "Email của bạn",
    },
    phone: {
      label: "Điện Thoại",
      placeholder: "Số điện thoại của bạn",
    },
    specialization: {
      label: "Chuyên Môn",
      placeholder: "Chuyên môn của bạn",
    },
    saveButton: "Lưu thay đổi",
    saving: "Đang lưu...",
    successTitle: "Hồ sơ đã cập nhật",
    successMessage: "Hồ sơ của bạn đã được cập nhật thành công.",
  },
  password: {
    title: "Đổi Mật Khẩu",
    description: "Cập nhật mật khẩu để giữ an toàn cho tài khoản của bạn",
    currentPassword: {
      label: "Mật Khẩu Hiện Tại",
      placeholder: "Nhập mật khẩu hiện tại của bạn",
    },
    newPassword: {
      label: "Mật Khẩu Mới",
      placeholder: "Nhập mật khẩu mới của bạn",
      description: "Mật khẩu phải có ít nhất 8 ký tự.",
    },
    confirmPassword: {
      label: "Xác Nhận Mật Khẩu Mới",
      placeholder: "Xác nhận mật khẩu mới của bạn",
    },
    updateButton: "Cập Nhật Mật Khẩu",
    updating: "Đang cập nhật...",
    successTitle: "Mật khẩu đã cập nhật",
    successMessage: "Mật khẩu của bạn đã được cập nhật thành công.",
  },
  notifications: {
    title: "Thông Báo",
    description: "Quản lý cách bạn nhận thông báo",
    emailNotifications: {
      label: "Thông Báo Qua Email",
      description: "Nhận thông báo qua email",
    },
    pushNotifications: {
      label: "Thông Báo Đẩy",
      description: "Nhận thông báo đẩy trên thiết bị của bạn",
    },
    appointmentReminders: {
      label: "Nhắc Nhở Cuộc Hẹn",
      description: "Nhận nhắc nhở về cuộc hẹn sắp tới",
    },
    marketingEmails: {
      label: "Email Tiếp Thị",
      description: "Nhận email về tính năng mới và khuyến mãi",
    },
    saveButton: "Lưu tùy chọn",
    saving: "Đang lưu...",
    successTitle: "Cài đặt thông báo đã cập nhật",
    successMessage: "Cài đặt thông báo của bạn đã được cập nhật thành công.",
  },
};
