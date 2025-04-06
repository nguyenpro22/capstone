"use client"
import { motion } from "framer-motion"
import type React from "react"

import { X, Mail, MapPin, Building2, FileText, Phone, Calendar, Info, ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Certificate, Doctor } from "@/features/clinic/types"
import Image from "next/image"
import { useState, useRef } from "react"

interface ViewDoctorModalProps {
  viewDoctor: Doctor
  onClose: () => void
}

export default function ViewDoctorModal({ viewDoctor, onClose }: ViewDoctorModalProps) {
  const t = useTranslations("doctor")
  const [expandedCertificates, setExpandedCertificates] = useState(false)
  const [hoveredCertificate, setHoveredCertificate] = useState<Certificate | null>(null)
  const certificateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    } catch (error) {
      return dateString
    }
  }

  // Open certificate in new tab
  const openCertificateUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, "_blank")
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col relative"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header with gradient background */}
        <div className="relative h-24 bg-gradient-to-r from-purple-600 to-pink-600 flex-shrink-0">
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
        <div className="pt-20 px-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">{viewDoctor.fullName}</h2>
          <div className="mt-1">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {viewDoctor.role}
            </span>
          </div>
        </div>

        {/* Doctor details - Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto flex-grow">
          <div className="space-y-4">
            {/* Email */}
            <motion.div
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-xs text-gray-500">{t("email")}</p>
                <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 break-all">
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
                <div className="ml-4 flex-1">
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
                <div className="ml-4 flex-1">
                  <p className="text-xs text-gray-500">{t("address")}</p>
                  <p className="font-medium">{viewDoctor.fullAddress}</p>
                </div>
              </motion.div>
            )}

            {/* Certificates */}
            {viewDoctor.doctorCertificates && viewDoctor.doctorCertificates.length > 0 && (
              <div className="relative">
                <motion.div
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                  onClick={() => setExpandedCertificates(!expandedCertificates)}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">{t("doctorCertificates") || "Doctor Certificates"}</p>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {viewDoctor.doctorCertificates.length}
                      </span>
                    </div>
                    <p className="font-medium flex items-center gap-1">
                      {expandedCertificates ? "Hide certificates" : "View certificates"}
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedCertificates ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </p>
                  </div>
                </motion.div>

                {/* Certificate List */}
                {expandedCertificates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-14 mt-2 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {viewDoctor.doctorCertificates.map((cert: Certificate) => (
                        <div
                          key={cert.id}
                          className="relative"
                          ref={(el) => {
                            if (el) certificateRefs.current[cert.id] = el
                          }}
                        >
                          <div
                            className="p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer group"
                            onMouseEnter={() => setHoveredCertificate(cert)}
                            onMouseLeave={() => setHoveredCertificate(null)}
                            onClick={(e) => openCertificateUrl(cert.certificateUrl, e)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                <span className="font-medium text-indigo-700">{cert.certificateName}</span>
                              </div>
                              <ExternalLink className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="mt-1 flex items-center gap-2 text-xs text-indigo-600">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {t("expiryDate") || "Expiry Date"}: {formatDate(cert.expiryDate)}
                              </span>
                            </div>
                          </div>

                          {/* Certificate Preview Popup - Positioned above the certificate */}
                          {hoveredCertificate && hoveredCertificate.id === cert.id && (
                            <div
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-2"
                              style={{ width: "200px", height: "200px" }}
                            >
                              {/* Triangle pointer */}
                              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-200"></div>

                              <div className="w-full h-full flex items-center justify-center bg-gray-50 overflow-hidden">
                                <Image
                                  src={cert.certificateUrl || "/placeholder.svg"}
                                  alt={cert.certificateName}
                                  className="max-w-full max-h-full object-contain"
                                  width={100}
                                  height={100}
                                />
                              </div>
                            </div>
                          )}

                          {/* Note on Hover */}
                          {hoveredCertificate && hoveredCertificate.id === cert.id && cert.note && (
                            <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-white rounded-lg shadow-lg border border-indigo-100 z-10">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-gray-700">{t("note") || "Note"}:</p>
                                  <p className="text-sm text-gray-600 mt-1">{cert.note}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
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
                <div className="ml-4 flex-1">
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
        </div>

        {/* Footer with close button - Fixed at bottom */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-md transition-all"
          >
            {t("close")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

