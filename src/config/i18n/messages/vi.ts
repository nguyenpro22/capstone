import { Messages } from "./type";

const vi: Messages = {
  home: {
    header: "Tiêu đề",
    currentTheme: "Chủ đề hiện tại",
    primaryAction: "Hành động chính",
    secondaryAction: "Hành động phụ",
    mutedBackground: "Tắt nền",
    light: "Sáng",
    dark: "Tối",
    login: "Đăng nhập",
    register: "Đăng ký",
    logout: "Đăng xuất",
  },
  navbar: {
    home: "Trang chủ",
    about: "Giới thiệu",
    contact: "Liên hệ",
  },
  api: {
    auth: {
      login: {
        loginSuccess: "Đăng nhập thành công",
        loginError: "Đăng nhập thất bại",
        requiredEmail: "Email hoặc tên đăng nhập là bắt buộc",
        minPassword: "Mật khẩu phải có ít nhất 6 ký tự",
        maxPassword: "Mật khẩu không được vượt quá 50 ký tự",
        invalidEmail: "Email không hợp lệ",
        userNotFoundError: "Tên đăng nhập không tìm thấy",
        providerLoginError: "Đăng nhập thất bại",
      },
    },
  },
};

export default vi;
