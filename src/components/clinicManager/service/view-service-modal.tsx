"use client"
import { motion } from "framer-motion"
import { MapPin, Mail, Phone, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { Procedure, Service } from "@/features/clinic-service/types"
import type { Clinic } from "@/features/clinic/types"
import Modal from "@/components/systemAdmin/Modal"

// Update the Service interface to include the missing properties
interface ExtendedService extends Service {
  clinics?: Clinic[]
  procedures?: Procedure[]
}

interface ViewServiceModalProps {
  viewService: ExtendedService | null
  onClose: () => void
}

export default function ViewServiceModal({ viewService, onClose }: ViewServiceModalProps) {
  if (!viewService) return null

  return (
    <Modal onClose={onClose}>
      <div className="space-y-8">
        {/* Header with gradient underline */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif tracking-wide text-gray-800">{viewService?.name}</h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full" />
        </div>

        {/* Service Info & Cover Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Information */}
          <div className="space-y-6 p-6 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{viewService?.description}</p>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  {new Intl.NumberFormat("vi-VN").format(Number(viewService?.minPrice || 0))} -{" "}
                  {new Intl.NumberFormat("vi-VN").format(Number(viewService?.maxPrice || 0))} đ
                </span>
                {viewService?.discountPercent > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">
                    -{viewService.discountPercent}%
                  </span>
                )}
              </div>

              {viewService?.category && (
                <div
                  className="inline-flex items-center px-4 py-1.5 rounded-full 
                        bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                >
                  <span className="text-sm font-medium text-purple-700">{viewService.category.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative h-[300px] rounded-xl overflow-hidden group shadow-md">
            {viewService?.coverImage?.length && viewService?.coverImage?.length > 0 ? (
              <Image
                src={viewService.coverImage[0] || "/placeholder.svg"}
                alt="Cover"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                <ImageIcon className="w-12 h-12 mb-2" />
                <span className="text-sm">Không có ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* Clinics Section */}
        {viewService?.clinics?.length &&viewService?.clinics?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-gray-800 flex items-center gap-2">
              <span>Phòng khám</span>
              <div className="h-px flex-grow bg-gradient-to-r from-purple-200 to-transparent"></div>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              {viewService.clinics.map((clinic: Clinic) => (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-sm">
                      {clinic.profilePictureUrl ? (
                        <Image
                          src={clinic.profilePictureUrl || "/placeholder.svg"}
                          alt={clinic.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium text-gray-800">{clinic.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-purple-500" />
                          <span>{clinic.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-pink-500" />
                          <span>{clinic.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-purple-500" />
                          <span>{clinic.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Procedures Section */}
        {viewService?.procedures?.length && viewService?.procedures?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-gray-800 flex items-center gap-2">
              <span>Các thủ tục</span>
              <div className="h-px flex-grow bg-gradient-to-r from-purple-200 to-transparent"></div>
            </h3>
            <div className="space-y-4">
              {viewService.procedures.map((procedure: Procedure, index: number) => (
                <motion.div
                  key={procedure.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="flex gap-6 p-4">
                    {/* Procedure Image */}
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                      {procedure.coverImage?.length ? (
                        <Image
                          src={procedure.coverImage[0] || "/placeholder.svg"}
                          alt={procedure.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Procedure Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">{procedure.name}</h4>
                        <p className="text-gray-600 mt-1">{procedure.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Bước:</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-600">
                          {procedure.stepIndex}
                        </span>
                      </div>

                      {/* Price Types */}
                      {procedure.procedurePriceTypes && procedure.procedurePriceTypes.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {procedure.procedurePriceTypes.map((priceType: any) => (
                            <div
                              key={priceType.id}
                              className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
                            >
                              <div className="text-sm font-medium text-gray-600">{priceType.name}</div>
                              <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                                {new Intl.NumberFormat("vi-VN").format(priceType.price)} đ
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

