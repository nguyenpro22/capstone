import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(time: string): string {
  // Convert 24-hour format to 12-hour format
  const [hour, minute] = time.split(":").map(Number)
  const period = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

export function getServiceColor(service: string): string {
  if (service.toLowerCase().includes("consultation")) {
    return "bg-blue-100 text-blue-800 border-blue-300"
  } else if (service.toLowerCase().includes("treatment")) {
    return "bg-green-100 text-green-800 border-green-300"
  } else if (service.toLowerCase().includes("follow-up")) {
    return "bg-purple-100 text-purple-800 border-purple-300"
  }
  return "bg-gray-100 text-gray-800 border-gray-300"
}

