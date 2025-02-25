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
}

export interface ClinicDetailResponse {
  value: Clinic;
  isSuccess: boolean;
}