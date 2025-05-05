import type { Messages } from "../types";

export const bookingFlowMessages: Messages["bookingFlow"] = {
  // General
  loadingClinics: "Đang tải danh sách phòng khám...",
  loadingDoctors: "Đang tải danh sách bác sĩ...",
  loadingServices: "Đang tải dịch vụ...",
  loadingTimeSlots: "Đang tải khung giờ khả dụng...",
  errorOccurred: "Đã xảy ra lỗi",
  generalError: "Đã xảy ra lỗi. Vui lòng thử lại.",
  connectionError: "Lỗi kết nối. Vui lòng kiểm tra kết nối internet của bạn.",
  bookingService: "Đặt dịch vụ",
  // Navigation and steps
  next: "Tiếp theo",
  back: "Quay lại",
  cancel: "Hủy",
  close: "Đóng",
  finish: "Hoàn thành",
  complete: "Hoàn tất đặt lịch",
  loading: "Đang tải...",
  selectClinicStep: "Chọn phòng khám",
  selectDoctorDateStep: "Chọn bác sĩ & ngày",
  selectServiceStep: "Chọn dịch vụ",
  confirmInfoStep: "Xác nhận thông tin",
  completeStep: "Hoàn thành",

  // Clinic selection
  selectClinic: "Chọn phòng khám",
  pleaseSelectClinic: "Vui lòng chọn phòng khám cho cuộc hẹn của bạn",
  noActiveClinicWarning: "Hiện không có phòng khám nào đang hoạt động",
  list: "Danh sách",
  map: "Bản đồ",
  clinicMap: "Bản đồ vị trí phòng khám sẽ được hiển thị tại đây",
  active: "Đang hoạt động",
  inactive: "Không hoạt động",
  clinicUnavailable: "Phòng khám này hiện không khả dụng",

  // Doctor selection
  selectDoctor: "Chọn bác sĩ",
  skipDoctorSelection:
    "Bỏ qua việc chọn bác sĩ (chúng tôi sẽ chỉ định bác sĩ có đánh giá cao nhất)",
  automaticallySelectedDoctor:
    "Chúng tôi đã tự động chọn bác sĩ có đánh giá cao nhất cho bạn",
  doctorSelect: "Bác sĩ",

  // Date and time selection
  selectDateTime: "Chọn ngày và giờ",
  pleaseSelectTime: "Vui lòng chọn ngày và giờ cho cuộc hẹn của bạn",
  selectDate: "Chọn ngày",
  selectTime: "Chọn giờ",
  selectDateFirst: "Vui lòng chọn ngày trước",
  noAvailableSlots: "Không có khung giờ khả dụng cho ngày này",
  youSelected: "Bạn đã chọn:",
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  evening: "Buổi tối",

  // Missing information alerts
  missingInfo: "Thiếu thông tin",
  selectDoctorClinicFirst: "Vui lòng chọn bác sĩ và phòng khám trước",
  selectDoctorFirst: "Vui lòng chọn bác sĩ trước",
  selectClinicFirst: "Vui lòng chọn phòng khám trước",
  selectServiceType: "Chọn loại dịch vụ:",
  // Service selection
  selectService: "Chọn dịch vụ",
  pleaseSelectServices: "Vui lòng chọn các dịch vụ bạn muốn đặt lịch",
  useDefaultPackage: "Sử dụng gói mặc định (giá tốt nhất)",
  noProcedureDetails: "Không có thông tin chi tiết về thủ tục cho dịch vụ này",
  estimatedTotalCost: "Chi phí ước tính",
  youSelectedDefaultPackageBestPrice:
    "Bạn đã chọn gói mặc định với các tùy chọn giá tốt nhất",
  noServiceSelection: "Không có dịch vụ nào được chọn",
  subtotal: "Tạm tính",
  vatTax: "Thuế VAT (10%)",
  total: "Tổng cộng",

  // Booking summary
  bookingInfo: "Thông tin đặt lịch",
  pleaseReviewBooking: "Vui lòng xem lại thông tin đặt lịch trước khi xác nhận",
  serviceInfo: "Thông tin dịch vụ",
  service: "Dịch vụ",
  category: "Danh mục",
  defaultPackage: "Đã chọn gói mặc định",
  selectedProcedures: "Các thủ tục đã chọn",
  appointmentInfo: "Thông tin cuộc hẹn",

  // Customer information
  customerInfo: "Thông tin khách hàng",
  pleaseUpdateInfo: "Vui lòng cập nhật thông tin của bạn nếu cần",
  fullName: "Họ và tên",
  enterFullName: "Nhập họ và tên của bạn",
  phoneNumber: "Số điện thoại",
  enterPhoneNumber: "Nhập số điện thoại của bạn",
  email: "Email",
  enterEmailOptional: "Nhập email của bạn (không bắt buộc)",
  notes: "Ghi chú",
  enterNotesOptional: "Nhập bất kỳ ghi chú bổ sung nào (không bắt buộc)",

  // Booking success
  bookingSuccessful: "Đặt lịch thành công!",
  thankYou:
    "Cảm ơn bạn đã đặt lịch. Chúng tôi đã gửi chi tiết đến điện thoại của bạn.",
  bookingCode: "Mã đặt lịch",
  clinic: "Phòng khám",
  doctor: "Bác sĩ",
  time: "Thời gian",
  depositRequired: "Cần Đặt Cọc",
  depositInfo: "Tiền đặt cọc:",
  customer: {
    customer: "Khách hàng",
    name: "Tên Khách Hàng",
    phone: "Số điện thoại",
    email: "Email",
  },
  backToHome: "Quay Lại Trang Chủ",
  viewAppointments: "Xem Lịch Hẹn",
  formattedDate: "Ngày {date} tháng {month} năm {year}",
  months: {
    0: "1",
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "7",
    7: "8",
    8: "9",
    9: "10",
    10: "11",
    11: "12",
  },
  bookingCancelledMessage: "Hủy đặt lịch thành công.",
};
