export interface RequestItem {
    id: string;
    name: string;
    email: string;
    fullAddress: string;
    totalApply: number;
  }

  export interface BranchRequestItem {
    id: string;
    name: string;
    createdOnUtc: string;
    parentId: string;
    parentName: number;
    parentEmail: string;
    parentPhoneNumber: string;
    parentCity: string;
    parentDistrict: string;
    parentWard: number;
    parentAddress: string;
    rejectReason: number;
  }


  
export interface PartnershipRequestsResponse {
  value: {
    items: RequestItem[]
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
export interface ClinicApplication {
  name: string
  email: string
  phoneNumber: string
  city: string
  district: string
  ward: string
  address: string
  taxCode: string
  bankName: string
  bankAccountNumber: string
  businessLicense: string
  operatingLicense: string
  operatingLicenseExpiryDate: string
  profilePictureUrl: string
  rejectReason: string
}
