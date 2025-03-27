"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAppointments } from "@/hooks/use-appointments";
import { getStatusColor } from "../utils";

export default function TodaySchedule() {
  const { appointments } = useAppointments();
  const t = useTranslations("doctorDashboard.todaySchedule");
  const statusT = useTranslations("doctorCommon.status");

  // Get today's date
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Filter appointments for today
  const todayAppointments = appointments
    .filter((appointment) => appointment.date === todayStr)
    .sort((a, b) => {
      const timeA = a.time.split(":").map(Number);
      const timeB = b.time.split(":").map(Number);

      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      }
      return timeA[1] - timeB[1];
    });

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  const getAppointmentForTimeSlot = (timeSlot: string) => {
    const [hour, minute] = timeSlot.split(":").map(Number);

    return todayAppointments.find((appointment) => {
      const [appHour, appMinute] = appointment.time.split(":").map(Number);
      return appHour === hour && appMinute === minute;
    });
  };

  return (
    <Card className="border-t-4 border-t-secondary">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description", { date: today.toLocaleDateString() })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {timeSlots.map((timeSlot) => {
            const appointment = getAppointmentForTimeSlot(timeSlot);

            return (
              <div
                key={timeSlot}
                className={cn(
                  "flex items-center p-2 rounded-md transition-colors",
                  appointment
                    ? "bg-muted"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <div className="w-16 font-medium">{timeSlot}</div>
                {appointment ? (
                  <div className="flex flex-1 items-center justify-between">
                    <div className="ml-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {appointment.patient.name}
                        </span>
                        <Badge
                          className={cn(
                            "border",
                            getStatusColor(appointment.status)
                          )}
                        >
                          {statusT(appointment.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.service}
                      </div>
                    </div>
                    <Link href={`/appointments/${appointment.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        {t("details")}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="ml-4">{t("available")}</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
