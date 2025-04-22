import { Messages } from "../types";

export const register: Messages["register"] = {
  createAccount: "Tạo tài khoản",
  fillDetails: "Vui lòng điền thông tin bên dưới để đăng ký.",
  email: "Email",
  emailPlaceholder: "email@example.com",
  password: "Mật khẩu",
  passwordPlaceholder: "Nhập mật khẩu của bạn",
  confirmPassword: "Xác nhận mật khẩu",
  confirmPasswordPlaceholder: "Nhập lại mật khẩu của bạn",
  firstName: "Tên",
  firstNamePlaceholder: "Nguyễn",
  lastName: "Họ",
  lastNamePlaceholder: "Văn A",
  phoneNumber: "Số điện thoại",
  phoneNumberPlaceholder: "0901234567",
  dateOfBirth: "Ngày sinh",
  address: "Địa chỉ",
  addressPlaceholder: "Nhập địa chỉ của bạn",
  register: "Đăng ký",
  registering: "Đang đăng ký...",
  alreadyHaveAccount: "Bạn đã có tài khoản?",
  signIn: "Đăng nhập",
  registrationSuccess: "Đăng ký thành công!",
  verificationCodeSent:
    "Mã xác minh đã được gửi đến email của bạn. Vui lòng nhập mã để hoàn tất đăng ký.",
  enterVerificationCode: "Nhập mã xác minh",
  checkEmail: "Vui lòng kiểm tra email và nhập mã xác minh.",
  verificationCodePlaceholder: "Nhập mã xác minh",
  timeRemaining: "Thời gian còn lại",
  confirm: "Xác nhận",
  emailAlreadyExists:
    "Email hoặc số điện thoại đã tồn tại. Vui lòng sử dụng một cái khác.",
  // New translation fields
  mustBe18YearsOld: "Bạn phải đủ 18 tuổi trở lên",
  selectYourBirthday: "Chọn ngày sinh của bạn",
  validationError: "Lỗi xác thực",
  unexpectedError: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
  verificationFailed: "Xác minh không thành công. Vui lòng thử lại.",
  // Backend validation error messages
  invalidEmailFormat: "Định dạng email không hợp lệ",
  passwordTooShort: "Mật khẩu phải có ít nhất 8 ký tự",
  passwordTooLong: "Mật khẩu không được vượt quá 20 ký tự",
  firstNameOnlyLetters: "Tên chỉ được chứa chữ cái",
  firstNameTooShort: "Tên phải có ít nhất 2 ký tự",
  firstNameTooLong: "Tên không được vượt quá 30 ký tự",
  lastNameOnlyLetters: "Họ chỉ được chứa chữ cái",
  lastNameTooShort: "Họ phải có ít nhất 2 ký tự",
  lastNameTooLong: "Họ không được vượt quá 30 ký tự",
  mustBeAtLeast18: "Người dùng phải đủ 18 tuổi trở lên",
  addressTooShort: "Địa chỉ phải có ít nhất 10 ký tự",
  addressTooLong: "Địa chỉ không được vượt quá 100 ký tự",
    // New verification messages
    pleaseEnterVerificationCode: "Vui lòng nhập mã xác minh",
    verifying: "Đang xác minh...",
    verificationSuccessful: "Xác minh thành công!",
    passwordNoSpaces: "Mật khẩu không được chứa khoảng trắng",
  passwordRequirements: "Mật khẩu phải đáp ứng các yêu cầu sau:",
  passwordRequiresUppercase: "Bao gồm ít nhất một chữ cái viết hoa",
  passwordRequiresLowercase: "Bao gồm ít nhất một chữ cái viết thường",
  passwordRequiresNumber: "Bao gồm ít nhất một số",
  passwordRequiresSpecial: "Bao gồm ít nhất một ký tự đặc biệt",
  passwordsDoNotMatch: "Mật khẩu không khớp",
  
  // Email validation
  invalidEmail: "Vui lòng nhập địa chỉ email hợp lệ",
  
  // Phone validation
  invalidPhoneNumber: "Vui lòng nhập số điện thoại hợp lệ",
  
  // Verification code validation
  invalidVerificationCode: "Mã xác minh không hợp lệ. Vui lòng nhập mã 6 chữ số",
  
  // Form submission
  formSubmissionError: "Đã xảy ra lỗi khi gửi biểu mẫu. Vui lòng thử lại.",
  serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
  
  // Address validation
  invalidAddress: "Vui lòng nhập địa chỉ hợp lệ",
};

