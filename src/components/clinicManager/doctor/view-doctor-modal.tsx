"use client"
import { motion } from "framer-motion"
import { X, Mail, MapPin, Building2, FileText, Phone } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Doctor } from "@/features/clinic/types"
import Image from "next/image"

interface ViewDoctorModalProps {
  viewDoctor: Doctor
  onClose: () => void
}

export default function ViewDoctorModal({ viewDoctor, onClose }: ViewDoctorModalProps) {
  const t = useTranslations("doctor")

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center shadow-lg overflow-hidden">
              {viewDoctor.profilePictureUrl ? (
                <Image
                  src={viewDoctor.profilePictureUrl || "/placeholder.svg"}
                  alt={viewDoctor.fullName}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="text-4xl font-bold text-purple-500">
                  {viewDoctor.firstName?.charAt(0) || ""}
                  {viewDoctor.lastName?.charAt(0) || ""}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doctor name and role */}
        <div className="pt-20 px-6">
          <h2 className="text-2xl font-bold text-gray-800">{viewDoctor.fullName}</h2>
          <div className="mt-1">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {viewDoctor.role}
            </span>
          </div>
        </div>

        {/* Doctor details */}
        <div className="p-6 space-y-5">
          <div className="space-y-4">
            {/* Email */}
            <motion.div
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">{t("email")}</p>
                <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  {viewDoctor.email}
                </p>
              </div>
            </motion.div>

            {/* Phone Number */}
            {viewDoctor.phoneNumber && (
              <motion.div
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">{t("phoneNumber")}</p>
                  <p className="font-medium">{viewDoctor.phoneNumber}</p>
                </div>
              </motion.div>
            )}

            {/* Address */}
            {viewDoctor.fullAddress && (
              <motion.div
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">{t("address")}</p>
                  <p className="font-medium">{viewDoctor.fullAddress}</p>
                </div>
              </motion.div>
            )}

            {/* Certificates */}
            {viewDoctor.doctorCertificates && (
              <motion.div
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">{t("doctorCertificates") || "Doctor Certificates"}</p>
                  <p className="font-medium">
                    {Array.isArray(viewDoctor.doctorCertificates)
                      ? `${viewDoctor.doctorCertificates.length} certificates`
                      : "Certificate available"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Branches */}
            {viewDoctor.branchs && viewDoctor.branchs.length > 0 && (
              <motion.div
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-teal-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">{t("branches")}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewDoctor.branchs.map((branch, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                        {branch.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-md transition-all"
            >
              {t("close")}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

