"use client";

import { useState } from "react";

import { useShiftData } from "@/hooks/use-shift-data";
import { useTranslations } from "next-intl";
import type {
  DoctorWorkingSchedule,
  WorkingSchedule,
} from "@/features/doctor/types";
import { CalendarView } from "./calendar-view";
import { AppointmentSidebar } from "./appointment-sidebar";
import { AppointmentDetails } from "./appointment-details";

export default function CalendarPage() {
  const t = useTranslations("doctor");
  const { shifts, isLoading } = useShiftData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedShift, setSelectedShift] =
    useState<DoctorWorkingSchedule | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<WorkingSchedule | null>(null);

  // Get shifts for the selected date
  const shiftsForSelectedDate = selectedDate
    ? shifts.filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/30">
      <header className="bg-gradient-to-r from-purple-900/90 to-indigo-900/80 text-white p-4 shadow-md flex-shrink-0">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">{t("calendar.title")}</h1>
          <p className="text-purple-100">{t("calendar.subtitle")}</p>
        </div>
      </header>

      <main className="flex flex-1 p-4 gap-4 overflow-hidden min-h-0">
        <div className="flex-1 rounded-xl shadow-lg bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/50 overflow-hidden">
          <CalendarView
            shifts={shifts}
            isLoading={isLoading}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onSelectShift={setSelectedShift}
            onSelectAppointment={setSelectedAppointment}
          />
        </div>

        {selectedDate && (
          <div className="w-full md:w-80 lg:w-96 rounded-xl shadow-lg bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/50 overflow-hidden flex-shrink-0">
            <AppointmentSidebar
              selectedDate={selectedDate}
              shifts={shiftsForSelectedDate}
              onSelectShift={setSelectedShift}
              onSelectAppointment={setSelectedAppointment}
            />
          </div>
        )}
      </main>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          shift={selectedShift}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
