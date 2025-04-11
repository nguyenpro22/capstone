"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Clock, AlertCircle } from "lucide-react"
import { TimeSlotGroup } from "../time-slot-group"
import { useGetBusyTimesQuery } from "@/features/booking/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { BookingData } from "../../types/booking"
import { BookingService } from "../../utils/booking-service"
import { formatDate, groupTimeSlots } from "../../utils/booking-utils"
import { useTranslations } from "next-intl" // Import useTranslations

interface SelectDateTimeStepProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
}

export function SelectDateTimeStep({ bookingData, updateBookingData }: SelectDateTimeStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date || undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(bookingData.time || null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const t = useTranslations("bookingFlow") // Use the hook with the namespace

  const { doctor, clinic } = bookingData

  // Format date for API query
  const formattedDate = selectedDate ? selectedDate.toISOString().split("T")[0] : ""

  // Use RTK Query hook to fetch busy times
  const { data, isLoading } = useGetBusyTimesQuery(
    {
      doctorId: doctor?.id || "",
      clinicId: clinic?.id || "",
      date: formattedDate,
    },
    // Only run the query if we have all required parameters
    {
      skip: !doctor?.id || !clinic?.id || !formattedDate,
    },
  )

  // Calculate available time slots when busy times data changes
  useEffect(() => {
    const calculateAvailableSlots = async () => {
      if (data?.value && selectedDate) {
        try {
          // Use the BookingService to calculate available time slots
          const slots = await BookingService.getAvailableTimeSlots(data.value)
          setAvailableTimeSlots(slots)
        } catch (error) {
          console.error("Error calculating available time slots:", error)
          setAvailableTimeSlots([])
        }
      }
    }

    calculateAvailableSlots()
  }, [data, selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setSelectedTime(null) // Reset selected time when date changes

      // Only update if date actually changed
      if (!bookingData.date || date.getTime() !== bookingData.date.getTime()) {
        updateBookingData({ date, time: null })
      }
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)

    // Only update if time actually changed
    if (time !== bookingData.time) {
      updateBookingData({ time })
    }
  }

  // Group time slots by period
  const timeSlotGroups = groupTimeSlots(availableTimeSlots)

  // Check if we have all required data
  const missingRequirements = !doctor || !clinic

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t("selectDateTime")}</h3>
        <p className="text-muted-foreground mb-4">{t("pleaseSelectTime")}</p>

        {missingRequirements && (
          <Alert variant="default" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("missingInfo")}</AlertTitle>
            <AlertDescription>
              {!doctor && !clinic
                ? t("selectDoctorClinicFirst")
                : !doctor
                  ? t("selectDoctorFirst")
                  : t("selectClinicFirst")}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar column */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{t("selectDate")}</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                // Disable past dates and dates more than 30 days in the future
                const maxDate = new Date()
                maxDate.setDate(maxDate.getDate() + 30)

                return date < today || date > maxDate
              }}
              className="rounded-md border bg-white shadow"
            />
          </div>

          {/* Time slots column */}
          <div>
            <h4 className="font-medium mb-2">{t("selectTime")}</h4>
            {selectedDate ? (
              isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">{t("loadingTimeSlots")}</p>
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
                    <div className="p-4 text-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">{t("noAvailableSlots")}</p>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="p-8 text-center bg-muted/30 rounded-lg h-full flex items-center justify-center">
                <p className="text-muted-foreground">{t("selectDateFirst")}</p>
              </div>
            )}
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
            <p className="font-medium">{t("youSelected")}</p>
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
  )
}
