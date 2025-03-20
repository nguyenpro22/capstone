export interface Clinic {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  phoneNumber: string;
  totalBranches: number;
  profilePictureUrl: string;
  bankName: string;
  bankAccountNumber: string;
  isActivated: boolean;
  
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
  city: string;
  district: string;
  phoneNumber: string;
  ward: string;
  address: string;
  fullAddress: string;
  taxCode: string;
  businessLicenseUrl: string;
  operatingLicenseUrl: string;
  operatingLicenseExpiryDate: string;
  profilePictureUrl: string;
  isActivated: boolean;
  branches: Branch[];
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
  id: string
  certificateUrl: string
  certificateName: string
  expiryDate: string
  note?: string
}
export interface Staff {
  id: string
  clinicId: string
  employeeId: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  city: string | null
  district: string | null
  ward: string | null
  address: string | null
  phoneNumber: string | null
  fullAddress: string
  profilePictureUrl: string | null
  role: string
  doctorCertificates: Array<Certificate>
  branchs?: Array<Branch>
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
  branchs?: Array<Branch>
}
