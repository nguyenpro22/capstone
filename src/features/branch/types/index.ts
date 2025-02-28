export interface Branch {
    id: string;
    name: string;
    description: string;
    isParent: boolean;
    parentId: string | null;
    isDeleted: boolean;
  }
  
export interface BranchDetailResponse {
  value: Branch;
  isSuccess: boolean;
}