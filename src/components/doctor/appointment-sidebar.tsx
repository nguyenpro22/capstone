"use client";

import { format, parseISO } from "date-fns";
import { ArrowRight, Calendar, Clock, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import type { DoctorWorkingSchedule } from "@/features/doctor/types";
import { cn } from "@/lib/utils";

// Helper function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

interface AppointmentSidebarProps {
  selectedDate: Date | null;
  appointmentsByDate: Record<string, DoctorWorkingSchedule[]>;
  handleAppointmentClick: (appointment: DoctorWorkingSchedule) => void;
}

export function AppointmentSidebar({
  selectedDate,
  appointmentsByDate,
  handleAppointmentClick,
}: AppointmentSidebarProps) {
  // Move the useTranslations hooks to the component level
  const t = useTranslations("doctor");
  const sidebarT = useTranslations("doctor.sidebarList");
  console.log(selectedDate);

  if (!selectedDate) return null;

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const appointments = appointmentsByDate[dateStr] || [];

  // Format dates using the translation functions
  const formattedDate = sidebarT("title", { date: selectedDate });

  // Get the day of the week and day of the month
  const dayOfWeek = format(selectedDate, "EEEE");
  const dayOfMonth = format(selectedDate, "d");
  const monthYear = format(selectedDate, "MMMM yyyy");

  return (
    <div className="h-full flex flex-col">
      <div className="mb-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-blue-50/80 dark:bg-blue-900/20 p-3 rounded-xl shadow-sm">
            <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {formattedDate}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {monthYear}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
                "dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
                "rounded-lg px-2.5 py-0.5"
              )}
            >
              {appointments.length} {t("calendar.appointments")}
            </Badge>
          </div>
        </div>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-3 overflow-auto flex-grow pr-1">
          {appointments.map((appointment) => (
            <Card
              key={appointment.workingScheduleId}
              className="border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden group"
            >
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-300 dark:from-blue-500 dark:to-blue-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 text-white text-sm font-medium">
                      {getInitials(appointment.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">
                        {appointment.customerName}
                      </h4>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-blue-400 dark:text-blue-500" />
                      <span>
                        {sidebarT("timeRange", {
                          startTime: format(
                            parseISO(`2000-01-01T${appointment.startTime}`),
                            "h:mm a"
                          ),
                          endTime: format(
                            parseISO(`2000-01-01T${appointment.endTime}`),
                            "h:mm a"
                          ),
                        })}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 max-w-[60%] truncate">
                        {appointment.serviceName}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg -mr-1"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        {sidebarT("detailsButton")}
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
        <div className="flex-grow flex items-center justify-center flex-col text-center p-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-blue-400 dark:text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            {sidebarT("emptyTitle")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
            {sidebarT("emptyDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
