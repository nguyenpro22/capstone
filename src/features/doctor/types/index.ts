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
