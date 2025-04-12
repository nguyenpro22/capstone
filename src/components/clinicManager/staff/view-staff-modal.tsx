"use client"
import type { Staff } from "@/features/clinic/types"
import { motion } from "framer-motion"
import { X, Mail, MapPin, User, Phone, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { CopyNotification } from "@/components/systemStaff/copy-notification"

interface ViewStaffModalProps {
  viewStaff: Staff
  onClose: () => void
}

export default function ViewStaffModal({ viewStaff, onClose }: ViewStaffModalProps) {
  const t = useTranslations("staff")
  const [showCopyNotification, setShowCopyNotification] = useState(false)

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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative flex flex-col"
          style={{ maxHeight: "90vh" }}
        >
          {/* Header with gradient background */}
          <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600 flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center shadow-lg">
                <div className="text-4xl font-bold text-purple-500">
                  {viewStaff.firstName.charAt(0)}
                  {viewStaff.lastName.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {/* Staff name and role - fixed part */}
          <div className="pt-20 px-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-800">
              {viewStaff.firstName} {viewStaff.lastName}
            </h2>
            <div className="mt-1 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                {viewStaff.role}
              </span>
            </div>
          </div>

          {/* Scrollable content area */}
          <div
            className="overflow-y-auto flex-grow px-6"
            style={{
              maxHeight: "calc(90vh - 250px)",
              paddingBottom: "80px", // Extra padding to ensure content isn't hidden behind the footer
            }}
          >
            <div className="space-y-4">
              {/* Email */}
              <motion.div
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <p className="text-xs text-gray-500">{t("email") || "Email"}</p>
                  <div className="flex items-center gap-2">
                    <p
                      className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 truncate"
                      title={viewStaff.email}
                    >
                      {viewStaff.email}
                    </p>
                    <button
                      onClick={() => copyToClipboard(viewStaff.email)}
                      className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                      title={t("copyToClipboard") || "Copy to clipboard"}
                    >
                      <Copy className="w-3.5 h-3.5 text-purple-600" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Phone Number */}
              {viewStaff.phoneNumber && (
                <motion.div
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500">{t("phoneNumber") || "Phone Number"}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate" title={viewStaff.phoneNumber}>
                        {viewStaff.phoneNumber}
                      </p>
                      <button
                        onClick={() => copyToClipboard(viewStaff.phoneNumber || "")}
                        className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                        title={t("copyToClipboard") || "Copy to clipboard"}
                      >
                        <Copy className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Address */}
              {viewStaff.fullAddress && (
                <motion.div
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500">{t("address") || "Address"}</p>
                    <div className="flex items-start gap-2">
                      <p className="font-medium break-words" title={viewStaff.fullAddress}>
                        {viewStaff.fullAddress}
                      </p>
                      <button
                        onClick={() => copyToClipboard(viewStaff.fullAddress)}
                        className="p-1 hover:bg-purple-100 rounded-full transition-colors flex-shrink-0 mt-0.5"
                        title={t("copyToClipboard") || "Copy to clipboard"}
                      >
                        <Copy className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Role */}
              <motion.div
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">{t("role") || "Role"}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {viewStaff.role}
                      </span>
                    </p>
                   
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Fixed footer with close button */}
        </motion.div>
      </div>
      <CopyNotification show={showCopyNotification} onClose={() => setShowCopyNotification(false)} />
    </>
  )
}
