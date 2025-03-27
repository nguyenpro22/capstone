"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppointments } from "@/hooks/use-appointments";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getStatusColor } from "../utils";

interface PatientHistoryProps {
  patientId: string;
}

export default function PatientHistory({ patientId }: PatientHistoryProps) {
  const { appointments } = useAppointments();
  const t = useTranslations("doctorAppointments.patientHistory");
  const statusT = useTranslations("doctorCommon.status");

  // Filter appointments for this patient
  const patientAppointments = appointments
    .filter((appointment) => appointment.patient.id === patientId)
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime(); // Sort by date descending (newest first)
    });

  const completedAppointments = patientAppointments.filter(
    (appointment) => appointment.status === "completed"
  );

  const upcomingAppointments = patientAppointments.filter(
    (appointment) =>
      appointment.status !== "completed" && appointment.status !== "cancelled"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="completed" className="space-y-4">
          <TabsList>
            <TabsTrigger value="completed">{t("treatmentHistory")}</TabsTrigger>
            <TabsTrigger value="upcoming">
              {t("upcomingAppointments")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed">
            {completedAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {t("noTreatmentHistory")}
              </p>
            ) : (
              <div className="space-y-4">
                {completedAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{appointment.service}</h3>
                          <Badge
                            className={cn(getStatusColor(appointment.status))}
                          >
                            {statusT(appointment.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {appointment.time}
                        </p>
                      </div>
                      <Link href={`/appointments/${appointment.id}`}>
                        <Badge variant="outline">{t("viewDetails")}</Badge>
                      </Link>
                    </div>

                    <Separator className="my-3" />

                    <div>
                      <h4 className="text-sm font-medium">
                        {t("treatmentNotes")}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {appointment.treatmentResults?.notes ||
                          t("noTreatmentNotes")}
                      </p>
                    </div>

                    {appointment.treatmentResults?.recommendations && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium">
                          {t("recommendations")}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.treatmentResults.recommendations}
                        </p>
                      </div>
                    )}

                    {appointment.treatmentResults?.images &&
                      appointment.treatmentResults.images.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">
                            {t("treatmentImages")}
                          </h4>
                          <div className="flex gap-2 mt-1">
                            {appointment.treatmentResults.images.map(
                              (image, index) => (
                                <div
                                  key={index}
                                  className="h-16 w-16 rounded border overflow-hidden"
                                >
                                  <img
                                    src={image || "https://placehold.co/64x64"}
                                    alt={`Treatment ${index + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {t("noUpcomingAppointments")}
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{appointment.service}</h3>
                          <Badge
                            className={cn(getStatusColor(appointment.status))}
                          >
                            {statusT(appointment.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {appointment.time}
                        </p>
                      </div>
                      <Link href={`/appointments/${appointment.id}`}>
                        <Badge variant="outline">{t("viewDetails")}</Badge>
                      </Link>
                    </div>

                    <Separator className="my-3" />

                    <div>
                      <h4 className="text-sm font-medium">
                        {t("treatmentNotes")}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {appointment.notes || t("noTreatmentNotes")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
