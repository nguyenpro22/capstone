"use client";

import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import type { Clinic } from "../types/booking";
import { MapPin, Phone, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl"; // Import useTranslations
import { cn } from "@/lib/utils";

interface ClinicItemProps {
  clinic: Clinic;
  isSelected: boolean;
  radioId?: string; // Make radioId optional
  showRadio?: boolean; // Add option to hide radio input
  isActive?: boolean; // Add isActive prop
  disabled?: boolean; // Add disabled prop
}

export function ClinicItem({
  clinic,
  isSelected,
  radioId = `clinic-${clinic.id}`,
  showRadio = true,
  isActive = clinic.isActivated !== false, // Default based on clinic.isActivated
  disabled = clinic.isActivated === false, // Default based on clinic.isActivated
}: ClinicItemProps) {
  const t = useTranslations("bookingFlow"); // Use translations

  return (
    <div className="flex">
      {showRadio && (
        <RadioGroupItem
          value={clinic.id}
          id={radioId}
          className="peer sr-only"
          disabled={disabled}
        />
      )}
      <Label
        htmlFor={showRadio && !disabled ? radioId : undefined}
        className={cn(
          "flex flex-1 items-start rounded-md border-2 bg-white dark:bg-gray-800 p-4",
          showRadio && !disabled
            ? "cursor-pointer"
            : disabled
            ? "cursor-not-allowed"
            : "",
          isSelected
            ? "border-purple-500 dark:border-purple-400"
            : "border-gray-200 dark:border-gray-700",
          disabled
            ? "opacity-70 bg-gray-50 dark:bg-gray-800/50"
            : "hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-700 dark:hover:text-purple-300",
          showRadio && !disabled
            ? "peer-data-[state=checked]:border-purple-500 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:border-purple-500 dark:[&:has([data-state=checked])]:border-purple-400"
            : ""
        )}
      >
        <div className="flex w-full gap-4">
          <div className="relative h-16 w-16 rounded-md overflow-hidden">
            <Image
              src={
                clinic.profilePictureUrl ||
                "https://placehold.co/64x64.png" ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              width={64}
              height={64}
              alt={clinic.name}
              className={`object-cover h-full w-full ${
                !isActive ? "grayscale" : ""
              }`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {clinic.name}
              </div>
              {isActive ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs border-green-200 dark:border-green-800/30">
                  {t("active")}
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs border-red-200 dark:border-red-800/30">
                  {t("inactive")}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {clinic.address ?? "Địa chỉ chưa được cập nhật"}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Phone className="h-3 w-3 mr-1" />
              {clinic.phoneNumber ?? "Số điện thoại chưa được cập nhật"}
            </div>

            {/* Show unavailable message for inactive clinics */}
            {!isActive && (
              <div className="flex items-center text-xs text-red-500 dark:text-red-400 mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                {t("clinicUnavailable")}
              </div>
            )}
          </div>
        </div>
      </Label>
    </div>
  );
}
