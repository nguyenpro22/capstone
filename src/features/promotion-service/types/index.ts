export interface ServicePromotion {
    id: string;
    name: string;
    description: string;
    isParent: boolean;
    parentId: string | null;
    isDeleted: boolean;
  }
  
export interface ServicePromotionDetailResponse {
  value: ServicePromotion;
  isSuccess: boolean;
}