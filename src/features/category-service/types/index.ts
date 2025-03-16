export interface CategoryDetail {
  id: string
  name: string
  description: string
  isParent: boolean
  parentId?: string
  isDeleted: boolean
  subCategories?: SubCategory[]
}


  export interface SubCategory {
    id: string
    name: string
    description: string
    isParent: boolean
    parentId: string
    isDeleted: boolean
  }
  
export interface CategoryDetailResponse {
  value: CategoryDetail;
  isSuccess: boolean;
}