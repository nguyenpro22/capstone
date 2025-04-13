"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, Clock, User } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { CustomerSchedule } from "@/features/customer-schedule/types"
// Add the useTranslations import
import { useTranslations } from "next-intl"

interface FollowUpSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  schedules: CustomerSchedule[]
  onScheduleSelected: (schedule: CustomerSchedule) => void
}

export default function FollowUpSelectionModal({
  isOpen,
  onClose,
  schedules,
  onScheduleSelected,
}: FollowUpSelectionModalProps) {
  // Add the translation hook
  const t = useTranslations("customerSchedule")
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null)

  const handleSubmit = () => {
    const selectedSchedule = schedules.find((schedule) => schedule.id === selectedScheduleId)
    if (selectedSchedule) {
      onScheduleSelected(selectedSchedule)
      onClose()
    }
  }

  // Format time range
  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("selectAppointmentForFollowUp")}</DialogTitle>
          <DialogDescription>{t("multipleAppointmentsNeedFollowUps")}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedScheduleId || ""} onValueChange={setSelectedScheduleId}>
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`mb-3 p-4 rounded-lg border ${
                  selectedScheduleId === schedule.id
                    ? "border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800"
                } transition-colors cursor-pointer`}
                onClick={() => setSelectedScheduleId(schedule.id)}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={schedule.id} id={schedule.id} className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor={schedule.id}
                      className="text-base font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <User className="h-4 w-4 text-purple-500" />
                      {schedule.customerName}
                    </Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{schedule.serviceName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{schedule.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>{formatTimeRange(schedule.startTime, schedule.endTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedScheduleId}>
            {t("scheduleFollowUp")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
