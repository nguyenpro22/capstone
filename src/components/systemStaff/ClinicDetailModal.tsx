"use client"
import { motion } from "framer-motion"
import type React from "react"
import { useState } from "react"

import { Clock, CreditCard, CheckCircle2, XCircle, FileText, Layers, Copy } from "lucide-react"
import Modal from "@/components/systemStaff/Modal"
import type { Clinic } from "@/features/clinic/types"
import { CopyNotification } from "@/components/systemStaff/copy-notification"

// Add the useTranslations import at the top
import { useTranslations } from "next-intl"

interface ClinicDetailModalProps {
  clinic: Clinic | null
  onClose: () => void
}

const ClinicDetailModal: React.FC<ClinicDetailModalProps> = ({ clinic, onClose }) => {
  // Add the t constant inside the component
  const t = useTranslations("clinic")
  const [showCopyNotification, setShowCopyNotification] = useState(false)

  if (!clinic) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowCopyNotification(true)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <>
      <Modal onClose={onClose}>
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{t("clinicDetails")}</h2>
            <div className="w-16 h-1 mx-auto bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mt-2" />
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Clinic Name */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("clinicName")}</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="truncate text-base font-medium text-slate-800 dark:text-slate-200"
                        title={clinic.name}
                      >
                        {clinic.name}
                      </div>
                      <button
                        onClick={() => copyToClipboard(clinic.name)}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-full transition-colors"
                        title={t("copyToClipboard")}
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("email")}</div>
                    <div className="flex items-center gap-2">
                      <div className="truncate text-slate-700 dark:text-slate-300" title={clinic.email}>
                        {clinic.email}
                      </div>
                      <button
                        onClick={() => copyToClipboard(clinic.email)}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-full transition-colors"
                        title={t("copyToClipboard")}
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("phoneNumber")}</div>
                    <div className="flex items-center gap-2">
                      <div className="truncate text-slate-700 dark:text-slate-300" title={clinic.phoneNumber}>
                        {clinic.phoneNumber}
                      </div>
                      <button
                        onClick={() => copyToClipboard(clinic.phoneNumber)}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-full transition-colors"
                        title={t("copyToClipboard")}
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("address")}</div>
                    <div className="flex items-center gap-2">
                      <div className="truncate text-slate-700 dark:text-slate-300" title={(clinic.address||"")}>
                        {clinic.address}
                      </div>
                      <button
                        onClick={() => copyToClipboard(clinic.address || "")}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-full transition-colors"
                        title={t("copyToClipboard")}
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Code */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("taxCode")}</div>
                    <div className="flex items-center gap-2">
                      <div className="truncate text-slate-700 dark:text-slate-300" title={clinic.taxCode}>
                        {clinic.taxCode}
                      </div>
                      <button
                        onClick={() => copyToClipboard(clinic.taxCode)}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-full transition-colors"
                        title={t("copyToClipboard")}
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Business License */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("businessLicense")}</div>
                    <div className="flex items-center gap-2">
                      <a
                        href={clinic.businessLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline font-medium"
                        title={t("viewBusinessLicense")}
                      >
                        {t("viewBusinessLicense")}
                      </a>
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating License */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("operatingLicense")}</div>
                    <div className="flex items-center gap-2">
                      <a
                        href={clinic.operatingLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline font-medium"
                        title={t("viewOperatingLicense")}
                      >
                        {t("viewOperatingLicense")}
                      </a>
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating License Expiry Date */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {t("operatingLicenseExpiryDate")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="truncate text-slate-700 dark:text-slate-300"
                        title={new Intl.DateTimeFormat("vi-VN").format(new Date(clinic.operatingLicenseExpiryDate))}
                      >
                        {new Intl.DateTimeFormat("vi-VN").format(new Date(clinic.operatingLicenseExpiryDate))}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            new Intl.DateTimeFormat("vi-VN").format(new Date(clinic.operatingLicenseExpiryDate)),
                          )
                        }
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-full transition-colors"
                        title={t("copyToClipboard")}
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              {clinic.profilePictureUrl && (
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("profilePicture")}</div>
                      <div className="flex items-center gap-2">
                        <a
                          href={clinic.profilePictureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline font-medium"
                          title={t("viewProfilePicture")}
                        >
                          {t("viewProfilePicture")}
                        </a>
                       
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Branches */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                    <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("totalBranches")}</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="truncate text-slate-700 dark:text-slate-300"
                        title={clinic.totalBranches.toString()}
                      >
                        {clinic.totalBranches}
                      </div>
                      <button
                        onClick={() => copyToClipboard(clinic.totalBranches.toString())}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-full transition-colors"
                        title={t("copyToClipboard")}
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${clinic.isActivated ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                  >
                    {clinic.isActivated ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("status")}</div>
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                        clinic.isActivated
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {clinic.isActivated ? t("active") : t("inactive")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
              {t("close")}
            </motion.button>
          </div>
        </div>
      </Modal>

      <CopyNotification show={showCopyNotification} onClose={() => setShowCopyNotification(false)} />
    </>
  )
}

export default ClinicDetailModal
