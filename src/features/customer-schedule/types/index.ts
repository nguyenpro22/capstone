export interface CustomerSchedule {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  serviceName: string;
  doctorId: string;
  doctorName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  procedurePriceTypeName: string;
  procedureName: string; // Added procedureName field
  stepIndex: string;
  isFirstCheckIn: boolean;
  // Updated pricing fields
  servicePrice: number;
  discountAmount: number;
  depositAmount: number;
  amount: number;
  note?: string;
}

export interface CustomerScheduleForClinic {
  id: string;
  customerName?: string;
  doctorId: string;
}

// Define the interface for the update schedule request body
export interface UpdateCustomerScheduleRequest {
  customerScheduleId: string;
  date: string;
  startTime: string;
  isNext: boolean;
}
export interface ApproveCustomerScheduleRequest {
  customerScheduleId: string;
  status: string;
}

export interface BusyTime {
  start: string;
  end: string;
  date: string;
}
