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
  start: string; // "HH:mm:ss"
  end: string; // "HH:mm:ss"
  serviceName: string;
  procedureId: string;
  stepIndex: number;
  name: string;
  duration: number;
  dateCompleted: string; // "YYYY-MM-DD"
  status: BookingStatus;
  date: string; // "YYYY-MM-DD"
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
  liveStreamRoomId?: string | null;
}
export interface AvailableTime {
  date: string;
  startTime: string;
  endTime: string;
}
export enum OrderStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  UNCOMPLETED = "Uncompleted",
  CANCELED = "Canceled",
}

export type CustomerSchedule = {
  customerScheduleId: string;
  date: string;
  startTime: string;
};

export interface AppointmentCounts {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
}

export interface DailyData {
  date: string;
  counts: AppointmentCounts;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Service {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
}

export interface Clinic {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  customer: Customer;
  service: Service;
  startTime: string;
  endTime: string;
  duration: string;
  status: string;
  doctor: Doctor;
  clinic: Clinic;
}

type ProcedureStepDetail = {
  procedureName: string | null;
  stepIndex: string;
  procedurePriceType: string;
  duration: number;
  dateCompleted: string | null;
  timeCompleted: string | null;
  status: string;
};

type ServiceDetail = {
  id: string;
  name: string;
  imageUrls: string[] | null;
};

type DoctorDetail = {
  id: string;
  name: string;
  imageUrl: string | null;
};

type ClinicDetail = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type AppointmentDetail = {
  id: string;
  customerName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number | null;
  doctorNote: string | null;
  status: OrderStatus;
  service: ServiceDetail;
  doctor: DoctorDetail;
  clinic: ClinicDetail;
  procedureHistory: ProcedureStepDetail[];
};
export type Order = {
  id: string;
  customerName: string;
  serviceName: string;
  finalAmount: number;
  orderDate: string; // ISO format: "YYYY-MM-DD"
  status:
    | "Completed"
    | "Pending"
    | "In Progress"
    | "Uncompleted"
    | "Waiting Approval"
    | string;
};
