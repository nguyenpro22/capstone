"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useTranslations } from "next-intl";
import { useAppointments } from "@/hooks/use-appointments";
import { AppointmentStatus } from "../types";

interface AppointmentCount {
  day: string;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
}

export default function AppointmentSummary() {
  const { appointments } = useAppointments();
  const [weeklyData, setWeeklyData] = useState<AppointmentCount[]>([]);
  const t = useTranslations("doctorDashboard.appointmentSummary");

  useEffect(() => {
    // Get the current date
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    // Initialize data for each day of the week
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const initialData: AppointmentCount[] = Array.from(
      { length: 7 },
      (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return {
          day: days[i],
          confirmed: 0,
          pending: 0,
          completed: 0,
          cancelled: 0,
        };
      }
    );

    // Count appointments for each day and status
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const dayDiff = Math.floor(
        (appointmentDate.getTime() - startOfWeek.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (dayDiff >= 0 && dayDiff < 7) {
        initialData[dayDiff][
          appointment.status as keyof Omit<AppointmentCount, "day">
        ] += 1;
      }
    });

    setWeeklyData(initialData);
  }, [appointments]);

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={AppointmentStatus.CONFIRMED}
                name={t("confirmed")}
                fill="#10b981"
              />
              <Bar
                dataKey={AppointmentStatus.PENDING}
                name={t("pending")}
                fill="#f59e0b"
              />
              <Bar
                dataKey={AppointmentStatus.COMPLETED}
                name={t("completed")}
                fill="#3b82f6"
              />
              <Bar
                dataKey={AppointmentStatus.CANCELLED}
                name={t("cancelled")}
                fill="#ef4444"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
