"use client"
import { MdEditSquare } from "react-icons/md"
import { useState } from "react"
import { MapPin, Mail, Phone, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import {
  useGetServicesQuery,
  useLazyGetServiceByIdQuery,
  useDeleteServiceMutation,
} from "@/features/clinic-service/api"
import { useGetCategoriesQuery } from "@/features/category-service/api"
import ServiceForm from "@/components/clinicManager/ServiceForm"
import PromotionForm from "@/components/clinicManager/PromotionForm"

import EditServiceForm from "@/components/clinicManager/EditServiceForm"
import AddProcedure from "@/components/clinicManager/AddProcedure"
import { useTranslations } from "next-intl"

import Pagination from "@/components/common/Pagination/Pagination"
import ImageModal from "@/components/clinicManager/ImageModal"
import type { Procedure, Service } from "@/features/clinic-service/types"
import type { Clinic } from "@/features/clinic/types"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MoreVertical } from "lucide-react" // Import icon ba chấm và icon đóng
import Modal from "@/components/systemAdmin/Modal" // Component popup để hiển thị thông tin gói
import Image from "next/image"

export default function ServicePage() {
  const t = useTranslations("service") // Sử dụng namespace "dashboard"

  const [viewService, setViewService] = useState<any | null>(null) // Cho popup "Xem thông tin"
  const [editService, setEditService] = useState<any | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [modalType, setModalType] = useState<"promotion" | "procedure" | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showPromotionForm, setShowPromotionForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5

  const { data, refetch } = useGetServicesQuery({
    pageIndex,
    pageSize,
    searchTerm,
  })
  const { data: categoriesData } = useGetCategoriesQuery({
    pageIndex: 1,
    pageSize: 100,
    searchTerm: "",
  })

  console.log("API Response:", data)
  const [fetchServiceById] = useLazyGetServiceByIdQuery()
  const [deleteService] = useDeleteServiceMutation()

  const services: Service[] = data?.value?.items || []
  const categories = categoriesData?.value || []
  console.log("Service Data:", services) // Debug
  console.log("Category Data:", categories) // Debug

  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage
  const hasPreviousPage = data?.value?.hasPreviousPage

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  // const [selectedService, setSelectedService] = useState<any | null>(null);

  // const handleToggleMenu = (serviceId: string) => {
  //   setMenuOpen(menuOpen === serviceId ? null : serviceId);
  // };
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (images: string[]) => {
    setSelectedImages(images)
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

  const handleMenuAction = async (action: string, pkgId: string) => {
    if (action === "view") {
      try {
        const result = await fetchServiceById(pkgId).unwrap()
        setViewService(result.value)
      } catch (error) {
        console.error(error)
        toast.error("Không thể lấy thông tin gói!")
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
        toast.error("Không thể lấy thông tin gói!")
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

    setMenuOpen(null)
  }

  const handleDeleteService = async (ServiceId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        await deleteService({ id: ServiceId }).unwrap()
        toast.success("Gói đã được xóa thành công!")
        refetch()
      } catch (error) {
        console.error(error)
        toast.error("Xóa gói thất bại!")
      }
    }
  }

  return (
    <div className="p-6" onClick={handleCloseMenu}>
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          {t("servicesList")}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={`${t("searchByServiceName")}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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

      <div className="bg-white p-6 shadow-md rounded-lg relative">
        {services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 text-left">
                  <th className="p-3 border border-gray-200 rounded-tl-lg">{t("no")}</th>
                  <th className="p-3 border border-gray-200">{t("serviceName")}</th>
                  <th className="p-3 border border-gray-200">{t("price")}</th>
                  <th className="p-3 border border-gray-200">{t("coverImage")}</th>
                  <th className="p-3 border border-gray-200">{t("category")}</th>
                  <th className="p-3 border border-gray-200">{t("percentDiscount")}</th>
                  <th className="p-3 border border-gray-200 rounded-tr-lg">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service: Service, index: number) => (
                  <tr key={service.id} className="border-t hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 border border-gray-200">{(pageIndex - 1) * pageSize + index + 1}</td>
                    <td className="p-3 border border-gray-200 font-medium">{service.name}</td>
                    <td className="p-3 border border-gray-200">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-medium">
                        {service.minPrice.toLocaleString()} - {service.maxPrice.toLocaleString()} VND
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        {service.coverImage && service.coverImage.length > 0 && (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden shadow-sm">
                            <Image
                              src={service.coverImage[0] || "/placeholder.svg"}
                              alt="Cover"
                              className="object-cover"
                              width={100}
                              height={100}
                            />
                          </div>
                        )}
                        {service.coverImage && service.coverImage.length > 1 && (
                          <button
                            className="text-purple-500 hover:text-purple-700 text-sm font-medium transition-colors"
                            onClick={() => handleOpenModal(service.coverImage || [])}
                          >
                            +{service.coverImage.length - 1} more
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                        {service.category.name}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        {service.discountPercent > 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                            {service.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        <button
                          onClick={() => openPromotionForm(service.id)}
                          className="p-1.5 rounded-full hover:bg-purple-50 text-purple-500 transition-colors"
                        >
                          <MdEditSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 relative">
                      <button
                        className="p-2 rounded-full hover:bg-purple-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpen(menuOpen === service.id ? null : service.id)
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {menuOpen === service.id && (
                        <motion.ul
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="fixed right-auto mt-2 w-48 bg-white border shadow-lg rounded-md text-sm py-1 z-[1001]"
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "auto",
                            right: "0",
                            maxHeight: "300px",
                            overflowY: "auto",
                          }}
                        >
                          <li
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => handleMenuAction("view", service.id)}
                          >
                            <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            </span>
                            {t("viewServiceDetail")}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => handleMenuAction("edit", service.id)}
                          >
                            <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            </span>
                            {t("editService")}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => handleMenuAction("addProcedure", service.id)}
                          >
                            <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            </span>
                            {t("addProcedure")}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => handleDeleteService(service?.id)}
                          >
                            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            </span>
                            {t("deleteService")}
                          </li>
                        </motion.ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-purple-300" />
            </div>
            <p className="text-gray-500">No Services available.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors"
            >
              Add your first service
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
              refetch()
              toast.success("Service added successfully!")
            }}
          />
        </div>
      )}

      {/* Hiển thị PromotionForm khi click */}
      {modalType === "promotion" && selectedServiceId && (
        <PromotionForm serviceId={selectedServiceId} onClose={() => setModalType(null)} />
      )}

      {modalType === "procedure" && selectedServiceId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AddProcedure onClose={() => setSelectedServiceId(null)} clinicServiceId={selectedServiceId} />
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
              refetch()
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

      {viewService && (
        <Modal onClose={() => setViewService(null)}>
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
                      {new Intl.NumberFormat("vi-VN").format(Number(viewService?.price || 0))} đ
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
                {viewService?.coverImage?.length > 0 ? (
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
            {viewService?.clinics?.length > 0 && (
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
            {viewService?.procedures?.length > 0 && (
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
      )}
    </div>
  )
}

