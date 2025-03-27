"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { Appointment } from "../types";

interface AppointmentDetailsProps {
  appointment: Appointment;
}

export default function AppointmentDetails({
  appointment,
}: AppointmentDetailsProps) {
  const t = useTranslations("doctorAppointments.appointmentDetails");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{t("serviceDetails")}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {appointment.service}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-sm font-medium">{t("duration")}</h4>
              <p className="text-sm text-muted-foreground">60 minutes</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">{t("price")}</h4>
              <p className="text-sm text-muted-foreground">$150</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">{t("appointmentHistory")}</h3>
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">{t("created")}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}{" "}
                  at 10:30 AM
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">{t("lastUpdated")}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(
                    Date.now() - 2 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}{" "}
                  at 2:15 PM
                </p>
              </div>
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-medium">{t("statusChanges")}</h4>
              <div className="space-y-2 mt-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {new Date(
                      Date.now() - 7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}{" "}
                    at 10:30 AM:
                  </span>{" "}
                  {t("createdWithStatus")}{" "}
                  <span className="font-medium">pending</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {new Date(
                      Date.now() - 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}{" "}
                    at 9:45 AM:
                  </span>{" "}
                  {t("changedTo")}{" "}
                  <span className="font-medium">confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">{t("additionalNotes")}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {appointment.notes || t("noAdditionalNotes")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
