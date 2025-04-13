"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { UserIcon, Building2, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetStaffQuery, useLazyGetStaffByIdQuery, useDeleteStaffMutation } from "@/features/clinic/api"
import { useTranslations } from "next-intl"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"
import { useDebounce } from "@/hooks/use-debounce"

import Pagination from "@/components/common/Pagination/Pagination"
import StaffForm from "@/components/clinicManager/staff/StaffForm"
import EditStaffForm from "@/components/clinicManager/staff/EditStaffForm"
import ViewStaffModal from "@/components/clinicManager/staff/view-staff-modal"

import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { MoreVertical } from "lucide-react"
import { MenuPortal } from "@/components/ui/menu-portal"

// Add the import for getAccessToken and GetDataByToken
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { Branch, Staff } from "@/features/clinic/types"
import ConfirmationDialog from "@/components/ui/confirmation-dialog"

interface BranchViewModalProps {
  branches: Array<{ id: string; name: string; fullAddress?: string }>
  onClose: () => void
}

const BranchViewModal = ({ branches, onClose }: BranchViewModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          All Branches
        </h3>

        <div className="max-h-60 overflow-y-auto">
          {branches.map((branch, index) => (
            <div key={branch.id} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-purple-500 dark:text-purple-400 mr-2" />
                  <span className="font-medium dark:text-white">{branch.name}</span>
                </div>
                {branch.fullAddress && (
                  <div className="mt-1 ml-6 text-xs text-gray-500 dark:text-gray-400">{branch.fullAddress}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null)
  const [viewStaff, setViewStaff] = useState<Staff | null>(null)
  const [editStaff, setEditStaff] = useState<Staff | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [viewingBranches, setViewingBranches] = useState<Array<{
    id: string
    name: string
    fullAddress?: string
  }> | null>(null)

  // State to track which branch is being hovered
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null)
  // Ref to store tooltip position
  const tooltipPositionRef = useRef<{ x: number; y: number; targetElement?: HTMLElement } | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500) // 500ms delay

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5

  const { data, refetch } = useGetStaffQuery({
    clinicId,
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
    role: 2, // Add role parameter with value 2 for Staff
  })

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch)

  const [fetchStaffById] = useLazyGetStaffByIdQuery()
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation()

  // Update to match the actual response structure
  const staffList: Staff[] = data?.value?.items || []

  // Get pagination info from the response
  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = !!data?.value?.hasNextPage
  const hasPreviousPage = !!data?.value?.hasPreviousPage

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  // Reset page index when search term changes
  useEffect(() => {
    setPageIndex(1)
  }, [debouncedSearchTerm])

  const handleCloseMenu = () => {
    setMenuOpen(null)
  }

  const handleViewAllBranches = (branches: Branch[]) => {
    // Map the branches to match the expected type
    const mappedBranches = branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      fullAddress: branch.fullAddress || undefined, // Convert null to undefined
    }))

    setViewingBranches(mappedBranches)
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

    if (action === "delete") {
      setStaffToDelete(staffId)
      setConfirmDialogOpen(true)
    }

    setMenuOpen(null)
  }

  // Update the handleDeleteStaff function to use the correct API structure
  const handleDeleteStaff = async (staffId: string) => {
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
      delayedRefetch()
    } catch (error) {
      console.error(error)
      toast.error("Xóa nhân viên thất bại!")
    }
  }

  // Handle mouse enter on branch with position capture
  const handleBranchMouseEnter = (branchId: string, e: React.MouseEvent) => {
    // Store the target element for tooltip positioning
    tooltipPositionRef.current = {
      x: e.clientX,
      y: e.clientY,
      targetElement: e.currentTarget as HTMLElement,
    }
    setHoveredBranchId(branchId)
  }

  return (
    <div className="p-6 dark:bg-gray-900" onClick={handleCloseMenu}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          {t("staffList") || "Staff List"}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={`${t("searchByName") || "Search by name"}...`}
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
            <span className="font-medium tracking-wide">{t("addNewStaff") || "Add New Staff"}</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-900/20 rounded-lg relative">
        {staffList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-left">
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tl-lg dark:text-gray-200">
                    {t("no") || "No."}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200">
                    {t("fullName") || "Full Name"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200">
                    {t("email") || "Email"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200">
                    {t("phoneNumber") || "Phone Number"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200">
                    {t("role") || "Role"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-200">
                    {t("branches") || "Branches"}
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tr-lg dark:text-gray-200">
                    {t("action") || "Action"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff: Staff, index: number) => (
                  <tr
                    key={staff.employeeId}
                    className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-300">
                      {(pageIndex - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium dark:text-gray-200">
                      <div className="max-w-[150px] truncate" title={staff.fullName}>
                        {staff.fullName}
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <div className="max-w-[180px] truncate" title={staff.email}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 font-medium">
                          {staff.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 dark:text-gray-300">
                      <div className="max-w-[120px] truncate" title={staff.phoneNumber || "-"}>
                        {staff.phoneNumber || "-"}
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700">
                      {staff.branchs && staff.branchs.length > 0 ? (
                        <div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {staff.branchs.slice(0, 2).map((branch, idx) => (
                              <div key={idx} className="relative">
                                <span
                                  className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors max-w-[100px] inline-block truncate align-bottom"
                                  onMouseEnter={(e) => handleBranchMouseEnter(branch.id, e)}
                                  onMouseLeave={() => setHoveredBranchId(null)}
                                >
                                  {branch.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          {staff.branchs.length > 2 && (
                            <button
                              onClick={() => handleViewAllBranches(staff.branchs || [])}
                              className="text-xs text-purple-600 dark:text-purple-400 flex items-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                            >
                              View all ({staff.branchs.length})
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">No branches</span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-200 dark:border-gray-700 relative">
                      <button
                        className="p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.nativeEvent.stopImmediatePropagation()
                          // Lưu vị trí của button
                          setTriggerRect(e.currentTarget.getBoundingClientRect())
                          setMenuOpen(menuOpen === staff.employeeId ? null : staff.employeeId)
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>

                      <AnimatePresence>
                        {menuOpen === staff.employeeId && (
                          <MenuPortal
                            isOpen={menuOpen === staff.employeeId}
                            onClose={() => setMenuOpen(null)}
                            triggerRect={triggerRect}
                          >
                            <li
                              className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("view", staff.employeeId)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>
                              </span>
                              {t("viewStaffDetail") || "View Staff Detail"}
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("edit", staff.employeeId)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                              </span>
                              {t("editStaff") || "Edit Staff"}
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 cursor-pointer flex items-center gap-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMenuAction("delete", staff.employeeId)
                              }}
                            >
                              <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-300"></span>
                              </span>
                              {t("deleteStaff")}
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
              <UserIcon className="w-8 h-8 text-purple-300 dark:text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">{t("noStaffAvailable") || "No Staff available."}</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
            >
              {t("addYourFirstStaff") || "Add your first staff member"}
            </button>
          </div>
        )}
      </div>

      {/* Tooltip for branch addresses - positioned below each branch with arrow */}
      {hoveredBranchId &&
        staffList.some((staff) =>
          staff.branchs?.some((branch) => branch.id === hoveredBranchId && branch.fullAddress),
        ) && (
          <div
            className="fixed z-[9999] p-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded shadow-lg"
            style={{
              top: (tooltipPositionRef.current?.targetElement?.getBoundingClientRect().bottom || 0) + 5 + "px",
              left: (tooltipPositionRef.current?.targetElement?.getBoundingClientRect().left || 0) + "px",
              maxWidth: "250px",
              pointerEvents: "none", // Prevents the tooltip from interfering with mouse events
            }}
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-800 dark:border-b-gray-700" />

            {/* Only show the address */}
            {
              staffList.flatMap((staff) => staff.branchs || []).find((branch) => branch.id === hoveredBranchId)
                ?.fullAddress
            }
          </div>
        )}

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
              delayedRefetch()
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
              delayedRefetch()
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

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          if (staffToDelete) {
            handleDeleteStaff(staffToDelete)
            setConfirmDialogOpen(false)
          }
        }}
        title={t("confirmDelete")}
        message={
          t("deleteStaffConfirmation") || "Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác."
        }
        confirmButtonText={t("deleteStaff")}
        cancelButtonText={t("cancel")}
        isLoading={isDeleting}
        type="delete"
      />
    </div>
  )
}
