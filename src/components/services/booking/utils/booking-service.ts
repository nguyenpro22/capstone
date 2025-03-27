import { TimeSlot } from "@/features/booking/types";
import type { Doctor, Clinic, Procedure, Service } from "../types/booking";

export const BookingService = {
  // Get doctors by service ID
  getDoctorsByService: async (service: Service): Promise<Doctor[]> => {
    return service.doctorServices.map((ds) => ds.doctor);
  },

  // Get clinics by service ID
  getClinicsByService: async (service: Service): Promise<Clinic[]> => {
    return service.clinics;
  },

  // Get procedures by service ID
  getProceduresByService: async (service: Service): Promise<Procedure[]> => {
    return service.procedures;
  },

  // Get busy time slots for a doctor at a specific clinic on a given date

  // Get available time slots (1-hour intervals from 8:00 to 20:00)
  getAvailableTimeSlots: async (busySlots: TimeSlot[]): Promise<string[]> => {
    // Generate all possible time slots (from 8:00 to 20:00 with 1-hour intervals)
    const allTimeSlots: string[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      allTimeSlots.push(`${formattedHour}:00`);
    }

    // Filter out busy slots - if any part of an hour is busy, disable the entire hour
    const availableSlots = allTimeSlots.filter((timeSlot) => {
      const hour = Number.parseInt(timeSlot.split(":")[0]);

      // Check if this hour overlaps with any busy slot
      return !busySlots.some((busySlot) => {
        const busyStartHour = Number.parseInt(busySlot.start.split(":")[0]);
        const busyEndHour = Number.parseInt(busySlot.end.split(":")[0]);
        const busyEndMinute = Number.parseInt(busySlot.end.split(":")[1]);

        // If end minute is 0 and end hour is greater than start hour,
        // it means the end time is exactly at the hour boundary
        const adjustedBusyEndHour =
          busyEndMinute === 0 && busyEndHour > busyStartHour
            ? busyEndHour - 1
            : busyEndHour;

        // If the busy slot overlaps with this hour, disable it
        return hour >= busyStartHour && hour <= adjustedBusyEndHour;
      });
    });

    console.log("Available slots:", availableSlots);
    return availableSlots;
  },
};
// const formattedDate = date.toISOString().split("T")[0];
