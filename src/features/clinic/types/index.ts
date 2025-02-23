export interface Clinic {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  totalBranches: number;
  isActivated: boolean;
}

export interface ClinicDetailResponse {
  value: Clinic;
  isSuccess: boolean;
}

export interface ClinicsResponse {
  value: Clinic[];
  isSuccess: boolean;
}
