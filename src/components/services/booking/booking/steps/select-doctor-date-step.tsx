"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { BookingData, Doctor } from "../../types/booking";
import { formatDate, groupTimeSlots } from "../../utils/booking-utils";
import { Clock, AlertCircle } from "lucide-react";
import { TimeSlotGroup } from "../time-slot-group";
import { DoctorItem } from "../doctor-item";
import { useGetBusyTimesQuery } from "@/features/booking/api";
import { BookingService } from "../../utils/booking-service";
import { CustomCalendar } from "./custom-calendar";
import { useTranslations } from "next-intl"; // Import useTranslations

interface SelectDoctorDateStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  highestRatedDoctor: Doctor | null;
}

export function SelectDoctorDateStep({
  bookingData,
  updateBookingData,
  highestRatedDoctor,
}: SelectDoctorDateStepProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    bookingData.doctor?.id || null
  );
  const [skipDoctorSelection, setSkipDoctorSelection] = useState<boolean>(
    bookingData.skipDoctorSelection
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date || undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    bookingData.time || null
  );
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const t = useTranslations("bookingFlow"); // Use the hook with the namespace

  const { service, clinic } = bookingData;

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        if (service.doctorServices && service.doctorServices.length > 0) {
          const doctorsData = await BookingService.getDoctorsByService(service);
          setDoctors(doctorsData);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [service]);

  // Get the current doctor (either selected or highest rated if skipped)
  const currentDoctor =
    skipDoctorSelection && highestRatedDoctor
      ? highestRatedDoctor
      : bookingData.doctor;

  // Format date for API query
  function formatDateForApi(date: Date): string {
    const year = date?.getFullYear();
    const month = `${date?.getMonth() + 1}`.padStart(2, "0");
    const day = `${date?.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Use RTK Query hook to fetch busy times
  const { data, isLoading, refetch } = useGetBusyTimesQuery(
    {
      doctorId: currentDoctor?.id || "",
      clinicId: clinic?.id || "",
      date: selectedDate ? formatDateForApi(selectedDate) : "",
    },
    // Only run the query if we have all required parameters
    {
      skip: !currentDoctor?.id || !clinic?.id || !selectedDate,
    }
  );

  // Calculate available time slots when busy times data changes
    useEffect(() => {
    const calculateAvailableSlots = async () => {
      if (data?.value && selectedDate) {
        try {
          // Use the BookingService to calculate available time slots
          const slots = await BookingService.getAvailableTimeSlots(data.value);

          // Filter out past time slots if the selected date is today
          const today = new Date();
          const isToday = selectedDate.toDateString() === today.toDateString();

          if (isToday) {
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();

            // Filter out time slots that have already passed
            const filteredSlots = slots.filter((timeSlot) => {
              const [hourStr, minuteStr] = timeSlot.split(":");
              const hour = Number.parseInt(hourStr, 10);
              const minute = Number.parseInt(minuteStr, 10);

              // Compare with current time
              return (
                hour > currentHour ||
                (hour === currentHour && minute > currentMinute)
              );
            });

            setAvailableTimeSlots(filteredSlots);
          } else {
            setAvailableTimeSlots(slots);
          }
        } catch (error) {
          console.error("Error calculating available time slots:", error);
          setAvailableTimeSlots([]);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    };

    calculateAvailableSlots();
  }, [data, selectedDate]);


  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    const selectedDoctor = doctors.find((doc) => doc.id === doctorId) || null;
    updateBookingData({ doctor: selectedDoctor });

    // Reset time when doctor changes
    setSelectedTime(null);
    updateBookingData({ time: null });
  };

  const handleSkipDoctorToggle = (checked: boolean) => {
    setSkipDoctorSelection(checked);
    updateBookingData({ skipDoctorSelection: checked });

    if (checked && highestRatedDoctor) {
      setSelectedDoctorId(highestRatedDoctor.id);
      updateBookingData({ doctor: highestRatedDoctor });

      // Reset time when doctor changes
      setSelectedTime(null);
      updateBookingData({ time: null });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset selected time when date changes
      updateBookingData({ date, time: null });
      refetch();
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateBookingData({ time });
  };

  // Group time slots by period
  const timeSlotGroups = groupTimeSlots(availableTimeSlots);

  // Check if we have all required data
  const missingRequirements = !currentDoctor || !clinic;

  if (loadingDoctors) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-purple-500 dark:border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">
          {t("loadingDoctors")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          {t("selectDoctor")}
        </h3>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="skip-doctor"
            checked={skipDoctorSelection}
            onCheckedChange={(checked) =>
              handleSkipDoctorToggle(checked === true)
            }
            className="border-purple-300 dark:border-purple-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 dark:data-[state=checked]:bg-purple-500 dark:data-[state=checked]:border-purple-500"
          />
          <Label
            htmlFor="skip-doctor"
            className="text-sm cursor-pointer text-gray-800 dark:text-gray-200"
          >
            {t("skipDoctorSelection")}
          </Label>
        </div>

        {!skipDoctorSelection ? (
          <RadioGroup
            value={selectedDoctorId || ""}
            onValueChange={handleDoctorSelect}
            className="space-y-3"
          >
            {doctors.map((doctor) => (
              <DoctorItem
                key={doctor.id}
                doctor={doctor}
                serviceCategoryName={service.category.name}
                isSelected={selectedDoctorId === doctor.id}
                showRadio={true}
              />
            ))}
          </RadioGroup>
        ) : (
          highestRatedDoctor && (
            <div className="bg-purple-50/70 dark:bg-purple-900/20 p-4 rounded-lg mb-4 border border-purple-100 dark:border-purple-800/20">
              <p className="font-medium text-purple-800 dark:text-purple-300">
                {t("automaticallySelectedDoctor")}:
              </p>
              <div className="mt-2">
                <DoctorItem
                  doctor={highestRatedDoctor}
                  serviceCategoryName={service.category.name}
                  isSelected={true}
                  showRadio={false}
                />
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          {t("selectDateTime")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t("pleaseSelectTime")}
        </p>

        {missingRequirements && (
          <Alert
            variant="default"
            className="mb-4 border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20"
          >
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              {t("missingInfo")}
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              {!currentDoctor && !clinic
                ? t("selectDoctorClinicFirst")
                : !currentDoctor
                ? t("selectDoctorFirst")
                : t("selectClinicFirst")}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar column */}
          <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-100 dark:border-purple-800/20">
            <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
              {t("selectDate")}
            </h4>
            <CustomCalendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Disable past dates and dates more than 30 days in the future
                const maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + 30);

                return date < today || date > maxDate;
              }}
            />
          </div>

          {/* Time slots column */}
          <div>
            <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
              {t("selectTime")}
            </h4>
            {selectedDate ? (
              isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-8 w-8 border-4 border-purple-500 dark:border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("loadingTimeSlots")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <TimeSlotGroup
                    title={t("morning")}
                    timeSlots={timeSlotGroups.morning}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  <TimeSlotGroup
                    title={t("afternoon")}
                    timeSlots={timeSlotGroups.afternoon}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  <TimeSlotGroup
                    title={t("evening")}
                    timeSlots={timeSlotGroups.evening}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  {availableTimeSlots.length === 0 && (
                    <div className="p-4 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("noAvailableSlots")}
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg h-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("selectDateFirst")}
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="mt-4 p-4 bg-purple-50/70 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/20">
            <p className="font-medium text-purple-800 dark:text-purple-300">
              {t("youSelected")}
            </p>
            <div className="flex items-center mt-2">
              <Badge
                variant="outline"
                className="mr-2 border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300"
              >
                {selectedDate
                  ? t("formattedDate", {
                      date: selectedDate.getDate(),
                      month: t(`months.${selectedDate.getMonth()}`),
                      year: selectedDate.getFullYear(),
                    })
                  : ""}
              </Badge>
              <Badge className="bg-purple-600 dark:bg-purple-500 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {selectedTime}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
