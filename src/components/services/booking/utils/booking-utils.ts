import { BookingRequest } from "@/features/booking/types";
import { BookingData, Procedure } from "../types/booking";

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get initials from a name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Parse time string to minutes since midnight
export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

// Convert minutes since midnight to time string (HH:MM)
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// Generate 30-minute time slots from time ranges
export function generateTimeSlots(
  timeRanges: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>
): string[] {
  const slots: string[] = [];
  const INTERVAL_MINUTES = 30;

  timeRanges.forEach((range) => {
    // Extract hours and minutes from the time strings
    // Handle both "HH:MM:SS" and "HH:MM" formats
    const startTimeParts = range.startTime.split(":");
    const endTimeParts = range.endTime.split(":");

    const startHour = Number.parseInt(startTimeParts[0], 10);
    const startMinute = Number.parseInt(startTimeParts[1], 10);

    const endHour = Number.parseInt(endTimeParts[0], 10);
    const endMinute = Number.parseInt(endTimeParts[1], 10);

    // Convert to minutes since midnight
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Generate slots at 30-minute intervals
    for (let time = startMinutes; time < endMinutes; time += INTERVAL_MINUTES) {
      slots.push(minutesToTime(time));
    }
  });

  // Sort and remove duplicates
  return [...new Set(slots)].sort();
}

// Group time slots by period (morning, afternoon, evening)
export function groupTimeSlots(timeSlots: string[]): {
  morning: string[];
  afternoon: string[];
  evening: string[];
} {
  const groups: { morning: string[]; afternoon: string[]; evening: string[] } =
    { morning: [], afternoon: [], evening: [] };

  timeSlots.forEach((time) => {
    const hour = Number.parseInt(time.split(":")[0], 10);

    if (hour < 12) {
      groups.morning.push(time);
    } else if (hour < 17) {
      groups.afternoon.push(time);
    } else {
      groups.evening.push(time);
    }
  });

  return groups;
}

// Format time for display (e.g., "08:30" -> "8:30 AM")
export function formatTimeDisplay(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number.parseInt(hourStr, 10);
  const minute = minuteStr;

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}
// Convert BookingData to BookingRequest
export const createBookingRequest = (
  bookingData: BookingData
): BookingRequest => {
  // Format date to MM/DD/YYYY format as required by the API
  const formattedDate = bookingData.date
    ? `${bookingData.date.getFullYear()}-${(bookingData.date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${bookingData.date
        .getDate()
        .toString()
        .padStart(2, "0")}`
    : "01/01/0001"; // Default date if none is selected

  // Create procedurePriceTypeIds array or null based on isDefault
  const procedurePriceTypeIds = bookingData.isDefault
    ? null
    : bookingData.selectedProcedures.map((item) => item.priceTypeId);

  // Use the highest rated doctor if skipDoctorSelection is true and no doctor is selected
  const doctorId = bookingData.doctor?.id || "";

  return {
    doctorId,
    startTime: bookingData.time || "",
    bookingDate: formattedDate,
    clinicId: bookingData.clinic?.id || "",
    serviceId: bookingData.service.id,
    procedurePriceTypeIds,
    isDefault: bookingData.isDefault,
  };
};
// Calculate total price
export const calculateTotalPrice = (
  selectedProcedures: {
    procedure: Procedure;
    priceTypeId: string;
  }[]
): number => {
  return selectedProcedures.reduce((total, item) => {
    const priceType = item.procedure.procedurePriceTypes.find(
      (pt) => pt.id === item.priceTypeId
    );
    return total + (priceType?.price || 0);
  }, 0);
};

// Calculate total price with VAT
export const calculateTotalPriceWithVAT = (
  selectedProcedures: {
    procedure: Procedure;
    priceTypeId: string;
  }[]
): number => {
  const subtotal = calculateTotalPrice(selectedProcedures);
  return Math.round(subtotal * 1.1); // Including 10% VAT
};
