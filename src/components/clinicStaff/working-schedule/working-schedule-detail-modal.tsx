"use client";

import { useState } from "react";
import {
  User,
  Clock,
  Calendar,
  AlertCircle,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import React from "react";

// Import the WorkingScheduleDetail interface
import type { WorkingScheduleDetail } from "@/features/working-schedule/types";
import type { WorkingSchedule } from "@/features/working-schedule/types";

interface WorkingScheduleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: WorkingSchedule | null;
  scheduleDetails: WorkingScheduleDetail[] | undefined;
  isLoading: boolean;
  error: any;
}

export function WorkingScheduleDetailModal({
  isOpen,
  onClose,
  schedule,
  scheduleDetails,
  isLoading,
  error,
}: WorkingScheduleDetailModalProps) {
  const t = useTranslations("workingSchedule");
  const [activeTab, setActiveTab] = useState<string>("list");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Group doctors by status
  const assignedDoctors =
    scheduleDetails?.filter((detail) => detail.doctorId !== null) || [];
  const unassignedSlots =
    scheduleDetails?.filter((detail) => detail.doctorId === null) || [];

  // Group customers by doctor
  const customersByDoctor = scheduleDetails?.reduce((acc, detail) => {
    if (detail.doctorId && detail.customerId) {
      if (!acc[detail.doctorId]) {
        acc[detail.doctorId] = [];
      }
      acc[detail.doctorId].push(detail);
    }
    return acc;
  }, {} as Record<string, WorkingScheduleDetail[]>);

  // Format time helper function
  const formatTime = (time: string | null | undefined): string => {
    if (!time) return "--:--";
    const timeParts = time.split(":");
    if (timeParts.length >= 2) {
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return time;
  };

  const sortedScheduleDetails = React.useMemo(() => {
    if (!scheduleDetails || !sortColumn) return scheduleDetails;

    return [...(scheduleDetails || [])].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortColumn) {
        case "doctor":
          valueA = a.doctorName || "";
          valueB = b.doctorName || "";
          break;
        case "customer":
          valueA = a.customerName || "";
          valueB = b.customerName || "";
          break;
        case "service":
          valueA = a.serviceName || "";
          valueB = b.serviceName || "";
          break;
        case "status":
          valueA = a.status || "";
          valueB = b.status || "";
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [scheduleDetails, sortColumn, sortOrder]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="inline h-4 w-4" />
    ) : (
      <ChevronDown className="inline h-4 w-4" />
    );
  };

  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-screen max-h-[95vh] flex flex-col">
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle>{t("detailTitle")}</DialogTitle>
          <DialogDescription>
            {t("detailDescription", {
              date: schedule.date,
              startTime: formatTime(schedule.startTime),
              endTime: formatTime(schedule.endTime),
            })}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("error")}</AlertTitle>
            <AlertDescription>{t("detailLoadError")}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 shrink-0">
              <div className="flex flex-col p-4 border rounded-md">
                <span className="text-sm text-muted-foreground">
                  {t("date")}
                </span>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">
                    {schedule.date
                      ? format(new Date(schedule.date), "EEEE, dd/MM/yyyy", {
                          locale: vi,
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col p-4 border rounded-md">
                <span className="text-sm text-muted-foreground">
                  {t("time")}
                </span>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">
                    {formatTime(schedule.startTime)} -{" "}
                    {formatTime(schedule.endTime)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col p-4 border rounded-md">
                <span className="text-sm text-muted-foreground">
                  {t("capacity")}
                </span>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">
                    <Badge variant="outline" className="ml-1">
                      {t("doctorsRegistered", {
                        registered: assignedDoctors.length,
                        total: schedule.capacity,
                      })}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="list"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList className="shrink-0 mb-4">
                <TabsTrigger value="list">{t("list")}</TabsTrigger>
                <TabsTrigger value="doctors">
                  {t("doctors", { count: assignedDoctors.length })}
                </TabsTrigger>
                <TabsTrigger value="slots">
                  {t("emptySlots", { count: unassignedSlots.length })}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <TabsContent
                    value="list"
                    className="mt-0 data-[state=active]:block"
                  >
                    {isLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : scheduleDetails && scheduleDetails.length > 0 ? (
                      <div className="border rounded-md overflow-hidden mb-8">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead
                                onClick={() => handleSort("doctor")}
                                className="cursor-pointer hover:bg-muted/50"
                              >
                                {t("doctor")} {renderSortIndicator("doctor")}
                              </TableHead>
                              <TableHead
                                onClick={() => handleSort("customer")}
                                className="cursor-pointer hover:bg-muted/50"
                              >
                                {t("customer")}{" "}
                                {renderSortIndicator("customer")}
                              </TableHead>
                              <TableHead
                                onClick={() => handleSort("service")}
                                className="cursor-pointer hover:bg-muted/50"
                              >
                                {t("service")} {renderSortIndicator("service")}
                              </TableHead>
                              <TableHead
                                onClick={() => handleSort("status")}
                                className="cursor-pointer hover:bg-muted/50"
                              >
                                {t("status")} {renderSortIndicator("status")}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedScheduleDetails &&
                              sortedScheduleDetails.map((detail) => (
                                <TableRow key={detail.workingScheduleId}>
                                  <TableCell className="font-mono text-xs">
                                    {detail.workingScheduleId.substring(0, 8)}
                                    ...
                                  </TableCell>
                                  <TableCell>
                                    {detail.doctorId ? (
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback>
                                            {detail.doctorName?.substring(
                                              0,
                                              2
                                            ) || "BS"}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span>
                                          {detail.doctorName || t("noName")}
                                        </span>
                                      </div>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="bg-amber-50"
                                      >
                                        {t("notRegistered")}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {detail.customerId ? (
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>
                                          {detail.customerName || t("noName")}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        -
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {detail.serviceId ? (
                                      <span>
                                        {detail.serviceName || t("noName")}
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        -
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <StatusBadge status={detail.status} />
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t("noDetailData")}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="doctors"
                    className="mt-0 data-[state=active]:block"
                  >
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-24 w-full" />
                        ))}
                      </div>
                    ) : assignedDoctors.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {assignedDoctors.map((doctor) => (
                          <div
                            key={doctor.workingScheduleId}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar>
                                <AvatarFallback>
                                  {doctor.doctorName?.substring(0, 2) || "BS"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">
                                  {doctor.doctorName || t("doctorNoName")}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  ID: {doctor.doctorId}
                                </p>
                              </div>
                            </div>

                            {customersByDoctor &&
                            customersByDoctor[doctor.doctorId || ""] ? (
                              <div className="mt-2">
                                <p className="text-sm font-medium mb-1">
                                  {t("customersBooked")}:
                                </p>
                                <ul className="text-sm space-y-1">
                                  {customersByDoctor[doctor.doctorId || ""].map(
                                    (appointment) => (
                                      <li
                                        key={appointment.customerScheduleId}
                                        className="flex items-center gap-2"
                                      >
                                        <User className="h-3 w-3" />
                                        <span>
                                          {appointment.customerName ||
                                            t("customerNoName")}
                                        </span>
                                        <StatusBadge
                                          status={appointment.status}
                                        />
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {t("noCustomersBooked")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t("noDoctorsRegistered")}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="slots"
                    className="mt-0 data-[state=active]:block"
                  >
                    {isLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : unassignedSlots.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
                        {unassignedSlots.map((slot) => (
                          <div
                            key={slot.workingScheduleId}
                            className="border rounded-md p-3 flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {t("emptySlot")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: {slot.workingScheduleId.substring(0, 8)}
                                ...
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50">
                              {t("canRegister")}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t("noEmptySlotsLeft")}
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </div>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: string | null | undefined }) {
  const t = useTranslations("workingSchedule");

  if (!status)
    return <Badge variant="outline">{t("statusUndetermined")}</Badge>;

  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800">
          {t("statusCompleted")}
        </Badge>
      );
    case "in progress":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          {t("statusInProgress")}
        </Badge>
      );
    case "scheduled":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          {t("statusScheduled")}
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800">
          {t("statusCancelled")}
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-orange-100 text-orange-800">
          {t("statusPending")}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
