import { OrderStatus } from "@/features/booking/types";

export type OrderItem = {
  id: string;
  customerName: string;
  serviceName: string;
  totalAmount: number;
  discount: number;
  depositAmount: number;
  finalAmount: number;
  orderDate: string; // ISO format "YYYY-MM-DD"
  status: OrderStatus;
  customerPhone: string;
  customerEmail: string;
  isFromLivestream: boolean;
  livestreamName: string | null;
};

export type ServiceBooking = {
  id: string;
  serviceName: string;
  procedurePriceType: string;
  price: number;
  duration: number; // in minutes
  customerEmail: string;
  customerPhone: string;
};

export interface ScheduleFeedback {
  customerScheduleId: string;
  Rating: number;
  Content: string;
}

export interface CreateFeedbackPayload {
  orderId: string;
  images?: File[]; // support multiple files
  content: string;
  rating: number;
  scheduleFeedbacks: ScheduleFeedback[];
}

export interface CustomerSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  profileUrl: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleDetail {
  id: string;
  customerName: string;
  serviceName: string;
  totalAmount: number;
  discount: number;
  depositAmount: number;
  finalAmount: number;
  orderDate: string;
  status: string;
  customerPhone: string;
  customerEmail: string;
  isFromLivestream: boolean;
  livestreamName: string | null;
  customerSchedules: CustomerSchedule[];
}
