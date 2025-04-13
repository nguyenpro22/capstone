"use client"
import { MdEditSquare } from "react-icons/md"

import { useState, useEffect } from "react"
import { ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useGetServicesQuery,
  useLazyGetServiceByIdQuery,
  useDeleteServiceMutation,
} from "@/features/clinic-service/api"
import { useGetCategoriesQuery } from "@/features/category-service/api"
import ServiceForm from "@/components/clinicManager/ServiceForm"
import PromotionForm from "@/components/clinicManager/PromotionForm"
import { useDebounce } from "@/hooks/use-debounce"

import EditServiceForm from "@/components/clinicManager/EditServiceForm"
import AddProcedure from "@/components/clinicManager/AddProcedure"
import { useTranslations } from "next-intl"

import Pagination from "@/components/common/Pagination/Pagination"
import ImageModal from "@/components/clinicManager/ImageModal"
import type { Service, ImageObject } from "@/features/clinic-service/types"

import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MoreVertical } from "lucide-react" // Import icon ba chấm và icon đóng
import Image from "next/image"
// Thêm import cho component ViewServiceModal
import ViewServiceModal from "@/components/clinicManager/service/view-service-modal"
import { MenuPortal } from "@/components/ui/menu-portal"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"
import ConfirmationDialog from "@/components/ui/confirmation-dialog"

export default function ServicePage() {
  const t = useTranslations("service") 

  const [viewService, setViewService] = useState<any | null>(null) // Cho popup "Xem thông tin"
  const [editService, setEditService] = useState<any | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [modalType, setModalType] = useState<"promotion" | "procedure" | null>(null)

  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showPromotionForm, setShowPromotionForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500) // 500ms delay

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5

  const { data, refetch } = useGetServicesQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
  })

  // Reset page index when search term changes
  useEffect(() => {
    setPageIndex(1)
  }, [debouncedSearchTerm])

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch)
  const { data: categoriesData } = useGetCategoriesQuery({
    pageIndex: 1,
    pageSize: 100,
    searchTerm: "",
  })

  console.log("API Response:", data)
  const [fetchServiceById] = useLazyGetServiceByIdQuery()
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()

  const services: Service[] = data?.value?.items || []
  const categories = categoriesData?.value || []
  console.log("Service Data:", services) // Debug
  console.log("Category Data:", categories) // Debug

  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage
  const hasPreviousPage = data?.value?.hasPreviousPage

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (images: ImageObject[]) => {
    // Convert ImageObject array to string array of URLs
    const imageUrls = images.map((img) => img.url)
    setSelectedImages(imageUrls)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const openPromotionForm = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setModalType("promotion")
  }

  const handleCloseMenu = () => {
    setMenuOpen(null)
  }

  const handleToggleMenu = (serviceId: string) => {
    setMenuOpen(menuOpen === serviceId ? null : serviceId)
  }

  const handleMenuAction = async (action: string, pkgId: string) => {
    if (action === "view") {
      try {
        const result = await fetchServiceById(pkgId).unwrap()
        setViewService(result.value)
      } catch (error) {
        console.error(error)
        toast.error(t("errors.fetchServiceFailed"))
        setViewService({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        })
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchServiceById(pkgId).unwrap()
        setEditService(result.value)
      } catch (error) {
        console.error(error)
        toast.error(t("errors.fetchServiceFailed"))
        setEditService({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        })
      }
      setShowEditForm(true)
    }

    if (action === "addProcedure") {
      setSelectedServiceId(pkgId) // Mở modal AddProcedure
      setModalType("procedure") // 🆕 Chỉ mở form AddProcedure
    }

    if (action === "delete") {
      setServiceToDelete(pkgId)
      setConfirmDialogOpen(true)
    }

    setMenuOpen(null)
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService({ id: serviceId }).unwrap()
      toast.success(t("success.serviceDeleted"))
      delayedRefetch()
    } catch (error) {
      console.error(error)
      toast.error(t("errors.deleteServiceFailed"))
    }
  }

  // Hàm để refetch dữ liệu service khi cần thiết (ví dụ: sau khi thêm/xóa bác sĩ)
  const refetchServiceData = async () => {
    if (viewService && viewService.id) {
      try {
        // Refetch dữ liệu service
        const result = await fetchServiceById(viewService.id).unwrap()
        // Cập nhật state với dữ liệu mới
        setViewService(result.value)
      } catch (error) {
        console.error("Error refreshing service data:", error)
        toast.error(t("errors.refreshServiceFailed"))
      }
    }
  }

  // Thêm state để lưu trữ vị trí của button
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  return (
    <div className="p-6 dark:bg-gray-950" onClick={handleCloseMenu}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">
          {t("servicesList")}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={`${t("searchByName")}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500 focus:ring-opacity-50 transition-all dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium tracking-wide">{t("addNewService")}</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 shadow-md dark:shadow-gray-900/20 rounded-lg relative">
        {services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-left">
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tl-lg dark:text-gray-100">
                    {t("no")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-100">
                    {t("serviceName")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-100">{t("price")}</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-100">
                    {t("coverImage")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-100">
                    {t("category")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-100">
                    {t("percentDiscount")}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tr-lg dark:text-gray-100">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service: Service, index: number) => (
                  <tr
                    key={service.id}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    <td className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200">
                      {(pageIndex - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium dark:text-gray-100">
                      {service.name}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-300 dark:to-purple-300 font-medium">
                        {service.minPrice.toLocaleString()} - {service.maxPrice.toLocaleString()} VND
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        {service.coverImage && service.coverImage.length > 0 && (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden shadow-sm">
                            <Image
                              src={service.coverImage[0].url || "/placeholder.svg"}
                              alt="Cover"
                              className="object-cover"
                              width={100}
                              height={100}
                            />
                          </div>
                        )}
                        {service.coverImage && service.coverImage.length > 1 && (
                          <button
                            className="text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200 text-sm font-medium transition-colors"
                            onClick={() => handleOpenModal(service.coverImage || [])}
                          >
                            +{service.coverImage.length - 1} {t("moreImages")}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200">
                        {service.category.name}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200">
                          {service.discountPercent}%
                        </span>

                        <button
                          onClick={() => openPromotionForm(service.id)}
                          className="p-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-500 dark:text-purple-300 transition-colors"
                        >
                          <MdEditSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 relative">
                      <button
                        className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.nativeEvent.stopImmediatePropagation()
                          // Lưu vị trí của button
                          setTriggerRect(e.currentTarget.getBoundingClientRect())
                          setMenuOpen(menuOpen === service.id ? null : service.id)
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </button>

                      <AnimatePresence>
                        {menuOpen === service.id && (
                          <MenuPortal
                            isOpen={menuOpen === service.id}
                            onClose={() => setMenuOpen(null)}
                            triggerRect={triggerRect}
                          >
                            <li
                              className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("view", service.id)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-300"></span>
                              </span>
                              {t("viewServiceDetail")}
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("edit", service.id)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-300"></span>
                              </span>
                              {t("editService")}
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("addProcedure", service.id)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-300"></span>
                              </span>
                              {t("addProcedure")}
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 cursor-pointer flex items-center gap-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("delete", service.id)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-300"></span>
                              </span>
                              {t("deleteService")}
                            </li>
                          </MenuPortal>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-purple-300 dark:text-purple-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-300">{t("noServicesAvailable")}</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 border border-purple-200 dark:border-purple-700 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
            >
              {t("addFirstService")}
            </button>
          </div>
        )}

        {/* Modal hiển thị ảnh */}
        {isModalOpen && <ImageModal images={selectedImages} onClose={handleCloseModal} />}
      </div>

      {/* Keeping the original form structure as requested */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)", // Làm mờ nền phía sau
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // Đảm bảo hiển thị trên cùng
          }}
        >
          <ServiceForm
            onClose={() => setShowForm(false)}
            onSaveSuccess={() => {
              setShowForm(false)
              delayedRefetch()
              toast.success(t("success.serviceAdded"))
            }}
          />
        </div>
      )}

      {/* Hiển thị PromotionForm khi click */}
      {modalType === "promotion" && selectedServiceId && (
        <PromotionForm
          serviceId={selectedServiceId}
          onClose={() => setModalType(null)}
          onSuccess={() => delayedRefetch()}
        />
      )}

      {modalType === "procedure" && selectedServiceId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AddProcedure
            onClose={() => setSelectedServiceId(null)}
            clinicServiceId={selectedServiceId}
            onSuccess={() => delayedRefetch()}
          />
        </div>
      )}

      {showEditForm && editService && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditServiceForm
            initialData={editService}
            categories={categoriesData?.value.items || []}
            onClose={() => {
              setShowEditForm(false)
              setEditService(null)
            }}
            onSaveSuccess={() => {
              setShowEditForm(false)
              setEditService(null)
              delayedRefetch()
            }}
          />
        </div>
      )}

      <div className="mt-6">
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={setPageIndex}
        />
      </div>

      {/* Truyền refetchService vào ViewServiceModal */}
      {viewService && (
        <ViewServiceModal
          viewService={viewService}
          onClose={() => setViewService(null)}
          refetchService={refetchServiceData}
        />
      )}

      {/* Use the reusable confirmation dialog component */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          if (serviceToDelete) {
            handleDeleteService(serviceToDelete)
            setConfirmDialogOpen(false)
          }
        }}
        title={t("confirmDelete")}
        message={t("deleteServiceConfirmation")}
        confirmButtonText={t("deleteService")}
        cancelButtonText={t("cancel")}
        isLoading={isDeleting}
        type="delete"
      />
    </div>
  )
}
