"use client"

import React from "react"
import { useState } from "react"
import { MoreVertical, ChevronDown, ChevronUp, UserIcon, Edit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useGetBranchesQuery,
  useLazyGetBranchByIdQuery,
  useChangeStatusBranchMutation,
  useGetStaffQuery,
  useLazyGetStaffByIdQuery,
} from "@/features/clinic/api"
import { useTranslations } from "next-intl"
import * as XLSX from "xlsx"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import BranchForm from "@/components/clinicManager/BranchForm"
import EditBranchForm from "@/components/clinicManager/EditBranchForm"
import EditStaffForm from "@/components/clinicManager/staff/EditStaffForm"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { Branch, Staff } from "@/features/clinic/types"
import ViewBranchModal from "@/components/clinicManager/branch/view-branch-modal"
import Pagination from "@/components/common/Pagination/Pagination"
import { MenuPortal } from "@/components/ui/menu-portal"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch"

const BranchesList: React.FC = () => {
  const t = useTranslations("branch")

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5
  const [searchTerm, setSearchTerm] = useState("")
  const [viewBranch, setViewBranch] = useState<Branch | null>(null)
  const [editBranch, setEditBranch] = useState<Branch | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const token = getAccessToken()
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null
  const clinicId = tokenData?.clinicId || ""

  // Staff related states
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null)
  const [editStaff, setEditStaff] = useState<Staff | null>(null)
  const [showEditStaffForm, setShowEditStaffForm] = useState(false)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)

  const { data, isLoading, error, refetch } = useGetBranchesQuery(clinicId || "")
  const delayedRefetch = useDelayedRefetch(refetch)

  const [changeStatusBranch] = useChangeStatusBranchMutation()
  const [fetchBranchById] = useLazyGetBranchByIdQuery()
  const [fetchStaffById] = useLazyGetStaffByIdQuery()

  // Update the branches variable to correctly access the items array
  const branches = Array.isArray(data?.value?.branches?.items) ? data?.value?.branches?.items : []

  // Update the pagination variables to use the correct properties
  const totalCount = data?.value?.branches?.totalCount || 0
  const hasNextPage = data?.value?.branches?.hasNextPage
  const hasPreviousPage = data?.value?.branches?.hasPreviousPage
  // Function to fetch staff for a specific branch
  const { data: staffData } = useGetStaffQuery(
    {
      clinicId,
      pageIndex: 1,
      pageSize: 100, // Get all staff to filter by branch
      searchTerm: "",
      role: 2, // Staff role
    },
    {
      skip: !expandedBranch,
    },
  )

  const allStaff = staffData?.value?.items || []

  // Filter staff by branch
  const getStaffForBranch = (branchId: string) => {
    return allStaff.filter((staff) => staff.branchs && staff.branchs.some((branch) => branch.id === branchId))
  }

  const handleToggleMenu = (branchId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    // Store the position of the button
    setTriggerRect(e.currentTarget.getBoundingClientRect())
    setMenuOpen(menuOpen === branchId ? null : branchId)
  }

  const handleMenuAction = async (action: string, branchId: string) => {
    if (action === "view") {
      try {
        const result = await fetchBranchById(branchId).unwrap()
        setViewBranch(result.value)
      } catch (error) {
        toast.error(t("fetchBranchError"))
        setViewBranch(null)
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchBranchById(branchId).unwrap()
        setEditBranch(result.value)
        setShowEditForm(true)
      } catch (error) {
        toast.error(t("fetchBranchError"))
        setEditBranch(null)
      }
    }

    setMenuOpen(null)
  }

  const handleEditStaff = async (staffId: string) => {
    try {
      const result = await fetchStaffById({
        clinicId,
        staffId,
      }).unwrap()
      setEditStaff(result.value)
      setShowEditStaffForm(true)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch staff details")
      setEditStaff(null)
    }
    // setStaffMenuOpen(null)
  }

  const handleDeleteBranch = async (branchId: string) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        // await deleteBranch(branchId).unwrap();
        toast.success(t("deleteSuccess"))
        delayedRefetch()
      } catch (error) {
        console.error(error)
        toast.error(t("deleteFailed"))
      }
    }
  }

  const handleCloseForm = () => {
    setViewBranch(null)
    setShowEditForm(false)
    setEditBranch(null)
    setShowCreateForm(false)
    setShowEditStaffForm(false)
    setEditStaff(null)
  }

  const handleToggleStatus = async (id: string) => {
    const branch = branches.find((branch: Branch) => branch.id === id)
    if (!branch) return

    try {
      // Simply call the API with the branch ID - no body needed
      await changeStatusBranch({ id: branch.id }).unwrap()
      toast.success(t("statusUpdated"))
      delayedRefetch()
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error(t("statusUpdateFailed"))
    }
  }

  const handleToggleExpandBranch = (branchId: string) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(branches)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Branches")
    XLSX.writeFile(workbook, "Branches.xlsx")
  }

  if (isLoading) return <div className="text-center text-gray-600">{t("loading")}</div>
  if (error) return <div className="text-center text-red-600">{t("errorFetching")}</div>

  const filteredBranches =
    searchTerm && Array.isArray(branches)
      ? branches.filter(
          (branch: Branch) =>
            branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.address?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : branches

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50 shadow-xl rounded-xl">
      {/* Toast Container */}
      <ToastContainer />
      <h1 className="text-3xl font-serif font-semibold mb-6 text-gray-800 tracking-wide">{t("branchesList")}</h1>

      {/* Buttons and Search */}
      <div className="flex items-center justify-between mb-6">
        {/* Export Excel Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={exportToExcel}
        >
          <span className="flex items-center gap-2">
            📥 <span className="font-medium">{t("exportExcel")}</span>
          </span>
        </motion.button>

        {/* Search Input and Create Button */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t("searchByName")}
            className="w-full max-w-md px-5 py-3 bg-white/80 border border-gray-200 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="w-full flex justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
            >
              <span className="font-medium">{t("createNewBranch")}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-purple-100 to-pink-100 text-gray-700">
          <tr>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider border-b border-r border-gray-200 last:border-r-0">
              {t("branchName")}
            </th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider border-b border-r border-gray-200 last:border-r-0">
              {t("email")}
            </th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider border-b border-r border-gray-200 last:border-r-0">
              {t("address")}
            </th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider border-b border-r border-gray-200 last:border-r-0">
              {t("operatingLicenseExpiryDate")}
            </th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider border-b border-r border-gray-200 last:border-r-0">
              {t("status")}
            </th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider border-b border-r border-gray-200 last:border-r-0">
              {t("action")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredBranches.map((branch: Branch, index: number) => (
            <React.Fragment key={branch.id}>
              <motion.tr
                whileHover={{ backgroundColor: "rgba(250, 245, 255, 0.7)" }}
                className={`transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-purple-50"
                } border-b border-gray-200 last:border-b-0`}
              >
                <td className="p-4 text-gray-800 font-serif border-r border-gray-200 last:border-r-0">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleToggleExpandBranch(branch.id)}
                      className="mr-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      {expandedBranch === branch.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <div className="max-w-[180px] truncate" title={branch.name || ""}>
                      {branch.name}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600 border-r border-gray-200 last:border-r-0">
                  <div className="max-w-[180px] truncate" title={branch.email || ""}>
                    {branch.email}
                  </div>
                </td>
                <td className="p-4 text-gray-600 border-r border-gray-200 last:border-r-0">
                  <div className="max-w-[200px] truncate" title={branch.address || ""}>
                    {branch.address}
                  </div>
                </td>
                <td className="p-4 text-gray-600 border-r border-gray-200 last:border-r-0">
                  {branch.operatingLicenseExpiryDate
                    ? new Date(branch.operatingLicenseExpiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "N/A"}
                </td>
                <td className="p-4 border-r border-gray-200 last:border-r-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={branch.isActivated}
                      onChange={() => handleToggleStatus(branch.id)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className={`text-sm font-medium ${branch.isActivated ? "text-green-600" : "text-red-600"}`}>
                      {branch.isActivated ? t("active") : t("inactive")}
                    </span>
                  </div>
                </td>
                <td className="p-4 relative border-r border-gray-200 last:border-r-0">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      onClick={(e) => handleToggleMenu(branch.id, e)}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </motion.button>

                    <AnimatePresence>
                      {menuOpen === branch.id && (
                        <MenuPortal
                          isOpen={menuOpen === branch.id}
                          onClose={() => setMenuOpen(null)}
                          triggerRect={triggerRect}
                        >
                          <li
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMenuAction("view", branch.id)
                            }}
                          >
                            <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            </span>
                            {t("viewBranchDetail")}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMenuAction("edit", branch.id)
                            }}
                          >
                            <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            </span>
                            {t("editBranch")}
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteBranch(branch.id)
                            }}
                          >
                            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            </span>
                            {t("deleteBranch")}
                          </li>
                        </MenuPortal>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>

              {/* Staff List for the Branch */}
              {expandedBranch === branch.id && (
                <tr>
                  <td colSpan={6} className="p-0">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-t border-b border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="w-1 h-6 bg-purple-500 rounded-full mr-2"></div>
                        <h3 className="text-lg font-medium text-purple-700">Staff in {branch.name}</h3>
                      </div>

                      {getStaffForBranch(branch.id).length > 0 ? (
                        <div className="border border-purple-200 rounded-lg overflow-hidden shadow-sm">
                          <table className="w-full border-collapse border border-purple-200 rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                              <tr>
                                <th className="p-3 text-left text-sm font-medium text-purple-800 border-b border-purple-200">
                                  Name
                                </th>
                                <th className="p-3 text-left text-sm font-medium text-purple-800 border-b border-purple-200">
                                  Email
                                </th>
                                <th className="p-3 text-left text-sm font-medium text-purple-800 border-b border-purple-200">
                                  Phone
                                </th>
                                <th className="p-3 text-left text-sm font-medium text-purple-800 border-b border-purple-200">
                                  Role
                                </th>
                                <th className="p-3 text-left text-sm font-medium text-purple-800 border-b border-purple-200">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {getStaffForBranch(branch.id).map((staff: Staff, index: number) => (
                                <tr
                                  key={staff.employeeId}
                                  className={`hover:bg-purple-100 transition-colors ${
                                    index % 2 === 0 ? "bg-white" : "bg-purple-50"
                                  } ${
                                    index !== getStaffForBranch(branch.id).length - 1
                                      ? "border-b border-purple-100"
                                      : ""
                                  }`}
                                >
                                  <td className="p-3 font-medium">
                                    <div className="max-w-[150px] truncate" title={staff.fullName || ""}>
                                      {staff.fullName}
                                    </div>
                                  </td>
                                  <td className="p-3 text-purple-600">
                                    <div className="max-w-[180px] truncate" title={staff.email || ""}>
                                      {staff.email}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="max-w-[120px] truncate" title={staff.phoneNumber || "-"}>
                                      {staff.phoneNumber || "-"}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                                      {staff.role}
                                    </span>
                                  </td>
                                  <td className="p-3 relative">
                                    {/* Replace the staff actions column with a direct edit button: */}
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      className="p-1 rounded-full hover:bg-purple-100 transition-colors flex items-center gap-1 text-purple-600"
                                      onClick={() => handleEditStaff(staff.employeeId)}
                                    >
                                      <Edit className="w-4 h-4" />
                                      <span className="text-xs">Edit</span>
                                    </motion.button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-6 text-center bg-white rounded-lg border border-purple-200 shadow-sm">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-50 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-purple-300" />
                          </div>
                          <p className="text-gray-500">No staff assigned to this branch</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}

      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        hasNextPage={!!hasNextPage}
        hasPreviousPage={!!hasPreviousPage}
        onPageChange={setPageIndex}
      />

      {/* View Branch Modal */}
      {viewBranch && <ViewBranchModal viewBranch={viewBranch} onClose={() => setViewBranch(null)} />}

      {/* Edit Branch Form */}
      {showEditForm && editBranch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseForm}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <EditBranchForm
              initialData={editBranch}
              onClose={handleCloseForm}
              onSaveSuccess={() => {
                toast.success(t("branchUpdatedSuccess") || "Branch updated successfully!")
                handleCloseForm()
                delayedRefetch()
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Create Branch Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseForm}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <BranchForm
              onClose={handleCloseForm}
              onSaveSuccess={() => {
                handleCloseForm()
                delayedRefetch()
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Edit Staff Form */}
      {showEditStaffForm && editStaff && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseForm}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <EditStaffForm
              initialData={editStaff}
              onClose={handleCloseForm}
              onSaveSuccess={() => {
                handleCloseForm()
                delayedRefetch()
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default BranchesList

