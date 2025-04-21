"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, Home } from "lucide-react";
import type { BookingData } from "../../types/booking";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("bookingFlow");

  // Format date and time for display
  const formattedDate = date ? formatDate(date) : "";
  const formattedTime = time || "";

  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>

      <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
        {t("bookingSuccessful")}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t("thankYou")}</p>

      <Card className="w-full mb-6 border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-green-200 dark:border-green-800/30 pb-3">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t("bookingCode")}:
              </span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {bookingId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t("service")}:
              </span>
              <span className="text-gray-800 dark:text-gray-200 text-right">
                {service.name}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t("clinic")}:
              </span>
              <span className="text-gray-800 dark:text-gray-200 text-right">
                {clinic?.name}
              </span>
            </div>

            {doctor && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("doctor")}:
                </span>
                <span className="text-gray-800 dark:text-gray-200 text-right">
                  {doctor.fullName}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t("time")}:
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {formattedDate} {formattedTime}
              </span>
            </div>

            <div className="border-t border-green-200 dark:border-green-800/30 pt-3">
              <div className="text-left">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("customer.customer")}:
                </h3>
                <div className="grid grid-cols-1 gap-2 pl-2">
                  <div className="text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{t("customer.name")}:</span>{" "}
                    {customerInfo.name}
                  </div>
                  <div className="text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{t("customer.phone")}:</span>{" "}
                    {customerInfo.phone}
                  </div>
                  {customerInfo.email && (
                    <div className="text-gray-800 dark:text-gray-200">
                      <span className="font-medium">
                        {t("customer.email")}:
                      </span>{" "}
                      {customerInfo.email}
                    </div>
                  )}
                  {customerInfo.notes && (
                    <div className="text-gray-800 dark:text-gray-200">
                      <span className="font-medium">{t("notes")}:</span>{" "}
                      {customerInfo.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          <Home className="mr-2 h-4 w-4" />
          {t("backToHome")}
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <Calendar className="mr-2 h-4 w-4" />
          {t("viewAppointments")}
        </Button>
      </div>
    </div>
  );
}
