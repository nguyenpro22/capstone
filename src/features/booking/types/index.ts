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
