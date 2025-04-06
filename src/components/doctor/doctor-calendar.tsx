"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addDays,
  startOfWeek,
  endOfWeek,
  parseISO,
  isToday,
  addWeeks,
  subWeeks,
} from "date-fns";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { AppointmentDetails } from "./appointment-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { DoctorWorkingSchedule } from "@/features/doctor/types";
import { useGetDoctorSchedulesQuery } from "@/features/doctor/api";

export function DoctorCalendar() {
  const t = useTranslations("doctor");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorWorkingSchedule | null>(null);
  const [view, setView] = useState<"month" | "week">("month");
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  // Format date for API query - expand range for week view
  const queryStartDate =
    view === "month"
      ? format(startOfMonth(date), "yyyy-MM-dd")
      : format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");

  const queryEndDate =
    view === "month"
      ? format(endOfMonth(date), "yyyy-MM-dd")
      : format(endOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");

  // Fetch doctor schedules for the selected period
  const { data, isLoading } = useGetDoctorSchedulesQuery({
    pageSize: 100,
    searchTerm: `${queryStartDate} to ${queryEndDate}`,
  });

  const schedules = data?.value?.items || [];

  // Group appointments by date
  const appointmentsByDate = schedules.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, DoctorWorkingSchedule[]>);

  // Generate week days for week view
  useEffect(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });

    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    setWeekDays(days);
  }, [date]);

  // Navigation functions
  const navigate = (direction: "prev" | "next") => {
    if (view === "month") {
      setDate(direction === "prev" ? subMonths(date, 1) : addMonths(date, 1));
    } else {
      setDate(direction === "prev" ? subWeeks(date, 1) : addWeeks(date, 1));
    }
  };

  // Go to today
  const goToToday = () => setDate(new Date());

  // Handle appointment selection
  const handleAppointmentClick = (appointment: DoctorWorkingSchedule) => {
    setSelectedAppointment(appointment);
  };

  // Close appointment details modal
  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  // Get formatted title based on view
  const getViewTitle = () => {
    if (view === "month") {
      return format(date, "MMMM yyyy");
    } else {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });

      if (format(start, "MMM") === format(end, "MMM")) {
        return `${format(start, "d")} - ${format(end, "d")} ${format(
          end,
          "MMMM yyyy"
        )}`;
      } else {
        return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
      }
    }
  };

  // Generate calendar days for month view
  const generateMonthView = () => {
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Generate weeks
    const weeks = [];
    let day = startDate;

    while (day <= endDate) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dateStr = format(currentDay, "yyyy-MM-dd");
        const dayAppointments = appointmentsByDate[dateStr] || [];
        const isCurrentMonth = isSameMonth(currentDay, date);
        const isCurrentDay = isToday(currentDay);

        week.push(
          <div
            key={dateStr}
            className={cn(
              "min-h-[120px] p-0 border border-border/40 relative group",
              !isCurrentMonth && "bg-muted/10 dark:bg-muted/5",
              isCurrentDay &&
                "bg-primary/5 border-primary/30 dark:bg-primary/10"
            )}
          >
            <div className="flex justify-between items-center p-2 border-b border-border/40">
              <span
                className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                  isCurrentDay && "bg-primary text-primary-foreground"
                )}
              >
                {format(currentDay, "d")}
              </span>

              {isCurrentMonth && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="p-1 space-y-1 max-h-[80px] overflow-y-auto">
              {dayAppointments.slice(0, 3).map((appointment) => (
                <AppointmentItem
                  key={appointment.workingScheduleId}
                  appointment={appointment}
                  onClick={() => handleAppointmentClick(appointment)}
                />
              ))}

              {dayAppointments.length > 3 && (
                <div className="text-xs text-center text-primary font-medium mt-1 py-0.5 bg-primary/5 dark:bg-primary/10 rounded">
                  +{dayAppointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      weeks.push(
        <div
          key={format(week[0].key as string, "yyyy-MM-dd")}
          className="grid grid-cols-7"
        >
          {week}
        </div>
      );
    }

    return (
      <div className="rounded-lg overflow-hidden shadow-sm border border-border/40 dark:border-border/20">
        <div className="grid grid-cols-7 bg-muted/20 dark:bg-muted/10">
          {dayNames.map((name) => (
            <div
              key={name}
              className="text-center text-sm font-medium text-muted-foreground py-3 border-b border-border/40 dark:border-border/20"
            >
              {name}
            </div>
          ))}
        </div>
        <div className="bg-card dark:bg-card/95">{weeks}</div>
      </div>
    );
  };

  // Generate time slots for week view
  const generateWeekView = () => {
    // Time slots from 8 AM to 6 PM
    const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);

    return (
      <div className="rounded-lg overflow-hidden shadow-sm border border-border/40 dark:border-border/20">
        <div className="grid grid-cols-8 bg-muted/20 dark:bg-muted/10">
          <div className="p-3 text-center font-medium text-muted-foreground border-r border-b border-border/40 dark:border-border/20">
            Time
          </div>
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "p-3 text-center border-r border-b last:border-r-0 border-border/40 dark:border-border/20",
                isToday(day) && "bg-primary/5 dark:bg-primary/10"
              )}
            >
              <div className="text-sm text-muted-foreground">
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "text-base font-medium",
                  isToday(day) && "text-primary"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card dark:bg-card/95">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b last:border-b-0 border-border/40 dark:border-border/20"
            >
              <div className="py-3 px-4 text-right text-sm text-muted-foreground border-r border-border/40 dark:border-border/20 bg-muted/10 dark:bg-muted/5">
                {format(new Date(2000, 1, 1, hour), "h a")}
              </div>

              {weekDays.map((day, index) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const appointments = appointmentsByDate[dateStr] || [];

                // Filter appointments for this hour
                const hourAppointments = appointments.filter((appointment) => {
                  const startHour = Number.parseInt(
                    appointment.startTime.split(":")[0]
                  );
                  return startHour === hour;
                });

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "p-1 min-h-[80px] border-r last:border-r-0 border-border/40 dark:border-border/20 relative group",
                      isToday(day) && "bg-primary/5 dark:bg-primary/10",
                      hour % 2 === 0 && "bg-muted/5 dark:bg-muted/[0.03]"
                    )}
                  >
                    {hourAppointments.map((appointment) => (
                      <AppointmentItem
                        key={appointment.workingScheduleId}
                        appointment={appointment}
                        onClick={() => handleAppointmentClick(appointment)}
                        showTime
                      />
                    ))}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 dark:bg-primary/20 p-2.5 rounded-full text-primary">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold">{getViewTitle()}</h2>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="h-9 shadow-sm hover:shadow dark:border-border/30 dark:bg-background/80"
              >
                {t("calendar.today")}
              </Button>

              <div className="flex items-center rounded-md shadow-sm bg-background dark:bg-background/80 dark:border dark:border-border/30">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => navigate("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="h-9 w-px bg-border dark:bg-border/30" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => navigate("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shadow-sm hover:shadow dark:border-border/30 dark:bg-background/80"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
        <div className="flex justify-end mb-4">
          <TabsList className="dark:bg-muted/20">
            <TabsTrigger value="month">{t("calendar.month")}</TabsTrigger>
            <TabsTrigger value="week">{t("calendar.week")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="month">{generateMonthView()}</TabsContent>

        <TabsContent value="week">{generateWeekView()}</TabsContent>
      </Tabs>

      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

interface AppointmentItemProps {
  appointment: DoctorWorkingSchedule;
  onClick: () => void;
  showTime?: boolean;
}

function AppointmentItem({
  appointment,
  onClick,
  showTime = false,
}: AppointmentItemProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40",
          border: "border-l-2 border-amber-300 dark:border-amber-500/70",
          text: "text-amber-700 dark:text-amber-300",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/40",
          border: "border-l-2 border-blue-400 dark:border-blue-500/70",
          text: "text-blue-700 dark:text-blue-300",
        };
      case "COMPLETED":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/40",
          border: "border-l-2 border-emerald-400 dark:border-emerald-500/70",
          text: "text-emerald-700 dark:text-emerald-300",
        };
      case "UNCOMPLETED":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/40",
          border: "border-l-2 border-rose-400 dark:border-rose-500/70",
          text: "text-rose-700 dark:text-rose-300",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-800/40",
          border: "border-l-2 border-gray-300 dark:border-gray-600",
          text: "text-gray-700 dark:text-gray-300",
        };
    }
  };

  const styles = getStatusStyles(appointment.status);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            className={cn(
              "text-left text-xs p-1.5 rounded shadow-sm border group cursor-pointer hover:shadow transition-shadow",
              styles.bg,
              styles.border,
              styles.text
            )}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium truncate flex-1">
                {appointment.customerName}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onClick}>
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {showTime && (
              <div className="text-xs opacity-80 mt-0.5">
                {format(
                  parseISO(`2000-01-01T${appointment.startTime}`),
                  "h:mm a"
                )}{" "}
                -
                {format(
                  parseISO(`2000-01-01T${appointment.endTime}`),
                  "h:mm a"
                )}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="font-medium">{appointment.customerName}</div>
            <div className="text-xs">
              {format(
                parseISO(`2000-01-01T${appointment.startTime}`),
                "h:mm a"
              )}{" "}
              -{format(parseISO(`2000-01-01T${appointment.endTime}`), "h:mm a")}
            </div>
            <div className="text-xs">{appointment.serviceName}</div>
            <Badge variant="outline" className="mt-1 text-xs">
              {appointment.status}
            </Badge>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
