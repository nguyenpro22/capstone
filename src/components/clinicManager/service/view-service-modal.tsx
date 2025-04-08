"use client"

import { useState, useEffect, useRef } from "react"
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
  Save,
  Check,
  Plus,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => <div className="h-40 w-full border rounded-md bg-muted/20 dark:bg-muted/40 animate-pulse" />,
})

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

// Update the interface for PriceType to match the API response
interface PriceType {
  id?: string
  name: string
  price: number
  duration: number
  isDefault: boolean
}

// Add a proper interface for the editing state
interface EditingProcedure {
  name: string
  description: string
  stepIndex: number
  procedurePriceTypes: PriceType[]
}

export default function ViewServiceModal({ viewService, onClose, refetchService }: ViewServiceModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [categories, setCategories] = useState([])
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const { theme } = useTheme()

  const modalContentRef = useRef<HTMLDivElement>(null)

  const [deleteProcedure, { isLoading: isDeleting }] = useDeleteProcedureMutation()
  const [updateProcedure, { isLoading: isUpdating }] = useUpdateProcedureMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editProcedureData, setEditProcedureData] = useState<any>(null)
  const [editorLoaded, setEditorLoaded] = useState(false)

  // State for inline editing
  const [editingProcedures, setEditingProcedures] = useState<Record<string, EditingProcedure>>({})

  // Add this state for the custom confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [procedureToDelete, setProcedureToDelete] = useState<string | null>(null)

  // Ensure editor is loaded
  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  // Memoized scroll handler to prevent recreation on every render

  // Set up scroll listener with debounce

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

  // Fix the handleStartEditProcedure function
  const handleStartEditProcedure = (procedure: Procedure) => {
    if (!procedure || !procedure.id) return

    // Create a properly typed object for the editing state
    const editingProcedure: EditingProcedure = {
      name: procedure.name || "",
      description: procedure.description || "", // Ensure description is a string
      stepIndex: procedure.stepIndex || 1,
      procedurePriceTypes:
        procedure.procedurePriceTypes?.map((pt) => ({
          id: pt.id,
          name: pt.name || "",
          price: pt.price || 0,
          duration: pt.duration || 30,
          isDefault: pt.isDefault || false,
        })) || [],
    }

    // Update the state with the properly typed object
    setEditingProcedures((prev) => ({
      ...prev,
      [procedure.id]: editingProcedure,
    }))

    setEditingId(procedure.id)
  }

  // Hàm hủy chỉnh sửa procedure
  const handleCancelEditProcedure = () => {
    setEditingId(null)
  }

  // Hàm cập nhật dữ liệu khi chỉnh sửa
  const handleEditProcedureChange = (procedureId: string, field: string, value: any) => {
    setEditingProcedures((prev) => ({
      ...prev,
      [procedureId]: {
        ...prev[procedureId],
        [field]: value,
      },
    }))
  }

  // Hàm cập nhật dữ liệu price type khi chỉnh sửa
  const handleEditPriceTypeChange = (procedureId: string, index: number, field: string, value: any) => {
    const updatedProcedure = { ...editingProcedures[procedureId] }
    const updatedPriceTypes = [...updatedProcedure.procedurePriceTypes]

    if (field === "isDefault" && value === true) {
      // If setting this one as default, unset others
      updatedPriceTypes.forEach((pt, i) => {
        pt.isDefault = i === index
      })
    } else {
      updatedPriceTypes[index] = {
        ...updatedPriceTypes[index],
        [field]: field === "price" || field === "duration" ? Number(value) : value,
      }
    }

    updatedProcedure.procedurePriceTypes = updatedPriceTypes

    setEditingProcedures({
      ...editingProcedures,
      [procedureId]: updatedProcedure,
    })
  }

  // Hàm thêm price type mới khi chỉnh sửa
  const handleAddPriceType = (procedureId: string) => {
    const updatedProcedure = { ...editingProcedures[procedureId] }
    const isDefault = updatedProcedure.procedurePriceTypes.length === 0

    updatedProcedure.procedurePriceTypes = [
      ...updatedProcedure.procedurePriceTypes,
      {
        name: "",
        price: 0,
        duration: 30,
        isDefault: isDefault,
      },
    ]

    setEditingProcedures({
      ...editingProcedures,
      [procedureId]: updatedProcedure,
    })
  }

  // Hàm xóa price type khi chỉnh sửa
  const handleRemovePriceType = (procedureId: string, index: number) => {
    const updatedProcedure = { ...editingProcedures[procedureId] }
    const updatedPriceTypes = [...updatedProcedure.procedurePriceTypes]
    const isRemovingDefault = updatedPriceTypes[index].isDefault

    updatedPriceTypes.splice(index, 1)

    // If we removed the default and there are other price types, set the first one as default
    if (isRemovingDefault && updatedPriceTypes.length > 0) {
      updatedPriceTypes[0].isDefault = true
    }

    updatedProcedure.procedurePriceTypes = updatedPriceTypes

    setEditingProcedures({
      ...editingProcedures,
      [procedureId]: updatedProcedure,
    })
  }

  // Hàm lưu thay đổi procedure
  const handleSaveProcedure = async (procedureId: string) => {
    if (!procedureId || !viewService?.id) return

    try {
      const editData = editingProcedures[procedureId]

      // Validate data
      if (!editData.name.trim()) {
        toast.error("Tên giai đoạn không được để trống!")
        return
      }

      if (editData.procedurePriceTypes.length === 0) {
        toast.error("Phải có ít nhất một loại giá!")
        return
      }

      // Ensure at least one price type is set as default
      if (!editData.procedurePriceTypes.some((pt) => pt.isDefault)) {
        toast.error("Phải có ít nhất một loại giá được đặt làm mặc định!")
        return
      }

      // Format data for API
      const updateData = {
        serviceId: viewService.id,
        procedureId: procedureId,
        name: editData.name,
        stepIndex: editData.stepIndex,
        description: editData.description,
        procedurePriceTypes: editData.procedurePriceTypes.map((pt) => ({
          name: pt.name,
          price: pt.price,
          duration: pt.duration,
          isDefault: pt.isDefault,
        })),
      }

      await updateProcedure({
        id: procedureId,
        data: updateData as any,
      }).unwrap()

      toast.success("Cập nhật giai đoạn thành công")
      setEditingId(null)
      handleRefresh()
    } catch (error) {
      console.error("Failed to update procedure:", error)
      toast.error("Không thể cập nhật giai đoạn. Vui lòng thử lại sau.")
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
      <div
        ref={modalContentRef}
        className="relative pb-6 overflow-y-auto max-h-[85vh] w-full rounded-t-xl dark:bg-gray-900"
      >
        {/* Sticky Header - Sẽ luôn hiển thị khi cuộn */}
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm rounded-t-xl">
          <div className="px-6 pt-6 pb-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{viewService.name}</h2>

              <Badge variant="destructive" className="text-sm px-3 py-1">
                -{viewService.discountPercent}% Giảm giá
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {viewService.category && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-800/50"
                >
                  <Tag className="w-3.5 h-3.5 mr-1" />
                  {viewService.category.name}
                </Badge>
              )}

              <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-300 dark:to-purple-300">
                {new Intl.NumberFormat("vi-VN").format(Number(viewService.minPrice || 0))} -{" "}
                {new Intl.NumberFormat("vi-VN").format(Number(viewService.maxPrice || 0))} đ
              </div>
            </div>
          </div>

          <div className="px-6 py-2 bg-white dark:bg-gray-900">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 dark:bg-gray-800">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 dark:text-gray-300"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger
                  value="clinics"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 dark:text-gray-300"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Phòng khám
                </TabsTrigger>
                <TabsTrigger
                  value="procedures"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 dark:text-gray-300"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Giai đoạn
                </TabsTrigger>
                <TabsTrigger
                  value="doctors"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-300 dark:text-gray-300"
                >
                  <UserRound className="w-4 h-4 mr-2" />
                  Bác sĩ
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content area */}
        <div className="px-6 pt-6 space-y-6">
          <Tabs defaultValue="overview" value={activeTab} className="w-full" onValueChange={setActiveTab}>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Mô tả dịch vụ với avatar nhỏ bên cạnh */}
              <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex gap-4">
                  {/* Mô tả */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Mô tả dịch vụ</h3>
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {/* Parse description to extract images and text */}
                      {(() => {
                        // If description is not available, return null
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
                                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
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
                <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Thông tin giá</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Giá thấp nhất:</span>
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        {new Intl.NumberFormat("vi-VN").format(Number(viewService.minPrice || 0))} đ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Giá cao nhất:</span>
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        {new Intl.NumberFormat("vi-VN").format(Number(viewService.maxPrice || 0))} đ
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Giảm giá:</span>
                      <span className="font-medium text-red-600 dark:text-red-300">{viewService.discountPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Thông tin khác</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <span className="text-gray-600 dark:text-gray-400">Thời gian đặt lịch: 30-60 phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <span className="text-gray-600 dark:text-gray-400">Thời gian thực hiện: 1-2 giờ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <span className="text-gray-600 dark:text-gray-400">Đánh giá: 4.8/5 (120 đánh giá)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thêm phần hiển thị ảnh mô tả */}
              {viewService.descriptionImage && viewService.descriptionImage.length > 0 && (
                <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Hình ảnh mô tả</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {viewService.descriptionImage.map((image: any, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
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
                <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Hình ảnh bìa</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {viewService.coverImage.map((image: any, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
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
                      className="group p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
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
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-400 dark:text-gray-500">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <h4 className="font-medium text-lg text-gray-800 dark:text-gray-100">{clinic.name}</h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                              <span className="truncate">{clinic.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-pink-500 dark:text-pink-400 flex-shrink-0" />
                              <span className="truncate">{clinic.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                              <span>{clinic.phoneNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <MapPin className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Không có phòng khám</h3>
                  <p className="text-gray-500 dark:text-gray-400">Dịch vụ này hiện chưa có phòng khám nào cung cấp.</p>
                </div>
              )}
            </TabsContent>

            {/* Procedures Tab */}
            <TabsContent value="procedures" className="space-y-4 tabs-content">
              {viewService.procedures && viewService.procedures.length > 0 ? (
                <div className="space-y-4">
                  {viewService.procedures.map((procedure: Procedure, index: number) => (
                    <motion.div
                      key={procedure.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      {editingId === procedure.id ? (
                        // Editing mode
                        <div className="p-5 space-y-6">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                              Chỉnh sửa giai đoạn
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveProcedure(procedure.id)}
                                disabled={isUpdating}
                                className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full transition-colors flex items-center gap-1"
                              >
                                <Save className="w-4 h-4" />
                                <span className="text-sm">Lưu</span>
                              </button>
                              <button
                                onClick={handleCancelEditProcedure}
                                className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                <span className="text-sm">Hủy</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${procedure.id}`} className="text-gray-700 dark:text-gray-300">
                                Tên giai đoạn
                              </Label>
                              <Input
                                id={`name-${procedure.id}`}
                                value={editingProcedures[procedure.id].name}
                                onChange={(e) => handleEditProcedureChange(procedure.id, "name", e.target.value)}
                                placeholder="Nhập tên giai đoạn"
                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`stepIndex-${procedure.id}`} className="text-gray-700 dark:text-gray-300">
                                Thứ tự bước
                              </Label>
                              <Input
                                id={`stepIndex-${procedure.id}`}
                                type="number"
                                min="1"
                                value={editingProcedures[procedure.id].stepIndex}
                                onChange={(e) =>
                                  handleEditProcedureChange(procedure.id, "stepIndex", Number(e.target.value))
                                }
                                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                              />
                            </div>
                          </div>

                          {/* Add a clear div after the QuillEditor to ensure proper spacing */}
                          <div className="space-y-2">
                            <Label htmlFor={`description-${procedure.id}`} className="text-gray-700 dark:text-gray-300">
                              Mô tả
                            </Label>
                            <div className="quill-editor-container">
                              {editorLoaded && (
                                <QuillEditor
                                  value={editingProcedures[procedure.id].description}
                                  onChange={(value) => handleEditProcedureChange(procedure.id, "description", value)}
                                  placeholder="Nhập mô tả chi tiết về giai đoạn"
                                />
                              )}
                            </div>
                            {/* Add a clear div to prevent overlap */}
                            <div className="clear-both h-24"></div>
                          </div>

                          {/* Price Types - Added more spacing here */}
                          <div className="mt-16 pt-8 space-y-6 relative z-30 price-types-section dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                                Các loại giá
                              </Label>
                              <button
                                type="button"
                                onClick={() => handleAddPriceType(procedure.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors relative z-30"
                              >
                                <Plus className="w-4 h-4" /> Thêm loại giá
                              </button>
                            </div>

                            {editingProcedures[procedure.id].procedurePriceTypes.length === 0 ? (
                              <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                                Chưa có loại giá nào. Nhấn Thêm loại giá để bắt đầu.
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {editingProcedures[procedure.id].procedurePriceTypes.map((priceType, ptIndex) => (
                                  <div
                                    key={ptIndex}
                                    className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                  >
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`priceName-${procedure.id}-${ptIndex}`}
                                          className="text-gray-700 dark:text-gray-300"
                                        >
                                          Tên loại giá
                                        </Label>
                                        <Input
                                          id={`priceName-${procedure.id}-${ptIndex}`}
                                          value={priceType.name}
                                          onChange={(e) =>
                                            handleEditPriceTypeChange(procedure.id, ptIndex, "name", e.target.value)
                                          }
                                          placeholder="VD: Cơ bản, Cao cấp..."
                                          className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`priceValue-${procedure.id}-${ptIndex}`}
                                          className="text-gray-700 dark:text-gray-300"
                                        >
                                          Giá (VNĐ)
                                        </Label>
                                        <Input
                                          id={`priceValue-${procedure.id}-${ptIndex}`}
                                          type="number"
                                          min="0"
                                          value={priceType.price}
                                          onChange={(e) =>
                                            handleEditPriceTypeChange(procedure.id, ptIndex, "price", e.target.value)
                                          }
                                          placeholder="Nhập giá"
                                          className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`duration-${procedure.id}-${ptIndex}`}
                                          className="text-gray-700 dark:text-gray-300"
                                        >
                                          Thời gian (phút)
                                        </Label>
                                        <Input
                                          id={`duration-${procedure.id}-${ptIndex}`}
                                          type="number"
                                          min="1"
                                          value={priceType.duration}
                                          onChange={(e) =>
                                            handleEditPriceTypeChange(procedure.id, ptIndex, "duration", e.target.value)
                                          }
                                          placeholder="Thời gian thực hiện"
                                          className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                        />
                                      </div>
                                      <div className="flex items-center h-full pt-8">
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`isDefault-${procedure.id}-${ptIndex}`}
                                            checked={priceType.isDefault}
                                            onCheckedChange={(checked) =>
                                              handleEditPriceTypeChange(
                                                procedure.id,
                                                ptIndex,
                                                "isDefault",
                                                Boolean(checked),
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`isDefault-${procedure.id}-${ptIndex}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
                                          >
                                            Đặt làm mặc định
                                          </Label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex justify-end mt-2">
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePriceType(procedure.id, ptIndex)}
                                        className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-sm">Xóa</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="p-5">
                          {/* Procedure Info */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="px-2 py-1 rounded-md bg-purple-600 dark:bg-purple-700 text-white text-xs font-medium">
                                  Bước {procedure.stepIndex}
                                </div>
                                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                  {procedure.name}
                                </h4>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1">
                                {/* Edit Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleStartEditProcedure(procedure)
                                  }}
                                  disabled={isUpdating && editingId === procedure.id}
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                >
                                  <Pencil className="w-5 h-5" />
                                </button>

                                {/* Delete Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setProcedureToDelete(procedure.id)
                                    setConfirmDialogOpen(true)
                                  }}
                                  disabled={isDeleting && deletingId === procedure.id}
                                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Improved description rendering with proper image handling and "See more" functionality */}
                            {procedure.description && (
                              <div className="text-gray-600 dark:text-gray-300 mt-2">
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
                                            className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors flex items-center"
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
                                        className="mt-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors flex items-center"
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
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Các loại giá:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {procedure.procedurePriceTypes.map((priceType: any) => (
                                    <div
                                      key={priceType.id}
                                      className={`p-3 rounded-lg h-[120px] flex flex-col justify-between ${
                                        priceType.isDefault
                                          ? "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-200 dark:border-purple-800"
                                          : "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-900"
                                      }`}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div
                                          className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-[70%]"
                                          title={priceType.name}
                                        >
                                          {priceType.name}
                                        </div>
                                        {priceType.isDefault && (
                                          <Badge className="bg-purple-500 dark:bg-purple-600 text-white text-xs shrink-0">
                                            <Check className="w-3 h-3 mr-1" />
                                            Mặc định
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-300 dark:to-purple-300 mt-2">
                                        {new Intl.NumberFormat("vi-VN").format(priceType.price)} đ
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto flex items-center">
                                        <Clock className="w-3 h-3 mr-1 shrink-0" />
                                        {priceType.duration || 30} phút
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <Clipboard className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Không có giai đoạn</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Dịch vụ này hiện chưa có giai đoạn nào được định nghĩa.
                  </p>
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
            className="px-6 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center gap-2"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
            Đóng
          </button>
        </div>

        {/* Custom Confirmation Dialog */}
        {confirmDialogOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setConfirmDialogOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Xác nhận xóa</h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Bạn có chắc chắn muốn xóa giai đoạn này? Hành động này không thể hoàn tác.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDialogOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    if (procedureToDelete) {
                      handleDeleteProcedure(procedureToDelete)
                      setConfirmDialogOpen(false)
                    }
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg bg-red-600 dark:bg-red-700 text-white font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isDeleting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Xóa giai đoạn
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

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
        
        .quill-editor-container {
          position: relative;
          z-index: 30;
          margin-bottom: 80px; /* Significantly increased margin to create more space */
        }
        
        .ql-toolbar.ql-snow,
        .ql-container.ql-snow {
          position: relative;
          z-index: 30;
          background-color: white;
        }
        
        .ql-editor {
          min-height: 120px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 30;
          background-color: white;
          color: #1e293b;
        }

        /* Dark mode styles for Quill */
        [data-theme='dark'] .ql-toolbar.ql-snow,
        [data-theme='dark'] .ql-container.ql-snow {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        
        [data-theme='dark'] .ql-editor {
          background-color: #1f2937;
          color: #d1d5db;
        }
        
        [data-theme='dark'] .ql-picker-label {
          color: #d1d5db;
        }
        
        [data-theme='dark'] .ql-stroke {
          stroke: #d1d5db;
        }
        
        [data-theme='dark'] .ql-fill {
          fill: #d1d5db;
        }
        
        [data-theme='dark'] .ql-picker-options {
          background-color: #1f2937;
          border-color: #4b5563;
        }
        
        [data-theme='dark'] .ql-picker-item {
          color: #d1d5db;
        }

        /* Fix for overlapping elements */
        .tabs-content {
          position: relative;
          z-index: 10;
        }

        .price-types-section {
          position: relative;
          z-index: 20;
          background-color: white;
          margin-top: 100px; /* Add more space after the editor */
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }
        
        [data-theme='dark'] .price-types-section {
          background-color: #1f2937;
          border-top: 1px solid #374151;
        }
      `}</style>
    </ModalService>
  )
}
