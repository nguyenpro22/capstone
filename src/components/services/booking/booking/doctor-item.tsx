import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import type { Doctor } from "../types/booking";
import { getInitials } from "../utils/booking-utils";
import { Star } from "lucide-react";

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
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={doctor.profilePictureUrl || undefined}
              alt={doctor.fullName}
            />
            <AvatarFallback>{getInitials(doctor.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{doctor.fullName}</div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm">4.9</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Chuyên gia {serviceCategoryName}
            </div>
            {doctor.doctorCertificates &&
              doctor.doctorCertificates.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.isArray(doctor.doctorCertificates) &&
                    doctor.doctorCertificates.slice(0, 2).map((cert, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {typeof cert === "string" ? cert : cert.name}
                      </Badge>
                    ))}
                  {doctor.doctorCertificates.length > 2 && (
                    <Badge variant="outline" className="text-xs">
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
