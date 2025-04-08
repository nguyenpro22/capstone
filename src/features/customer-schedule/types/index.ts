export interface CustomerSchedule {
  id: string
  orderId: string
  amount: number
  customerName: string
  customerPhoneNumber: string
  serviceName: string
  doctorName:string
  doctorId: string
  bookingDate: string
  startTime: string
  endTime: string
  status: string
  procedurePriceTypeName?: string
  note: string
  isFirstCheckIn: boolean
}

// Define the interface for the update schedule request body
export interface UpdateCustomerScheduleRequest {
  customerScheduleId: string
  date: string
  startTime: string
}