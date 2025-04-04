"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import { CustomerInfoForm } from "../customer-info-form";
import { PriceSummary } from "../price-summary";
import { DoctorItem } from "../doctor-item";
import { ClinicItem } from "../clinic-item";
import { BookingData } from "../../types/booking";
import { formatDate } from "../../utils/booking-utils";

interface BookingSummaryStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
}

export function BookingSummaryStep({
  bookingData,
  updateBookingData,
}: BookingSummaryStepProps) {
  const {
    service,
    doctor,
    clinic,
    date,
    time,
    selectedProcedures,
    customerInfo,
    isDefault,
  } = bookingData;

  // Handle customer info changes
  const handleCustomerInfoChange = (
    field: keyof typeof customerInfo,
    value: string
  ) => {
    updateBookingData({
      customerInfo: {
        ...customerInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Thông tin đặt lịch</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng kiểm tra lại thông tin đặt lịch của bạn
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Thông tin dịch vụ</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dịch vụ:</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Danh mục:</span>
                  <Badge variant="outline">{service.category.name}</Badge>
                </div>
                <Separator className="my-2" />
                {isDefault ? (
                  <div className="text-center p-2 bg-muted/30 rounded-md">
                    <p className="text-sm">
                      Sử dụng gói dịch vụ mặc định (giá tốt nhất)
                    </p>
                    <div className="mt-2">
                      <PriceSummary selectedProcedures={selectedProcedures} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="text-sm font-medium mb-2">
                      Các quy trình đã chọn:
                    </h5>
                    <PriceSummary selectedProcedures={selectedProcedures} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Thông tin lịch hẹn</h4>
              <div className="space-y-3">
                {doctor && (
                  <div className="mb-3">
                    <DoctorItem
                      doctor={doctor}
                      serviceCategoryName={service.category.name}
                      isSelected={true}
                      showRadio={false}
                    />
                  </div>
                )}

                {clinic && (
                  <div className="mb-3">
                    <ClinicItem
                      clinic={clinic}
                      isSelected={true}
                      showRadio={false}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-md">
                  {date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(date)}</span>
                    </div>
                  )}

                  {time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{time}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Thông tin khách hàng</h3>
        <p className="text-muted-foreground mb-4">
          Vui lòng kiểm tra và cập nhật thông tin liên hệ của bạn nếu cần
        </p>

        <CustomerInfoForm
          customerInfo={customerInfo}
          onChange={handleCustomerInfoChange}
        />
      </div>
    </div>
  );
}
