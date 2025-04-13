"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock } from 'lucide-react'
import { useTranslations } from "next-intl"

interface EarlyCheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  minutesEarly: number
  scheduledTime: string
}

export default function EarlyCheckInModal({
  isOpen,
  onClose,
  onConfirm,
  minutesEarly,
  scheduledTime,
}: EarlyCheckInModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const t = useTranslations("customerSchedule")

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
    } finally {
      setIsConfirming(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
            <Clock className="h-5 w-5" />
            {t("earlyCheckInTitle")}
          </DialogTitle>
          <DialogDescription>{t("earlyCheckInDescription")}</DialogDescription>
        </DialogHeader>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-4 my-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">
                {t("earlyCheckInWarning", { minutes: minutesEarly })}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {t("scheduledTime")}: <span className="font-medium">{scheduledTime}</span>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
            disabled={isConfirming}
          >
            {isConfirming ? t("processing") : t("proceedWithEarlyCheckIn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
