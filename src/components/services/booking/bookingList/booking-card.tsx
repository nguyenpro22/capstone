"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./status-badge";
import {
  CalendarIcon,
  Clock,
  ExternalLink,
  RotateCw,
  User,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Booking } from "@/features/booking/types";

interface BookingCardProps {
  booking: Booking;
  onStatusChange: () => void;
}

export function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  // const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  // const handleCancel = async () => {
  //   if (!confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
  //     return;
  //   }

  //   try {
  //     const result = await cancelBooking(booking.id).unwrap();
  //     if (result.isSuccess) {
  //       toast({
  //         title: "Hủy lịch hẹn thành công",
  //         description: `Lịch hẹn đã được hủy.`,
  //       });
  //       onStatusChange();
  //     } else {
  //       toast({
  //         title: "Lỗi",
  //         description:
  //           result.error?.message ||
  //           "Không thể hủy lịch hẹn. Vui lòng thử lại sau.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Lỗi",
  //       description: "Không thể hủy lịch hẹn. Vui lòng thử lại sau.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              Mã đặt lịch:{" "}
              <span className="font-mono">{booking.id.substring(0, 8)}...</span>
            </div>
            <div className="mt-2">
              <StatusBadge status={booking.status as string} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-primary">
              {/* {booking.currentProcedurePriceType} */}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-primary/10 p-2 rounded-full">
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">
                {booking.start} - {booking.end}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">{booking.customerName}</span>
            </div>
          </div>

          <div>
            {booking.status === "Pending" && (
              <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm border border-blue-100">
                <p className="font-semibold">Quy trình hiện tại</p>
                {/* <p className="mt-1.5">{booking.currentProcedurePriceType}</p> */}
              </div>
            )}

            {booking.status === "Success" && (
              <div className="bg-green-50 p-4 rounded-lg text-green-800 text-sm border border-green-100">
                <p className="font-semibold">Dịch vụ đã hoàn thành</p>
                <p className="mt-1.5">
                  Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                </p>
              </div>
            )}

            {booking.status === "Canceled" && (
              <div className="bg-red-50 p-4 rounded-lg text-red-800 text-sm border border-red-100">
                <p className="font-semibold">Lịch hẹn đã bị hủy</p>
                <p className="mt-1.5">
                  Vui lòng liên hệ với chúng tôi nếu bạn muốn đặt lại.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/20 p-4 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800">
        {booking.status === "Pending" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/booking/${booking.id}`)}
              className="h-9"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                (window.location.href = `/booking/${booking.id}/reschedule`)
              }
              className="h-9"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Đổi lịch
            </Button>
            <Button
              variant="destructive"
              size="sm"
              // onClick={handleCancel}
              // disabled={isLoading}
              className="h-9"
            >
              {/* {isLoading ? "Đang xử lý..." : "Hủy lịch"} */}
            </Button>
          </>
        )}

        {booking.status === "Success" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/booking/${booking.id}`)}
              className="h-9"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/review/${booking.id}`)}
              className="h-9"
            >
              Đánh giá
            </Button>
            <Button
              size="sm"
              onClick={() =>
                (window.location.href = `/booking/new?serviceId=${booking.serviceName}`)
              }
              className="h-9"
            >
              Đặt lại
            </Button>
          </>
        )}

        {booking.status === "Canceled" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/booking/${booking.id}`)}
              className="h-9"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
            <Button
              size="sm"
              onClick={() =>
                (window.location.href = `/booking/new?serviceId=${booking.serviceName}`)
              }
              className="h-9"
            >
              Đặt lại
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
