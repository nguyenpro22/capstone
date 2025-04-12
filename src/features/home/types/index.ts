export interface ICategory {
  id: string;
  name: string;
  description: string;
  isParent: boolean;
  parentId: string | null;
  isDeleted: boolean;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  profilePicture: string | null;
  city: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  fullAddress: string;
}
