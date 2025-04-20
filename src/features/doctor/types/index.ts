import { OrderStatus } from "@/features/booking/types";

export type WorkingSchedule = {
  workingScheduleId: string;
  startTime: string;
  endTime: string;
  status: OrderStatus;
  stepIndex: string;
  customerName: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  customerScheduleId: string;
  currentProcedureName: string;
};

export type DoctorWorkingSchedule = {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  workingSchedules: WorkingSchedule[];
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
