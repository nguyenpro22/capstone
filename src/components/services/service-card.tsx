"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Heart, MapPin, Star } from "lucide-react";
import DoctorCertificateCard from "./doctor-certificate-card";
import { Service } from "./booking/types/booking";
import { ServiceItem } from "@/features/services/types";

interface ServiceCardProps {
  service: ServiceItem;
  onFavoriteToggle?: (id: string) => void;
  onBookService?: (service: ServiceItem) => void;
  isFavorite?: boolean;
  viewMode?: "grid" | "list";
}

// Utility functions
const formatPrice = (
  value: number,
  currency = "đ",
  locale = "vi-VN"
): string => {
  if (value === 0) return "Liên hệ";
  return `${value.toLocaleString(locale)}${currency}`;
};

export default function ServiceCard({
  service,
  onFavoriteToggle,
  onBookService,
  isFavorite = false,
  viewMode = "grid",
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(service.id);
    }
  };

  const handleBookService = () => {
    if (onBookService) {
      onBookService(service);
    }
  };

  // Grid view
  if (viewMode === "grid") {
    return (
      <Card
        className="group overflow-hidden border-purple-100 dark:border-gray-700 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 dark:bg-gray-800/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="relative h-56 overflow-hidden">
            <Image
              src={
                // service.coverImage?.[0]?.url ||
                "https://placehold.co/300x200.png"
              }
              alt={service.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            {service.discountPercent && Number(service.discountPercent) > 0 && (
              <Badge className="absolute top-4 right-4 bg-purple-600 font-medium px-2.5 py-1">
                {service.discountPercent}% GIẢM
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-4 left-4 text-white hover:text-purple-400 hover:bg-white/20 ${
                isFavorite ? "text-purple-400" : ""
              }`}
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-purple-400" : ""}`}
              />
            </Button>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <Badge
                variant="outline"
                className="bg-black/40 backdrop-blur-sm text-white border-white/20"
              >
                {service.category?.name || "Chưa phân loại"}
              </Badge>
              <div className="flex items-center bg-black/40 backdrop-blur-sm text-white rounded-full px-2 py-0.5 text-xs">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                <span>4.9</span>
              </div>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
              {service.name}
            </h3>
            <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {service.clinics?.[0]?.name || "Chưa có thông tin"}
              </span>
            </div>

            {/* Doctor Certificate Info */}
            {service.doctorServices && service.doctorServices.length > 0 && (
              <div className="mb-3">
                {/* <DoctorCertificateCard service={service} compact={true} /> */}
              </div>
            )}

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">60 phút</span>
                </div>
                <div className="text-right">
                  {Number(service.discountPercent) > 0 &&
                    service.maxPrice > 0 && (
                      <span className="text-sm text-muted-foreground line-through mr-2">
                        {formatPrice(service.maxPrice)}
                      </span>
                    )}
                  <span className="text-lg font-semibold text-purple-600">
                    {service.maxPrice > 0
                      ? service.discountMaxPrice > 0
                        ? formatPrice(service.discountMaxPrice)
                        : formatPrice(service.maxPrice)
                      : "Liên hệ"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                  variant="outline"
                  asChild
                >
                  <Link href={`/services/${service.id}`}>Chi tiết</Link>
                </Button>
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleBookService}
                >
                  Đặt lịch
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view
  return (
    <Card
      className="group overflow-hidden border-purple-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 dark:bg-gray-800/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-1/3">
            <Image
              src={
                // service.coverImage?.[0]?.url ||
                "https://placehold.co/300x200.png"
              }
              alt={service.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {Number(service.discountPercent) > 0 && (
              <Badge className="absolute top-4 right-4 bg-purple-600">
                {service.discountPercent}% GIẢM
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-4 left-4 text-white hover:text-purple-400 hover:bg-white/20 ${
                isFavorite ? "text-purple-400" : ""
              }`}
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-purple-400" : ""}`}
              />
            </Button>
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
              >
                {service.category?.name || "Chưa phân loại"}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm ml-1">4.9</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
              {service.name}
            </h3>
            <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{service.clinics?.[0]?.name || "Chưa có thông tin"}</span>
            </div>

            {/* Doctor Certificate Info */}
            {service.doctorServices && service.doctorServices.length > 0 && (
              <div className="mb-4">
                {/* <DoctorCertificateCard service={service} compact={true} /> */}
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">60 phút</span>
              </div>
              <div className="text-right">
                {Number(service.discountPercent) > 0 &&
                  service.maxPrice > 0 && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      {formatPrice(service.maxPrice)}
                    </span>
                  )}
                <span className="text-xl font-semibold text-purple-600">
                  {service.maxPrice > 0
                    ? service.discountMaxPrice > 0
                      ? formatPrice(service.discountMaxPrice)
                      : formatPrice(service.maxPrice)
                    : "Liên hệ"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 md:flex-none" variant="outline" asChild>
                <Link href={`/services/${service.id}`}>Chi tiết</Link>
              </Button>
              <Button
                className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleBookService}
              >
                Đặt lịch
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
