"use client";
import {
  Layers,
  X,
  FileText,
  Phone,
  FileCode,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  CreditCard,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { formatTime } from "@/lib/utils";

interface ViewBranchModalProps {
  viewBranch: any; // Thay thế 'any' bằng kiểu dữ liệu cụ thể nếu có thể
  onClose: () => void;
}

export default function ViewBranchModal({
  viewBranch,
  onClose,
}: ViewBranchModalProps) {
  const t = useTranslations("branch"); // Sử dụng namespace "branch" hoặc namespace phù hợp
  const { theme } = useTheme();

  if (!viewBranch) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-2xl mx-auto p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl font-serif tracking-wide text-gray-800 dark:text-gray-100">
            {t("branchDetails")}
          </h2>
          <div className="w-16 h-1 mx-auto bg-gradient-to-r from-pink-200 to-purple-200 rounded-full" />
        </div>

        {/* Content - Wrap in a div with overflow-y-auto */}
        <div
          className="overflow-y-auto pr-2"
          style={{ maxHeight: "calc(80vh - 150px)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Branch Name */}
              <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                <Layers className="w-5 h-5 text-pink-400 mt-1" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t("branchName")}
                  </div>
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {viewBranch.name}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                <FileText className="w-5 h-5 text-pink-400 mt-1" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t("email")}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {viewBranch.email}
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                <Phone className="w-5 h-5 text-pink-400 mt-1" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t("phoneNumber")}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {viewBranch.phoneNumber}
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              {(viewBranch.workingTimeStart || viewBranch.workingTimeEnd) && (
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("operatingHours")}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {formatTime(viewBranch.workingTimeStart)} -{" "}
                      {formatTime(viewBranch.workingTimeEnd)}
                    </div>
                  </div>
                </div>
              )}

              {/* Tax Code */}
              {"taxCode" in viewBranch && viewBranch.taxCode && (
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                  <FileCode className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("taxCode")}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {viewBranch.taxCode as string}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Full Address */}
              {viewBranch.address && (
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("address")}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {viewBranch.address}
                      {viewBranch.ward && `, ${viewBranch.ward}`}
                      {viewBranch.district && `, ${viewBranch.district}`}
                      {viewBranch.city && `, ${viewBranch.city}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Information */}
              {(viewBranch.bankName || viewBranch.bankAccountNumber) && (
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                  <CreditCard className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("bankInformation")}
                    </div>
                    <div className="space-y-1">
                      {viewBranch.bankName && (
                        <div className="text-gray-700 dark:text-gray-300">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t("bankName")}:{" "}
                          </span>
                          {viewBranch.bankName}
                        </div>
                      )}
                      {viewBranch.bankAccountNumber && (
                        <div className="text-gray-700 dark:text-gray-300">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t("bankAccountNumber")}:{" "}
                          </span>
                          {viewBranch.bankAccountNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* License Information */}
              {(viewBranch.businessLicenseUrl ||
                viewBranch.operatingLicenseUrl) && (
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                  <FileText className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("licenses")}
                    </div>
                    <div className="space-y-2">
                      {viewBranch.businessLicenseUrl && (
                        <a
                          href={viewBranch.businessLicenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          {t("viewBusinessLicense")}
                        </a>
                      )}
                      {viewBranch.operatingLicenseUrl && (
                        <a
                          href={viewBranch.operatingLicenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          {t("viewOperatingLicense")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Operating License Expiry Date */}
              {viewBranch.operatingLicenseExpiryDate && (
                <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
                  <Calendar className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("operatingLicenseExpiryDate")}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {new Date(
                        viewBranch.operatingLicenseExpiryDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Picture */}
          {viewBranch.profilePictureUrl && (
            <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {t("profilePicture")}
              </div>
              <div className="flex justify-center">
                <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={viewBranch.profilePictureUrl || "/placeholder.svg"}
                    alt={viewBranch.name || t("branchProfilePicture")}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors duration-300">
            <div className="flex items-center justify-center space-x-2">
              {viewBranch.isActivated ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  viewBranch.isActivated
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 dark:from-emerald-900/50 dark:to-emerald-800/50 dark:text-emerald-300"
                    : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-300"
                }`}
              >
                {viewBranch.isActivated ? t("active") : t("inactive")}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-200 dark:shadow-none hover:shadow-purple-300 dark:hover:shadow-none font-medium tracking-wide"
          >
            {t("close")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
