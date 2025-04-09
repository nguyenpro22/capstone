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
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Use RTK Query hook to fetch busy times
  const { data, isLoading } = useGetBusyTimesQuery(
    {
      doctorId: currentDoctor?.id || "",
      clinicId: clinic?.id || "",
      date: formatDate(selectedDate as Date),
    },
    // Only run the query if we have all required parameters
    {
      skip: !currentDoctor?.id || !clinic?.id || !formatDate,
    }
  );

  // Calculate available time slots when busy times data changes
  useEffect(() => {
    const calculateAvailableSlots = async () => {
      if (data?.value && selectedDate) {
        try {
          // Use the BookingService to calculate available time slots
          const slots = await BookingService.getAvailableTimeSlots(data.value);
          setAvailableTimeSlots(slots);
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
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Đang tải danh sách bác sĩ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Chọn bác sĩ</h3>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="skip-doctor"
            checked={skipDoctorSelection}
            onCheckedChange={(checked) =>
              handleSkipDoctorToggle(checked === true)
            }
          />
          <Label htmlFor="skip-doctor" className="text-sm cursor-pointer">
            Bỏ qua chọn bác sĩ (hệ thống sẽ tự động chọn bác sĩ có đánh giá cao
            nhất)
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
            <div className="bg-primary/5 p-4 rounded-lg mb-4">
              <p className="font-medium">Bác sĩ được chọn tự động:</p>
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
        <h3 className="text-lg font-medium mb-4">Chọn ngày và giờ</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng chọn thời gian bạn muốn thực hiện dịch vụ
        </p>

        {missingRequirements && (
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Thiếu thông tin</AlertTitle>
            <AlertDescription>
              {!currentDoctor && !clinic
                ? "Vui lòng chọn bác sĩ và cơ sở trước khi chọn ngày và giờ."
                : !currentDoctor
                ? "Vui lòng chọn bác sĩ trước khi chọn ngày và giờ."
                : "Vui lòng chọn cơ sở trước khi chọn ngày và giờ."}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar column */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Chọn ngày</h4>
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
            <h4 className="font-medium mb-2">Chọn giờ</h4>
            {selectedDate ? (
              isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">
                    Đang tải khung giờ trống...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <TimeSlotGroup
                    title="Buổi sáng"
                    timeSlots={timeSlotGroups.morning}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  <TimeSlotGroup
                    title="Buổi chiều"
                    timeSlots={timeSlotGroups.afternoon}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  <TimeSlotGroup
                    title="Buổi tối"
                    timeSlots={timeSlotGroups.evening}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />

                  {availableTimeSlots.length === 0 && (
                    <div className="p-4 text-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">
                        Không có khung giờ trống cho ngày này. Vui lòng chọn
                        ngày khác.
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="p-8 text-center bg-muted/30 rounded-lg h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  Vui lòng chọn ngày trước
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
            <p className="font-medium">Bạn đã chọn:</p>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="mr-2">
                {selectedDate ? formatDate(selectedDate) : ""}
              </Badge>
              <Badge>
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
