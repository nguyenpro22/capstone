"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/hooks/use-appointments";
import dynamic from "next/dynamic";
import { Appointment, AppointmentStatus } from "@/components/doctor/types";

// Dynamically import components
const AppointmentDetails = dynamic(
  () => import("@/components/doctor/appointments/appointment-details"),
  {
    loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />,
  }
);

const PatientHistory = dynamic(
  () => import("@/components/doctor/appointments/patient-history"),
  {
    loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />,
  }
);

const TreatmentForm = dynamic(
  () => import("@/components/doctor/appointments/treatment-form"),
  {
    loading: () => <Skeleton className="w-full h-[500px] rounded-lg" />,
    ssr: false,
  }
);

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { appointments, updateAppointment } = useAppointments();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("doctorAppointments");
  const statusT = useTranslations("doctorCommon.status");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const found = appointments.find((a) => a.id === id);
      setAppointment(found || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [appointments, id]);

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case AppointmentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case AppointmentStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case AppointmentStatus.CANCELLED:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">{t("details.notFound")}</h2>
        <p className="text-muted-foreground">{t("details.notFoundDesc")}</p>
        <Button onClick={handleBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("details.goBack")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            {t("details.title")}
          </h1>
        </div>
        <Badge className={getStatusColor(appointment.status)}>
          {statusT(appointment.status)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("patient.information")}</CardTitle>
            <CardDescription>{t("patient.details")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {appointment.patient.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("patient.id", { id: appointment.patient.id })}
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.patient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("patient.dateOfBirth", {
                    date: new Date(
                      appointment.patient.dateOfBirth
                    ).toLocaleDateString(),
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("appointment.information")}</CardTitle>
            <CardDescription>{t("appointment.details")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
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
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">
                {t("appointment.notes")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {appointment.notes || t("appointment.noNotes")}
              </p>
            </div>
            {appointment.status !== AppointmentStatus.COMPLETED && (
              <Button
                className="w-full"
                onClick={() =>
                  updateAppointment({
                    ...appointment,
                    status: AppointmentStatus.COMPLETED,
                  })
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />{" "}
                {t("appointment.markCompleted")}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">{t("tabs.details")}</TabsTrigger>
          <TabsTrigger value="history">{t("tabs.history")}</TabsTrigger>
          <TabsTrigger value="treatment">{t("tabs.treatment")}</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <AppointmentDetails appointment={appointment} />
        </TabsContent>
        <TabsContent value="history">
          <PatientHistory patientId={appointment.patient.id} />
        </TabsContent>
        <TabsContent value="treatment">
          <TreatmentForm appointment={appointment} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
