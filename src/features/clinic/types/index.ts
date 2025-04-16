import { Service } from "@/features/clinic-service/types";

export interface Clinic {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string | null;
  district: string | null;
  ward: string | null;
  fullAddress: string;
  taxCode: string;
  branchLimit: number;
  businessLicenseUrl: string;
  operatingLicenseUrl: string;
  operatingLicenseExpiryDate: string;
  profilePictureUrl: string | null;
  totalBranches: number;
  isActivated: boolean;
  bankName: string;
  bankAccountNumber: string;
  branches: {
    items: Branch[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  currentSubscription: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActivated: boolean;
    limitBranch: number;
    limitLiveStream: number;
    dateBought: string;
    dateExpired: string;
    daysLeft: number;
  };
  services: Service[];
}
export interface ProfileClinic {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string | null;
  district: string | null;
  ward: string | null;
  fullAddress: string;
  taxCode: string;
  businessLicenseUrl: string;
  operatingLicenseUrl: string;
  operatingLicenseExpiryDate: string | null;
  profilePictureUrl: string | null;
  totalBranches: number;
  isActivated: boolean;
  bankName: string;
  bankAccountNumber: string;
  branches: {
    items: Branch[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  services: Service[];
}

export interface ClinicsResponse {
  value: {
    items: Clinic[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface ClinicDetailResponse {
  value: Clinic;
  isSuccess: boolean;
}

export interface Branch {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  fullAddress: string | null;
  taxCode: string;
  businessLicenseUrl: string;
  operatingLicenseUrl: string;
  operatingLicenseExpiryDate: string | null;
  profilePictureUrl: string | null;
  totalBranches?: number;
  isActivated: boolean;
  bankName?: string;
  bankAccountNumber?: string;
  currentSubscription: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActivated: boolean;
    limitBranch: number;
    limitLiveStream: number;
    dateBought: string;
    dateExpired: string;
    daysLeft: number;
  };
  branches: {
    items: Branch[] | null;
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  services: any[] | null;
}

export interface BranchDetailResponse {
  value: {
    items: Branch[]; // Array of branches
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface SubscriptionResponse {
  documentId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActivated: boolean;
}

export interface TransactionDetails {
  transactionId: string;
  bankNumber: string;
  bankGateway: string;
  amount: number;
  orderDescription: string;
  qrUrl: string;
}
export interface Certificate {
  id: string;
  certificateUrl: string;
  certificateName: string;
  expiryDate: string;
  note?: string;
}
export interface Staff {
  id: string;
  clinicId: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  city: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  phoneNumber: string | null;
  fullAddress: string;
  profilePictureUrl: string | null;
  role: string;
  doctorCertificates: Array<Certificate>;
  branchs?: Array<Branch>;
}

export interface Doctor {
  id: string;
  clinicId: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  city: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  phoneNumber: string | null;
  fullAddress: string;
  profilePictureUrl: string | null;
  role: string;
  doctorCertificates: any | null;
  branchs?: Array<Branch>;
}

export interface ClinicBranchesData {
  clinics: {
    id: string;
    name: string;
    logo: string | null;
    balance: number;
    pendingWithdrawals: number;
    totalEarnings: number;
    bankName: string;
    bankAccountNumber: string;
    isMainClinic: boolean;
  }[];
  totals: {
    totalBalance: number;
    totalPendingWithdrawals: number;
    totalEarnings: number;
  };
}
export interface ClinicBranchData {
  id: string;
  name: string;
  logo: string | null;
  balance: number;
  pendingWithdrawals: number;
  totalEarnings: number;
  bankName: string;
  bankAccountNumber: string;
  isMainClinic: boolean;
}

// Định nghĩa type cho toàn bộ response
export interface ClinicBranchesResponse {
  value: ClinicBranchesData;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}
