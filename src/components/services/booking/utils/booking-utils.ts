import { BookingRequest } from "@/features/booking/types";
import { BookingData, Procedure } from "../types/booking";

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Get initials for avatar fallback
export const getInitials = (name: string): string => {
  if (!name) {
    return ""; // Return an empty string if the name is undefined or empty
  }
  
  return name
    .split(" ") // Split the name by spaces
    .map((part) => part[0]) // Get the first character of each part
    .join("") // Join the initials into a string
    .toUpperCase(); // Convert the result to uppercase
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

// Group time slots by period (morning, afternoon, evening)
export const groupTimeSlots = (availableTimeSlots: string[]) => {
  const morning = availableTimeSlots.filter((time) => {
    const hour = Number.parseInt(time.split(":")[0]);
    return hour >= 8 && hour < 12;
  });

  const afternoon = availableTimeSlots.filter((time) => {
    const hour = Number.parseInt(time.split(":")[0]);
    return hour >= 12 && hour < 17;
  });

  const evening = availableTimeSlots.filter((time) => {
    const hour = Number.parseInt(time.split(":")[0]);
    return hour >= 17 && hour <= 20;
  });

  return { morning, afternoon, evening };
};
