"use client"

import type React from "react"
import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetBranchesQuery, useLazyGetBranchByIdQuery, useChangeStatusBranchMutation } from "@/features/clinic/api"
import { useTranslations } from "next-intl"
import * as XLSX from "xlsx"
import { toast } from "react-toastify"
import BranchForm from "@/components/clinicManager/BranchForm"
import EditBranchForm from "@/components/clinicManager/EditBranchForm"
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils"
import type { Branch } from "@/features/clinic/types"
import ViewBranchModal from "@/components/clinicManager/branch/view-branch-modal"

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
  const token = getAccessToken() as string
  const { clinicId } = GetDataByToken(token) as TokenData

  const { data, isLoading, error, refetch } = useGetBranchesQuery(clinicId || "")

  const [changeStatusBranch] = useChangeStatusBranchMutation()
  const [fetchBranchById] = useLazyGetBranchByIdQuery()

  const branches = data?.value?.branches || []
  const totalCount = branches.length || 0
  // const hasNextPage = false
  // const hasPreviousPage = false

  const handleToggleMenu = (branchId: string) => {
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

  const handleDeleteBranch = async (branchId: string) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        // await deleteBranch(branchId).unwrap();
        toast.success(t("deleteSuccess"))
        refetch()
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
  }

  const handleToggleStatus = async (id: string) => {
    const branch = branches.find((branch: Branch) => branch.id === id)
    if (!branch) return

    try {
      // Simply call the API with the branch ID - no body needed
      await changeStatusBranch({ id: branch.id }).unwrap()
      toast.success(t("statusUpdated"))
      refetch()
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error(t("statusUpdateFailed"))
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(branches)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Branches")
    XLSX.writeFile(workbook, "Branches.xlsx")
  }

  if (isLoading) return <div className="text-center text-gray-600">{t("loading")}</div>
  if (error) return <div className="text-center text-red-600">{t("errorFetching")}</div>

  const filteredBranches = searchTerm
    ? branches.filter(
        (branch: Branch) =>
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : branches

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50 shadow-xl rounded-xl">
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
      <table className="table-auto w-full border-collapse">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
          <tr>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("branchName")}</th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("email")}</th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("address")}</th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">
              {t("operatingLicenseExpiryDate")}
            </th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("status")}</th>
            <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("action")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredBranches.map((branch: Branch) => (
            <motion.tr
              key={branch.id}
              whileHover={{ backgroundColor: "rgba(250, 245, 255, 0.5)" }}
              className="transition-colors duration-200"
            >
              <td className="p-4 text-gray-800 font-serif">{branch.name}</td>
              <td className="p-4 text-gray-600">{branch.email}</td>
              <td className="p-4 text-gray-600">{branch.address}</td>
              <td className="p-4 text-gray-600">
                {branch.operatingLicenseExpiryDate
                  ? new Date(branch.operatingLicenseExpiryDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "N/A"}
              </td>
              <td className="p-4">
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
              <td className="p-4 relative">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleMenu(branch.id)
                    }}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </motion.button>

                  <AnimatePresence>
                    {menuOpen === branch.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg text-sm py-2 z-[100]"
                        style={{ top: "100%" }}
                      >
                        <button
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150"
                          onClick={() => handleMenuAction("view", branch.id)}
                        >
                          {t("viewBranchDetail")}
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150"
                          onClick={() => handleMenuAction("edit", branch.id)}
                        >
                          {t("editBranch")}
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                          onClick={() => handleDeleteBranch(branch.id)}
                        >
                          {t("deleteBranch")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {/* 
<Pagination
  pageIndex={pageIndex}
  pageSize={pageSize}
  totalCount={totalCount}
  hasNextPage={hasNextPage}
  hasPreviousPage={hasPreviousPage}
  onPageChange={setPageIndex}
/> 
*/}

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
                handleCloseForm()
                refetch()
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
                refetch()
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default BranchesList

