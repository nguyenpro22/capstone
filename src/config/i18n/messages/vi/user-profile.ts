import { Messages } from "../types";

export const userProfileMessages: Messages["userProfileMessages"] = {
  header: {
    profile: {
      title: "Thông tin cá nhân",
      description: "Xem và quản lý thông tin cá nhân của bạn",
    },
    wallet: {
      title: "Ví của tôi",
      description: "Quản lý ví và xem số dư của bạn",
    },
  },
  sidebar: {
    balance: "Số dư ví",
    navigation: {
      profile: "Thông tin cá nhân",
      wallet: "Ví của tôi",
      deposit: "Nạp tiền",
      withdraw: "Rút tiền",
      history: "Lịch sử giao dịch",
    },
    backHome: "Quay lại trang chủ",
  },
  profile: {
    actions: {
      edit: "Chỉnh sửa",
      cancel: "Hủy",
      save: "Lưu thay đổi",
      saving: "Đang lưu...",
    },
    sections: {
      personal: {
        title: "Thông tin cá nhân",
        fullName: "Họ và tên",
        firstName: "Tên",
        lastName: "Họ",
        dateOfBirth: "Ngày sinh",
        avatar: "Ảnh đại diện",
      },
      contact: {
        title: "Thông tin liên hệ",
        email: "Email",
        phone: "Số điện thoại",
      },
      address: {
        title: "Thông tin địa chỉ",
        province: "Thành phố/Tỉnh",
        district: "Quận/Huyện",
        ward: "Phường/Xã",
        detail: "Địa chỉ chi tiết",
        fullAddress: "Địa chỉ đầy đủ",
        area: "Khu vực",
        selectProvince: "Chọn Thành phố/Tỉnh",
        selectDistrict: "Chọn Quận/Huyện",
        selectWard: "Chọn Phường/Xã",
        selectDistrictFirst: "Vui lòng chọn Quận/Huyện trước",
        selectWardFirst: "Vui lòng chọn Phường/Xã trước",
        placeholder: "Số nhà, tên đường, khu vực...",
      },
    },
  },
  wallet: {
    balance: {
      title: "Số dư hiện tại",
      current: "Số dư hiện tại",
      lastUpdate: "Cập nhật lần cuối: {date}",
    },
    actions: {
      deposit: "Nạp tiền vào ví",
      withdraw: "Rút tiền từ ví",
    },
  },
  messages: {
    success: "Cập nhật thông tin thành công",
    error: "Cập nhật thông tin thất bại. Vui lòng thử lại sau.",
    imageSize: "Kích thước ảnh vượt quá 5MB.",
  },
};
