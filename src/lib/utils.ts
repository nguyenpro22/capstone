import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}
// Format time for display
export function formatTime (timeString: string)  {
  if (!timeString) return "";

  try {
    // Handle common format HH:MM:SS
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeString)) {
      // Just return the first 5 characters (HH:MM)
      return timeString.substring(0, 5);
    }

    // If it's already in HH:MM format, return as is
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // Try to parse as Date object if it's in another format
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    // If all else fails, return the original string
    return timeString;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
};

