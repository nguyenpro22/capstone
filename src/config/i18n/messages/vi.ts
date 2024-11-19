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
      loginSuccess: "Đăng nhập thành công",
      registerSuccess: "Đăng ký thành công",
      logoutSuccess: "Đăng xuất thành công",
      loginError: "Đăng nhập thất bại",
      registerError: "Đăng ký thất bại",
      logoutError: "Đăng xuất thất bại",
    },
  },
};

export default vi;
