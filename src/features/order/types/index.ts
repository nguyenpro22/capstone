import { OrderStatus } from "@/features/booking/types";

export type OrderItem = {
  id: string;
  customerName: string;
  serviceName: string;
  totalAmount: number;
  discount: number;
  depositAmount: number;
  finalAmount: number;
  orderDate: string; // You can use Date type if you want to parse it to a Date object
  status: OrderStatus; // Use string literal types for predefined statuses
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
  procedureName: string;
  profileUrl: string;
  status: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  feedbackContent: string | null;
  doctorFeedbackRating: number | null;
  feedbackCreatedOnUtc: string | null;
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
  status: OrderStatus;
  customerPhone: string;
  customerEmail: string;
  isFromLivestream: boolean;
  isFinished: boolean;
  livestreamName: string | null;
  feedbackContent: string | null;
  feedbackRating: number | null;
  feedbackImages: string | null;
  customerSchedules: CustomerSchedule[];
}
