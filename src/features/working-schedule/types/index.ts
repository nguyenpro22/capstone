// API response interfaces that match the exact structure from the backend
export interface Shift {
  id: string
  name: string
  note: string
  startTime: string
  endTime: string
  createdAt: string
}

export interface ShiftsResponse {
  value: {
    items: Shift[]
    pageIndex: number
    pageSize: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  isSuccess: boolean
  isFailure: boolean
  error: {
    code: string
    message: string
  }
}

export interface WorkingScheduleResponseGetAll {
  id: string
  shiftGroupId: string
  capacity: number
  numberOfDoctors: number
  numberOfCustomers: number
  date: string
  startTime: string
  endTime: string
}

export interface WorkingScheduleDetail {
  workingScheduleId: string
  startTime: string
  endTime: string
  doctorId: string | null
  doctorName: string | null
  date: string
  status: string | null
  stepIndex: number | null
  customerName: string | null
  customerId: string | null
  serviceId: string | null
  serviceName: string | null
  customerScheduleId: string | null
  currentProcedureName: string | null
}

export interface IListResponse<T> {
  items: T[]
  pageIndex: number
  pageSize: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface IResCommon<T> {
  value: T
  isSuccess: boolean
  isFailure: boolean
  error: {
    code: string
    message: string
  }
}

// Interface for the API request to create working schedules
export interface WorkingSchedule {
  capacity: number
  shiftGroupId: string
  date: string
}

// Update the ExtendedWorkingSchedule interface to support multiple shifts
export interface ExtendedWorkingSchedule extends WorkingSchedule {
  doctorName?: string
  timeSlots?: TimeSlot[]
  error?: {
    field: string
    message: string
  }
  shifts?: {
    id: string
    name: string
    note: string
    startTime: string
    endTime: string
  }[]
  shiftName?: string
  shiftNote?: string
  startTime?: string
  endTime?: string
}

export interface TimeSlot {
  startTime: string
  endTime: string
  capacity: number
}

export interface BusyTimeSlot {
  start: string
  end: string
  date: string
}

export interface AvailableSlot {
  startTime: string
  endTime: string
  date: string
}
