import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import type { Clinic } from "../types/booking";
import { MapPin, Phone, AlertCircle } from 'lucide-react';
import Image from "next/image";
import { useTranslations } from "next-intl"; // Import useTranslations

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
        className={`flex flex-1 items-start ${
          showRadio && !disabled ? "cursor-pointer" : disabled ? "cursor-not-allowed" : ""
        } rounded-md border-2 ${
          isSelected ? "border-primary" : "border-muted"
        } bg-popover p-4 ${
          disabled ? "opacity-70 bg-muted" : "hover:bg-accent hover:text-accent-foreground"
        } ${
          showRadio && !disabled
            ? "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            : ""
        }`}
      >
        <div className="flex w-full gap-4">
          <div className="relative h-16 w-16 rounded-md overflow-hidden">
            <Image
              src={
                clinic.profilePictureUrl ||
                "https://placehold.co/64x64.png" ||
                "/placeholder.svg"
               || "/placeholder.svg"}
              width={64}
              height={64}
              alt={clinic.name}
              className={`object-cover h-full w-full ${!isActive ? "grayscale" : ""}`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-medium">{clinic.name}</div>
              {isActive ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                  {t("active")}
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                  {t("inactive")}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {clinic.address ?? "Địa chỉ chưa được cập nhật"}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
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