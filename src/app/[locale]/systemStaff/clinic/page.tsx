"use client"
import type React from "react"
import { useState } from "react"
import {
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  Search,
  Download,
  MoreVertical,
  Loader2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetClinicsQuery, useLazyGetClinicByIdQuery, useUpdateClinicMutation } from "@/features/clinic/api"
import { useTranslations } from "next-intl"
import * as XLSX from "xlsx"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Modal from "@/components/systemStaff/Modal"
import EditClinicForm from "@/components/systemStaff/EditClinicForm"
import Pagination from "@/components/common/Pagination/Pagination"
import type { Clinic } from "@/features/clinic/types"
import { MenuPortal } from "@/components/ui/menu-portal"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"

const ClinicsList: React.FC = () => {
  const t = useTranslations("clinic")

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5
  const [searchTerm, setSearchTerm] = useState("")
  const [viewClinic, setViewClinic] = useState<any | null>(null)
  const [editClinic, setEditClinic] = useState<any | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  const { data, isLoading, error, refetch } = useGetClinicsQuery({
    pageIndex,
    pageSize,
    searchTerm,
  })

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch)

  const [updateClinic] = useUpdateClinicMutation()

  const clinics = data?.value.items || []
  const totalCount = data?.value.totalCount || 0
  const hasNextPage = data?.value.hasNextPage || false
  const hasPreviousPage = data?.value.hasPreviousPage || false

  const [fetchClinicById] = useLazyGetClinicByIdQuery()

  const handleCloseMenu = () => {
    setMenuOpen(null)
  }

  const handleToggleMenu = (clinicId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    // Store the position of the button
    setTriggerRect(e.currentTarget.getBoundingClientRect())
    setMenuOpen(menuOpen === clinicId ? null : clinicId)
  }

  const handleMenuAction = async (action: string, clinicId: string) => {
    if (action === "view") {
      try {
        const result = await fetchClinicById(clinicId).unwrap()
        setViewClinic(result.value)
      } catch (error) {
        toast.error("Không thể lấy thông tin phòng khám!" + error)
        setViewClinic(null)
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchClinicById(clinicId).unwrap()
        setEditClinic(result.value)
      } catch (error) {
        toast.error("Không thể lấy thông tin phòng khám!" + error)
        setEditClinic(null)
      }
      setShowEditForm(true)
    }

    setMenuOpen(null)
  }

  const handleDeleteClinic = async (clinicId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        // await deleteClinic(clinicId).unwrap();
        toast.success("Gói đã được xóa thành công!" + clinicId)
        delayedRefetch() // Use delayed refetch instead of immediate refetch
      } catch (error) {
        console.error(error)
        toast.error("Xóa gói thất bại!")
      }
    }
  }

  const handleCloseEditForm = () => {
    setViewClinic(null)
    setShowEditForm(false)
    setEditClinic(null)
  }

  const handleSaveSuccess = () => {
    // Thêm hàm này để xử lý khi lưu thành công
    delayedRefetch() // Use delayed refetch instead of immediate refetch
    handleCloseEditForm()
  }

  const handleToggleStatus = async (id: string) => {
    const clinic = clinics.find((clinic) => clinic.id === id)
    if (!clinic) return

    try {
      const updatedFormData = new FormData()
      updatedFormData.append("clinicId", clinic.id || "")
      updatedFormData.append("isActivated", (!clinic.isActivated).toString())

      await updateClinic({ clinicId: id, data: updatedFormData }).unwrap()
      toast.success("Trạng thái phòng khám đã được cập nhật!")
      delayedRefetch() // Use delayed refetch instead of immediate refetch
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error("Cập nhật trạng thái thất bại!")
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clinics)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clinics")
    XLSX.writeFile(workbook, "Clinics.xlsx")
  }

  return (
    <div
      className="container mx-auto p-8 bg-gradient-to-br from-white via-slate-50 to-indigo-50 shadow-xl rounded-2xl border border-indigo-100/50"
      onClick={handleCloseMenu}
    >
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-indigo-950 tracking-tight">{t("clinicsList")}</h1>
          <p className="text-slate-500">
            {totalCount} {totalCount === 1 ? "clinic" : "clinics"} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t("searchByName")}
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Export Excel Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            onClick={exportToExcel}
          >
            <Download className="h-5 w-5" />
            <span>{t("exportExcel")}</span>
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading clinics...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center text-red-500">
            <XCircle className="h-10 w-10 mb-4" />
            <p className="text-lg font-medium">Error fetching data</p>
            <button
              onClick={() => delayedRefetch()} // Use delayed refetch instead of immediate refetch
              className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Table Section */}
      {!isLoading && !error && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-indigo-50 text-slate-700">
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200">
                    {t("fullName")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200">
                    {t("email")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200">
                    {t("address")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200">
                    {t("totalBranches")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200">
                    {t("status")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clinics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No clinics found
                    </td>
                  </tr>
                ) : (
                  clinics.map((clinic: Clinic) => (
                    <motion.tr
                      key={clinic.id}
                      whileHover={{ backgroundColor: "rgba(238, 242, 255, 0.5)" }}
                      className="transition-colors duration-200 h-16"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {clinic.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {clinic.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {clinic.fullAddress || clinic.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {clinic.totalBranches}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={clinic.isActivated}
                              className="sr-only peer"
                              onChange={() => handleToggleStatus(clinic.id)}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                          </label>
                          <span
                            className={`text-sm font-medium ${clinic.isActivated ? "text-emerald-600" : "text-slate-500"}`}
                          >
                            {clinic.isActivated ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                          onClick={(e) => handleToggleMenu(clinic.id, e)}
                        >
                          <MoreVertical className="w-5 h-5 text-slate-600" />
                        </motion.button>

                        <AnimatePresence>
                          {menuOpen === clinic.id && (
                            <MenuPortal
                              isOpen={menuOpen === clinic.id}
                              onClose={() => setMenuOpen(null)}
                              triggerRect={triggerRect}
                            >
                              <li
                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center gap-2 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction("view", clinic.id)
                                }}
                              >
                                <Eye className="w-4 h-4 text-indigo-600" />
                                {t("viewClinicDetail")}
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center gap-2 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMenuAction("edit", clinic.id)
                                }}
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                                {t("editClinic")}
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteClinic(clinic.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                                {t("deleteClinic")}
                              </li>
                            </MenuPortal>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && clinics.length > 0 && (
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
      )}

      {/* View Clinic Modal */}
      {viewClinic && (
        <Modal onClose={() => setViewClinic(null)}>
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-900">Chi Tiết Phòng Khám</h2>
              <div className="w-16 h-1 mx-auto bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mt-2" />
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Clinic Name */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Layers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Tên phòng khám</div>
                      <div className="text-base font-medium text-slate-800">{viewClinic.name}</div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Email</div>
                      <div className="text-slate-700">{viewClinic.email}</div>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Số điện thoại</div>
                      <div className="text-slate-700">{viewClinic.phoneNumber}</div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Địa chỉ</div>
                      <div className="text-slate-700">{viewClinic.address}</div>
                    </div>
                  </div>
                </div>

                {/* Tax Code */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Mã số thuế</div>
                      <div className="text-slate-700">{viewClinic.taxCode}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Business License */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Giấy phép kinh doanh</div>
                      <a
                        href={viewClinic.businessLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                      >
                        Xem giấy phép
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating License */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Giấy phép hoạt động</div>
                      <a
                        href={viewClinic.operatingLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                      >
                        Xem giấy phép
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating License Expiry Date */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Ngày hết hạn giấy phép</div>
                      <div className="text-slate-700">
                        {new Intl.DateTimeFormat("vi-VN").format(new Date(viewClinic.operatingLicenseExpiryDate))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Picture */}
                {viewClinic.profilePictureUrl && (
                  <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Ảnh đại diện</div>
                        <a
                          href={viewClinic.profilePictureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                        >
                          Xem ảnh đại diện
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Branches */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Layers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Tổng số chi nhánh</div>
                      <div className="text-slate-700">{viewClinic.totalBranches}</div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${viewClinic.isActivated ? "bg-emerald-100" : "bg-red-100"}`}>
                      {viewClinic.isActivated ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Trạng thái</div>
                      <div
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                          viewClinic.isActivated ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {viewClinic.isActivated ? "Đang hoạt động" : "Ngừng hoạt động"}
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
                onClick={() => setViewClinic(null)}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Đóng
              </motion.button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Clinic Form */}
      {showEditForm && editClinic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleCloseEditForm}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-4xl mx-4"
          >
            <EditClinicForm initialData={editClinic} onClose={handleCloseEditForm} onSaveSuccess={handleSaveSuccess} />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ClinicsList

