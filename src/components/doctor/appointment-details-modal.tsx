"use client";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { User, Stethoscope, X, Edit, Save } from "lucide-react";
import type { DoctorWorkingSchedule } from "@/features/doctor/types";
import { useAddAppointmentNoteMutation } from "@/features/doctor/api";
import { toast } from "react-toastify";

interface AppointmentDetailsModalProps {
  appointment: DoctorWorkingSchedule | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailsModalProps) {
  const t = useTranslations("registerSchedule");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [addAppointmentNote, { isLoading: isSavingNote }] =
    useAddAppointmentNoteMutation();

  if (!appointment) return null;

  // Calculate appointment duration in hours and minutes
  const calculateDuration = () => {
    const startTime = parseISO(`2000-01-01T${appointment.startTime}`);
    const endTime = parseISO(`2000-01-01T${appointment.endTime}`);
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  const { hours, minutes } = calculateDuration();

  // Get status color based on appointment status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/50";
      case "in progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50";
      case "scheduled":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50";
      case "pending":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/50";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const handleEditNote = () => {
    setNoteText(appointment.note || "");
    setIsEditingNote(true);
  };

  const handleSaveNote = async () => {
    try {
      await addAppointmentNote({
        customerScheduleId: appointment.workingScheduleId,
        note: noteText,
      }).unwrap();

      toast.success(t("noteSaved"), {
        position: "bottom-right",
        autoClose: 2000,
      });
      setIsEditingNote(false);
    } catch (error) {
      toast.error(t("errorSavingNote"), {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("appointmentDetails")}
            </DialogTitle>
            <DialogDescription className="text-indigo-100 mt-1">
              {format(parseISO(appointment.date), "EEEE, MMMM d, yyyy", {
                locale: vi,
              })}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {appointment.customerName}
            </div>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("startTime")}
              </div>
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {format(
                  parseISO(`2000-01-01T${appointment.startTime}`),
                  "h:mm a"
                )}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("endTime")}
              </div>
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {format(
                  parseISO(`2000-01-01T${appointment.endTime}`),
                  "h:mm a"
                )}
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
              {t("service")}
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-indigo-500" />
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {appointment.serviceName}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t("notes")}
              </div>
              {!isEditingNote && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditNote}
                  className="h-7 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {t("edit")}
                </Button>
              )}
            </div>

            {isEditingNote ? (
              <div className="space-y-2">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={t("enterNotes")}
                  className="min-h-[100px] text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingNote(false)}
                    disabled={isSavingNote}
                    className="h-8 text-xs"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNote}
                    disabled={isSavingNote}
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSavingNote ? (
                      <>
                        <span className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        {t("saving")}
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-1" />
                        {t("saveNotes")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-slate-700 dark:text-slate-300 text-sm min-h-[40px]">
                {appointment.note || t("noNotes")}
              </div>
            )}
          </div>

          {appointment.currentProcedureName && (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("currentProcedure")}
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                {appointment.currentProcedureName}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={onClose}
            className="w-full border-slate-200 dark:border-slate-700"
          >
            <X className="h-4 w-4 mr-2" />
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
