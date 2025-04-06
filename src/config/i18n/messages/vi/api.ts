import { Messages } from "../types";

export const apiMessages: Messages["api"] = {
  auth: {
    login: {
      loginSuccess: "Đăng nhập thành công",
      loginError: "Đăng nhập thất bại",
      requiredEmail: "Email hoặc tên đăng nhập là bắt buộc",
      minPassword: "Mật khẩu phải có ít nhất 6 ký tự",
      maxPassword: "Mật khẩu không được vượt quá 50 ký tự",
      invalidEmail: "Email không hợp lệ",
      logoutError: "Đã xảy ra lỗi khi đăng xuất.",
      invalidCredentials: "Thông tin đăng nhập không hợp lệ.",
      userNotFound: "Không tìm thấy người dùng.",
      generalError: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      logoutSuccess: "Đăng xuất thành công.",
      providerLoginError: "Lỗi đăng nhập với nhà cung cấp.",
      popupBlocked: "Popup bị chặn. Vui lòng kiểm tra cài đặt trình duyệt.",
      authTimeout: "Phiên đăng nhập đã hết hạn.",
      authCancelled: "Đăng nhập bị huỷ bỏ.",
      providerLoginSuccess: "Đăng nhập với Google thành công",
    },
  },
};
