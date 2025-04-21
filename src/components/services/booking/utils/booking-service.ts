import type { Doctor, Clinic } from "../types/booking";
import type { Procedure, ServiceDetail } from "@/features/services/types";
import { generateTimeSlots } from "./booking-utils";

export const BookingService = {
  // Get doctors by service ID
  getDoctorsByService: async (service: ServiceDetail): Promise<Doctor[]> => {
    return service.doctorServices.map((ds) => ds.doctor);
  },

  // Get clinics by service ID
  getClinicsByService: async (service: ServiceDetail): Promise<Clinic[]> => {
    return service.clinics.map((clinic) => ({
      ...clinic,
      address: clinic.address ?? "",
    }));
  },

  // Get procedures by service ID
  getProceduresByService: async (
    service: ServiceDetail
  ): Promise<Procedure[]> => {
    return service.procedures;
  },

  // Process available time ranges into 30-minute slots
  getAvailableTimeSlots: async (
    timeRanges: Array<{
      date: string;
      startTime: string;
      endTime: string;
    }>
  ): Promise<string[]> => {
    // Generate 30-minute time slots from the available time ranges
    return generateTimeSlots(timeRanges);
  },
};
