"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CalendarIcon, Clock, InfoIcon } from "lucide-react";
import { CustomerInfoForm } from "../customer-info-form";
import { PriceSummary } from "../price-summary";
import { DoctorItem } from "../doctor-item";
import { ClinicItem } from "../clinic-item";
import type { BookingData } from "../../types/booking";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const t = useTranslations("bookingFlow");

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

  // Calculate total price for deposit message
  const totalPrice = selectedProcedures.reduce((sum, procedure) => {
    // If there's a selected price type ID
    if (procedure.priceTypeId) {
      const selectedPriceType = procedure.procedure.procedurePriceTypes.find(
        (type) => type.id === procedure.priceTypeId
      );
      return sum + (selectedPriceType?.price || 0);
    }
    // If no specific price type is selected, use the default one
    else {
      const defaultPriceType = procedure.procedure.procedurePriceTypes.find(
        (type) => type.price
      );
      return sum + (defaultPriceType?.price || 0);
    }
  }, 0);
  const depositAmount = totalPrice * 0.1;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {t("bookingInfo")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-5">
          {t("pleaseReviewBooking")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-purple-100 dark:border-purple-800/20 shadow-sm">
            <CardContent className="p-5">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                <span className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full mr-2">
                  <InfoIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </span>
                {t("serviceInfo")}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("service")}:
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {service.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("category")}:
                  </span>
                  <Badge
                    variant="outline"
                    className="border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 font-normal"
                  >
                    {service.category.name}
                  </Badge>
                </div>
                <Separator className="my-3 bg-purple-100 dark:bg-purple-800/30" />
                {isDefault ? (
                  <div className="text-center p-3 bg-purple-50/50 dark:bg-purple-900/10 rounded-md">
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">
                      {t("defaultPackage")}
                    </p>
                    <div>
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

          <Card className="border-purple-100 dark:border-purple-800/20 shadow-sm">
            <CardContent className="p-5">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-4 flex items-center">
                <span className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full mr-2">
                  <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </span>
                {t("appointmentInfo")}
              </h4>
              <div className="space-y-4">
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

                <div className="flex flex-col gap-3 bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-md">
                  {date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-800 dark:text-gray-200">
                        {t("formattedDate", {
                          date: date.getDate(),
                          month: t(`months.${date.getMonth()}`),
                          year: date.getFullYear(),
                        })}
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
                <Alert className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/30">
                  <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <AlertTitle className="text-purple-700 dark:text-purple-300 font-medium">
                    {t("depositRequired")}
                  </AlertTitle>
                  <AlertDescription className="text-purple-600/80 dark:text-purple-400/80">
                    {t("depositInfo", { percent: "10%" })} (
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(depositAmount)}
                    )
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {t("customerInfo")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-5">
          {t("pleaseUpdateInfo")}
        </p>

        <Card className="border-purple-100 dark:border-purple-800/20 shadow-sm">
          <CardContent className="p-5">
            <CustomerInfoForm
              customerInfo={customerInfo}
              onChange={handleCustomerInfoChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
