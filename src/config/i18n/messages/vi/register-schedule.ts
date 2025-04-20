import { Messages } from "../types";

export const registerSchedule: Messages["registerSchedule"] = {
  // Page title and description
  title: "Đăng Ký Lịch Làm Việc",
  description:
    "Chọn các ca trực có sẵn tại phòng khám để đăng ký lịch làm việc của bạn.",

  // Calendar page
  doctorCalendar: "Lịch Của Tôi",
  calendarDescription:
    "Xem và quản lý các cuộc hẹn đã lên lịch và ca trực đã đăng ký của bạn.",
  registerNewSchedule: "Đăng Ký Lịch Mới",

  // Main sections
  availableShifts: "Ca Trực Có Sẵn",
  selectedShifts: "Ca Trực Đã Chọn",

  // View modes
  calendarView: "Xem Lịch",
  listView: "Xem Danh Sách",
  monthView: "Tháng",
  filter: "Lọc",
  timeOfDay: "Thời Gian Trong Ngày",
  selectTime: "Chọn thời gian",
  more: "khác",
  noShifts: "Không có ca trực",

  // Calendar navigation
  today: "Hôm Nay",

  // Shift selection
  shiftsSelected: "ca trực đã chọn",
  noShiftsSelected: "Chưa Chọn Ca Trực",
  selectShiftsToRegister:
    "Vui lòng chọn ca trực từ các tùy chọn có sẵn để đăng ký.",
  clearAll: "Xóa Tất Cả",

  // Registration actions
  registerShifts: "Đăng Ký Ca Trực",
  registering: "Đang Đăng Ký...",

  // Search and filters
  searchShifts: "Tìm kiếm ca trực...",
  dateFilter: "Lọc Theo Ngày",
  timeFilter: "Lọc Theo Giờ",
  allDates: "Tất Cả Ngày",
  allTimes: "Tất Cả Giờ",
  tomorrow: "Ngày Mai",
  nextWeek: "7 Ngày Tới",
  nextMonth: "30 Ngày Tới",
  morning: "Buổi Sáng (6h-12h)",
  afternoon: "Buổi Chiều (12h-17h)",
  evening: "Buổi Tối (17h-23h)",
  upcomingShifts: "Ca Trực Sắp Tới",
  allShifts: "Tất Cả Ca Trực",

  // List view labels
  shifts: "ca trực",
  shift: "ca trực",
  noShiftsFound: "Không Tìm Thấy Ca Trực",
  tryAdjustingFilters:
    "Hãy thử điều chỉnh bộ lọc hoặc tiêu chí tìm kiếm để tìm ca trực có sẵn.",

  // Toast notifications
  pleaseSelectShifts: "Vui lòng chọn ít nhất một ca trực để đăng ký.",
  shiftsRegisteredSuccessfully:
    "Các ca trực của bạn đã được đăng ký thành công!",
  errorRegisteringShifts:
    "Đã xảy ra lỗi khi đăng ký ca trực. Vui lòng thử lại.",
  registrationSuccess: "Đăng Ký Thành Công",
  registrationFailed: "Đăng Ký Thất Bại",
  shiftAdded: "Đã thêm ca trực vào danh sách",
  shiftRemoved: "Đã xóa ca trực khỏi danh sách",
  noteSaved: "Ghi chú đã được lưu thành công",
  errorSavingNote: "Lỗi khi lưu ghi chú. Vui lòng thử lại.",
  endDateBeforeStart: "Ngày kết thúc không thể trước ngày bắt đầu",
  dateRangeLimited: "Khoảng thời gian giới hạn tối đa {days} ngày",
  shiftOverlapsWithRegistered: "Ca trực này trùng với ca trực bạn đã đăng ký",
  shiftOverlapsWithSelected: "Ca trực này trùng với ca trực khác bạn đã chọn",
  shiftsAddedCount: "Đã thêm {count} ca trực vào danh sách",
  someShiftsOverlap: "{count} ca trực không thể chọn do trùng lịch",

  // Confirmation dialog
  confirmRegistration: "Xác Nhận Đăng Ký",
  confirmRegistrationDescription:
    "Bạn có chắc chắn muốn đăng ký {count} ca trực? Hành động này không thể hoàn tác.",
  confirmAndRegister: "Xác Nhận & Đăng Ký",
  cancel: "Hủy",

  // Success animation
  registrationSuccessful: "Đăng Ký Thành Công!",
  registrationSuccessDescription:
    "Các ca trực của bạn đã được đăng ký thành công. Bạn có thể xem chúng trong lịch của mình.",
  viewCalendar: "Xem Lịch",
  registerMore: "Đăng Ký Thêm Ca Trực",
  autoRedirect: "Bạn sẽ được chuyển đến lịch của mình trong 5 giây...",

  // Shift details modal
  shiftDetails: "Chi Tiết Ca Trực",
  startTime: "Giờ Bắt Đầu",
  endTime: "Giờ Kết Thúc",
  duration: "Thời Lượng",
  hour: "giờ",
  hours: "giờ",
  minute: "phút",
  minutes: "phút",
  clinic: "Phòng Khám",
  status: "Trạng Thái",
  available: "Có Sẵn",
  unavailable: "Không Khả Dụng",
  close: "Đóng",
  details: "Chi Tiết",
  selectShift: "Chọn Ca Trực",
  removeShift: "Xóa Ca Trực",
  shiftOverlapsWarning: "Ca trực này trùng với lịch của bạn",

  // Appointment details
  appointmentDetails: "Chi Tiết Cuộc Hẹn",
  service: "Dịch Vụ",
  notes: "Ghi Chú",
  noNotes: "Không có ghi chú",
  edit: "Chỉnh Sửa",
  saveNotes: "Lưu Ghi Chú",
  saving: "Đang Lưu...",
  enterNotes: "Nhập ghi chú của bạn tại đây...",
  currentProcedure: "Thủ Tục Hiện Tại",

  // Add new translations for date range picker
  selectDateRange: "Chọn khoảng thời gian",
  selectEndDate: "Chọn ngày kết thúc",
  selectBothDates: "Chọn ngày bắt đầu và kết thúc",
  apply: "Áp dụng",
  customDateRange: "Khoảng Thời Gian Tùy Chỉnh",

  // Add new translations for the week view
  selected: "Đã chọn",
  select: "Chọn",
  viewShifts: "Xem Ca Trực",
  shiftsForDate: "Ca trực ngày {date}",
  noShiftsAvailable: "Không có ca trực nào cho ngày này",
  shiftsAvailable: "ca trực có sẵn",
  selectAll: "Chọn Tất Cả",
  remove: "Xóa",

  // Overlap validation
  overlapsWithRegistered: "Trùng với ca trực đã đăng ký",
  overlapsWithSelected: "Trùng với ca trực đã chọn",
  overlapsWithRegisteredTooltip:
    "Bạn đã đăng ký một ca trực trong khoảng thời gian này",
  overlapsWithSelectedTooltip:
    "Bạn đã chọn một ca trực khác trong khoảng thời gian này",

  // Thêm các bản dịch mới
  selectDateFilter: "Chọn khoảng thời gian",
  selectTimeFilter: "Chọn thời gian trong ngày",
  maxDateRangeInfo: "Tối đa {days} ngày được phép",
};
