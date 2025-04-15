"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import type { Doctor } from "../types/booking";
import { getInitials } from "../utils/booking-utils";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DoctorItemProps {
  doctor: Doctor;
  serviceCategoryName: string;
  isSelected: boolean;
  radioId?: string; // Make radioId optional
  showRadio?: boolean; // Add option to hide radio input
}

export function DoctorItem({
  doctor,
  serviceCategoryName,
  isSelected,
  radioId = `doctor-${doctor.id}`,
  showRadio = true,
}: DoctorItemProps) {
  const t = useTranslations("bookingFlow");
  return (
    <div className="flex">
      {showRadio && (
        <RadioGroupItem
          value={doctor.id}
          id={radioId}
          className="peer sr-only"
        />
      )}
      <Label
        htmlFor={showRadio ? radioId : undefined}
        className={cn(
          "flex flex-1 items-start rounded-md border-2 bg-white dark:bg-gray-800 p-4",
          showRadio ? "cursor-pointer" : "",
          isSelected
            ? "border-purple-500 dark:border-purple-400"
            : "border-gray-200 dark:border-gray-700",
          "hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-700 dark:hover:text-purple-300",
          showRadio
            ? "peer-data-[state=checked]:border-purple-500 dark:peer-data-[state=checked]:border-purple-400 [&:has([data-state=checked])]:border-purple-500 dark:[&:has([data-state=checked])]:border-purple-400"
            : ""
        )}
      >
        <div className="flex w-full gap-4">
          <Avatar className="h-12 w-12 border-2 border-purple-100 dark:border-purple-800/30">
            <AvatarImage
              src={doctor.profilePictureUrl || undefined}
              alt={doctor.fullName}
            />
            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {getInitials(doctor.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {doctor.fullName}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm">4.9</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("doctorSelect")} {serviceCategoryName}
            </div>
            {doctor.doctorCertificates &&
              doctor.doctorCertificates.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.isArray(doctor.doctorCertificates) &&
                    doctor.doctorCertificates.slice(0, 2).map((cert, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300"
                      >
                        {typeof cert === "string" ? cert : cert.name}
                      </Badge>
                    ))}
                  {doctor.doctorCertificates.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300"
                    >
                      +{doctor.doctorCertificates.length - 2}
                    </Badge>
                  )}
                </div>
              )}
          </div>
        </div>
      </Label>
    </div>
  );
}
