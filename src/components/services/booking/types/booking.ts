import { ServiceDetail, ServiceItem } from "@/features/services/types";

// API Request Type
export interface BookingRequest {
  doctorId: string;
  startTime: string;
  bookingDate: string; // MM/DD/YYYY format
  clinicId: string;
  serviceId: string;
  procedurePriceTypeIds: string[] | null;
  isDefault: boolean;
}

// API Response Types
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
  profilePictureUrl: string | null;
  isParent: boolean;
  parentId: string | null;
  isActivated: boolean;
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
  procedurePriceTypes: ProcedurePriceType[];
}

export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  doctorCertificates: any[];
}

export interface DoctorService {
  id: string;
  serviceId: string;
  doctor: Doctor;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  discountPercent: string;
  discountMaxPrice: number;
  discountMinPrice: number;
  coverImage: ServiceImage[];
  descriptionImage: ServiceImage[];
  clinics: Clinic[];
  category: Category;
  procedures: Procedure[];
  promotions: any | null;
  doctorServices: DoctorService[];
}

export interface ServiceResponse {
  value: Service;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface BookingData {
  service: ServiceDetail;
  doctor: Doctor | null;
  clinic: Clinic | null;
  date: Date | null;
  time: string | null;
  selectedProcedures: {
    procedure: Procedure;
    priceTypeId: string;
  }[];
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  paymentMethod: "cash" | "credit_card" | "bank_transfer" | null;
  isDefault: boolean;
  skipDoctorSelection: boolean;
}
