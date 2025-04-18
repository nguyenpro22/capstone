import { Messages } from "../types";

export const orderMessages: Messages["userOrder"] = {
  title: "Quản lý lịch sử đặt lịch",
  subtitle: "Lịch sử đặt lịch & Lịch hẹn",
  description:
    "Xem lại tất cả các lịch sử đặt lịch và lịch hẹn của bạn tại đây. Bạn có thể theo dõi trạng thái và xem chi tiết mỗi mục.",
  tabs: {
    orders: "Lịch sử đặt lịch",
    bookings: "Lịch hẹn",
  },
  search: {
    placeholder: "Tìm kiếm theo tên dịch vụ...",
  },
  filter: {
    status: "Trạng thái",
    allStatuses: "Tất cả trạng thái",
    completed: "Hoàn thành",
    inProgress: "Đang xử lý",
    pending: "Chờ xử lý",
  },
  columns: {
    id: "Mã lịch sử",
    customerName: "Khách hàng",
    serviceName: "Dịch vụ",
    orderDate: "Ngày đặt",
    totalAmount: "Tổng tiền",
    discount: "Giảm giá",
    depositAmount: "Đặt cọc",
    finalAmount: "Thành tiền",
    customerPhone: "Điện thoại",
    customerEmail: "Email",
    livestream: "Livestream",
    feedback: "Đánh giá",
    status: "Trạng thái",
    details: "Chi tiết",
  },
  columnVisibility: {
    title: "Hiển thị cột",
    selectColumns: "Chọn cột để hiển thị",
  },
  status: {
    completed: "Hoàn thành",
    inProgress: "Đang xử lý",
    pending: "Chờ xử lý",
  },
  noOrders: {
    title: "Không tìm thấy lịch sử đặt lịch nào",
    description:
      "Bạn chưa có lịch sử đặt lịch nào hoặc không có mục nào phù hợp với bộ lọc hiện tại.",
  },
  pagination: {
    showing: "Hiển thị {count} trên tổng số {total} mục",
    page: "Trang",
    rowsPerPage: "Số dòng mỗi trang",
    first: "Trang đầu",
    previous: "Trang trước",
    next: "Trang sau",
    last: "Trang cuối",
  },
  viewDetails: "Xem chi tiết",
  noFeedback: "Chưa có đánh giá",
  noFeedbackComment: "Không có bình luận kèm theo đánh giá này",
  bookingsForDate: "Lịch hẹn cho ngày {date}",
  bookingsCount: "{count} lịch hẹn đã được đặt",
  noBookingsForDate: "Không có lịch hẹn nào cho ngày này",
  noBookingsTitle: "Không tìm thấy lịch hẹn",
  noBookingsDescription: "Không có lịch hẹn nào cho ngày này.",
  moreBookings: "lịch hẹn khác",
  close: "Đóng",
};
