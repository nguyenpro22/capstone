"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
// Add the useTranslations import
import { useTranslations } from "next-intl"

interface NextScheduleNotificationProps {
  customerName?: string
  schedulesCount?: number
  onScheduleFollowUp: () => void
}

export default function NextScheduleNotification({
  customerName,
  schedulesCount = 0,
  onScheduleFollowUp,
}: NextScheduleNotificationProps) {
  // Add the translation hook
  const t = useTranslations("customerSchedule")

  // Determine the message based on whether we have multiple schedules or just one
  const message =
    schedulesCount > 1
      ? t("multipleFollowUpsNeeded", { count: schedulesCount })
      : t("singleFollowUpNeeded", { name: customerName })

  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertTitle className="text-amber-800 dark:text-amber-300">{t("followUpRequired")}</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-amber-700 dark:text-amber-400">
        <span>{message}</span>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/40 dark:hover:text-amber-300 w-full sm:w-auto"
          onClick={onScheduleFollowUp}
        >
          {t("scheduleFollowUp")}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
