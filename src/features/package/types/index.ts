export interface Package {
  id: string
  name: string
  description: string
  price: number // Changed from string to number based on API response
  duration: number // Changed from string to number based on API response
  isActivated: boolean // Changed from status: string to match API response
  limitBranch: number
  limitLiveStream: number
  enhancedViewer: number
}

export interface PackagesResponse {
  value: {
    items: Package[]
    pageIndex: number
    pageSize: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  isSuccess: boolean
  isFailure: boolean
  error: {
    code: string
    message: string
  }
}

export interface PackageDetailResponse {
  value: Package
  isSuccess: boolean
  isFailure: boolean // Added to match API response pattern
  error: {
    code: string
    message: string
  }
}

// Optional: Add request types for better type safety
export interface GetPackagesParams {
  pageIndex: number
  pageSize: number
  searchTerm: string
}

