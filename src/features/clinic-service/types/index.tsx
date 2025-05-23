import type { Clinic } from "@/features/clinic/types";

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ImageObject {
  id: string;
  index: number;
  url: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  discountPercent: number | string;
  discountMaxPrice?: number;
  discountMinPrice?: number;
  depositPercent: number;
  isRefundable: boolean;
  coverImage?: ImageObject[]; // Array of image objects, not strings
  descriptionImage?: ImageObject[]; // Array of image objects, not strings
  category: Category;
  clinics?: Clinic[];
}

// New interface for updating services
export interface UpdateService extends Partial<Service> {
  indexCoverImagesChange?: string; // Indices of cover images to change
  indexDescriptionImagesChange?: string; // Indices of description images to change
  categoryId?: string; // Category ID for update operations
  clinicId: string;
}

export interface ProcedurePriceType {
  id: string;
  name: string;
  duration: number;
  price: number;
  isDefault: boolean;
}
export interface PriceType {
  name: string;
  duration: number;
  price: number;
  isDefault: boolean;
}

export interface Procedure {
  id: string;
  name: string;
  description?: string;
  stepIndex: number;
  coverImage?: string[];
  procedurePriceTypes?: ProcedurePriceType[] | undefined;
}

export interface ServiceDetail extends Service {
  procedures: Procedure[];
}

export interface ServiceDetailResponse {
  value: {
    items: Service[];
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

// For FormData submission
export interface UpdateServiceRequest {
  id: string;
  data: FormData;
}

export interface ProcedureRequest {
  clinicServiceId: string;
  name: string;
  description: string;
  stepIndex: number;
  procedurePriceTypes: PriceType[];
}

// Add the new interface for updating procedures
export interface UpdateProcedureRequest {
  serviceId: string;
  procedureId: string;
  name: string;
  description: string;
  stepIndex: number;
  procedurePriceTypes: ProcedurePriceType[];
}
