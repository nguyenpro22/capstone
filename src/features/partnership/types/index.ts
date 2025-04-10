export interface RequestItem {
    id: string;
    name: string;
    email: string;
    fullAddress: string;
    totalApply: number;
  }

  
export interface PartnershipRequestsResponse {
  value: {
    items: RequestItem[]
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
