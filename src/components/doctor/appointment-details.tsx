"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarClock,
  Calendar,
  MessageSquare,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { DoctorWorkingSchedule } from "@/features/doctor/types";
import { useAddAppointmentNoteMutation } from "@/features/doctor/api";
import { OrderStatus } from "@/features/booking/types";
import toast from "react-hot-toast";

interface AppointmentDetailsProps {
  appointment: DoctorWorkingSchedule;
  onClose: () => void;
}

export function AppointmentDetails({
  appointment,
  onClose,
}: AppointmentDetailsProps) {
  const t = useTranslations("doctor");
  const [note, setNote] = useState(appointment.note || "");
  const [addAppointmentNote, { isLoading }] = useAddAppointmentNoteMutation();

  const isInProgress = appointment.status === OrderStatus.IN_PROGRESS;

  const handleSaveNote = async () => {
    try {
      await addAppointmentNote({
        customerScheduleId: appointment.workingScheduleId,
        note,
      }).unwrap();

      toast.success(t("appointment.noteSaved") || "Note saved successfully");
      onClose();
    } catch (error) {
      toast.error(t("appointment.noteError") || "An error occurred");
    }
  };

  // Get status badge variant and icon
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          variant: "warning" as const,
          icon: CalendarClock,
          color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
          label: t("status.pending") || "Pending",
        };
      case OrderStatus.IN_PROGRESS:
        return {
          variant: "default" as const,
          icon: Clock,
          color: "text-sky-500 bg-sky-50 dark:bg-sky-900/20",
          label: t("status.inProgress") || "In Progress",
        };
      case OrderStatus.COMPLETED:
        return {
          variant: "success" as const,
          icon: CheckCircle2,
          color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
          label: t("status.completed") || "Completed",
        };
      case OrderStatus.UNCOMPLETED:
        return {
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20",
          label: t("status.uncompleted") || "Uncompleted",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          color: "text-slate-500 bg-slate-100 dark:bg-slate-800",
          label: status,
        };
    }
  };

  const statusInfo = getStatusInfo(appointment.status);
  const StatusIcon = statusInfo.icon;

  // Get patient initials for avatar
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl p-8 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="bg-sky-50 dark:bg-sky-900/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                  {getInitials(appointment.customerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl text-slate-800 dark:text-slate-200">
                  {appointment.customerName}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("font-normal", statusInfo.color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="border border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-sky-500" />
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">
                    Date & Time
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-slate-500 dark:text-slate-400">
                      Date:
                    </div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {format(parseISO(appointment.date), "EEEE, MMMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-slate-500 dark:text-slate-400">
                      Time:
                    </div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {format(
                        parseISO(`2000-01-01T${appointment.startTime}`),
                        "h:mm a"
                      )}{" "}
                      -
                      {format(
                        parseISO(`2000-01-01T${appointment.endTime}`),
                        "h:mm a"
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="h-4 w-4 text-sky-500" />
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">
                    Service Details
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-slate-500 dark:text-slate-400">
                      Service:
                    </div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {appointment.serviceName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 text-slate-500 dark:text-slate-400">
                      Procedure:
                    </div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {appointment.currentProcedureName}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-sky-500" />
              <Label
                htmlFor="note"
                className="font-medium text-slate-700 dark:text-slate-300"
              >
                Notes
              </Label>
              {!isInProgress && (
                <Badge
                  variant="outline"
                  className="font-normal text-xs border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-orange-200 ml-auto"
                >
                  {t("appointment.notesRestriction") ||
                    "Notes can only be edited during appointment"}
                </Badge>
              )}
            </div>

            <Card
              className={cn(
                "border",
                isInProgress
                  ? "border-sky-200 dark:border-sky-800/40 shadow-sm"
                  : "border-slate-200 dark:border-slate-800"
              )}
            >
              <CardContent className="p-0">
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    t("appointment.addNotes") ||
                    "Add notes about the appointment..."
                  }
                  rows={4}
                  disabled={!isInProgress}
                  className={cn(
                    "resize-none transition-all border-0 focus-visible:ring-0 rounded-none text-slate-700 dark:text-slate-300",
                    isInProgress
                      ? "focus:border-sky-500 dark:focus:border-sky-400"
                      : ""
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("appointment.cancel") || "Cancel"}
            </Button>
            {isInProgress && (
              <Button
                onClick={handleSaveNote}
                disabled={isLoading}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    {t("appointment.saving") || "Saving..."}
                  </>
                ) : (
                  t("appointment.save") || "Save Notes"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
