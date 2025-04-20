"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ScheduleRegistrationForm } from "@/components/doctor/schedule-registration-form";
import { AvailableShiftsCalendar } from "@/components/doctor/available-shifts-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ListFilter, ChevronRight } from "lucide-react";
import { AvailableShiftsList } from "@/components/doctor/available-shifts-list";
import type { ClinicShiftSchedule } from "@/features/doctor/types";
import { motion } from "framer-motion";
import { SuccessAnimation } from "@/components/doctor/success-animation";

export default function RegisterSchedulePage() {
  const t = useTranslations("registerSchedule");
  const [selectedShifts, setSelectedShifts] = useState<ClinicShiftSchedule[]>(
    []
  );
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectShift = (shift: ClinicShiftSchedule) => {
    setSelectedShifts((prev) => {
      // Check if already selected
      const isSelected = prev.some(
        (s) => s.workingScheduleId === shift.workingScheduleId
      );

      // If selected, remove it; otherwise, add it
      return isSelected
        ? prev.filter((s) => s.workingScheduleId !== shift.workingScheduleId)
        : [...prev, shift];
    });
  };

  const handleRegistrationSuccess = () => {
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelectedShifts([]);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-950 dark:to-purple-950/30 p-4 md:p-6 lg:p-8">
      {showSuccess && <SuccessAnimation onClose={handleCloseSuccess} />}

      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
                <span>Doctor Portal</span>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span>Schedule</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                {t("title")}
              </h1>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
            {t("description")}
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-purple-100/50 dark:border-purple-900/20 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    {t("availableShifts")}
                  </h2>
                  <Tabs
                    value={viewMode}
                    onValueChange={(v) => setViewMode(v as "calendar" | "list")}
                    className="w-full sm:w-auto"
                  >
                    <TabsList className="grid grid-cols-2 w-full sm:w-auto bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-lg">
                      <TabsTrigger
                        value="calendar"
                        className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {t("calendarView")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="list"
                        className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <ListFilter className="h-4 w-4 mr-2" />
                        {t("listView")}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="p-6">
                <Tabs value={viewMode} className="hidden">
                  <TabsContent
                    value="calendar"
                    className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                  >
                    <AvailableShiftsCalendar
                      selectedShifts={selectedShifts}
                      onSelectShift={handleSelectShift}
                    />
                  </TabsContent>

                  <TabsContent
                    value="list"
                    className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                  >
                    <AvailableShiftsList
                      selectedShifts={selectedShifts}
                      onSelectShift={handleSelectShift}
                    />
                  </TabsContent>
                </Tabs>

                {/* Render the active view directly based on viewMode */}
                {viewMode === "calendar" ? (
                  <AvailableShiftsCalendar
                    selectedShifts={selectedShifts}
                    onSelectShift={handleSelectShift}
                  />
                ) : (
                  <AvailableShiftsList
                    selectedShifts={selectedShifts}
                    onSelectShift={handleSelectShift}
                  />
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ScheduleRegistrationForm
              selectedShifts={selectedShifts}
              onClearSelection={() => setSelectedShifts([])}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
