"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Appointment } from "../types";
import { getStatusColor } from "../utils";

interface AppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export default function AppointmentModal({
  appointment,
  onClose,
}: AppointmentModalProps) {
  const t = useTranslations("doctorAppointments");
  const statusT = useTranslations("doctorCommon.status");

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t("details.title")}</DialogTitle>
            <Badge className={getStatusColor(appointment.status)}>
              {statusT(appointment.status)}
            </Badge>
          </div>
          <DialogDescription>
            View details for this appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{t("patient.information")}</h3>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patient.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patient.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">
              {t("appointment.information")}
            </h3>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("appointment.date", {
                    date: new Date(appointment.date).toLocaleDateString(),
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{t("appointment.time", { time: appointment.time })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("appointment.service", { service: appointment.service })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">{t("appointment.notes")}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {appointment.notes || t("appointment.noNotes")}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Link href={`/appointments/${appointment.id}`}>
              <Button>View Full Details</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
