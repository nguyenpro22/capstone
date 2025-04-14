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
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-green-600 mb-2">
        {t("bookingSuccessful")}
      </h2>
      <p className="text-muted-foreground mb-6">{t("thankYou")}</p>

      <Card className="w-full max-w-md mb-6 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t("bookingCode")}:</span>
              <span className="font-bold">{bookingId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">{t("service")}:</span>
              <span>{service.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">{t("clinic")}:</span>
              <span>{clinic?.name}</span>
            </div>

            {doctor && (
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("doctor")}:</span>
                <span>{doctor.fullName}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-medium">{t("time")}:</span>
              <span>
                {formattedDate} {formattedTime}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">{t("customer")}:</span>
              <span>{customerInfo.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 w-full max-w-md">
        <Button onClick={onClose} className="w-full">
          <span>{t("finish")}</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
