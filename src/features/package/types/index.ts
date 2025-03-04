export interface Package {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: string;
    status: string;
  }
export interface PackageDetailResponse {
  value: Package;
  isSuccess: boolean;
}