import { OrderStatus } from "@/features/booking/types";

export type DoctorWorkingSchedule = {
  workingScheduleId: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  status: OrderStatus; // OrderStatus
  note: string | null;
  stepIndex: string;
  customerName: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  currentProcedureName: string;
};

type WorkingDate = {
  date: string;
  startTime: string;
  endTime: string;
};

export type DoctorSchedule = {
  doctorId: string;
  workingDates: WorkingDate[];
};
export type Certificate = {
  id: string;
  doctorName: string;
  certificateUrl: string;
  certificateName: string;
  expiryDate: string;
  note: string | null;
};

export type ClinicShiftSchedule = {
  workingScheduleId: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm:ss
  endTime: string; // Format: HH:mm:ss
};
export type DoctorScheduleRequest = {
  clinicId: string;
  workingScheduleIds: string[];
};
