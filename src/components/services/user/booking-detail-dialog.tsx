"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  ListOrdered,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface Booking {
  id: string;
  customerName: string;
  start: string | null;
  end: string | null;
  serviceName: string;
  procedureId: string;
  stepIndex: string;
  name: string;
  duration: number;
  dateCompleted: string | null;
  status: string;
  date: string | null;
}

interface BookingDetailDialogProps {
  booking: Booking;
  children: React.ReactNode;
}

export function BookingDetailDialog({
  booking,
  children,
}: BookingDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Format time
  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    return time.substring(0, 5);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
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
  const getStatusIcon = (status: string) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div
          className={`h-2 ${
            booking.status === "Completed"
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : booking.status === "In Progress"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500"
              : "bg-gradient-to-r from-yellow-400 to-amber-500"
          }`}
        ></div>
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            Chi tiết lịch hẹn
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-semibold text-xl">{booking.serviceName}</h3>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-xs font-bold text-primary mr-1.5">
                  {booking.stepIndex}
                </span>
                <p className="text-sm text-gray-500">
                  Bước {booking.stepIndex}: {booking.name}
                </p>
              </div>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-4">
              {getStatusIcon(booking.status)}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Trạng thái lịch hẹn</p>
              <p className="font-medium">
                {booking.status === "Completed"
                  ? "Lịch hẹn đã hoàn thành"
                  : booking.status === "In Progress"
                  ? "Lịch hẹn đang được thực hiện"
                  : "Lịch hẹn đang chờ xác nhận"}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{booking.customerName}</p>
              </div>
            </div>

            {booking.date && (
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-4">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày hẹn</p>
                  <p className="font-medium">
                    {format(parseISO(booking.date), "EEEE, dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            )}

            {booking.start && booking.end && (
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian</p>
                  <p className="font-medium">
                    {formatTime(booking.start)} - {formatTime(booking.end)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dịch vụ</p>
                <p className="font-medium">{booking.serviceName}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-2 mr-4">
                <ListOrdered className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quy trình</p>
                <p className="font-medium">
                  Bước {booking.stepIndex}: {booking.name}
                </p>
              </div>
            </div>

            {booking.dateCompleted && (
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2 mr-4">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày hoàn thành</p>
                  <p className="font-medium text-green-600">
                    {format(parseISO(booking.dateCompleted), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Button
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
              onClick={() => setIsOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
