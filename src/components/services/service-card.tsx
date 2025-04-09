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
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/features/services/types";
import { BrandingBadge } from "./branding-badge";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceCardProps {
  service: ServiceItem;
  onBookService: (service: ServiceItem) => void;
  onFavoriteToggle: () => void;
  isFavorite: boolean;
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

export default function ServiceCard({
  service,
  onBookService,
  onFavoriteToggle,
  isFavorite,
  viewMode = "grid",
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasDiscount =
    service.discountPercent && Number(service.discountPercent) > 0;
  const displayPrice = hasDiscount
    ? service.discountMaxPrice
    : service.maxPrice;

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

          {/* Favorite button with animation */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute top-3 left-3 z-10 h-9 w-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isFavorite
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400"
              )}
            />
          </motion.button>

          {/* Branding badge */}
          {service.branding && (
            <div className="absolute bottom-3 left-3 z-10 max-w-[85%]">
              <BrandingBadge branding={service.branding} variant="overlay" />
            </div>
          )}
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
                4.9
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              (120 reviews)
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
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                <MapPin className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {service.clinics.length}{" "}
                  {service.clinics.length === 1 ? "clinic" : "clinics"}
                </span>
              </div>
            )}

            {/* Duration placeholder */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                60 min
              </span>
            </div>

            {/* Customers served placeholder */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
              <Users className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                500+
              </span>
            </div>
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
                Book now
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Quality badge - conditionally shown */}

        <div className="absolute -top-1 -right-1 z-20">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-md rounded-tr-md shadow-md transform rotate-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Shield className="h-3 w-3 inline-block mr-0.5" />
            Premium
          </motion.div>
        </div>
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

        {/* Quality badge - conditionally shown */}

        <div className="absolute -top-1 -left-1 z-20">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md rounded-tl-md shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Shield className="h-2.5 w-2.5 inline-block mr-0.5" />
            Premium
          </motion.div>
        </div>
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
                  4.9
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (120 reviews)
              </span>
            </motion.div>
          </div>

          {/* Favorite button with animation */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isFavorite
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400"
              )}
            />
          </motion.button>
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
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {service.clinics.length}{" "}
                {service.clinics.length === 1 ? "clinic" : "clinics"}
              </span>
            </div>
          )}

          {/* Duration placeholder */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              60 min
            </span>
          </div>

          {/* Customers served placeholder */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              500+
            </span>
          </div>
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
              onClick={() => onBookService(service)}
              className="rounded-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 shadow-sm"
            >
              Details
            </Button>
            <Button
              size="sm"
              onClick={() => onBookService(service)}
              className="rounded-full px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Book now
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
