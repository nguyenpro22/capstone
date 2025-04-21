export interface BusyTimeSlot {
  start: string;
  end: string;
  date: string;
}
export interface AvailableSlot {
  startTime: string;
  endTime: string;
  date: string;
}

export interface AvailableTimesResponse {
  value: AvailableSlot[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}
export interface BusyTimesResponse {
  value: BusyTimeSlot[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
}

// WorkingSchedule interface that matches the API expectation
export interface WorkingSchedule {
  shiftGroupId: string;
  date: string;
  capacity: number;
}

export interface WorkingScheduleDetail {
  workingScheduleId: string;
  doctorId: string | null;
  doctorName: string | null;
  clinicId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string | null;
  stepIndex: number | null;
  customerName: string | null;
  customerId: string | null;
  serviceId: string | null;
  serviceName: string | null;
  customerScheduleId: string | null;
  currentProcedureName: string | null;
}
// Extended WorkingSchedule for UI with timeSlots
export interface ExtendedWorkingSchedule {
  date: string;
  capacity: number;
  timeSlots?: TimeSlot[];
}

export interface WorkingScheduleResponse {
  workingScheduleId: string;
  doctorId: number;
  doctorName?: string;
  clinicId: string;
  date: string;
  startTime: number;
  endTime?: string;
  status?: string;
  stepIndex: string;
  customerName: number;
  customerId?: string;
  serviceId?: string;
  serviceName: string;
  customerScheduleId: string;
  currentProcedureName: string;
}
