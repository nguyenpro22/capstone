import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface NextScheduleNotificationProps {
  customerName: string
  onScheduleFollowUp: () => void
}

export default function NextScheduleNotification({ customerName, onScheduleFollowUp }: NextScheduleNotificationProps) {
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Follow-up Required</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-amber-700">
        <span>{customerName} needs to schedule their next appointment.</span>
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 text-amber-700 hover:bg-amber-100 hover:text-amber-800 w-full sm:w-auto"
          onClick={onScheduleFollowUp}
        >
          Schedule Follow-up
        </Button>
      </AlertDescription>
    </Alert>
  )
}
