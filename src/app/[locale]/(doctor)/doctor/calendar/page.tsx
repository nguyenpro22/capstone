"use client";

import { useTranslations } from "next-intl";
import { DoctorCalendar } from "@/components/doctor/doctor-calendar";

export default function DoctorCalendarPage() {
  const t = useTranslations("doctor.calendar");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <DoctorCalendar />
    </div>
  );
}
