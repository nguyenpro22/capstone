"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUpdateCustomerScheduleMutation, useLazyGetScheduleByIdQuery } from "@/features/customer-schedule/api";
import { useLazyGetDoctorBusyTimesQuery } from "@/features/working-schedule/api";

import type { CustomerSchedule } from "@/features/customer-schedule/types";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";

interface ScheduleFollowUpModalProps {
  schedule: CustomerSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BusyTimeSlot {
  start: string;
  end: string;
  date: string;
}

const allTimeSlots = [
  "08:00:00", "08:30:00", "09:00:00", "09:30:00", "10:00:00", "10:30:00",
  "11:00:00", "11:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00",
  "15:00:00", "15:30:00", "16:00:00", "16:30:00",
];

export default function ScheduleFollowUpModal({ schedule, isOpen, onClose, onSuccess }: ScheduleFollowUpModalProps) {
  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startTime, setStartTime] = useState<string>("");
  const [busyTimeSlots, setBusyTimeSlots] = useState<BusyTimeSlot[]>([]);
  const [updateCustomerSchedule, { isLoading }] = useUpdateCustomerScheduleMutation();
  const [getDoctorBusyTimes, { isLoading: isLoadingBusyTimes }] = useLazyGetDoctorBusyTimesQuery();
  const [getScheduleById, { isLoading: isLoadingSchedule }] = useLazyGetScheduleByIdQuery();
  const [scheduleDetail, setScheduleDetail] = useState<CustomerSchedule | null>(null);
  const [calendarRef, setCalendarRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && schedule) {
      fetchScheduleDetails(schedule.id);
    }
  }, [isOpen, schedule]);

  const fetchScheduleDetails = async (scheduleId: string) => {
    try {
      const result = await getScheduleById(scheduleId).unwrap();
      if (result.isSuccess && result.value) {
        setScheduleDetail(result.value);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow);
        if (result.value.doctorId && clinicId) {
          fetchBusyTimes(tomorrow, result.value.doctorId, clinicId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch schedule details:", error);
      toast.error("Failed to load appointment details. Please try again.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStartTime("");
      setShowCalendar(false);
      setBusyTimeSlots([]);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef && !calendarRef.contains(event.target as Node) && showCalendar) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar, calendarRef]);

  const fetchBusyTimes = async (selectedDate: Date, doctorId: string, clinicId: string) => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      console.log(`Fetching busy times with params:`, { doctorId, clinicId, date: formattedDate });

      if (!doctorId || !clinicId || !formattedDate) {
        throw new Error("Missing required parameters: " + JSON.stringify({ doctorId, clinicId, date: formattedDate }));
      }

      const queryResult = getDoctorBusyTimes({ doctorId, clinicId, date: formattedDate });
      console.log("Query result before unwrap:", queryResult);

      const response = await queryResult.unwrap();
      console.log("Unwrapped API response:", response);

      if (response && response.isSuccess && Array.isArray(response.value)) {
        setBusyTimeSlots(response.value);
        console.log("Busy time slots set:", response.value);
      } else {
        console.log("Invalid response format or no busy times:", response);
        setBusyTimeSlots([]);
        if (response?.isFailure) {
          console.log("API error:", response.error);
        }
      }
    } catch (error) {
      console.error("Failed to fetch busy times:", error);
      toast.error("Failed to fetch doctor's busy schedule. Using default time slots.");
      setBusyTimeSlots([]);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log("Date selected:", newDate);
    setDate(newDate);
    setStartTime("");
    setShowCalendar(false);

    if (newDate && scheduleDetail && scheduleDetail.doctorId && clinicId) {
      console.log("Calling fetchBusyTimes with:", {
        date: newDate,
        doctorId: scheduleDetail.doctorId,
        clinicId: clinicId,
      });
      fetchBusyTimes(newDate, scheduleDetail.doctorId, clinicId);
    } else {
      console.log("Not calling fetchBusyTimes because:", {
        hasDate: !!newDate,
        hasScheduleDetail: !!scheduleDetail,
        hasDoctorId: scheduleDetail ? !!scheduleDetail.doctorId : false,
        hasClinicId: !!clinicId,
      });
      setBusyTimeSlots([]);
    }
  };

  const convertTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
  };

  const availableTimeSlots = useMemo(() => {
    console.log("Current busyTimeSlots in useMemo:", busyTimeSlots);
    if (!busyTimeSlots.length) {
      console.log("No busy slots, returning all time slots:", allTimeSlots);
      return allTimeSlots;
    }

    const filteredSlots = allTimeSlots.filter((timeSlot) => {
      const slotStartMinutes = convertTimeToMinutes(timeSlot);
      const slotEndMinutes = slotStartMinutes + 30;

      const isBusy = busyTimeSlots.some((busySlot) => {
        const busyStartMinutes = convertTimeToMinutes(busySlot.start);
        const busyEndMinutes = convertTimeToMinutes(busySlot.end);

        const overlaps =
          (slotStartMinutes >= busyStartMinutes && slotStartMinutes < busyEndMinutes) ||
          (slotEndMinutes > busyStartMinutes && slotEndMinutes <= busyEndMinutes) ||
          (slotStartMinutes <= busyStartMinutes && slotEndMinutes >= busyEndMinutes);

        if (overlaps) {
          console.log(`Excluding ${timeSlot} (ends ${minutesToTime(slotEndMinutes)}) due to overlap with ${busySlot.start}-${busySlot.end}`);
        }
        return overlaps;
      });

      return !isBusy;
    });

    console.log("Filtered available time slots:", filteredSlots);
    return filteredSlots;
  }, [busyTimeSlots]);

  const handleSubmit = async () => {
    if (!schedule || !date || !startTime) {
      toast.error("Please select both date and time for the follow-up appointment");
      return;
    }

    try {
      await updateCustomerSchedule({
        customerScheduleId: schedule.id,
        date: format(date, "yyyy-MM-dd"),
        startTime,
      }).unwrap();

      toast.success("Follow-up appointment scheduled successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to schedule follow-up:", error);
      toast.error("Failed to schedule follow-up appointment. Please try again.");
    }
  };

  const toggleCalendar = () => setShowCalendar(!showCalendar);
  const confirmDateSelection = () => setShowCalendar(false);

  if (isLoadingSchedule && !scheduleDetail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Follow-up Appointment</DialogTitle>
            <DialogDescription>Loading appointment details...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500 dark:text-pink-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
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
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                onClick={toggleCalendar}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
              {showCalendar && (
                <div
                  ref={setCalendarRef}
                  className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                  <div className="flex justify-end p-2 border-t dark:border-gray-700">
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
            <Select value={startTime} onValueChange={setStartTime} disabled={isLoadingBusyTimes}>
              <SelectTrigger id="time">
                <SelectValue placeholder={isLoadingBusyTimes ? "Loading available times..." : "Select time"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingBusyTimes ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading available times...</span>
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time.substring(0, 5)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No available time slots for this date
                  </div>
                )}
              </SelectContent>
            </Select>
            {availableTimeSlots.length === 0 && !isLoadingBusyTimes && date && (
              <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">
                The doctor is fully booked on this date. Please select another date.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isLoadingBusyTimes || !date || !startTime}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Follow-up"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}