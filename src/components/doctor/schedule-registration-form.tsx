"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  Trash2,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import { useRegisterScheduleMutation } from "@/features/doctor/api";
import type { ClinicShiftSchedule } from "@/features/doctor/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationDialog } from "./confirmation-dialog";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";

interface ScheduleRegistrationFormProps {
  selectedShifts: ClinicShiftSchedule[];
  onClearSelection: () => void;
  onRegistrationSuccess?: () => void;
}

export function ScheduleRegistrationForm({
  selectedShifts,
  onClearSelection,
  onRegistrationSuccess,
}: ScheduleRegistrationFormProps) {
  const t = useTranslations("registerSchedule");
  const router = useRouter();
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;
  const [registerSchedule, { isLoading }] = useRegisterScheduleMutation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Group shifts by date for display
  const shiftsByDate = selectedShifts.reduce((acc, shift) => {
    const date = shift.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, ClinicShiftSchedule[]>);

  // Sort dates
  const sortedDates = Object.keys(shiftsByDate).sort((a, b) => {
    return parseISO(a).getTime() - parseISO(b).getTime();
  });

  const handleSubmit = async () => {
    if (selectedShifts.length === 0) {
      toast.error(t("pleaseSelectShifts"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmRegistration = async () => {
    try {
      const workingScheduleIds = selectedShifts.map(
        (shift) => shift.workingScheduleId
      );

      await registerSchedule({
        clinicId: clinicId || "c0b7058f-8e72-4dee-8742-0df6206d1843",
        workingScheduleIds,
      }).unwrap();

      toast.success(t("shiftsRegisteredSuccessfully"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setShowConfirmation(false);

      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      } else {
        onClearSelection();
        // Redirect to calendar page after successful registration
        router.push(`/doctor/calendar`);
      }
    } catch (error) {
      setShowConfirmation(false);
      toast.error(t("errorRegisteringShifts"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const removeShift = (shiftId: string) => {
    const shift = selectedShifts.find((s) => s.workingScheduleId === shiftId);
    if (shift) {
      const updatedShifts = selectedShifts.filter(
        (s) => s.workingScheduleId !== shiftId
      );
      // Call the parent component's function to update the selected shifts
      onClearSelection();
      updatedShifts.forEach((s) => {
        document.dispatchEvent(new CustomEvent("select-shift", { detail: s }));
      });
    }
  };

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden sticky top-6">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardList className="h-5 w-5" />
            {t("selectedShifts")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {selectedShifts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                  {t("noShiftsSelected")}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t("selectShiftsToRegister")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="shifts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 text-sm">
                    {selectedShifts.length} {t("shiftsSelected")}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="h-8 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    {t("clearAll")}
                  </Button>
                </div>

                <div className="max-h-[350px] overflow-y-auto pr-1 space-y-4">
                  {sortedDates.map((date) => (
                    <motion.div
                      key={date}
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {format(parseISO(date), "EEEE, MMMM d, yyyy", {
                            locale: vi,
                          })}
                        </h3>
                      </div>

                      {shiftsByDate[date].map((shift) => (
                        <motion.div
                          key={shift.workingScheduleId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {format(
                                parseISO(`2000-01-01T${shift.startTime}`),
                                "h:mm a"
                              )}{" "}
                              -
                              {format(
                                parseISO(`2000-01-01T${shift.endTime}`),
                                "h:mm a"
                              )}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeShift(shift.workingScheduleId)}
                            className="h-7 w-7 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={handleSubmit}
            disabled={selectedShifts.length === 0 || isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            {t("registerShifts")}
          </Button>
        </CardFooter>
      </Card>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmRegistration}
        selectedShifts={selectedShifts}
        isLoading={isLoading}
      />
    </>
  );
}
