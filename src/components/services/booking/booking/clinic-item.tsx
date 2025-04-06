import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import type { Clinic } from "../types/booking";
import { MapPin, Phone } from "lucide-react";

interface ClinicItemProps {
  clinic: Clinic;
  isSelected: boolean;
  radioId?: string; // Make radioId optional
  showRadio?: boolean; // Add option to hide radio input
}

export function ClinicItem({
  clinic,
  isSelected,
  radioId = `clinic-${clinic.id}`,
  showRadio = true,
}: ClinicItemProps) {
  return (
    <div className="flex">
      {showRadio && (
        <RadioGroupItem
          value={clinic.id}
          id={radioId}
          className="peer sr-only"
        />
      )}
      <Label
        htmlFor={showRadio ? radioId : undefined}
        className={`flex flex-1 items-start ${
          showRadio ? "cursor-pointer" : ""
        } rounded-md border-2 ${
          isSelected ? "border-primary" : "border-muted"
        } bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
          showRadio
            ? "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            : ""
        }`}
      >
        <div className="flex w-full gap-4">
          <div className="relative h-16 w-16 rounded-md overflow-hidden">
            <img
              src={
                clinic.profilePictureUrl ||
                "https://placehold.co/64x64.png" ||
                "/placeholder.svg"
              }
              alt={clinic.name}
              className="object-cover h-full w-full"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium">{clinic.name}</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {clinic.address}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Phone className="h-3 w-3 mr-1" />
              {clinic.phoneNumber}
            </div>
          </div>
        </div>
      </Label>
    </div>
  );
}
