"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useAppointments } from "@/hooks/use-appointments";
import { getStatusColor } from "../utils";

export default function UpcomingAppointments() {
  const { appointments } = useAppointments();
  const t = useTranslations("doctorDashboard.upcomingAppointments");
  const statusT = useTranslations("doctorCommon.status");

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter appointments that are today or in the future and not cancelled
  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today && appointment.status !== "cancelled";
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <Link href="/calendar">
          <Button variant="outline" size="sm" className="ml-auto group">
            {t("viewAll")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            {t("noAppointments")}
          </p>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => {
              const appointmentDateTime = new Date(
                `${appointment.date} ${appointment.time}`
              );
              const timeUntil = formatDistanceToNow(appointmentDateTime, {
                addSuffix: true,
              });

              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <div className="space-y-1">
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
                    <div className="text-sm">
                      {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {appointment.time} ({timeUntil})
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
