"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Calendar,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import { BookingData } from "../../types/booking";

interface BookingSuccessStepProps {
  bookingId: string;
  bookingData: BookingData;
  onClose: () => void;
}
function formatDate(date: Date): string {
  const year = date?.getFullYear();
  const month = `${date?.getMonth() + 1}`.padStart(2, "0");
  const day = `${date?.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function BookingSuccess({
  bookingId,
  bookingData,
  onClose,
}: BookingSuccessStepProps) {
  const { service, clinic, doctor, date, time, customerInfo } = bookingData;

  // Format date and time for display
  const formattedDate = date ? formatDate(date) : "";
  const formattedTime = time || "";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-green-600 mb-2">
        Đặt lịch thành công!
      </h2>
      <p className="text-muted-foreground mb-6">
        Cảm ơn bạn đã đặt lịch. Chúng tôi đã gửi thông tin xác nhận đến email
        của bạn.
      </p>

      <Card className="w-full max-w-md mb-6 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Mã đặt lịch:</span>
              <span className="font-bold">{bookingId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Dịch vụ:</span>
              <span>{service.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Cơ sở:</span>
              <span>{clinic?.name}</span>
            </div>

            {doctor && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Bác sĩ:</span>
                <span>{doctor.fullName}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-medium">Thời gian:</span>
              <span>
                {formattedDate} {formattedTime}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Khách hàng:</span>
              <span>{customerInfo.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span>Thêm vào lịch</span>
        </Button>

        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Tải xuống</span>
        </Button>

        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Chia sẻ</span>
        </Button>
      </div>

      <div className="mt-8 w-full max-w-md">
        <Button onClick={onClose} className="w-full">
          <span>Hoàn tất</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
