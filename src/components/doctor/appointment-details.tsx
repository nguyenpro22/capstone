"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
  FileText,
  Stethoscope,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarClock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { DoctorWorkingSchedule } from "@/features/doctor/types";
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

      toast.success(
        t("appointment.noteSaved") + ": " + t("appointment.noteSuccess")
      );

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
          color:
            "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-300",
          label: t("status.pending"),
        };
      case OrderStatus.IN_PROGRESS:
        return {
          variant: "default" as const,
          icon: Clock,
          color:
            "text-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300",
          label: t("status.inProgress"),
        };
      case OrderStatus.COMPLETED:
        return {
          variant: "success" as const,
          icon: CheckCircle2,
          color:
            "text-green-500 bg-green-50 dark:bg-green-950/30 dark:text-green-300",
          label: t("status.completed"),
        };
      case OrderStatus.UNCOMPLETED:
        return {
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-500 bg-red-50 dark:bg-red-950/30 dark:text-red-300",
          label: t("status.uncompleted"),
        };
      default:
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          color: "text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
          label: status,
        };
    }
  };

  const statusInfo = getStatusInfo(appointment.status);
  const StatusIcon = statusInfo.icon;

  // Get patient initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border dark:border-border/30">
              <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20">
                {getInitials(appointment.customerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">
                {appointment.customerName}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={statusInfo.variant} className="font-normal">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(parseISO(appointment.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="dark:bg-border/20" />

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
          <div>
            <Label className="text-xs text-muted-foreground">
              {t("appointment.time")}
            </Label>
            <div className="font-medium flex items-center mt-1">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              {format(
                parseISO(`2000-01-01T${appointment.startTime}`),
                "h:mm a"
              )}{" "}
              -{format(parseISO(`2000-01-01T${appointment.endTime}`), "h:mm a")}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">
              {t("appointment.service")}
            </Label>
            <div className="font-medium flex items-center mt-1">
              <Stethoscope className="h-4 w-4 mr-2 text-muted-foreground" />
              {appointment.serviceName}
            </div>
          </div>

          <div className="col-span-2">
            <Label className="text-xs text-muted-foreground">
              {t("appointment.procedure")}
            </Label>
            <div className="font-medium flex items-center mt-1">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              {appointment.currentProcedureName}
            </div>
          </div>
        </div>

        <Separator className="dark:bg-border/20" />

        <div className="space-y-2 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="note" className="text-sm font-medium">
              {t("appointment.notes")}
            </Label>
            {!isInProgress && (
              <Badge
                variant="outline"
                className="font-normal text-xs dark:border-border/30"
              >
                {t("appointment.notesRestriction")}
              </Badge>
            )}
          </div>
          <Card
            className={cn(
              "border dark:border-border/30",
              isInProgress
                ? "border-primary/30 dark:border-primary/40"
                : "border-muted dark:border-muted/30"
            )}
          >
            <CardContent className="p-0">
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("appointment.addNotes")}
                rows={4}
                disabled={!isInProgress}
                className={cn(
                  "resize-none transition-all border-0 focus-visible:ring-0 rounded-none",
                  isInProgress ? "focus:border-primary" : ""
                )}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:border-border/30 dark:hover:bg-muted/30"
          >
            {t("appointment.cancel")}
          </Button>
          {isInProgress && (
            <Button
              onClick={handleSaveNote}
              disabled={isLoading}
              className="relative"
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  {t("appointment.saving")}
                </>
              ) : (
                t("appointment.save")
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
