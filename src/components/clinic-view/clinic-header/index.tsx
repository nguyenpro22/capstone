import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ClinicHeaderProps {
  Name: string;
  Email: string;
  PhoneNumber: string;
  FullAddress?: string;
  ProfilePictureUrl?: string;
  IsActivated: boolean;
}

export function ClinicHeader({
  Name,
  Email,
  PhoneNumber,
  FullAddress,
  ProfilePictureUrl,
  IsActivated,
}: ClinicHeaderProps) {
  return (
    <div className="glass-effect rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative h-24 w-24 rounded-xl overflow-hidden border-4 border-white/20">
          {ProfilePictureUrl ? (
            <Image
              src={ProfilePictureUrl || "/placeholder.svg"}
              alt={Name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient flex items-center justify-center">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gradient">{Name}</h1>
            {IsActivated ? (
              <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" /> Đang hoạt động
              </Badge>
            ) : (
              <Badge
                variant="destructive"
                className="bg-red-500/20 text-red-500 hover:bg-red-500/30"
              >
                <XCircle className="h-3 w-3 mr-1" /> Ngừng hoạt động
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              <span>{Email}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              <span>{PhoneNumber}</span>
            </div>
            {FullAddress && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{FullAddress}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="bg-gradient">Chỉnh sửa</Button>
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/10"
          >
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}
