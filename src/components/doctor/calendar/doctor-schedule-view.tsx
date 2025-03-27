"use client";

import { useState } from "react";
import { useGetDoctorSchedulesQuery } from "@/features/doctor/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/features/booking/types";

export default function DoctorScheduleView() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const t = useTranslations("calendar");

  const { data, error, isLoading, isFetching } = useGetDoctorSchedulesQuery({
    pageNumber: page,
    pageSize,
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.IN_PROGRESS:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case OrderStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case OrderStatus.UNCOMPLETED:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Schedules</CardTitle>
          <CardDescription>
            There was an error loading your schedules. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const schedules = data?.value?.items || [];
  const totalPages =
    Math.round((data?.value?.totalCount ?? 0) / (data?.value?.pageSize ?? 1)) ||
    1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Working Schedules</CardTitle>
        <CardDescription>
          Your upcoming appointments and working hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No schedules found
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.workingScheduleId}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{schedule.doctorName}</h3>
                        <Badge
                          className={cn(
                            getStatusColor(schedule.status as OrderStatus)
                          )}
                        >
                          {schedule.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(schedule.date).toLocaleDateString()} from{" "}
                        {schedule.startTime.substring(0, 5)} to{" "}
                        {schedule.endTime.substring(0, 5)}
                      </p>
                      {schedule.customerName && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Patient:</span>{" "}
                          {schedule.customerName}
                        </p>
                      )}
                      {schedule.serviceName && (
                        <p className="text-sm">
                          <span className="font-medium">Service:</span>{" "}
                          {schedule.serviceName}
                        </p>
                      )}
                      {schedule.currentProcedureName && (
                        <p className="text-sm">
                          <span className="font-medium">Procedure:</span>{" "}
                          {schedule.currentProcedureName}
                        </p>
                      )}
                      {schedule.note && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          <span className="font-medium">Note:</span>{" "}
                          {schedule.note}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages || isFetching}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
