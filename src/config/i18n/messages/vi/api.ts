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
    },
  },
};
