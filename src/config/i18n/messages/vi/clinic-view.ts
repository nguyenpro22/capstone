import type { Messages } from "../types";

export const clinicView: Messages["clinicView"] = {
  badge: "Hệ thống phòng khám",
  title: "Tìm kiếm phòng khám tốt nhất",
  description:
    "Duyệt qua danh sách các phòng khám thẩm mỹ và chăm sóc sức khỏe được chọn lọc để tìm nơi phù hợp nhất cho bạn.",
  searchPlaceholder: "Tìm theo tên phòng khám hoặc địa điểm...",
  sortBy: "Sắp xếp theo",
  sortByRating: "Đánh giá (Cao đến Thấp)",
  sortByName: "Tên (A-Z)",
  sortByNameDesc: "Tên (Z-A)",
  search: "Tìm kiếm",
  errorLoading: "Lỗi khi tải danh sách phòng khám",
  tryAgain: "Thử lại",
  noClinicsFound: "Không tìm thấy phòng khám nào",
  tryDifferentSearch: "Hãy thử từ khóa khác hoặc xóa bộ lọc",
  clearFilters: "Xóa bộ lọc",
};
