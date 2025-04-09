"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Verified, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface BrandingProps {
  branding: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    profilePictureUrl?: string | null;
    isParent?: boolean;
  };
  compact?: boolean;
  variant?: "overlay" | "card" | "inline";
}

export function BrandingBadge({
  branding,
  compact = false,
  variant = "overlay",
}: BrandingProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!branding || !mounted) return null;

  // Animation variants
  const badgeAnimations = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const verifiedBadgeAnimations = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.1, duration: 0.2 },
    },
  };

  if (variant === "inline") {
    return (
      <motion.div
        className="flex items-center gap-1.5 group"
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={badgeAnimations}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {branding.profilePictureUrl ? (
          <motion.div
            className="relative h-4 w-4 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm"
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            <Image
              src={branding.profilePictureUrl || "/placeholder.svg"}
              alt={branding.name}
              fill
              className="object-cover"
            />
          </motion.div>
        ) : (
          <motion.div
            className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-900 flex items-center justify-center text-white font-medium text-[8px] flex-shrink-0 shadow-sm"
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            {branding.name.charAt(0)}
          </motion.div>
        )}
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 truncate">
          {branding.name}
        </span>
        {branding.isParent && (
          <motion.div variants={verifiedBadgeAnimations}>
            <Badge
              variant="outline"
              className="h-3.5 px-1 text-[8px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 dark:border-blue-800 flex items-center shadow-sm"
            >
              <Verified className="h-2 w-2 mr-0.5 text-blue-500" />
              <span className="leading-none">Official</span>
            </Badge>
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (variant === "card") {
    return (
      <motion.div
        className="flex items-center gap-2.5 py-2 group"
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={badgeAnimations}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-shrink-0">
          {branding.profilePictureUrl ? (
            <motion.div
              className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-md"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Image
                src={branding.profilePictureUrl || "/placeholder.svg"}
                alt={branding.name}
                fill
                className="object-cover"
              />
              {branding.isParent && (
                <motion.div
                  className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <Verified className="h-2.5 w-2.5 text-blue-500" />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-900 flex items-center justify-center text-white font-medium text-xs shadow-md border-2 border-white dark:border-gray-800"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              {branding.name.charAt(0)}
              {branding.isParent && (
                <motion.div
                  className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <Verified className="h-2.5 w-2.5 text-blue-500" />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-1">
              {branding.name}
            </span>
            {branding.isParent && (
              <motion.div variants={verifiedBadgeAnimations}>
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[9px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 dark:border-blue-800 flex items-center shadow-sm"
                >
                  <Shield className="h-2.5 w-2.5 mr-0.5 text-blue-500" />
                  <span className="leading-none font-medium">Verified</span>
                </Badge>
              </motion.div>
            )}
          </div>

          {!compact && branding.phoneNumber && (
            <motion.span
              className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {branding.phoneNumber}
            </motion.span>
          )}
        </div>
      </motion.div>
    );
  }

  // Default overlay variant
  return (
    <motion.div
      className="flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-md group"
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={badgeAnimations}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0">
        {branding.profilePictureUrl ? (
          <motion.div
            className="relative h-5 w-5 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm"
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            <Image
              src={branding.profilePictureUrl || "/placeholder.svg"}
              alt={branding.name}
              fill
              className="object-cover"
            />
          </motion.div>
        ) : (
          <motion.div
            className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-900 flex items-center justify-center text-white font-medium text-xs shadow-sm border-2 border-white dark:border-gray-700"
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            {branding.name.charAt(0)}
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-1">
          {branding.name}
        </span>
        {branding.isParent && (
          <motion.div variants={verifiedBadgeAnimations}>
            <Badge
              variant="outline"
              className="h-4 px-1.5 text-[9px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 dark:border-blue-800 flex items-center shadow-sm"
            >
              <Verified className="h-2.5 w-2.5 mr-0.5 text-blue-500" />
              <span className="leading-none font-medium">Official</span>
            </Badge>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
