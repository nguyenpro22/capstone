"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
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
import {
  Calendar,
  Clock,
  User,
  X,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import type {
  DoctorWorkingSchedule,
  WorkingSchedule,
} from "@/features/doctor/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

interface AppointmentDetailsProps {
  appointment: WorkingSchedule;
  shift?: DoctorWorkingSchedule | null;
  onClose: () => void;
}

export function AppointmentDetails({
  appointment,
  shift,
  onClose,
}: AppointmentDetailsProps) {
  const t = useTranslations("doctor");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingNote(false);
    setIsEditingNote(false);
    // In a real app, you would update the appointment notes via API
  };

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

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] rounded-xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("calendar.appointmentDetails")}
            </DialogTitle>
            <DialogDescription className="text-purple-100 mt-1">
              {shift?.date
                ? format(new Date(shift.date), "EEEE, MMMM d, yyyy")
                : ""}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col max-h-[calc(90vh-180px)]"
        >
          <div className="border-b border-purple-100 dark:border-purple-900/50">
            <TabsList className="w-full h-auto p-0 bg-transparent rounded-none">
              <TabsTrigger
                value="details"
                className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500 dark:data-[state=active]:border-purple-400 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
              >
                {t("calendar.appointmentDetails")}
              </TabsTrigger>
              <TabsTrigger
                value="patient"
                className="flex-1 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500 dark:data-[state=active]:border-purple-400 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
              >
                {t("calendar.patientInfo")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="details"
            className="p-6 space-y-4 mt-0 overflow-y-auto max-h-[calc(90vh-240px)]"
          >
            {shift && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-purple-500" />
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("shift.doctor")}: {shift.doctorName}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {t("shift.shiftTime")}: {formatTime(shift.startTime)} -{" "}
                    {formatTime(shift.endTime)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {appointment.customerName}
              </div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                {t(
                  `appointment.status.${appointment.status
                    .toLowerCase()
                    .replace(/\s+/g, "")}`
                )}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t("time.startTime")}
                </div>
                <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                  {formatTime(appointment.startTime)}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t("time.endTime")}
                </div>
                <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                  {formatTime(appointment.endTime)}
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("time.duration")}
              </div>
              <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {hours > 0 &&
                  `${hours} ${hours === 1 ? t("time.hour") : t("time.hours")}`}
                {minutes > 0 &&
                  ` ${minutes} ${
                    minutes === 1 ? t("time.minute") : t("time.minutes")
                  }`}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("appointment.service")}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <div className="text-lg font-medium text-slate-800 dark:text-slate-200">
                  {appointment.serviceName}
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {t("appointment.notes")}
                </div>
                {!isEditingNote && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingNote(true)}
                    className="h-7 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    {t("calendar.edit")}
                  </Button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder={t("calendar.enterNotes")}
                    className="min-h-[100px] text-sm border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingNote(false)}
                      disabled={isSavingNote}
                      className="h-8 text-xs border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                    >
                      {t("calendar.cancel")}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveNote}
                      disabled={isSavingNote}
                      className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isSavingNote ? (
                        <>
                          <span className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                          {t("calendar.saving")}
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3 mr-1" />
                          {t("calendar.save")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-slate-700 dark:text-slate-300 text-sm min-h-[40px]">
                  {noteText || t("calendar.noNotes")}
                </div>
              )}
            </div>

            {appointment.currentProcedureName && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t("appointment.currentProcedure")}
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  {appointment.currentProcedureName}
                </div>
              </div>
            )}

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("appointment.step")}
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                {t("appointment.step")} {appointment.stepIndex}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="patient"
            className="p-6 space-y-4 mt-0 overflow-y-auto max-h-[calc(90vh-240px)]"
          >
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16 border-2 border-purple-100 dark:border-purple-900 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white text-xl font-medium">
                  {getInitials(appointment.customerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  {appointment.customerName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("appointment.patientId")}:{" "}
                  {appointment.customerId.substring(0, 8)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t("appointment.serviceHistory")}
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <p className="text-sm">
                    {t("appointment.currentService")}: {appointment.serviceName}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t("appointment.appointmentStatus")}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(appointment.status)}
                  <span className="text-slate-700 dark:text-slate-300">
                    {t(
                      `appointment.status.${appointment.status
                        .toLowerCase()
                        .replace(/\s+/g, "")}`
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t("appointment.customerScheduleId")}
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-sm font-mono">
                {appointment.customerScheduleId}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-6 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-200 dark:border-purple-800">
          <Button
            onClick={onClose}
            className="w-full border-purple-200 dark:border-purple-800 bg-white hover:bg-purple-50 text-purple-700 dark:text-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{t("calendar.close")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get status icon
function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "in progress":
    case "confirmed":
      return <Clock className="h-4 w-4 text-purple-500" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "cancelled":
    case "uncompleted":
      return <XCircle className="h-4 w-4 text-rose-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-slate-500" />;
  }
}

// Helper function to format time
function formatTime(timeString: string): string {
  if (!timeString) return "";

  // Handle format like "08:30:00"
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    const hour = Number.parseInt(parts[0]);
    const minute = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  }

  return timeString;
}

// Helper function to get initials
function getInitials(name: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
