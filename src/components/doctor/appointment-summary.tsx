"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, CalendarClock } from "lucide-react";

interface AppointmentSummaryProps {
  counts: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    uncompleted: number;
  };
}

export function AppointmentSummary({ counts }: AppointmentSummaryProps) {
  const t = useTranslations("doctor");

  const items = [
    {
      label: t("status.pending"),
      value: counts.pending,
      icon: CalendarClock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      label: t("status.inProgress"),
      value: counts.inProgress,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: t("status.completed"),
      value: counts.completed,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: t("status.uncompleted"),
      value: counts.uncompleted,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {t("calendar.appointmentSummary")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-2 rounded-md"
              style={{ backgroundColor: item.bgColor }}
            >
              <div className="flex items-center">
                <div
                  className={`p-1.5 rounded-full mr-2 ${item.color} bg-white`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
