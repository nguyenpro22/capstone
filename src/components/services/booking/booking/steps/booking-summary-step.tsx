"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import { CustomerInfoForm } from "../customer-info-form";
import { PriceSummary } from "../price-summary";
import { DoctorItem } from "../doctor-item";
import { ClinicItem } from "../clinic-item";
import type { BookingData } from "../../types/booking";
import { formatDate } from "../../utils/booking-utils";
import { useTranslations } from "next-intl"; // Import useTranslations

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
  const t = useTranslations("bookingFlow"); // Use the hook with the namespace

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
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          {t("bookingInfo")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t("pleaseReviewBooking")}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-purple-100 dark:border-purple-800/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3">
                {t("serviceInfo")}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("service")}:
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {service.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("category")}:
                  </span>
                  <Badge
                    variant="outline"
                    className="border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300"
                  >
                    {service.category.name}
                  </Badge>
                </div>
                <Separator className="my-2 bg-purple-100 dark:bg-purple-800/30" />
                {isDefault ? (
                  <div className="text-center p-2 bg-purple-50/50 dark:bg-purple-900/10 rounded-md">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {t("defaultPackage")}
                    </p>
                    <div className="mt-2">
                      <PriceSummary selectedProcedures={selectedProcedures} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                      {t("selectedProcedures")}:
                    </h5>
                    <PriceSummary selectedProcedures={selectedProcedures} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-800/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3">
                {t("appointmentInfo")}
              </h4>
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

                <div className="flex flex-col gap-2 bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-md">
                  {date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-800 dark:text-gray-200">
                        {formatDate(date)}
                      </span>
                    </div>
                  )}

                  {time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-800 dark:text-gray-200">
                        {time}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          {t("customerInfo")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t("pleaseUpdateInfo")}
        </p>

        <CustomerInfoForm
          customerInfo={customerInfo}
          onChange={handleCustomerInfoChange}
        />
      </div>
    </div>
  );
}
