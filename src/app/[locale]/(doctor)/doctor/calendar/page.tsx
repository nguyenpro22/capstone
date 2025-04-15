"use client";

import { useTranslations } from "next-intl";
import { DoctorCalendar } from "@/components/doctor/doctor-calendar";

export default function DoctorCalendarPage() {
  return (
    <div>
      <DoctorCalendar />
    </div>
  );
}
