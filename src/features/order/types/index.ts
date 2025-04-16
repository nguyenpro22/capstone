import { OrderStatus } from "@/features/booking/types";

export type OrderItem = {
  id: string;
  customerName: string;
  serviceName: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  orderDate: string;
  status: OrderStatus;
  customerPhone: string;
  customerEmail: string;
  isFromLivestream: boolean;
  livestreamName: string;
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
