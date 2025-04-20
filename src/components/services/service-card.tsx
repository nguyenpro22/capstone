"use client";

import { useState } from "react";
import {
  Heart,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Shield,
  Users,
  Calendar,
  Award,
  ThumbsUp,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/features/services/types";
import { BrandingBadge } from "./branding-badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServiceCardProps {
  service: ServiceItem;
  onBookService: (service: ServiceItem) => void;
  viewMode?: "grid" | "list";
}

// Utility function to format price
const formatPrice = (
  value: number,
  currency = "đ",
  locale = "vi-VN"
): string => {
  if (value === 0) return "Liên hệ";
  return `${value.toLocaleString(locale)}${currency}`;
};

// Calculate average rating from feedback
const calculateAverageRating = (feedbacks: any[] = []) => {
  if (!feedbacks || feedbacks.length === 0) return 4.9; // Default rating if no feedback
  const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
  return (sum / feedbacks.length).toFixed(1);
};

export default function ServiceCard({
  service,
  onBookService,
  viewMode = "grid",
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const hasDiscount =
    service.discountPercent && Number(service.discountPercent) > 0;
  const displayPrice = hasDiscount
    ? service.discountMaxPrice
    : service.maxPrice;
  const averageRating = calculateAverageRating(service.feedbacks);
  const reviewCount = service.feedbacks?.length || 0; // Fallback to 120 if no feedbacks

  // Check if service is premium (has more than 2 doctors or high rating)
  const isPremium =
    service.doctorServices?.length > 2 || Number(averageRating) >= 4.8;

  // Check if service is popular (has many feedbacks)
  const isPopular = reviewCount > 100;

  if (viewMode === "grid") {
    return (
      <motion.div
        className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container with gradient overlay */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={
              service.coverImage?.[0]?.url ||
              "/placeholder.svg?height=208&width=384"
            }
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount badge with animation */}
          <AnimatePresence>
            {hasDiscount && (
              <motion.div
                className="absolute top-3 right-3 z-10"
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium px-2 py-1 shadow-md">
                  <Sparkles className="h-3 w-3 mr-1" />-
                  {service.discountPercent}%
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Branding badge */}
          {service.branding && (
            <div className="absolute bottom-3 left-3 z-10 max-w-[85%]">
              <BrandingBadge branding={service.branding} variant="overlay" />
            </div>
          )}

          {/* Quick view button */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/30 z-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-md"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  Xem nhanh
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content with improved spacing and animations */}
        <div className="flex flex-1 flex-col p-4">
          {/* Category with hover effect */}
          {service.category && (
            <motion.div
              className="mb-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors duration-300">
                {service.category.name}
              </span>
            </motion.div>
          )}

          {/* Title with hover effect */}
          <motion.h3
            className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {service.name}
          </motion.h3>

          {/* Rating with animation */}
          <motion.div
            className="flex items-center gap-1.5 mb-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-0.5" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                {averageRating}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({reviewCount} đánh giá)
            </span>
          </motion.div>

          {/* Info badges with icons */}
          <motion.div
            className="flex flex-wrap gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Clinics count */}
            {service.clinics && service.clinics.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {service.clinics.length}{" "}
                        {service.clinics.length === 1 ? "cơ sở" : "cơ sở"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Có sẵn tại {service.clinics.length} cơ sở
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Doctors count */}
            {service.doctorServices && service.doctorServices.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {service.doctorServices.length} bác sĩ
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {service.doctorServices.length} bác sĩ chuyên môn
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Duration placeholder */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      60 phút
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Thời gian điều trị trung bình</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>

          {/* Price and booking with animations */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {hasDiscount && (
                <span className="text-xs text-gray-500 dark:text-gray-500 line-through">
                  {formatPrice(service.maxPrice)}
                </span>
              )}
              <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-300">
                {formatPrice(displayPrice)}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="sm"
                onClick={() => onBookService(service)}
                className="rounded-full px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                Đặt lịch
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Service badges */}
        <div className="absolute -top-1 -right-1 z-20 flex flex-col gap-2">
          {isPremium && (
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-md rounded-tr-md shadow-md transform rotate-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Shield className="h-3 w-3 inline-block mr-0.5" />
              Premium
            </motion.div>
          )}

          {isPopular && (
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-md rounded-tr-md shadow-md transform rotate-12 mt-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <ThumbsUp className="h-3 w-3 inline-block mr-0.5" />
              Phổ biến
            </motion.div>
          )}
        </div>

        {/* Service details modal */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="absolute inset-0 z-30 bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full flex flex-col">
                {/* Close button */}
                <button
                  className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Header image */}
                <div className="relative h-40 w-full">
                  <Image
                    src={
                      service.coverImage?.[0]?.url ||
                      "/placeholder.svg?height=160&width=384"
                    }
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {service.category && (
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/80 text-white mb-2">
                        {service.category.name}
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-white">
                      {service.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                  {/* Price and rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                          {averageRating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({reviewCount} đánh giá)
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      {hasDiscount && (
                        <span className="text-xs text-gray-500 dark:text-gray-500 line-through">
                          {formatPrice(service.maxPrice)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatPrice(displayPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Service details */}
                  <div className="space-y-4">
                    {/* Clinic info */}
                    {service.clinics && service.clinics.length > 0 && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Cơ sở
                          </h4>
                          <div className="space-y-1">
                            {service.clinics.slice(0, 2).map((clinic) => (
                              <p
                                key={clinic.id}
                                className="text-sm text-gray-600 dark:text-gray-400"
                              >
                                {clinic.name}
                              </p>
                            ))}
                            {service.clinics.length > 2 && (
                              <p className="text-sm text-purple-600 dark:text-purple-400">
                                +{service.clinics.length - 2} cơ sở khác
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Doctors */}
                    {service.doctorServices &&
                      service.doctorServices.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              Bác sĩ
                            </h4>
                            <div className="space-y-1">
                              {service.doctorServices
                                .slice(0, 2)
                                .map((doctorService) => (
                                  <p
                                    key={doctorService.id}
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                  >
                                    {doctorService.doctor.fullName}
                                  </p>
                                ))}
                              {service.doctorServices.length > 2 && (
                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                  +{service.doctorServices.length - 2} bác sĩ
                                  khác
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Procedures */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Thời gian
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Thời gian điều trị: khoảng 60 phút
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Thời gian hồi phục: 1-2 ngày
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
                      onClick={() => {
                        setShowDetails(false);
                        onBookService(service);
                      }}
                    >
                      Đặt lịch
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      className="group relative flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with gradient overlay */}
      <div className="relative h-36 w-36 md:h-44 md:w-44 flex-shrink-0 overflow-hidden">
        <Image
          src={
            service.coverImage?.[0]?.url ||
            "/placeholder.svg?height=176&width=176"
          }
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount badge with animation */}
        <AnimatePresence>
          {hasDiscount && (
            <motion.div
              className="absolute top-2 right-2 z-10"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium px-1.5 py-0.5 text-xs shadow-md">
                <Sparkles className="h-2.5 w-2.5 mr-0.5" />-
                {service.discountPercent}%
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branding badge */}
        {service.branding && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <BrandingBadge
              branding={service.branding}
              variant="overlay"
              compact
            />
          </div>
        )}

        {/* Service badges */}
        <div className="absolute -top-1 -left-1 z-20">
          {isPremium && (
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md rounded-tl-md shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Shield className="h-2.5 w-2.5 inline-block mr-0.5" />
              Premium
            </motion.div>
          )}
        </div>

        {/* Popular badge */}
        {isPopular && (
          <div className="absolute -bottom-1 -right-1 z-20">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-md rounded-br-md shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Award className="h-2.5 w-2.5 inline-block mr-0.5" />
              Phổ biến
            </motion.div>
          </div>
        )}
      </div>

      {/* Content with improved spacing and animations */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Category with hover effect */}
            {service.category && (
              <motion.div
                className="mb-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors duration-300">
                  {service.category.name}
                </span>
              </motion.div>
            )}

            {/* Title with hover effect */}
            <motion.h3
              className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {service.name}
            </motion.h3>

            {/* Rating with animation */}
            <motion.div
              className="flex items-center gap-1.5 mb-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-0.5" />
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                  {averageRating}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({reviewCount} đánh giá)
              </span>
            </motion.div>
          </div>
        </div>

        {/* Info badges with icons */}
        <motion.div
          className="flex flex-wrap gap-2 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Clinics count */}
          {service.clinics && service.clinics.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {service.clinics.length}{" "}
                      {service.clinics.length === 1 ? "cơ sở" : "cơ sở"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Có sẵn tại {service.clinics.length} cơ sở
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Doctors count */}
          {service.doctorServices && service.doctorServices.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Users className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {service.doctorServices.length} bác sĩ
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {service.doctorServices.length} bác sĩ chuyên môn
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Duration placeholder */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    60 phút
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Thời gian điều trị trung bình</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        {/* Price and booking with animations */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {hasDiscount && (
              <span className="text-xs text-gray-500 dark:text-gray-500 line-through">
                {formatPrice(service.maxPrice)}
              </span>
            )}
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-300">
              {formatPrice(displayPrice)}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="rounded-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 shadow-sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Chi tiết
            </Button>
            <Button
              size="sm"
              onClick={() => onBookService(service)}
              className="rounded-full px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Đặt lịch
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Service details modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden max-w-md w-full max-h-[90vh] shadow-xl"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full flex flex-col">
                {/* Close button */}
                <button
                  className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                  onClick={() => setShowDetails(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Header image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      service.coverImage?.[0]?.url ||
                      "/placeholder.svg?height=192&width=384"
                    }
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {service.category && (
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/80 text-white mb-2">
                        {service.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-white">
                      {service.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                  {/* Price and rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                          {averageRating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({reviewCount} đánh giá)
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      {hasDiscount && (
                        <span className="text-xs text-gray-500 dark:text-gray-500 line-through">
                          {formatPrice(service.maxPrice)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatPrice(displayPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Service details */}
                  <div className="space-y-4">
                    {/* Clinic info */}
                    {service.clinics && service.clinics.length > 0 && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Cơ sở
                          </h4>
                          <div className="space-y-1">
                            {service.clinics.slice(0, 2).map((clinic) => (
                              <p
                                key={clinic.id}
                                className="text-sm text-gray-600 dark:text-gray-400"
                              >
                                {clinic.name}
                              </p>
                            ))}
                            {service.clinics.length > 2 && (
                              <p className="text-sm text-purple-600 dark:text-purple-400">
                                +{service.clinics.length - 2} cơ sở khác
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Doctors */}
                    {service.doctorServices &&
                      service.doctorServices.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              Bác sĩ
                            </h4>
                            <div className="space-y-1">
                              {service.doctorServices
                                .slice(0, 2)
                                .map((doctorService) => (
                                  <p
                                    key={doctorService.id}
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                  >
                                    {doctorService.doctor.fullName}
                                  </p>
                                ))}
                              {service.doctorServices.length > 2 && (
                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                  +{service.doctorServices.length - 2} bác sĩ
                                  khác
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Procedures */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Thời gian
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Thời gian điều trị: khoảng 60 phút
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Thời gian hồi phục: 1-2 ngày
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
                      onClick={() => {
                        setShowDetails(false);
                        onBookService(service);
                      }}
                    >
                      Đặt lịch
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
