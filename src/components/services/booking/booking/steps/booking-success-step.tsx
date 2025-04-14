"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { BookingData } from "../../types/booking";
import { useTranslations } from "next-intl"; // Import useTranslations

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
  const t = useTranslations("bookingFlow"); // Use the hook with the namespace

  // Format date and time for display
  const formattedDate = date ? formatDate(date) : "";
  const formattedTime = time || "";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>

      <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
        {t("bookingSuccessful")}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{t("thankYou")}</p>

      <Card className="w-full max-w-md mb-6 border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
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
              <span className="text-gray-800 dark:text-gray-200">
                {service.name}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t("clinic")}:
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {clinic?.name}
              </span>
            </div>

            {doctor && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {t("doctor")}:
                </span>
                <span className="text-gray-800 dark:text-gray-200">
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

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {t("customer")}:
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {customerInfo.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 w-full max-w-md">
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
        >
          <span>{t("finish")}</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
