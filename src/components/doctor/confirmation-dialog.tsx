"use client";

import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { ClinicShiftSchedule } from "@/features/doctor/types";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedShifts: ClinicShiftSchedule[];
  isLoading: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedShifts,
  isLoading,
}: ConfirmationDialogProps) {
  const t = useTranslations("registerSchedule");

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
    >
      <AlertDialogContent className="max-w-md rounded-xl">
        <AlertDialogHeader>
          <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {t("confirmRegistration")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {t("confirmRegistrationDescription", {
              count: selectedShifts.length,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg my-4 border border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t("selectedShifts")} ({selectedShifts.length}):
          </div>
          <ul className="space-y-1 max-h-[150px] overflow-y-auto pr-2">
            {selectedShifts.map((shift) => (
              <li
                key={shift.workingScheduleId}
                className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
              >
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span>
                  {new Date(shift.date).toLocaleDateString()} (
                  {shift.startTime.substring(0, 5)} -{" "}
                  {shift.endTime.substring(0, 5)})
                </span>
              </li>
            ))}
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                {t("registering")}
              </>
            ) : (
              t("confirmAndRegister")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
