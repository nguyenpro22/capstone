
export interface Category {
    id: string;
    name: string;
    description: string;
  }
export interface Service {
    id: string;
    name: string;
    description : string;
    price: number;
    coverImage: string[] | undefined; // Danh sách ảnh
    descriptionImages: string[];
    category: Category; // Thông tin danh mục dịch vụ
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