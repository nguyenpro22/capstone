"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, Info, Loader2 } from "lucide-react";
import { AppointmentInfoCard } from "./appointment-info-card";
import type { AppointmentDetail } from "@/features/booking/types";
import type { Doctor } from "@/features/services/types";

interface ConfirmationStepProps {
  displayBooking: AppointmentDetail;
  selectedDate: Date;
  selectedTime: string;
  selectedDoctor: Doctor;
  onBack: () => void;
  onConfirm: () => void;
  isRescheduling: boolean;
}

export function ConfirmationStep({
  displayBooking,
  selectedDate,
  selectedTime,
  selectedDoctor,
  onBack,
  onConfirm,
  isRescheduling,
}: ConfirmationStepProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-indigo-200 mb-4 text-center">
        Bước 3: Xác nhận thông tin
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current booking info */}
        <AppointmentInfoCard
          title="Lịch hẹn hiện tại"
          date={displayBooking.date}
          time={displayBooking.startTime}
          endTime={displayBooking.endTime}
          doctor={displayBooking.doctor}
          isNew={false}
        />

        {/* New booking info */}
        <AppointmentInfoCard
          title="Lịch hẹn mới"
          date={selectedDate}
          time={selectedTime}
          doctor={selectedDoctor}
          isNew={true}
        />
      </div>

      {/* Warning message */}
      <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 flex items-start gap-3 shadow-sm">
        <div className="flex-shrink-0 mt-0.5">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
            Lưu ý quan trọng
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300/90">
            Sau khi xác nhận, lịch hẹn cũ của bạn sẽ bị hủy và thay thế bằng
            lịch hẹn mới. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          className="border-purple-200 dark:border-indigo-800/30 dark:bg-indigo-950/60 dark:text-indigo-200 dark:hover:bg-indigo-900/60 h-9 text-sm rounded-lg px-4"
          onClick={onBack}
        >
          <ChevronLeft className="mr-1.5 h-4 w-4" />
          Quay lại
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-sm h-9 text-sm rounded-lg transition-all duration-200 px-4"
          onClick={onConfirm}
          disabled={isRescheduling}
        >
          {isRescheduling ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Xác nhận đặt lịch
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
