export type BookingStatus = "Pending" | "Success" | "Canceled";

export interface UserBooking {
  id: string;
  bookingDate: string;
  time: string;
  service: {
    id: string;
    name: string;
    imageUrl: string;
  };
  doctor: {
    id: string;
    fullName: string;
    profilePictureUrl: string | null;
  };
  clinic: {
    id: string;
    name: string;
    address: string;
  };
  status: BookingStatus;
  currentProcedureIndex?: number; // Only for pending bookings
  procedures: {
    id: string;
    name: string;
    completed: boolean;
    scheduledDate?: string;
  }[];
  totalPrice: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerName: string;
  start: string;
  end: string;
  serviceName: string;
  currentProcedurePriceType: string;
  status: BookingStatus;
  date: string;
}
export interface BookingParams {
  pageIndex?: number;
  pageSize?: number;
  status?: BookingStatus | "All";
}

export interface BookingRequest {
  doctorId: string;
  startTime: string;
  bookingDate: string; // MM/DD/YYYY format
  clinicId: string;
  serviceId: string;
  procedurePriceTypeIds: string[] | null;
  isDefault: boolean;
}
export interface TimeSlot {
  start: string; // Định dạng HH:mm:ss
  end: string; // Định dạng HH:mm:ss
  date: string; // Định dạng YYYY-MM-DD
}
export enum OrderStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  UNCOMPLETED = "Uncompleted",
}

export type CustomerSchedule = {
  customerScheduleId: string;
  date: string;
  startTime: string;
};


export interface AppointmentCounts {
  total: number
  completed: number
  inProgress: number
  pending: number
  cancelled: number
}

export interface DailyData {
  date: string
  counts: AppointmentCounts
}

export interface Customer {
  id: string
  name: string
  avatar: string | null
}

export interface Service {
  id: string
  name: string
}

export interface Doctor {
  id: string
  name: string
}

export interface Clinic {
  id: string
  name: string
}

export interface Appointment {
  id: string
  customer: Customer
  service: Service
  startTime: string
  endTime: string
  duration: string
  status: string
  doctor: Doctor
  clinic: Clinic
}

