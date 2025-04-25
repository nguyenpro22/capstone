"use client";

import { format } from "date-fns";
import { Calendar, Clock, Users, ArrowRight, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  DoctorWorkingSchedule,
  WorkingSchedule,
} from "@/features/doctor/types";
import { useTranslations } from "next-intl";
import { formatDate } from "@/utils/format";
import { useDateTimeFormat } from "@/hooks/use-datetime-format";

// Helper function to get initials from a name
const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

interface AppointmentSidebarProps {
  selectedDate: Date;
  shifts: DoctorWorkingSchedule[];
  onSelectShift: (shift: DoctorWorkingSchedule) => void;
  onSelectAppointment: (appointment: WorkingSchedule) => void;
}

export function AppointmentSidebar({
  selectedDate,
  shifts,
  onSelectShift,
  onSelectAppointment,
}: AppointmentSidebarProps) {
  const t = useTranslations("doctor");
  const dateTimeFormat = useDateTimeFormat();

  // Format dates
  const formattedDate = dateTimeFormat.formatDate(selectedDate);

  // Get total appointments count
  const totalAppointments = shifts.reduce(
    (count, shift) => count + shift.workingSchedules.length,
    0
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-purple-100 dark:border-purple-900/50 flex-shrink-0">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-purple-50/80 dark:bg-purple-900/20 p-3 rounded-xl shadow-sm">
            <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {formattedDate}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
              "dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
              "rounded-lg px-2.5 py-0.5"
            )}
          >
            {shifts.length} {t("shift.shifts")}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
              "dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
              "rounded-lg px-2.5 py-0.5"
            )}
          >
            {totalAppointments} {t("calendar.appointments")}
          </Badge>
        </div>
      </div>

      {shifts.length > 0 ? (
        <div className="space-y-6 overflow-auto flex-1 p-4 pr-3 min-h-0">
          {shifts.map((shift) => (
            <div key={shift.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">
                    {t("shift.shifts")}
                  </h4>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs bg-purple-50 text-purple-600 border-purple-200",
                    "dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/50"
                  )}
                >
                  {dateTimeFormat.formatTime(shift.startTime)} -{" "}
                  {dateTimeFormat.formatTime(shift.endTime)}
                </Badge>
              </div>

              <Separator className="bg-purple-100 dark:bg-purple-800/50" />

              {shift.workingSchedules.length > 0 ? (
                <div className="space-y-3">
                  {shift.workingSchedules.map((appointment) => (
                    <Card
                      key={appointment.workingScheduleId}
                      className="border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden group"
                    >
                      <div className="h-1 bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-500 dark:to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 border-2 border-purple-100 dark:border-purple-900 shadow-sm flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white text-sm font-medium">
                              {getInitials(appointment.customerName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                {appointment.customerName}
                              </h4>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "bg-purple-50 text-purple-600 border-purple-200",
                                  "dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/50",
                                  "text-xs flex-shrink-0 ml-1"
                                )}
                              >
                                {t(
                                  `appointment.status.${appointment.status
                                    .toLowerCase()
                                    .replace(/\s+/g, "")}`
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="h-3.5 w-3.5 text-purple-400 dark:text-purple-500 flex-shrink-0" />
                              <span className="truncate">
                                {dateTimeFormat.formatTime(
                                  appointment.startTime
                                )}{" "}
                                -{" "}
                                {dateTimeFormat.formatTime(appointment.endTime)}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[60%]">
                                {appointment.serviceName}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg -mr-1 flex-shrink-0"
                                onClick={() => {
                                  onSelectShift(shift);
                                  onSelectAppointment(appointment);
                                }}
                              >
                                {t("calendar.details")}
                                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-sm text-slate-500 dark:text-slate-400">
                  {t("calendar.noAppointments")}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center flex-col text-center p-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-purple-400 dark:text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            {t("calendar.noAppointments")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
            {t("calendar.noAppointmentsDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
