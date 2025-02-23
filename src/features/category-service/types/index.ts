export interface Category {
    id: string;
    name: string;
    description: string;
    isParent: boolean;
    parentId: string | null;
    isDeleted: boolean;
  }
  
export interface CategoryDetailResponse {
  value: Category;
  isSuccess: boolean;
}