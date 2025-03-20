"use client"
import { useState } from "react"
import { UserIcon, Building2, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetStaffQuery, useLazyGetStaffByIdQuery, useDeleteStaffMutation } from "@/features/clinic/api"
import { useTranslations } from "next-intl"

import Pagination from "@/components/common/Pagination/Pagination"
import StaffForm from "@/components/clinicManager/staff/StaffForm"
import EditStaffForm from "@/components/clinicManager/staff/EditStaffForm"
import ViewStaffModal from "@/components/clinicManager/staff/view-staff-modal"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MoreVertical } from "lucide-react"
import { MenuPortal } from "@/components/ui/menu-portal"

// Add the import for getAccessToken and GetDataByToken
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { Staff } from "@/features/clinic/types"

interface BranchViewModalProps {
  branches: Array<{ id: string; name: string }>
  onClose: () => void
}

const BranchViewModal = ({ branches, onClose }: BranchViewModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          All Branches
        </h3>

        <div className="max-h-60 overflow-y-auto">
          {branches.map((branch, index) => (
            <div key={branch.id} className="p-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 text-purple-500 mr-2" />
                <span className="font-medium">{branch.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function StaffPage() {
  const t = useTranslations("staff") // Using namespace "staff"
  // Get the token and extract clinicId
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  const [viewStaff, setViewStaff] = useState<Staff | null>(null)
  const [editStaff, setEditStaff] = useState<Staff | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [viewingBranches, setViewingBranches] = useState<Array<{ id: string; name: string }> | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5

  const { data, refetch } = useGetStaffQuery({
    clinicId,
    pageIndex,
    pageSize,
    searchTerm,
    role: 2, // Add role parameter with value 2 for Staff
  })

  const [fetchStaffById] = useLazyGetStaffByIdQuery()
  const [deleteStaff] = useDeleteStaffMutation()

  // Update to match the actual response structure
  const staffList: Staff[] = data?.value?.items || []

  // Get pagination info from the response
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = !!data?.value?.hasNextPage
  const hasPreviousPage = !!data?.value?.hasPreviousPage

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  const handleCloseMenu = () => {
    setMenuOpen(null)
  }

  const handleViewAllBranches = (branches: Array<{ id: string; name: string }>) => {
    setViewingBranches(branches)
  }

  const handleMenuAction = async (action: string, staffId: string) => {
    if (action === "view") {
      try {
        // Update to pass both clinicId and staffId
        const result = await fetchStaffById({
          clinicId,
          staffId,
        }).unwrap()
        setViewStaff(result.value)
      } catch (error) {
        console.error(error)
        toast.error("Không thể lấy thông tin nhân viên!")
        setViewStaff({
          id: "",
          clinicId: "",
          employeeId: "",
          email: "",
          firstName: "",
          lastName: "",
          fullName: "",
          city: null,
          district: null,
          ward: null,
          address: null,
          phoneNumber: null,
          fullAddress: "",
          profilePictureUrl: null,
          role: "",
          doctorCertificates: [],
          branchs: [],
        })
      }
    }

    if (action === "edit") {
      try {
        // Update to pass both clinicId and staffId
        const result = await fetchStaffById({
          clinicId,
          staffId,
        }).unwrap()
        setEditStaff(result.value)
      } catch (error) {
        console.error(error)
        toast.error("Không thể lấy thông tin nhân viên!")
        setEditStaff({
          id: "",
          clinicId: "",
          employeeId: "",
          email: "",
          firstName: "",
          lastName: "",
          fullName: "",
          city: null,
          district: null,
          ward: null,
          address: null,
          phoneNumber: null,
          fullAddress: "",
          profilePictureUrl: null,
          role: "",
          doctorCertificates: [],
          branchs: [],
        })
      }
      setShowEditForm(true)
    }

    setMenuOpen(null)
  }

  // Update the handleDeleteStaff function to use the correct API structure
  const handleDeleteStaff = async (staffId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        // Check if clinicId is available
        if (!clinicId) {
          toast.error("Clinic ID not found. Please try again or contact support.")
          return
        }

        await deleteStaff({
          id: clinicId, // clinicId is now guaranteed to be a string
          accountId: staffId, // Use staffId as the accountId parameter
        }).unwrap()

        toast.success("Nhân viên đã được xóa thành công!")
        refetch()
      } catch (error) {
        console.error(error)
        toast.error("Xóa nhân viên thất bại!")
      }
    }
  }

  return (
    <div className="p-6" onClick={handleCloseMenu}>
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          {t("staffList") || "Staff List"}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={`${t("searchByName") || "Search by name"}...`}
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
            <span className="font-medium tracking-wide">{t("addNewStaff") || "Add New Staff"}</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg relative">
        {staffList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 text-left">
                  <th className="p-3 border border-gray-200 rounded-tl-lg">{t("no") || "No."}</th>
                  <th className="p-3 border border-gray-200">{t("fullName") || "Full Name"}</th>
                  <th className="p-3 border border-gray-200">{t("email") || "Email"}</th>
                  <th className="p-3 border border-gray-200">{t("phoneNumber") || "Phone Number"}</th>
                  <th className="p-3 border border-gray-200">{t("role") || "Role"}</th>
                  <th className="p-3 border border-gray-200">{t("branches") || "Branches"}</th>
                  <th className="p-3 border border-gray-200 rounded-tr-lg">{t("action") || "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff: Staff, index: number) => (
                  <tr key={staff.employeeId} className="border-t hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 border border-gray-200">{(pageIndex - 1) * pageSize + index + 1}</td>
                    <td className="p-3 border border-gray-200 font-medium">{staff.fullName}</td>
                    <td className="p-3 border border-gray-200">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-medium">
                        {staff.email}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200">{staff.phoneNumber || "-"}</td>
                    <td className="p-3 border border-gray-200">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200">
                      {staff.branchs && staff.branchs.length > 0 ? (
                        <div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {staff.branchs.slice(0, 2).map((branch, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                                {branch.name}
                              </span>
                            ))}
                          </div>
                          {staff.branchs.length > 2 && (
                            <button
                              onClick={() => handleViewAllBranches(staff.branchs|| [])}
                              className="text-xs text-purple-600 flex items-center hover:text-purple-800 transition-colors"
                            >
                              View all ({staff.branchs.length})
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No branches</span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-200 relative">
                      <button
                        className="p-2 rounded-full hover:bg-purple-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.nativeEvent.stopImmediatePropagation()
                          // Lưu vị trí của button
                          setTriggerRect(e.currentTarget.getBoundingClientRect())
                          setMenuOpen(menuOpen === staff.employeeId ? null : staff.employeeId)
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      <AnimatePresence>
                        {menuOpen === staff.employeeId && (
                          <MenuPortal
                            isOpen={menuOpen === staff.employeeId}
                            onClose={() => setMenuOpen(null)}
                            triggerRect={triggerRect}
                          >
                            <li
                              className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("view", staff.employeeId)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                              </span>
                              {t("viewStaffDetail") || "View Staff Detail"}
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("edit", staff.employeeId)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              </span>
                              {t("editStaff") || "Edit Staff"}
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteStaff(staff.employeeId)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              </span>
                              {t("deleteStaff") || "Delete Staff"}
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-purple-300" />
            </div>
            <p className="text-gray-500">{t("noStaffAvailable") || "No Staff available."}</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors"
            >
              {t("addYourFirstStaff") || "Add your first staff member"}
            </button>
          </div>
        )}
      </div>

      {/* Add Staff Form */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <StaffForm
            onClose={() => setShowForm(false)}
            onSaveSuccess={() => {
              setShowForm(false)
              refetch()
              toast.success("Staff added successfully!")
            }}
          />
        </div>
      )}

      {/* Edit Staff Form */}
      {showEditForm && editStaff && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditStaffForm
            initialData={editStaff}
            onClose={() => {
              setShowEditForm(false)
              setEditStaff(null)
            }}
            onSaveSuccess={() => {
              setShowEditForm(false)
              setEditStaff(null)
              refetch()
            }}
          />
        </div>
      )}

      {/* View All Branches Modal */}
      {viewingBranches && <BranchViewModal branches={viewingBranches} onClose={() => setViewingBranches(null)} />}

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

      {viewStaff && <ViewStaffModal viewStaff={viewStaff} onClose={() => setViewStaff(null)} />}
    </div>
  )
}

