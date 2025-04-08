"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock3,
  CalendarClock,
  User,
  Loader2,
  RefreshCcw,
  Building2,
  Stethoscope,
  ClipboardList,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useGetBookingByBookingIdQuery } from "@/features/booking/api";
import { skipToken } from "@reduxjs/toolkit/query";
import type { Booking } from "@/features/booking/types";

interface BookingDetailDialogProps {
  booking: Booking;
  children: React.ReactNode;
}

export function BookingDetailDialog({
  booking,
  children,
}: BookingDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: bookingDetail,
    isLoading,
    isError,
    refetch,
  } = useGetBookingByBookingIdQuery(
    isOpen && booking?.id ? { id: booking.id } : skipToken
  );

  useEffect(() => {
    if (isOpen && booking.id) {
      console.log(`Booking dialog opened for booking ID: ${booking.id}`);
    }
  }, [isOpen, booking.id]);

  // Use the API data if available, otherwise use the prop
  const displayBooking = bookingDetail?.value;

  // Format time
  const formatTime = (time: string | null | undefined) => {
    if (!time) return "N/A";
    return time.substring(0, 5);
  };

  // Get status badge
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge className="bg-gray-500">Không xác định</Badge>;

    switch (status) {
      case "Completed":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white">
              Hoàn thành
            </Badge>
          </div>
        );
      case "Pending":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 border-0 text-white">
              Chờ xử lý
            </Badge>
          </div>
        );
      case "In Progress":
        return (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0 text-white">
              Đang xử lý
            </Badge>
          </div>
        );
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <AlertCircle className="h-6 w-6 text-gray-500" />;

    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "Pending":
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case "In Progress":
        return <Clock3 className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-500";

    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "Pending":
        return "bg-gradient-to-r from-yellow-400 to-amber-500";
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-0 shadow-xl rounded-lg">
        <div className={`h-2 ${getStatusColor(displayBooking?.status)}`}></div>
        <DialogHeader className="px-6 pt-6 pb-0 flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            Chi tiết lịch hẹn
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                refetch();
              }}
              disabled={isLoading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="sr-only">Làm mới</span>
            </Button>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Đóng</span>
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="p-6 flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="p-6 flex flex-col justify-center items-center h-64">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-center text-red-500 font-medium">
              Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              Thử lại
            </Button>
          </div>
        ) : !displayBooking ? (
          <div className="p-6 flex flex-col justify-center items-center h-64">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
              Không tìm thấy thông tin lịch hẹn.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-xl">
                  {displayBooking.service?.name || "Dịch vụ không xác định"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Mã lịch hẹn:{" "}
                  {displayBooking.id
                    ? displayBooking.id.substring(0, 8) + "..."
                    : "N/A"}
                </p>
              </div>
              {getStatusBadge(displayBooking.status)}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center mb-4">
                {getStatusIcon(displayBooking.status)}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Trạng thái lịch hẹn</p>
                <p className="font-medium">
                  {displayBooking.status === "Completed"
                    ? "Lịch hẹn đã hoàn thành"
                    : displayBooking.status === "In Progress"
                    ? "Lịch hẹn đang được thực hiện"
                    : "Lịch hẹn đang chờ xác nhận"}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="font-medium">
                    {displayBooking.customerName || "Không xác định"}
                  </p>
                </div>
              </div>

              {displayBooking.date && (
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày hẹn</p>
                    <p className="font-medium">
                      {format(
                        parseISO(displayBooking.date),
                        "EEEE, dd/MM/yyyy",
                        {
                          locale: vi,
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}

              {displayBooking.startTime && displayBooking.endTime && (
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Thời gian</p>
                    <p className="font-medium">
                      {formatTime(displayBooking.startTime)} -{" "}
                      {formatTime(displayBooking.endTime)}
                    </p>
                  </div>
                </div>
              )}

              {displayBooking.doctor && (
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bác sĩ</p>
                    <p className="font-medium">{displayBooking.doctor.name}</p>
                  </div>
                </div>
              )}

              {displayBooking.clinic && (
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cơ sở</p>
                    <p className="font-medium">{displayBooking.clinic.name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dịch vụ</p>
                  <p className="font-medium">
                    {displayBooking.service?.name || "Không xác định"}
                  </p>
                </div>
              </div>

              {displayBooking.doctorNote && (
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-4 mt-1 flex-shrink-0">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ghi chú của bác sĩ</p>
                    <p className="font-medium">{displayBooking.doctorNote}</p>
                  </div>
                </div>
              )}
            </div>

            {displayBooking.procedureHistory &&
              displayBooking.procedureHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-4">
                    Quy trình điều trị
                  </h4>
                  <div className="space-y-4">
                    {displayBooking.procedureHistory.map((procedure, index) => (
                      <div
                        key={`${procedure.stepIndex}-${index}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative overflow-hidden shadow-sm"
                      >
                        <div
                          className={`absolute top-0 left-0 w-1 h-full ${
                            procedure.status === "Completed"
                              ? "bg-green-500"
                              : procedure.status === "In Progress"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <div className="flex justify-between items-start">
                          <div className="pl-3">
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold text-primary mr-2">
                                {procedure.stepIndex}
                              </span>
                              <h5 className="font-medium">{procedure.name}</h5>
                            </div>
                            {procedure.dateCompleted && (
                              <p className="text-sm text-green-600 mt-1 pl-8">
                                Hoàn thành:{" "}
                                {format(
                                  parseISO(procedure.dateCompleted),
                                  "dd/MM/yyyy",
                                  { locale: vi }
                                )}
                                {procedure.timeCompleted &&
                                  ` ${formatTime(procedure.timeCompleted)}`}
                              </p>
                            )}
                          </div>
                          <div className="ml-2">
                            {getStatusBadge(procedure.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-8">
              <Button
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium shadow-md"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
