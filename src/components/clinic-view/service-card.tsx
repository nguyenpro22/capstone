import { DollarSign, Timer, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  imageUrl?: string;
  isPopular?: boolean;
}

export function ServiceCard({
  id,
  name,
  description,
  price,
  duration,
  imageUrl,
  isPopular = false,
}: ServiceCardProps) {
  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white/10 rounded-lg overflow-hidden border border-white/20 hover:bg-white/20 transition-all group">
      {imageUrl && (
        <div className="relative h-40 w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {isPopular && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-secondary/80 text-white">
                <Sparkles className="h-3 w-3 mr-1" /> Phổ biến
              </Badge>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{name}</h4>
          {!imageUrl && isPopular && (
            <Badge className="bg-secondary/20 text-secondary">Phổ biến</Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-primary font-medium">
            <DollarSign className="h-4 w-4 mr-1" />
            {formatPrice(price)}
          </div>
          {duration && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="h-3 w-3 mr-1" />
              {duration} phút
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
