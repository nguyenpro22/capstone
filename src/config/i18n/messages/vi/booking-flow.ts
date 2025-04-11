import type { Messages } from "../types"

export const bookingFlowMessages: Messages["bookingFlow"] = {
   // Common booking flow messages
   bookingService: "Đặt lịch dịch vụ",
   bookingSuccessful: "Đặt lịch thành công",
   next: "Tiếp tục",
   back: "Quay lại",
   cancel: "Hủy",
   close: "Đóng",
   complete: "Hoàn tất",
   loading: "Đang tải...",
 
   // Step titles
   selectClinicStep: "Chọn cơ sở",
   selectDoctorDateStep: "Chọn bác sĩ & ngày",
   selectServiceStep: "Chọn dịch vụ",
   confirmInfoStep: "Xác nhận thông tin",
   completeStep: "Hoàn tất",
 
   // Booking summary step
   bookingInfo: "Thông tin đặt lịch",
   pleaseReviewBooking: "Vui lòng kiểm tra lại thông tin đặt lịch của bạn",
   serviceInfo: "Thông tin dịch vụ",
   service: "Dịch vụ",
   category: "Danh mục",
   appointmentInfo: "Thông tin lịch hẹn",
   defaultPackage: "Sử dụng gói dịch vụ mặc định (giá tốt nhất)",
   selectedProcedures: "Các quy trình đã chọn",
   customerInfo: "Thông tin khách hàng",
   pleaseUpdateInfo: "Vui lòng kiểm tra và cập nhật thông tin liên hệ của bạn nếu cần",
 
   // Booking success step
   thankYou: "Cảm ơn bạn đã đặt lịch. Chúng tôi đã gửi thông tin xác nhận đến email của bạn.",
   bookingCode: "Mã đặt lịch",
   clinic: "Cơ sở",
   doctor: "Bác sĩ",
   time: "Thời gian",
   customer: "Khách hàng",
   addToCalendar: "Thêm vào lịch",
   download: "Tải xuống",
   share: "Chia sẻ",
   finish: "Hoàn tất",
 
   // Select clinic step
   selectClinic: "Chọn cơ sở",
   pleaseSelectClinic: "Vui lòng chọn cơ sở bạn muốn thực hiện dịch vụ",
   list: "Danh sách",
   map: "Bản đồ",
   clinicMap: "Bản đồ các cơ sở",
   loadingClinics: "Đang tải danh sách cơ sở...",
 
   // Select date time step
   selectDateTime: "Chọn ngày và giờ",
   pleaseSelectTime: "Vui lòng chọn thời gian bạn muốn thực hiện dịch vụ",
   missingInfo: "Thiếu thông tin",
   selectDoctorClinicFirst: "Vui lòng chọn bác sĩ và cơ sở trước khi chọn ngày và giờ.",
   selectDoctorFirst: "Vui lòng chọn bác sĩ trước khi chọn ngày và giờ.",
   selectClinicFirst: "Vui lòng chọn cơ sở trước khi chọn ngày và giờ.",
   selectDate: "Chọn ngày",
   selectTime: "Chọn giờ",
   morning: "Buổi sáng",
   afternoon: "Buổi chiều",
   evening: "Buổi tối",
   loadingTimeSlots: "Đang tải khung giờ trống...",
   noAvailableSlots: "Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.",
   selectDateFirst: "Vui lòng chọn ngày trước",
   youSelected: "Bạn đã chọn:",
 
   // Error messages
   errorOccurred: "Đã xảy ra lỗi khi đặt lịch",
   generalError: "Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.",
   connectionError: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
 
   // Select doctor step
   selectDoctor: "Chọn bác sĩ",
   pleaseSelectDoctor: "Vui lòng chọn bác sĩ bạn muốn thực hiện dịch vụ",
   loadingDoctorsAndClinics: "Đang tải danh sách bác sĩ và cơ sở...",
   loadingDoctors: "Đang tải danh sách bác sĩ...",
 
   // Select procedure step
   selectService: "Chọn dịch vụ",
   pleaseSelectServiceType: "Vui lòng chọn loại dịch vụ cho mỗi quy trình",
   useDefaultPackage: "Sử dụng gói dịch vụ mặc định (tự động chọn các dịch vụ với giá tốt nhất)",
   estimatedTotalCost: "Tổng chi phí dự kiến",
   youSelectedDefaultPackage: "Bạn đã chọn sử dụng gói dịch vụ mặc định.",
   price: "Giá",
   loadingServices: "Đang tải danh sách dịch vụ...",
 
   // Select doctor date step
   skipDoctorSelection: "Bỏ qua chọn bác sĩ (hệ thống sẽ tự động chọn bác sĩ ngẫu nhiên)",
   automaticallySelectedDoctor: "Bác sĩ được chọn tự động",
    // Customer info form
  fullName: "Họ và tên",
  enterFullName: "Nhập họ và tên",
  phoneNumber: "Số điện thoại",
  enterPhoneNumber: "Nhập số điện thoại",
  email: "Email",
  enterEmailOptional: "Nhập email (không bắt buộc)",
  notes: "Ghi chú",
  enterNotesOptional: "Nhập ghi chú hoặc yêu cầu đặc biệt (không bắt buộc)",

  // Select service step
  pleaseSelectServices: "Vui lòng chọn các dịch vụ bạn muốn thực hiện",
  noProcedureDetails: "Không có thông tin quy trình chi tiết.",
  youSelectedDefaultPackageBestPrice: "Bạn đã chọn sử dụng gói dịch vụ mặc định với giá tốt nhất.",

  // Booking confirmation
  thankYouForBooking: "Cảm ơn bạn đã đặt lịch dịch vụ tại chúng tôi",
  pleaseKeepBookingCode: "Vui lòng lưu lại mã đặt lịch này để tra cứu thông tin khi cần thiết",
  appointmentDate: "Ngày hẹn",
  appointmentTime: "Giờ hẹn",
  location: "Địa điểm",
  dateNotSelected: "Chưa chọn ngày",
  timeNotSelected: "Chưa chọn giờ",
  clinicNotSelected: "Chưa chọn cơ sở",
  serviceDetails: "Chi tiết dịch vụ",
  totalIncludingVAT: "Tổng cộng (đã bao gồm VAT)",
  saveInformation: "Lưu thông tin",
 }
 