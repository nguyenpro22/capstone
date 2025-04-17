"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { format, isToday } from "date-fns";
import { CalendarIcon, Loader2, Clock, AlertCircle } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useUpdateCustomerScheduleMutation,
  useLazyGetScheduleByIdQuery,
} from "@/features/customer-schedule/api";
import { useLazyGetDoctorBusyTimesQuery } from "@/features/working-schedule/api";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type {
  CustomerSchedule,
  CustomerScheduleForClinic,
} from "@/features/customer-schedule/types";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";

// Add the useTranslations import at the top of the file
import { useTranslations } from "next-intl";

interface ScheduleChangeForCustomerModalProps {
  schedule: CustomerScheduleForClinic | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BusyTimeSlot {
  start: string;
  end: string;
  date: string;
}

interface TimeSlotGroupProps {
  title: string;
  timeSlots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

function TimeSlotGroup({
  title,
  timeSlots,
  selectedTime,
  onTimeSelect,
}: TimeSlotGroupProps) {
  if (timeSlots.length === 0) return null;

  return (
    <div>
      <h5 className="text-sm font-medium mb-2">{title}</h5>
      <div className="grid grid-cols-4 gap-2">
        {timeSlots.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-9 text-xs sm:text-sm",
              selectedTime === time
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            )}
            onClick={() => onTimeSelect(time)}
          >
            {time.substring(0, 5)}
          </Button>
        ))}
      </div>
    </div>
  );
}

function groupTimeSlots(timeSlots: string[]) {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  timeSlots.forEach((slot) => {
    const hour = Number.parseInt(slot.split(":")[0], 10);
    if (hour < 12) {
      morning.push(slot);
    } else if (hour < 17) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  });

  return { morning, afternoon, evening };
}

function formatDateForDisplay(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
}

const allTimeSlots = [
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
  "17:00:00",
  "17:30:00",
  "18:00:00",
  "18:30:00",
  "19:00:00",
  "19:30:00",
  "20:00:00",
  "20:30:00",
  "21:00:00",
  "21:30:00",
  "22:00:00",
  "22:30:00",
  "23:00:00",
];

export default function ScheduleChangeForCustomerModal({
  schedule,
  isOpen,
  onClose,
  onSuccess,
}: ScheduleChangeForCustomerModalProps) {
  // Add this line inside the component function, near the top with other hooks
  const t = useTranslations("customerSchedule");
  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [busyTimeSlots, setBusyTimeSlots] = useState<BusyTimeSlot[]>([]);
  const [updateCustomerSchedule, { isLoading }] =
    useUpdateCustomerScheduleMutation();
  const [getDoctorBusyTimes, { isLoading: isLoadingBusyTimes }] =
    useLazyGetDoctorBusyTimesQuery();
  const [getScheduleById, { isLoading: isLoadingSchedule }] =
    useLazyGetScheduleByIdQuery();
  const [scheduleDetail, setScheduleDetail] = useState<CustomerSchedule | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"calendar" | "timeSlots" | "date">(
    "calendar"
  );
  const selectedAppointmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && schedule) {
      fetchScheduleDetails(schedule.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setBusyTimeSlots([]);
      setViewMode("calendar");
    }
  }, [isOpen]);

  const fetchBusyTimes = async (
    selectedDate: Date,
    doctorId: string,
    clinicId: string
  ) => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      console.log(`Fetching busy times with params:`, {
        doctorId,
        clinicId,
        date: formattedDate,
      });

      if (!doctorId || !clinicId || !formattedDate) {
        throw new Error(
          "Missing required parameters: " +
            JSON.stringify({ doctorId, clinicId, date: formattedDate })
        );
      }

      const queryResult = getDoctorBusyTimes({
        doctorId,
        clinicId,
        date: formattedDate,
      });
      console.log("Query result before unwrap:", queryResult);

      const response = await queryResult.unwrap();
      console.log("Unwrapped API response:", response);

      if (response && response.isSuccess && Array.isArray(response.value)) {
        setBusyTimeSlots(response.value);
        console.log("Busy time slots set:", response.value);
        // Switch to time slots view after fetching busy times
        setViewMode("timeSlots");
      } else {
        console.log("Invalid response format or no busy times:", response);
        setBusyTimeSlots([]);
        if (response?.isFailure) {
          console.log("API error:", response.error);
        }
      }
    } catch (error) {
      console.error("Failed to fetch busy times:", error);
      toast.error(
        "Failed to fetch doctor's busy schedule. Using default time slots."
      );
      setBusyTimeSlots([]);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log("Date selected:", newDate);
    setDate(newDate);
    setStartTime("");
    setViewMode("calendar");

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
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:00`;
  };

  const availableTimeSlots = useMemo(() => {
    console.log("Current busyTimeSlots in useMemo:", busyTimeSlots);
    if (!busyTimeSlots.length) {
      console.log("No busy slots, returning all time slots:", allTimeSlots);
      return allTimeSlots.filter((timeSlot) => {
        // If selected date is today, only filter out time slots that have already passed
        if (date && isToday(date)) {
          const now = new Date();
          const [hours, minutes] = timeSlot.split(":").map(Number);
          const slotTime = new Date(date);
          slotTime.setHours(hours, minutes, 0);
          if (slotTime <= now) return false;
        }
        return true;
      });
    }

    const filteredSlots = allTimeSlots.filter((timeSlot) => {
      // If selected date is today, only filter out time slots that have already passed
      if (date && isToday(date)) {
        const now = new Date();
        const [hours, minutes] = timeSlot.split(":").map(Number);
        const slotTime = new Date(date);
        slotTime.setHours(hours, minutes, 0);
        if (slotTime <= now) return false;
      }

      const slotStartMinutes = convertTimeToMinutes(timeSlot);
      const slotEndMinutes = slotStartMinutes + 30;

      const isBusy = busyTimeSlots.some((busySlot) => {
        const busyStartMinutes = convertTimeToMinutes(busySlot.start);
        const busyEndMinutes = convertTimeToMinutes(busySlot.end);

        const overlaps =
          (slotStartMinutes >= busyStartMinutes &&
            slotStartMinutes < busyEndMinutes) ||
          (slotEndMinutes > busyStartMinutes &&
            slotEndMinutes <= busyEndMinutes) ||
          (slotStartMinutes <= busyStartMinutes &&
            slotEndMinutes >= busyEndMinutes);

        if (overlaps) {
          console.log(
            `Excluding ${timeSlot} (ends ${minutesToTime(
              slotEndMinutes
            )}) due to overlap with ${busySlot.start}-${busySlot.end}`
          );
        }
        return overlaps;
      });

      return !isBusy;
    });

    console.log("Filtered available time slots:", filteredSlots);
    return filteredSlots;
  }, [busyTimeSlots, date]);

  // Group time slots by period
  const timeSlotGroups = useMemo(
    () => groupTimeSlots(availableTimeSlots),
    [availableTimeSlots]
  );

  const handleTimeSelect = (time: string) => {
    setStartTime(time);

    // Use setTimeout to ensure the selectedAppointment section is rendered before scrolling
    setTimeout(() => {
      if (selectedAppointmentRef.current) {
        selectedAppointmentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  const handleSubmit = async () => {
    if (!schedule || !date || !startTime) {
      toast.error(
        "Please select both date and time for the follow-up appointment"
      );
      return;
    }

    try {
      await updateCustomerSchedule({
        customerScheduleId: schedule.id,
        date: format(date, "yyyy-MM-dd"),
        startTime,
        isNext: false,
      }).unwrap();

      toast.success("Follow-up appointment scheduled successfully");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to schedule follow-up:", error);
      toast.error(error.data.detail);
    }
  };

  const showDatePicker = () => {
    setViewMode("date");
  };

  const goBackToCalendar = () => {
    setViewMode("calendar");
    setStartTime("");
  };

  if (isLoadingSchedule && !scheduleDetail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("scheduleFollowUp")}</DialogTitle>
            <DialogDescription>
              {t("loadingAppointmentDetails")}
            </DialogDescription>
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("scheduleFollowUp")}</DialogTitle>
          <DialogDescription>
            {t("selectDateTimeForNextAppointment")} {schedule?.customerName}.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto pr-1 max-h-[60vh]">
          {viewMode === "date" ? (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t("selectDate")}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                >
                  {t("cancel")}
                </Button>
              </div>
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
                className="mx-auto"
              />
            </div>
          ) : viewMode === "calendar" ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">{t("date")}</Label>
                <Button
                  id="date"
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  onClick={showDatePicker}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{t("selectDate")}</span>}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t("selectTime")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {date ? formatDateForDisplay(date) : t("pleaseSelectDate")}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={showDatePicker}>
                  {t("changeDate")}
                </Button>
              </div>

              {isLoadingBusyTimes ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500 dark:text-pink-400 mr-2" />
                  <span>{t("loadingAvailableTimes")}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <TimeSlotGroup
                    title={t("morning")}
                    timeSlots={timeSlotGroups.morning}
                    selectedTime={startTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  <TimeSlotGroup
                    title={t("afternoon")}
                    timeSlots={timeSlotGroups.afternoon}
                    selectedTime={startTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  <TimeSlotGroup
                    title={t("evening")}
                    timeSlots={timeSlotGroups.evening}
                    selectedTime={startTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  {availableTimeSlots.length === 0 && (
                    <Alert
                      variant="default"
                      className="mt-4 text-xs sm:text-sm"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t("noAvailableTimes")}</AlertTitle>
                      <AlertDescription>
                        {t("doctorFullyBooked")}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {startTime && (
                <div
                  ref={selectedAppointmentRef}
                  className="mt-4 p-4 bg-primary/5 rounded-lg"
                >
                  <p className="font-medium">{t("selectedAppointment")}</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="mr-2">
                      {date ? formatDateForDisplay(date) : ""}
                    </Badge>
                    <Badge>
                      <Clock className="h-3 w-3 mr-1" />
                      {startTime.substring(0, 5)}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isLoadingBusyTimes || !date || !startTime}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("scheduling")}
              </>
            ) : (
              t("scheduleFollowUp")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
