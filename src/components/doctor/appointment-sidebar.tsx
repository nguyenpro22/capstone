"use client";

import { format, parseISO } from "date-fns";
import { ArrowRight, Clock, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { DoctorWorkingSchedule } from "@/features/doctor/types";

// Helper function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

interface Appointment {
  workingScheduleId: string;
  customerName: string;
  status: string;
  startTime: string;
  endTime: string;
  serviceName: string;
}

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

  if (!selectedDate) return null;

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const appointments = appointmentsByDate[dateStr] || [];
  console.log(selectedDate);

  // Format dates using the translation functions
  const formattedDate = sidebarT("title", { date: selectedDate });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/10 dark:border-border/20">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {formattedDate}
          </h3>
        </div>
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/70">
          {appointments.length} {t("calendar.appointments")}
        </Badge>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-3 overflow-auto flex-grow">
          {appointments.map((appointment) => (
            <Card
              key={appointment.workingScheduleId}
              className="border border-border/10 dark:border-border/20 shadow-sm hover:shadow-md transition-shadow rounded-xl"
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials(appointment.customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">
                        {appointment.customerName}
                      </h4>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
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
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {appointment.serviceName}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary hover:text-primary/80 rounded-lg"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        {sidebarT("detailsButton")}
                        <ArrowRight className="ml-1 h-3 w-3" />
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
          <Users className="h-12 w-12 text-muted-foreground/30 mb-2" />
          <h3 className="text-lg font-medium text-foreground">
            {sidebarT("emptyTitle")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {sidebarT("emptyDesc")}
          </p>
          <Button className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground rounded-lg shadow-md dark:shadow-primary/10">
            <Plus className="h-4 w-4 mr-1" />
            {sidebarT("addButton")}
          </Button>
        </div>
      )}
    </div>
  );
}
