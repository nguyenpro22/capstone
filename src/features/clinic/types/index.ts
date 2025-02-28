export interface Clinic {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  totalBranches: number;
  profilePictureUrl: string;
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
  address: string;
  taxCode: string;
  businessLicenseUrl: string;
  operatingLicenseUrl: string;
  operatingLicenseExpiryDate: string;
  profilePictureUrl: string;
  isActivated: boolean;
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
