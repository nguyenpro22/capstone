"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Phone, Stethoscope, Building, CreditCard } from "lucide-react"
import type { CustomerSchedule } from "@/features/customer-schedule/types"

interface ScheduleDetailsModalProps {
  schedule: CustomerSchedule | null
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
  disableCheckout?: boolean
}

export default function ScheduleDetailsModal({
  schedule,
  isOpen,
  onClose,
  onCheckout,
  disableCheckout = false,
}: ScheduleDetailsModalProps) {
  if (!schedule) return null

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Check if this is being viewed from the All Schedules section (history view)
  const isHistoryView =
    window.location.pathname.includes("/history") ||
    window.location.search.includes("history=true") ||
    (schedule.status.toLowerCase() !== "confirmed" && schedule.status.toLowerCase() !== "pending")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Schedule Details</DialogTitle>
          <DialogDescription>View the details of this scheduled appointment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-pink-700">Appointment Information</h3>
              <Badge
                className={
                  schedule.status.toLowerCase() === "confirmed"
                    ? "bg-green-500"
                    : schedule.status.toLowerCase() === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              >
                {schedule.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Customer</p>
                  <p className="text-sm text-gray-600">{schedule.customerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-600">{schedule.customerPhoneNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Service</p>
                  <p className="text-sm text-gray-600">{schedule.serviceName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Doctor</p>
                  <p className="text-sm text-gray-600">{schedule.doctorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Date</p>
                  <p className="text-sm text-gray-600">{schedule.bookingDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Time</p>
                  <p className="text-sm text-gray-600">{formatTimeRange(schedule.startTime, schedule.endTime)}</p>
                </div>
              </div>

              {schedule.amount && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Price</p>
                    <p className="text-sm text-gray-600">{formatPrice(schedule.amount)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {schedule.note && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{schedule.note}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!isHistoryView && (
            <Button
              onClick={onCheckout}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              disabled={disableCheckout || schedule.status.toLowerCase() === "pending"}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
