export interface RequestItem {
    id: string;
    name: string;
    email: string;
    address: string;
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
