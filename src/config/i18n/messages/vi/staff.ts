import { Messages } from "../types";

export const staffMessages: Messages["staff"] = {
    // Page titles and general
    staffList: "Danh Sách Bác Sĩ",
  addNewStaff: "Thêm Bác Sĩ Mới",
  noStaffAvailable: "Không có nhân viên nào",
  addYourFirstStaff: "Thêm nhân viên đầu tiên của bạn",  // Table headers
  no: "STT",
  fullName: "Họ & Tên",
  firstName: "Tên",
  lastName: "Họ",
  email: "Email",
  phoneNumber: "Số Điện Thoại",
  role: "Vai Trò",
  branches: "Chi Nhánh",
  branch: "Chi Nhánh",
  address: "Địa Chỉ",
  action: "Hành Động",

  // Actions and buttons
  viewStaffDetail: "Xem chi tiết nhân viên",
  editStaff: "Chỉnh sửa nhân viên",
  deleteStaff: "Xóa nhân viên",
  changeBranch: "Thay đổi chi nhánh",
  save: "Lưu",
  saving: "Đang lưu...",
  cancel: "Hủy",
  close: "Đóng",

  // Form fields and validation
  branchRequired: "Chi nhánh là bắt buộc",
  selectBranch: "Chọn chi nhánh",
  loadingBranches: "Đang tải chi nhánh...",

  // Success and error messages
  staffAddedSuccess: "Thêm nhân viên thành công!",
  staffAddedFailed: "Thêm nhân viên thất bại. Vui lòng thử lại.",
  staffUpdatedSuccess: "Cập nhật nhân viên thành công!",
  staffUpdatedFailed: "Cập nhật nhân viên thất bại. Vui lòng thử lại.",
  staffDeletedSuccess: "Xóa nhân viên thành công!",
  staffDeletedFailed: "Xóa nhân viên thất bại!",
  branchChangedSuccess: "Thay đổi chi nhánh thành công!",
  branchChangeFailed: "Thay đổi chi nhánh thất bại. Vui lòng thử lại.",
  clinicIdNotFound: "Không tìm thấy ID phòng khám. Vui lòng thử lại hoặc liên hệ hỗ trợ.",

  // Staff details
  staffDetails: "Chi tiết nhân viên",
  profilePicture: "Ảnh đại diện",

  // Branch related
  changingBranchFor: "Thay đổi chi nhánh cho",
  currentBranch: "Chi nhánh hiện tại",
  newBranch: "Chi nhánh mới",
  selectDestinationBranch: "Chọn chi nhánh đích",
  noAvailableBranches: "Không có chi nhánh nào khả dụng để chuyển đến",
  processing: "Đang xử lý...",
  viewAllBranches: "Xem tất cả",
  allBranches: "Tất cả chi nhánh",

  // Search
  searchByName: "Tìm kiếm theo tên",

  // Edit staff form tabs
  basicInfo: "Thông tin cơ bản",
  certificates: "Chứng chỉ",
  photo: "Ảnh",


  // Address related
  city: "Tỉnh/Thành phố",
  district: "Quận/Huyện",
  ward: "Phường/Xã",
  fullAddress: "Địa chỉ đầy đủ",

  // Photo related
  uploadProfilePictureDesc: "Tải lên ảnh đại diện cho nhân viên này",
  uploadImage: "Tải ảnh lên",
  remove: "Xóa",
  currentPhoto: "Ảnh hiện tại",

  // Status messages
  editingBasicInfo: "Đang chỉnh sửa thông tin cơ bản",
  viewingCertificates: "Đang xem chứng chỉ",
  editingAddress: "Đang chỉnh sửa địa chỉ",
  editingPhoto: "Đang chỉnh sửa ảnh đại diện",
  updateStaffInfo: "Cập nhật thông tin nhân viên",
  changeStaffBranch: "Thay đổi chi nhánh nhân viên",
  updateStaffBranch: "Cập nhật chi nhánh cho nhân viên này",
  }
  