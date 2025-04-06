"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DoctorWorkingSchedule } from "@/features/doctor/types";
import { OrderStatus } from "@/features/booking/types";

interface CalendarDayProps {
  day: Date;
  appointments: DoctorWorkingSchedule[];
  onAppointmentClick: (appointment: DoctorWorkingSchedule) => void;
  isCurrentMonth: boolean;
}

export function CalendarDay({
  day,
  appointments,
  onAppointmentClick,
  isCurrentMonth,
}: CalendarDayProps) {
  const t = useTranslations("doctor");

  // Sort appointments by start time
  const sortedAppointments = [...appointments].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  // Get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-50 border-yellow-200";
      case OrderStatus.IN_PROGRESS:
        return "bg-blue-50 border-blue-200";
      case OrderStatus.COMPLETED:
        return "bg-green-50 border-green-200";
      case OrderStatus.UNCOMPLETED:
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={cn("h-full w-full p-1", !isCurrentMonth && "opacity-50")}>
      <div className="text-center text-sm">{format(day, "d")}</div>

      {sortedAppointments.length > 0 ? (
        <div className="mt-1 max-h-20 overflow-y-auto space-y-1">
          {sortedAppointments.slice(0, 3).map((appointment) => (
            <button
              key={appointment.workingScheduleId}
              onClick={() => onAppointmentClick(appointment)}
              className={cn(
                "w-full text-left text-xs p-1 rounded border-l-2 block",
                getStatusColor(appointment.status)
              )}
            >
              <div className="truncate">
                {format(
                  new Date(`2000-01-01T${appointment.startTime}`),
                  "HH:mm"
                )}{" "}
                - {appointment.customerName.split(" ")[0]}
              </div>
            </button>
          ))}

          {sortedAppointments.length > 3 && (
            <div className="text-xs text-center text-muted-foreground">
              +{sortedAppointments.length - 3}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-1 text-xs text-center text-muted-foreground">
          {t("calendar.noAppointments")}
        </div>
      )}
    </div>
  );
}
