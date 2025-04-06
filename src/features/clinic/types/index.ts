export interface Clinic {
  id: string;
  name: string;
  email: string;
  fullAddress: string;
  totalBranches: number;
  isActivated: boolean;
  profilePictureUrl?: string;
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
  address: string;
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
