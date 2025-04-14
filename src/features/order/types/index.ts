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
