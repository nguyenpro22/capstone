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
  dateOfBirth: string; // You can use string for ISO date format or Date if you're parsing it
  email: string;
  phone: string;
  profilePicture: string | null; // Profile picture can either be a string (URL) or null
  city: string | null; // City can be a string or null
  district: string | null; // District can be a string or null
  ward: string | null; // Ward can be a string or null
  address: string | null; // Address can be a string or null
  fullAddress: string; // Full address is a string, can be empty
  balance: number;
}
