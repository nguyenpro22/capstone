"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Building, ArrowRight, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clinic } from "@/features/clinic/types";

interface ClinicCardProps {
  clinic: Clinic;
  featured?: boolean;
}

export function ClinicCard({ clinic, featured = false }: ClinicCardProps) {
  const router = useRouter();

  const handleClinicClick = () => {
    router.push(`/clinics/${clinic.id}`);
  };

  return (
    <Card
      className={`group overflow-hidden border-primary/10 hover:border-primary/30 dark:bg-gray-800/50 hover:shadow-xl transition-all duration-300 cursor-pointer ${
        featured ? "border-primary/30 shadow-lg" : ""
      }`}
      onClick={handleClinicClick}
    >
      <CardContent className="p-0">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={
              clinic.profilePictureUrl ||
              `/placeholder.svg?height=400&width=600`
            }
            alt={clinic.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                Featured
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md group-hover:text-primary-foreground transition-colors">
              {clinic.name}
            </h3>
            {!clinic.isActivated && (
              <Badge
                variant="outline"
                className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
              >
                Pending Activation
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <p className="text-sm truncate">{clinic.fullAddress}</p>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Mail className="h-4 w-4" />
            <p className="text-sm truncate">{clinic.email}</p>
          </div>

          <div className="flex items-center justify-between pt-2 mt-2 border-t border-muted/30">
            <div className="flex items-center gap-1.5">
              <Building className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {clinic.totalBranches}{" "}
                {clinic.totalBranches === 1 ? "branch" : "branches"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
            >
              View details
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
