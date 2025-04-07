"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { CalendarIcon, Check } from "lucide-react"
import { toast } from "react-toastify"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useUpdateCustomerScheduleMutation } from "@/features/customer-schedule/api"
import type { CustomerSchedule } from "@/features/customer-schedule/types"

interface ScheduleFollowUpModalProps {
  schedule: CustomerSchedule | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const timeSlots = [
  "08:00:00",
  "08:30:00",
  "09:00:00",
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00",
  "11:30:00",
  "13:00:00",
  "13:30:00",
  "14:00:00",
  "14:30:00",
  "15:00:00",
  "15:30:00",
  "16:00:00",
  "16:30:00",
]

export default function ScheduleFollowUpModal({ schedule, isOpen, onClose, onSuccess }: ScheduleFollowUpModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState(false)
  const [startTime, setStartTime] = useState<string>("")
  const [updateCustomerSchedule, { isLoading }] = useUpdateCustomerScheduleMutation()
  const calendarRef = useRef<HTMLDivElement>(null)

  // Reset form when modal opens or schedule changes
  useEffect(() => {
    if (isOpen) {
      // Set default date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setDate(tomorrow)
      setStartTime("")
      setShowCalendar(false)
    }
  }, [isOpen, schedule])

  // Handle clicks outside the calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) && showCalendar) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCalendar])

  const handleSubmit = async () => {
    if (!schedule || !date || !startTime) {
      toast.error("Please select both date and time for the follow-up appointment")
      return
    }

    try {
      await updateCustomerSchedule({
        customerScheduleId: schedule.id,
        date: format(date, "yyyy-MM-dd"),
        startTime,
      }).unwrap()

      toast.success("Follow-up appointment scheduled successfully")
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Failed to schedule follow-up:", error)
      toast.error("Failed to schedule follow-up appointment. Please try again.")
    }
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    // We don't close the calendar here
  }

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  const confirmDateSelection = () => {
    setShowCalendar(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Follow-up Appointment</DialogTitle>
          <DialogDescription>
            Select a date and time for the next appointment for {schedule?.customerName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Button
                id="date"
                type="button"
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                onClick={toggleCalendar}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>

              {showCalendar && (
                <div ref={calendarRef} className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => {
                      // Disable dates in the past
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                  />
                  <div className="flex justify-end p-2 border-t">
                    <Button size="sm" variant="outline" onClick={confirmDateSelection} className="flex items-center">
                      <Check className="mr-1 h-4 w-4" />
                      Confirm
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time.substring(0, 5)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !date || !startTime}>
            {isLoading ? "Scheduling..." : "Schedule Follow-up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

