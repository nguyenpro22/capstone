// types.ts

export type CoverImage = {
  id: string;
  index: number;
  url: string;
};

export type Clinic = {
  id: string;
  name: string;
  email: string;
  address: string | null;
  phoneNumber: string;
  workingTimeStart: string;
  workingTimeEnd: string;
  profilePictureUrl: string | null;
  isParent: boolean;
  isActivated: boolean;
  parentId: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type ProcedurePriceType = {
  id: string;
  name: string;
  duration: number;
  price: number;
  isDefault: boolean;
};

export type Procedure = {
  id: string;
  name: string;
  description: string;
  stepIndex: number;
  procedurePriceTypes: ProcedurePriceType[];
};

export type DoctorCertificate = {
  id: string;
  certificateUrl: string;
  certificateName: string;
  expiryDate: string;
  note: string;
};

export type DoctorService = {
  id: string;
  serviceId: string;
  doctor: Doctor;
};

type Branding = {
  id: string;
  name: string;
  email: string;
  address: string | null;
  phoneNumber: string;
  workingTimeStart: string;
  workingTimeEnd: string;
  profilePictureUrl: string;
  isParent: boolean;
  isActivated: boolean;
  parentId: string | null;
};

// Type dùng cho danh sách services
export type ServiceItem = {
  id: string;
  name: string;
  branding: Branding;
  maxPrice: number;
  minPrice: number;
  discountPercent: string;
  discountMaxPrice: number;
  discountMinPrice: number;
  coverImage: CoverImage[];
  clinics: Clinic[];
  category: Category;
  doctorServices: DoctorService[];
  feedbacks: Feedback[];
};
export type Feedback = {
  feedbackId: string;
  serviceId: string;
  images: string[];
  content: string;
  rating: number;
  user: User;
  isView: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type User = {
  id: string;
  avatar: string;
  phoneNumber: string;
  fullName: string;
  firstName: string;
  lastName: string;
  address: string;
};

// Type dùng cho chi tiết 1 service
export type ServiceDetailResponse = {
  value: ServiceDetail;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
};

export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  branding: Branding;
  maxPrice: number;
  minPrice: number;
  discountPercent: string;
  discountMaxPrice: number;
  discountMinPrice: number;
  depositPercent: number;
  isRefundable: boolean;
  coverImage: CoverImage[];
  clinics: Clinic[];
  category: Category;
  procedures: Procedure[];
  promotions: any; // hoặc thay bằng interface nếu có
  doctorServices: DoctorService[];
  feedbacks: Feedback[];
}

export interface RecentlyViewedService extends ServiceItem {
  viewedAt: number; // timestamp when the service was viewed
}
export type Doctor = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  doctorCertificates: Certificate[]; // Chú ý thay thế Certificate nếu có cấu trúc cụ thể
};

type Certificate = {
  // Định nghĩa cấu trúc của chứng chỉ nếu cần
  certificateId: string;
  certificateName: string;
  issueDate: string;
};

export type DoctorServiceData = {
  id: string;
  doctorServices: DoctorService[];
};
