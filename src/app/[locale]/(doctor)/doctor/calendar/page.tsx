"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useAppointments } from "@/hooks/use-appointments";
import { AppointmentStatus } from "@/components/doctor/types";

// Dynamically import components
const AppointmentModal = dynamic(
  () => import("@/components/doctor/appointments/appointment-modal"),
  {
    ssr: false,
  }
);

const DoctorScheduleView = dynamic(
  () => import("@/components/doctor/calendar/doctor-schedule-view"),
  {
    ssr: false,
  }
);

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "schedule">(
    "day"
  );
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all"
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  const t = useTranslations("doctorCalendar");
  const { appointments } = useAppointments();

  const filteredAppointments = appointments.filter(
    (appointment) =>
      statusFilter === "all" || appointment.status === statusFilter
  );

  const handlePrevious = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(date.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setMonth(date.getMonth() - 1);
    }
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(date.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    setDate(newDate);
  };

  const handleToday = () => {
    setDate(new Date());
  };

  const handleSelectAppointment = (id: string) => {
    setSelectedAppointmentId(id);
  };

  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
  };

  const selectedAppointment = selectedAppointmentId
    ? appointments.find((a) => a.id === selectedAppointmentId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-80">
          <Card>
            <CardHeader>
              <CardTitle>{t("calendar.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
              />
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">
                  {t("calendar.appointmentTypes")}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                    >
                      {t("calendar.consultation")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      {t("calendar.treatment")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                    >
                      {t("calendar.followUp")}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleToday}>
                    {t("navigation.today")}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="text-lg font-semibold">
                    {date.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {view !== "schedule" && (
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                          setStatusFilter(value as AppointmentStatus | "all")
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t("filter.byStatus")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("filter.all")}</SelectItem>
                          <SelectItem value={AppointmentStatus.CONFIRMED}>
                            {t("filter.confirmed")}
                          </SelectItem>
                          <SelectItem value={AppointmentStatus.PENDING}>
                            {t("filter.pending")}
                          </SelectItem>
                          <SelectItem value={AppointmentStatus.COMPLETED}>
                            {t("filter.completed")}
                          </SelectItem>
                          <SelectItem value={AppointmentStatus.CANCELLED}>
                            {t("filter.cancelled")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DoctorScheduleView />
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
