export interface ServiceImage {
  id: string;
  index: number;
  url: string;
}

export interface Clinic {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  profilePictureUrl: string;
  isParent: boolean;
  parentId: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ProcedurePriceType {
  id: string;
  name: string;
  price: number;
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  stepIndex: number;
  coverImage: string[];
  procedurePriceTypes: ProcedurePriceType[];
}

export interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  discountPercent: number;
  discountMaxPrice: number;
  discountMinPrice: number;
  coverImage: ServiceImage[];
  descriptionImage: ServiceImage[];
  clinics: Clinic[];
  category: Category;
  procedures: Procedure[];
}
