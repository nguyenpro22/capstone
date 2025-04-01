"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Mail,
  Phone,
  ImageIcon,
  Calendar,
  Clock,
  Star,
  Info,
  Tag,
  Clipboard,
  UserRound,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import type { Procedure, Service } from "@/features/clinic-service/types"
import type { Clinic } from "@/features/clinic/types"
import Modal from "@/components/systemAdmin/Modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ServiceDoctorsTab from "@/components/clinicManager/service/service-doctors-tab"
import type { DoctorService } from "@/features/doctor-service/types"
import { useDeleteProcedureMutation } from "@/features/clinic-service/api"
import { toast } from "react-toastify"

// Update the Service interface to include the missing properties
interface ExtendedService extends Service {
  clinics?: Clinic[]
  procedures?: Procedure[]
  doctorServices?: DoctorService[]
}

// Lấy hàm refetch từ props
interface ViewServiceModalProps {
  viewService: ExtendedService | null
  onClose: () => void
  refetchService?: () => void
}

export default function ViewServiceModal({ viewService, onClose, refetchService }: ViewServiceModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [categories, setCategories] = useState([])

  const [deleteProcedure, { isLoading: isDeleting }] = useDeleteProcedureMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Hàm xử lý xóa procedure
  const handleDeleteProcedure = async (id: string) => {
    if (!id) return

    try {
      setDeletingId(id)
      await deleteProcedure({ id }).unwrap()
      toast.success("Đã xóa thủ tục thành công")
      // Refresh data after deletion
      handleRefresh()
    } catch (error) {
      console.error("Failed to delete procedure:", error)
      toast.error("Không thể xóa thủ tục. Vui lòng thử lại sau.")
    } finally {
      setDeletingId(null)
    }
  }

  // Hàm refresh sẽ gọi refetchService từ component cha nếu có
  const handleRefresh = async () => {
    if (refetchService) {
      await refetchService()
    }
  }

  if (!viewService) return null

  // Helper function to safely extract URLs from ImageObjects
  function getImageUrl(image: any): string {
    if (!image) return "/placeholder.svg"
    if (typeof image === "string") return image
    if (typeof image === "object" && image !== null) {
      // Handle ImageObject with url property
      if (image.url && typeof image.url === "string") return image.url
      // Handle toString() method if available
      if (typeof image.toString === "function") {
        const str = image.toString()
        if (typeof str === "string" && str !== "[object Object]") return str
      }
    }
    return "/placeholder.svg"
  }

  // Get the first image for the avatar
  const avatarImage = viewService.coverImage?.length ? getImageUrl(viewService.coverImage[0]) : "/placeholder.svg"

  return (
    <Modal onClose={onClose}>
      <div className="relative pb-6">
        {/* Removed the image gallery from the top */}

        <div className="px-6 pt-6 space-y-6">
          {/* Header with service name and category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{viewService.name}</h2>

              <Badge variant="destructive" className="text-sm px-3 py-1">
                -{viewService.discountPercent}% Giảm giá
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {viewService.category && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                  <Tag className="w-3.5 h-3.5 mr-1" />
                  {viewService.category.name}
                </Badge>
              )}

              <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                {new Intl.NumberFormat("vi-VN").format(Number(viewService.minPrice || 0))} -{" "}
                {new Intl.NumberFormat("vi-VN").format(Number(viewService.maxPrice || 0))} đ
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
              >
                <Info className="w-4 h-4 mr-2" />
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="clinics"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Phòng khám
              </TabsTrigger>
              <TabsTrigger
                value="procedures"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
              >
                <Clipboard className="w-4 h-4 mr-2" />
                Thủ tục
              </TabsTrigger>
              <TabsTrigger
                value="doctors"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
              >
                <UserRound className="w-4 h-4 mr-2" />
                Bác sĩ
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Mô tả dịch vụ với avatar nhỏ bên cạnh */}
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  {/* Avatar nhỏ */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                    {avatarImage ? (
                      <Image
                        src={avatarImage || "/placeholder.svg"}
                        alt={viewService.name || "Service image"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Mô tả */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Mô tả dịch vụ</h3>
                    <p className="text-gray-700 leading-relaxed">{viewService.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Thông tin giá</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá thấp nhất:</span>
                      <span className="font-medium text-purple-700">
                        {new Intl.NumberFormat("vi-VN").format(Number(viewService.minPrice || 0))} đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá cao nhất:</span>
                      <span className="font-medium text-purple-700">
                        {new Intl.NumberFormat("vi-VN").format(Number(viewService.maxPrice || 0))} đ
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-medium text-red-600">{viewService.discountPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Thông tin khác</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">Thời gian đặt lịch: 30-60 phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">Thời gian thực hiện: 1-2 giờ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">Đánh giá: 4.8/5 (120 đánh giá)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thêm phần hiển thị ảnh mô tả */}
              {viewService.descriptionImage && viewService.descriptionImage.length > 0 && (
                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Hình ảnh mô tả</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {viewService.descriptionImage.map((image: any, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={getImageUrl(image) || "/placeholder.svg"}
                          alt={`Mô tả ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiển thị tất cả ảnh bìa */}
              {viewService.coverImage && viewService.coverImage.length > 0 && (
                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Hình ảnh bìa</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {viewService.coverImage.map((image: any, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={getImageUrl(image) || "/placeholder.svg"}
                          alt={`Ảnh bìa ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Clinics Tab */}
            <TabsContent value="clinics" className="space-y-4">
              {viewService.clinics && viewService.clinics.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {viewService.clinics.map((clinic: Clinic) => (
                    <motion.div
                      key={clinic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-sm">
                          {clinic.profilePictureUrl ? (
                            <Image
                              src={getImageUrl(clinic.profilePictureUrl) || "/placeholder.svg"}
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

                        <div className="flex-1 space-y-3">
                          <h4 className="font-medium text-lg text-gray-800">{clinic.name}</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              <span className="truncate">{clinic.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                              <span className="truncate">{clinic.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              <span>{clinic.phoneNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                  <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Không có phòng khám</h3>
                  <p className="text-gray-500">Dịch vụ này hiện chưa có phòng khám nào cung cấp.</p>
                </div>
              )}
            </TabsContent>

            {/* Procedures Tab */}
            <TabsContent value="procedures" className="space-y-4">
              {viewService.procedures && viewService.procedures.length > 0 ? (
                <div className="space-y-4">
                  {viewService.procedures.map((procedure: Procedure, index: number) => (
                    <motion.div
                      key={procedure.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row gap-6 p-5">
                        {/* Procedure Image */}
                        <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                          {procedure.coverImage?.length ? (
                            <Image
                              src={
                                procedure.coverImage?.length ? getImageUrl(procedure.coverImage[0]) : "/placeholder.svg"
                              }
                              alt={procedure.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}

                          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-purple-600 text-white text-xs font-medium">
                            Bước {procedure.stepIndex}
                          </div>
                        </div>

                        {/* Procedure Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium text-gray-800">{procedure.name}</h4>
                              <p className="text-gray-600 mt-1">{procedure.description}</p>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm(`Bạn có chắc chắn muốn xóa thủ tục "${procedure.name}"?`)) {
                                  handleDeleteProcedure(procedure.id)
                                }
                              }}
                              disabled={isDeleting && deletingId === procedure.id}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Price Types */}
                          {procedure.procedurePriceTypes && procedure.procedurePriceTypes.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Các loại giá:</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                  <Clipboard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Không có thủ tục</h3>
                  <p className="text-gray-500">Dịch vụ này hiện chưa có thủ tục nào được định nghĩa.</p>
                </div>
              )}
            </TabsContent>

            {/* Doctors Tab */}
            <TabsContent value="doctors" className="mt-0">
              <ServiceDoctorsTab
                key={viewService.id}
                serviceId={viewService.id}
                doctorServices={viewService.doctorServices || []}
                onRefresh={handleRefresh}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Modal>
  )
}

