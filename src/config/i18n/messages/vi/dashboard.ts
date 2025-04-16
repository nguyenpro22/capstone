import { Messages } from "../types";

export const dashboardMessages: Messages["dashboard"] = {
  totalUsers: "Tổng số người dùng",
  totalClinics: "Tổng số phòng khám",
  totalRevenue: "Tổng doanh thu",
  totalPending: "Tổng chờ xử lý",
  revenueDetails: "Chi tiết doanh thu",
  approvalHistory: "Lịch sử phê duyệt",
  clinicName: "Tên phòng khám",
  location: "Vị trí",
  dateTime: "Ngày - Giờ",
  piece: "Số lượng",
  amount: "Số tiền",
  status: "Trạng thái",
  accepted: "Chấp nhận",
  pending: "Đang chờ",
  upFromYesterday: "▲ {percent}% Tăng so với hôm qua",
  upFromLastWeek: "▲ {percent}% Tăng so với tuần trước",
  downFromYesterday: "▼ {percent}% Giảm so với hôm qua",
  clinicStaff: {
    totalAppointments: "Tổng số cuộc hẹn",
    confirmedAppointments: "Cuộc hẹn đã xác nhận",
    availableDoctors: "Bác sĩ hiện có",
    todaySchedule: "Lịch trình hôm nay",
    customer: "Khách hàng",
    service: "Dịch vụ",
    time: "Thời gian",
    doctor: "Bác sĩ",
    status: "Trạng thái",
    noAppointments: "Không có cuộc hẹn nào được lên lịch cho hôm nay",
    loading: "Đang tải...",
    atThisClinic: "Tại phòng khám này",
    confirmationRate: "tỷ lệ xác nhận",
    fromYesterday: "so với hôm qua",
    viewDetails: "Xem chi tiết",
    editAppointment: "Chỉnh sửa cuộc hẹn",
    cancel: "Hủy bỏ",
    // New missing translations
    dashboardTitle: "Bảng thống kê",
    inProgress: "Đang tiến hành",
    pending: "Đang chờ",
    cancelled: "Đã hủy",
    completed: "Hoàn thành",
    statusBadges: {
      inProgress: "Đang tiến hành",
      pending: "Đang chờ",
      cancelled: "Đã hủy",
      completed: "Hoàn thành",
    },
  },
  systemAdmin: {
    title: "Thống kê quản trị",
    timeSection: {
      time: "Thời gian",
      selectRange: "Chọn khoảng thời gian",
      week: "Tuần",
      month: "Tháng",
      last7Days: "7 ngày qua",
      last30Days: "30 ngày qua",
      last3Months: "3 tháng qua",
      clear: "Xóa",
      limitMessage: "Chỉ cho phép chọn 6 tháng gần nhất",
    },
    notifications: {
      noData: "Không có dữ liệu trong khoảng thời gian đã chọn. Thử chọn khoảng thời gian khác hoặc thêm dữ liệu mới.",
      partialData:
        "Dữ liệu chỉ có trong một số khoảng thời gian. Dashboard hiển thị dữ liệu trong các khoảng thời gian có thông tin.",
    },
    stats: {
      totalRevenue: "Tổng doanh thu",
      systemRevenue: "Doanh thu hệ thống",
      clinicRevenue: "Doanh thu phòng khám",
      totalDoctors: "Tổng số bác sĩ",
      brands: "Thương hiệu",
      branches: "Chi nhánh",
      services: "Dịch vụ",
      pendingBrands: "Thương hiệu chờ duyệt",
      bronzePackage: "Gói Đồng",
      silverPackage: "Gói Bạc",
      goldPackage: "Gói Vàng",
      comparedToPrevious: "so với kỳ trước",
    },
    charts: {
      revenueChart: "Biểu đồ doanh thu",
      totalRevenue: "Tổng doanh thu",
      systemRevenue: "Doanh thu hệ thống",
      clinicRevenue: "Doanh thu phòng khám",
      subscriptionChart: "Biểu đồ gói dịch vụ",
      bronzePackage: "Gói Đồng",
      silverPackage: "Gói Bạc",
      goldPackage: "Gói Vàng",
      growthChart: "Tăng trưởng thương hiệu và chi nhánh",
      totalBrands: "Tổng thương hiệu",
      totalBranches: "Tổng chi nhánh",
    },
    loading: "Đang tải...",
    error: {
      title: "Lỗi tải dữ liệu",
      defaultMessage: "Đã xảy ra lỗi khi tải dữ liệu",
    },
  },
  clinicManager: {
    title: "Thống kê",
    loading: "Đang tải dữ liệu bảng điều khiển...",
    error: {
      title: "Đã xảy ra lỗi",
      message: "Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.",
      tryAgain: "Thử lại"
    },
    rangeView: {
      title: "Xem theo khoảng",
      weekly: "Hàng tuần",
      monthly: "Hàng tháng",
      to: "đến",
      noData: {
        title: "Không có dữ liệu khoảng",
        message: "Không có dữ liệu cho khoảng thời gian đã chọn. Hãy thử chọn một khoảng thời gian khác."
      }
    },
    dailyView: {
      title: "Xem theo ngày",
      today: "Hôm nay",
      noData: {
        title: "Không có dữ liệu ngày",
        message: "Không có dữ liệu cho ngày đã chọn. Hãy thử chọn một ngày khác."
      }
    },
    charts: {
      customerOrders: "Đơn hàng khách hàng",
      scheduleStatus: "Trạng thái lịch hẹn",
      revenuePerformance: "Hiệu suất doanh thu",
      scheduleStatusDistribution: "Phân bố trạng thái lịch hẹn"
    },
    metrics: {
      customerMetrics: "Số liệu khách hàng",
      orderCustomers: "Khách hàng đặt hàng",
      scheduleCustomers: "Khách hàng đặt lịch",
      customerSchedules: "Lịch hẹn khách hàng"
    },
    status: {
      pending: "Đang chờ",
      inProgress: "Đang tiến hành",
      completed: "Hoàn thành",
      canceled: "Đã hủy"
    },
    revenue: {
      revenue: "Doanh thu",
      normalRevenue: "Doanh thu thường",
      liveStreamRevenue: "Doanh thu LiveStream"
    }
  }
};
