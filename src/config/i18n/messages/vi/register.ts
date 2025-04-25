import { Messages } from "../types";

export const register: Messages["register"] = {
  form: {
    title: {
      createAccount: "Tạo Tài Khoản",
      fillDetails: "Điền thông tin của bạn để bắt đầu",
    },
    labels: {
      email: "Email",
      password: "Mật khẩu",
      confirmPassword: "Xác nhận mật khẩu",
      firstName: "Tên",
      lastName: "Họ",
      phoneNumber: "Số điện thoại",
      dateOfBirth: "Ngày sinh",
      address: "Địa chỉ",
    },
    placeholders: {
      email: "Nhập email của bạn",
      password: "Nhập mật khẩu",
      confirmPassword: "Xác nhận mật khẩu",
      firstName: "Nhập tên của bạn",
      lastName: "Nhập họ của bạn",
      phoneNumber: "Nhập số điện thoại",
      address: "Nhập địa chỉ của bạn",
    },
    buttons: {
      register: "Đăng ký",
      registering: "Đang đăng ký...",
      signIn: "Đăng nhập",
      confirm: "Xác nhận",
      verifying: "Đang xác thực...",
    },
    validation: {
      required: "Trường này là bắt buộc",
      email: {
        invalid: "Vui lòng nhập địa chỉ email hợp lệ",
      },
      password: {
        min: "Mật khẩu phải có ít nhất 8 ký tự",
        max: "Mật khẩu tối đa 20 ký tự",
        uppercase: "Mật khẩu phải chứa ít nhất một chữ hoa",
        lowercase: "Mật khẩu phải chứa ít nhất một chữ thường",
        number: "Mật khẩu phải chứa ít nhất một số",
        special: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@$!%*?&)",
        noSpaces: "Mật khẩu không được chứa khoảng trắng",
        strength:
          "Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      },
      confirmPassword: {
        match: "Mật khẩu không khớp",
      },
      firstName: {
        min: "Tên phải có ít nhất 2 ký tự",
        lettersOnly: "Tên chỉ được chứa chữ cái",
      },
      lastName: {
        required: "Họ là bắt buộc",
        lettersOnly: "Họ chỉ được chứa chữ cái",
      },
      phoneNumber: {
        format: "Số điện thoại phải có 10 chữ số",
      },
      dateOfBirth: {
        invalid: "Định dạng ngày không hợp lệ",
        age: "Bạn phải đủ 18 tuổi để đăng ký",
        note: "Bạn phải đủ 18 tuổi",
      },
      address: {
        min: "Địa chỉ phải có ít nhất 8 ký tự",
      },
    },
    verification: {
      title: "Nhập Mã Xác Thực",
      success: "Đăng Ký Thành Công",
      codeSent: "Mã xác thực đã được gửi đến email của bạn",
      enterCode: "Nhập Mã Xác Thực",
      checkEmail: "Vui lòng kiểm tra email của bạn để lấy mã xác thực",
      codePlaceholder: "Nhập mã 5 chữ số",
      timeRemaining: "Thời gian còn lại",
      invalidCode: "Mã xác thực không hợp lệ",
      pleaseEnter: "Vui lòng nhập mã xác thực",
    },
    messages: {
      alreadyHaveAccount: "Đã có tài khoản?",
      unexpectedError: "Đã xảy ra lỗi. Vui lòng thử lại.",
      verificationSuccess: "Xác thực thành công",
      verificationFailed: "Xác thực thất bại. Vui lòng thử lại.",
    },
    terms: {
      text: "Tôi đồng ý với",
      link: "Điều khoản và Dịch vụ",
    },
  },
};
