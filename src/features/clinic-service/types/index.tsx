
export interface Category {
    id: string;
    name: string;
    description: string;
  }
export interface Service {
    id: string;
    name: string;
    description : string;
    maxPrice: number;
    minPrice: number,
    discountPercent: string;
    coverImage?: string[] | undefined; // Danh sách ảnh
    descriptionImages: string[];
    category: Category; // Thông tin danh mục dịch vụ
  }
  export interface ProcedurePriceType {
    id: number;
    name: string;
    price: number;
  }
  export interface Procedure {
    id: number;
    name: string;
    description?: string;
    stepIndex: number;
    coverImage?: string[];
    procedurePriceTypes?: ProcedurePriceType[];
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