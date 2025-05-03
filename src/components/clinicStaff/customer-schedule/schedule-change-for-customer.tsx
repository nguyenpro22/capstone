"use client";

import type React from "react";

import { useState, useEffect, useMemo, useRef } from "react";
import { format, isToday } from "date-fns";
import { CalendarIcon, Loader2, Clock, AlertCircle, Edit } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useUpdateCustomerScheduleMutation,
  useLazyGetScheduleByIdQuery,
} from "@/features/customer-schedule/api";
import { useLazyGetDoctorAvailableTimesQuery } from "@/features/working-schedule/api";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type {
  CustomerSchedule,
  CustomerScheduleForClinic,
} from "@/features/customer-schedule/types";
import type { AvailableSlot } from "@/features/working-schedule/types";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";

// Add the useTranslations import at the top of the file
import { useTranslations } from "next-intl";

interface ScheduleChangeForCustomerProps {
  schedule: CustomerScheduleForClinic | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

// Function to generate time slots from available slots
function generateTimeSlotsFromAvailable(
  availableSlots: AvailableSlot[]
): string[] {
  if (!availableSlots || availableSlots.length === 0) return [];

  const timeSlots: string[] = [];

  availableSlots.forEach((slot) => {
    const startHour = Number.parseInt(slot.startTime.split(":")[0], 10);
    const startMinute = Number.parseInt(slot.startTime.split(":")[1], 10);
    const endHour = Number.parseInt(slot.endTime.split(":")[0], 10);
    const endMinute = Number.parseInt(slot.endTime.split(":")[1], 10);

    // Convert to minutes for easier calculation
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Generate 30-minute slots
    for (let time = startTimeInMinutes; time < endTimeInMinutes; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00`;
      timeSlots.push(timeString);
    }
  });

  // Sort the time slots
  return timeSlots.sort();
}

// Function to check if a custom time is within available slots
function isTimeWithinAvailableSlots(
  time: string,
  availableSlots: AvailableSlot[]
): boolean {
  if (!time || !availableSlots || availableSlots.length === 0) return false;

  // Parse the time string to get hours and minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Convert to minutes for easier comparison
  const timeInMinutes = hours * 60 + minutes;

  // Check if the time falls within any available slot
  return availableSlots.some((slot) => {
    const startHour = Number.parseInt(slot.startTime.split(":")[0], 10);
    const startMinute = Number.parseInt(slot.startTime.split(":")[1], 10);
    const endHour = Number.parseInt(slot.endTime.split(":")[0], 10);
    const endMinute = Number.parseInt(slot.endTime.split(":")[1], 10);

    const slotStartMinutes = startHour * 60 + startMinute;
    const slotEndMinutes = endHour * 60 + endMinute;

    return timeInMinutes >= slotStartMinutes && timeInMinutes < slotEndMinutes;
  });
}

export default function ScheduleFollowUpModal({
  schedule,
  isOpen,
  onClose,
  onSuccess,
}: ScheduleChangeForCustomerProps) {
  // Add this line inside the component function, near the top with other hooks
  const t = useTranslations("customerSchedule");
  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [customTimeInput, setCustomTimeInput] = useState<string>("");
  const [showCustomTimeInput, setShowCustomTimeInput] =
    useState<boolean>(false);
  const [customTimeError, setCustomTimeError] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [updateCustomerSchedule, { isLoading }] =
    useUpdateCustomerScheduleMutation();
  const [getDoctorAvailableTimes, { isLoading: isLoadingAvailableTimes }] =
    useLazyGetDoctorAvailableTimesQuery();
  const [getScheduleById, { isLoading: isLoadingSchedule }] =
    useLazyGetScheduleByIdQuery();
  const [scheduleDetail, setScheduleDetail] = useState<CustomerSchedule | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"calendar" | "timeSlots" | "date">(
    "calendar"
  );
  const selectedAppointmentRef = useRef<HTMLDivElement>(null);
  const customTimeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && schedule) {
      fetchScheduleDetails(schedule.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, schedule]);

  const fetchScheduleDetails = async (
    scheduleId: string,
    isNextSchedule = false
  ) => {
    try {
      const result = await getScheduleById({
        id: scheduleId,
        isNextSchedule,
      }).unwrap();
      if (result.isSuccess && result.value) {
        setScheduleDetail(result.value);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow);
        if (result.value.id) {
          fetchAvailableTimes(tomorrow, result.value.id);
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
      setCustomTimeInput("");
      setShowCustomTimeInput(false);
      setCustomTimeError("");
      setAvailableSlots([]);
      setViewMode("calendar");
    }
  }, [isOpen]);

  // Focus the custom time input when it becomes visible
  useEffect(() => {
    if (showCustomTimeInput && customTimeInputRef.current) {
      customTimeInputRef.current.focus();
    }
  }, [showCustomTimeInput]);

  const fetchAvailableTimes = async (
    selectedDate: Date,
    customerScheduleId: string
  ) => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      console.log(`Fetching available times with params:`, {
        serviceIdOrCustomerScheduleId: customerScheduleId,
        isCustomerSchedule: true,
        date: formattedDate,
      });

      if (!customerScheduleId || !formattedDate) {
        throw new Error(
          "Missing required parameters: " +
            JSON.stringify({ customerScheduleId, date: formattedDate })
        );
      }

      const queryResult = getDoctorAvailableTimes({
        serviceIdOrCustomerScheduleId: customerScheduleId,
        isCustomerSchedule: true,
        date: formattedDate,
      });
      console.log("Query result before unwrap:", queryResult);

      const response = await queryResult.unwrap();
      console.log("Unwrapped API response:", response);

      if (response && response.isSuccess && Array.isArray(response.value)) {
        setAvailableSlots(response.value);
        console.log("Available time slots set:", response.value);
        // Switch to time slots view after fetching available times
        setViewMode("timeSlots");
      } else {
        console.log("Invalid response format or no available times:", response);
        setAvailableSlots([]);
        if (response?.isFailure) {
          console.log("API error:", response.error);
        }
      }
    } catch (error) {
      console.error("Failed to fetch available times:", error);
      toast.error(
        "Failed to fetch doctor's available schedule. Please try again."
      );
      setAvailableSlots([]);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log("Date selected:", newDate);
    setDate(newDate);
    setStartTime("");
    setCustomTimeInput("");
    setShowCustomTimeInput(false);
    setCustomTimeError("");
    setViewMode("calendar");

    if (newDate && scheduleDetail && scheduleDetail.id) {
      console.log("Calling fetchAvailableTimes with:", {
        date: newDate,
        customerScheduleId: scheduleDetail.id,
      });
      fetchAvailableTimes(newDate, scheduleDetail.id);
    } else {
      console.log("Not calling fetchAvailableTimes because:", {
        hasDate: !!newDate,
        hasScheduleDetail: !!scheduleDetail,
        hasScheduleId: scheduleDetail ? !!scheduleDetail.id : false,
      });
      setAvailableSlots([]);
    }
  };

  const availableTimeSlots = useMemo(() => {
    console.log("Current availableSlots in useMemo:", availableSlots);

    // Generate time slots from available slots
    const generatedTimeSlots = generateTimeSlotsFromAvailable(availableSlots);

    // Filter out past time slots if the selected date is today
    return generatedTimeSlots.filter((timeSlot) => {
      if (date && isToday(date)) {
        const now = new Date();
        const [hours, minutes] = timeSlot.split(":").map(Number);
        const slotTime = new Date(date);
        slotTime.setHours(hours, minutes, 0);
        return slotTime > now;
      }
      return true;
    });
  }, [availableSlots, date]);

  // Group time slots by period
  const timeSlotGroups = useMemo(
    () => groupTimeSlots(availableTimeSlots),
    [availableTimeSlots]
  );

  const handleTimeSelect = (time: string) => {
    setStartTime(time);
    setCustomTimeInput("");
    setShowCustomTimeInput(false);
    setCustomTimeError("");

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

  const toggleCustomTimeInput = () => {
    setShowCustomTimeInput(!showCustomTimeInput);
    if (!showCustomTimeInput) {
      setStartTime("");
    } else {
      setCustomTimeInput("");
      setCustomTimeError("");
    }
  };

  const validateAndSetCustomTime = () => {
    // Basic format validation
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(customTimeInput)) {
      setCustomTimeError(t("invalidTimeFormat"));
      return;
    }

    // Parse the time
    const [hours, minutes] = customTimeInput.split(":").map(Number);

    // Check if the time is within available slots
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;

    if (!isTimeWithinAvailableSlots(customTimeInput, availableSlots)) {
      setCustomTimeError(t("timeNotAvailable"));
      return;
    }

    // Clear any errors and set the time
    setCustomTimeError("");
    setStartTime(formattedTime);

    // Scroll to the selected appointment section
    setTimeout(() => {
      if (selectedAppointmentRef.current) {
        selectedAppointmentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTimeInput(e.target.value);
    // Clear error when user starts typing again
    if (customTimeError) {
      setCustomTimeError("");
    }
  };

  const handleCustomTimeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAndSetCustomTime();
    }
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

      toast.success(t("rescheduleSuccess"));
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
    setCustomTimeInput("");
    setShowCustomTimeInput(false);
    setCustomTimeError("");
  };

  if (isLoadingSchedule && !scheduleDetail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("reschedule")}</DialogTitle>
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
          <DialogTitle>{t("reschedule")}</DialogTitle>
          <DialogDescription>
            {t("selectDateTimeForChangeAppointment")} {schedule?.customerName}.
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

              {/* Custom time input toggle button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCustomTimeInput}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  {showCustomTimeInput
                    ? t("selectFromOptions")
                    : t("enterCustomTime")}
                </Button>
              </div>

              {/* Custom time input field */}
              {showCustomTimeInput ? (
                <div className="space-y-2">
                  <Label htmlFor="custom-time">{t("enterSpecificTime")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-time"
                      ref={customTimeInputRef}
                      placeholder="15:15"
                      value={customTimeInput}
                      onChange={handleCustomTimeChange}
                      onKeyDown={handleCustomTimeKeyDown}
                      className={cn(customTimeError && "border-red-500")}
                    />
                    <Button onClick={validateAndSetCustomTime}>
                      {t("apply")}
                    </Button>
                  </div>
                  {customTimeError && (
                    <p className="text-sm text-red-500">{customTimeError}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {t("timeFormatHint")}
                  </p>
                </div>
              ) : isLoadingAvailableTimes ? (
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
                  <p className="font-medium">{t("selectedAppointment")}:</p>
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
            disabled={
              isLoading || isLoadingAvailableTimes || !date || !startTime
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("scheduling")}
              </>
            ) : (
              t("reschedule")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
