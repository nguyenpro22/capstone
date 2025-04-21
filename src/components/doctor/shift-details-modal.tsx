"use client";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle, X, AlertCircle } from "lucide-react";
import type { ClinicShiftSchedule } from "@/features/doctor/types";

interface ShiftDetailsModalProps {
  shift: ClinicShiftSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (shift: ClinicShiftSchedule) => void;
  isSelected: boolean;
  isDisabled?: boolean;
}

export function ShiftDetailsModal({
  shift,
  isOpen,
  onClose,
  onSelect,
  isSelected,
  isDisabled = false,
}: ShiftDetailsModalProps) {
  const t = useTranslations("registerSchedule");

  if (!shift) return null;

  const handleSelect = () => {
    onSelect(shift);
    onClose();
  };

  // Calculate shift duration in hours and minutes
  const calculateDuration = () => {
    const startTime = parseISO(`2000-01-01T${shift.startTime}`);
    const endTime = parseISO(`2000-01-01T${shift.endTime}`);
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  const { hours, minutes } = calculateDuration();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("shiftDetails")}
            </DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1">
              {format(parseISO(shift.date), "EEEE, MMMM d, yyyy", {
                locale: vi,
              })}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("startTime")}
              </div>
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {format(parseISO(`2000-01-01T${shift.startTime}`), "h:mm a")}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("endTime")}
              </div>
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {format(parseISO(`2000-01-01T${shift.endTime}`), "h:mm a")}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {t("duration")}
            </div>
            <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
              {hours > 0 && `${hours} ${hours === 1 ? t("hour") : t("hours")}`}
              {minutes > 0 &&
                ` ${minutes} ${minutes === 1 ? t("minute") : t("minutes")}`}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {t("clinic")}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-500" />
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                Main Clinic
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {t("status")}
            </div>
            <Badge
              className={
                isDisabled
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              }
            >
              {isDisabled ? t("unavailable") : t("available")}
            </Badge>
            {isDisabled && (
              <div className="mt-2 flex items-center gap-2 text-red-500 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                {t("shiftOverlapsWarning")}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-200 dark:border-slate-700"
            >
              <X className="h-4 w-4 mr-2" />
              {t("close")}
            </Button>
            <Button
              onClick={handleSelect}
              disabled={!isSelected && isDisabled}
              className={`flex-1 ${
                isSelected
                  ? "bg-red-600 hover:bg-red-700"
                  : isDisabled
                  ? "bg-slate-400 dark:bg-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              {isSelected ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  {t("removeShift")}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t("selectShift")}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
