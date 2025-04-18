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
  address: string;
  phoneNumber: string;
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

export type Doctor = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  doctorCertificates: DoctorCertificate[];
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
  profilePictureUrl: string | null;
  isActivated: boolean;
  isParent: boolean;
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

export type ServiceDetail = {
  id: string;
  name: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  branding: Clinic;
  discountPercent: string;
  discountMaxPrice: number;
  discountMinPrice: number;
  coverImage: CoverImage[];
  clinics: Clinic[];
  category: Category;
  procedures: Procedure[];
  promotions: any[]; // Nếu có schema rõ ràng thì thay `any`
  doctorServices: DoctorService[];
};

export interface RecentlyViewedService extends ServiceItem {
  viewedAt: number; // timestamp when the service was viewed
}
