"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  Pencil,
  X,
} from "lucide-react"
import Image from "next/image"
import type { Procedure, Service } from "@/features/clinic-service/types"
import type { Clinic } from "@/features/clinic/types"
import ModalService from "@/components/systemAdmin/ModalService"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ServiceDoctorsTab from "@/components/clinicManager/service/service-doctors-tab"
import type { DoctorService } from "@/features/doctor-service/types"
import { useDeleteProcedureMutation, useUpdateProcedureMutation } from "@/features/clinic-service/api"
import { toast } from "react-toastify"
import EditProcedureForm from "@/components/clinicManager/EditProcedureForm"

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
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const [headerVisible, setHeaderVisible] = useState(true)

  const modalContentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const lockScroll = useRef(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  const [deleteProcedure, { isLoading: isDeleting }] = useDeleteProcedureMutation()
  const [updateProcedure, { isLoading: isUpdating }] = useUpdateProcedureMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editProcedureData, setEditProcedureData] = useState<any>(null)
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null)

  // Memoized scroll handler to prevent recreation on every render
  const handleScroll = useCallback(() => {
    if (lockScroll.current || !modalContentRef.current) return

    const currentScrollY = modalContentRef.current.scrollTop
    const scrollingDown = currentScrollY > lastScrollY.current

    // Only change visibility state when scrolling a significant amount
    if (Math.abs(currentScrollY - lastScrollY.current) > 15) {
      // When scrolling down past threshold, hide header
      if (scrollingDown && currentScrollY > 50 && headerVisible) {
        setHeaderVisible(false)
        lockScroll.current = true // Lock to prevent oscillation

        // Unlock after animation completes
        setTimeout(() => {
          lockScroll.current = false
        }, 400) // Slightly longer than the CSS transition
      }
      // When scrolling up, show header
      else if (!scrollingDown && !headerVisible) {
        setHeaderVisible(true)
        lockScroll.current = true // Lock to prevent oscillation

        // Unlock after animation completes
        setTimeout(() => {
          lockScroll.current = false
        }, 400) // Slightly longer than the CSS transition
      }

      lastScrollY.current = currentScrollY
    }
  }, [headerVisible])

  // Set up scroll listener with debounce
  useEffect(() => {
    const contentElement = modalContentRef.current

    const debouncedScrollHandler = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      scrollTimeout.current = setTimeout(() => {
        handleScroll()
      }, 10) // Small debounce for performance
    }

    if (contentElement) {
      contentElement.addEventListener("scroll", debouncedScrollHandler, { passive: true })
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", debouncedScrollHandler)
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [handleScroll])

  // Hàm xử lý xóa procedure
  const handleDeleteProcedure = async (id: string) => {
    if (!id) return

    try {
      setDeletingId(id)
      await deleteProcedure({ id }).unwrap()
      toast.success("Đã xóa giai đoạn thành công")
      // Refresh data after deletion
      handleRefresh()
    } catch (error) {
      console.error("Failed to delete procedure:", error)
      toast.error("Không thể xóa giai đoạn. Vui lòng thử lại sau.")
    } finally {
      setDeletingId(null)
    }
  }

  // Hàm xử lý edit procedure
  const handleEditProcedure = (procedure: Procedure) => {
    // Make sure we have all the necessary data
    if (procedure && procedure.id) {
      setEditingProcedure({
        ...procedure,
        // Ensure procedurePriceTypes has all required fields
        procedurePriceTypes:
          procedure.procedurePriceTypes?.map((pt) => ({
            ...pt,
            duration: pt.duration || 30, // Default to 30 minutes if not provided
            isDefault: pt.isDefault || false, // Default to false if not provided
          })) || [],
      })
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

  const toggleDescriptionExpand = (procedureId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [procedureId]: !prev[procedureId],
    }))
  }

  return (
    <ModalService onClose={onClose} customContent={true}>
      <div ref={modalContentRef} className="relative pb-6 overflow-y-auto max-h-[85vh] w-full rounded-t-xl">
        {/* Sticky Header - Sẽ luôn hiển thị khi cuộn */}
        <div
          ref={headerRef}
          className={`sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm transition-transform duration-300 ease-in-out rounded-t-xl ${
            headerVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Full Header - Hiển thị khi ở đầu trang */}
          <div
            className={`px-6 pt-6 pb-3 space-y-3 transition-all duration-300 ${
              headerVisible ? "opacity-100 max-h-[200px]" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
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

          {/* Compact Header - Hiển thị khi cuộn xuống */}
          <div
            className={`px-6 py-3 transition-all duration-300 ${
              !headerVisible ? "opacity-100 max-h-[60px]" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 truncate">{viewService.name}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 text-xs"
                >
                  {viewService.category?.name}
                </Badge>
                <Badge variant="destructive" className="text-xs">
                  -{viewService.discountPercent}%
                </Badge>
              </div>
            </div>
          </div>

          {/* TabsList - Hiển thị/ẩn khi cuộn */}
          <div
            className={`px-6 py-2 bg-white transition-all duration-300 ${
              headerVisible ? "opacity-100 max-h-[60px]" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
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
                  Giai đoạn
                </TabsTrigger>
                <TabsTrigger
                  value="doctors"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
                >
                  <UserRound className="w-4 h-4 mr-2" />
                  Bác sĩ
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Spacer when tabs are hidden */}
          <div className={`h-2 ${!headerVisible ? "block" : "hidden"}`}></div>
        </div>

        {/* Content area */}
        <div className="px-6 pt-6 space-y-6">
          <Tabs defaultValue="overview" value={activeTab} className="w-full" onValueChange={setActiveTab}>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Mô tả dịch vụ với avatar nhỏ bên cạnh */}
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  {/* Mô tả */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Mô tả dịch vụ</h3>
                    <div className="text-gray-700 leading-relaxed">
                      {/* Parse description to extract images and text */}
                      {(() => {
                        // If description is not available, return empty
                        if (!viewService.description) return null

                        // Create a temporary DOM element to parse the HTML
                        const tempDiv = document.createElement("div")
                        tempDiv.innerHTML = viewService.description

                        // Extract all images from the description
                        const images = Array.from(tempDiv.querySelectorAll("img"))
                        const extractedImages = images.map((img) => img.src)

                        // Remove images from the description text
                        images.forEach((img) => img.parentNode?.removeChild(img))
                        const textContent = tempDiv.innerHTML

                        return (
                          <>
                            {/* Display the text content */}
                            <div dangerouslySetInnerHTML={{ __html: textContent }} />

                            {/* Display extracted images */}
                            {extractedImages.length > 0 && (
                              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {extractedImages.map((src, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                                  >
                                    <Image
                                      src={src || "/placeholder.svg"}
                                      alt={`Mô tả hình ảnh ${index + 1}`}
                                      fill
                                      className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
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
                      <div className="p-5">
                        {/* Procedure Info */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="px-2 py-1 rounded-md bg-purple-600 text-white text-xs font-medium">
                                Bước {procedure.stepIndex}
                              </div>
                              <h4 className="text-lg font-medium text-gray-800">{procedure.name}</h4>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              {/* Edit Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditProcedure(procedure)
                                }}
                                disabled={isUpdating && editingId === procedure.id}
                                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (window.confirm(`Bạn có chắc chắn muốn xóa giai đoạn này?`)) {
                                    handleDeleteProcedure(procedure.id)
                                  }
                                }}
                                disabled={isDeleting && deletingId === procedure.id}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Improved description rendering with proper image handling and "See more" functionality */}
                          {procedure.description && (
                            <div className="text-gray-600 mt-2">
                              {(() => {
                                // If description is not available, return empty
                                if (!procedure.description) return null

                                const isExpanded = expandedDescriptions[procedure.id] || false

                                // For collapsed state, we need to create a version with limited height
                                if (!isExpanded) {
                                  // Create a temporary DOM element to measure text length
                                  const tempDiv = document.createElement("div")
                                  tempDiv.innerHTML = procedure.description
                                  const textLength = tempDiv.textContent?.length || 0

                                  return (
                                    <>
                                      {/* Display the content with line limit */}
                                      <div className="description-container collapsed">
                                        <div dangerouslySetInnerHTML={{ __html: procedure.description }} />
                                      </div>

                                      {/* Toggle button - only show if content is long enough */}
                                      {textLength > 100 && (
                                        <button
                                          onClick={() => toggleDescriptionExpand(procedure.id)}
                                          className="mt-1 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors flex items-center"
                                        >
                                          Xem thêm
                                          <svg
                                            className="ml-1 w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M19 9l-7 7-7-7"
                                            />
                                          </svg>
                                        </button>
                                      )}
                                    </>
                                  )
                                }

                                // For expanded state, show full content
                                return (
                                  <>
                                    {/* Display the full content */}
                                    <div className="description-container expanded">
                                      <div dangerouslySetInnerHTML={{ __html: procedure.description }} />
                                    </div>

                                    {/* Toggle button to collapse */}
                                    <button
                                      onClick={() => toggleDescriptionExpand(procedure.id)}
                                      className="mt-1 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors flex items-center"
                                    >
                                      Thu gọn
                                      <svg
                                        className="ml-1 w-4 h-4 rotate-180"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>
                                  </>
                                )
                              })()}
                            </div>
                          )}

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
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Không có giai đoạn</h3>
                  <p className="text-gray-500">Dịch vụ này hiện chưa có giai đoạn nào được định nghĩa.</p>
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
        {/* Close button at the bottom */}
        <div className="flex justify-center mt-8 pb-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors flex items-center gap-2"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
            Đóng
          </button>
        </div>
      </div>

      {/* Edit Procedure Form Modal */}
      {editingProcedure && (
        <EditProcedureForm
          procedure={editingProcedure}
          serviceId={viewService.id}
          onClose={() => setEditingProcedure(null)}
          onSuccess={handleRefresh}
        />
      )}

      {/* Add global styles to properly render base64 images in the Quill content */}
      <style jsx global>{`
        /* Ẩn thanh cuộn trong Modal */
        .modal-content {
          overflow: hidden !important;
        }
        
        .quill-content img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
          display: block;
        }
        
        .description-container.collapsed {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 4.5rem;
        }
        
        .description-container.expanded {
          max-height: none;
          overflow: visible;
        }
        
        .description-container {
          transition: max-height 0.3s ease;
        }
        
        .description-container img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
          display: inline-block;
        }
      `}</style>
    </ModalService>
  )
}

