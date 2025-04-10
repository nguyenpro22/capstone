import { Messages } from "../types";

export const doctorMessages: Messages["staffDoctor"] = {
    // Page titles and general
    doctorList: "Danh Sách Bác Sĩ",
  addNewDoctor: "Thêm Bác Sĩ Mới",
  noDoctorsAvailable: "Không có bác sĩ nào",
  addYourFirstDoctor: "Thêm bác sĩ đầu tiên của bạn",

  // Table headers
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
  viewDoctorDetail: "Xem chi tiết bác sĩ",
  editDoctor: "Chỉnh sửa bác sĩ",
  deleteDoctor: "Xóa bác sĩ",
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
  doctorAddedSuccess: "Thêm bác sĩ thành công!",
  doctorAddedFailed: "Thêm bác sĩ thất bại. Vui lòng thử lại.",
  doctorUpdatedSuccess: "Cập nhật bác sĩ thành công!",
  doctorUpdatedFailed: "Cập nhật bác sĩ thất bại. Vui lòng thử lại.",
  doctorDeletedSuccess: "Xóa bác sĩ thành công!",
  doctorDeletedFailed: "Xóa bác sĩ thất bại!",
  branchChangedSuccess: "Thay đổi chi nhánh thành công!",
  branchChangeFailed: "Thay đổi chi nhánh thất bại. Vui lòng thử lại.",
  clinicIdNotFound: "Không tìm thấy ID phòng khám. Vui lòng thử lại hoặc liên hệ hỗ trợ.",

  // Doctor details
  doctorDetails: "Chi tiết bác sĩ",
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

  // Edit doctor form tabs
  basicInfo: "Thông tin cơ bản",
  certificates: "Chứng chỉ",
  photo: "Ảnh",

  // Certificate related
  doctorCertificates: "Chứng chỉ bác sĩ",
  expiryDate: "Ngày hết hạn",
  note: "Ghi chú",
  viewCertificate: "Xem chứng chỉ",
  expired: "Đã hết hạn",
  noCertificates: "Không có chứng chỉ nào",
  certificateNote:
    "Chứng chỉ có thể được thêm hoặc cập nhật thông qua phần quản lý bác sĩ. Các thay đổi ở đây chỉ cập nhật thông tin cơ bản của bác sĩ.",

  // Address related
  city: "Tỉnh/Thành phố",
  district: "Quận/Huyện",
  ward: "Phường/Xã",
  fullAddress: "Địa chỉ đầy đủ",

  // Photo related
  uploadProfilePictureDesc: "Tải lên ảnh đại diện cho bác sĩ này",
  uploadImage: "Tải ảnh lên",
  remove: "Xóa",
  currentPhoto: "Ảnh hiện tại",

  // Status messages
  editingBasicInfo: "Đang chỉnh sửa thông tin cơ bản",
  viewingCertificates: "Đang xem chứng chỉ",
  editingAddress: "Đang chỉnh sửa địa chỉ",
  editingPhoto: "Đang chỉnh sửa ảnh đại diện",
  updateDoctorInfo: "Cập nhật thông tin bác sĩ",
  changeDoctorBranch: "Thay đổi chi nhánh bác sĩ",
  updateDoctorBranch: "Cập nhật chi nhánh cho bác sĩ này",
  deleteDoctorConfirmation: "Bạn có chắc chắn muốn xóa bác sĩ này? Hành động này không thể hoàn tác.",
  confirmDelete: "Xác nhận xóa",  
  }
  
