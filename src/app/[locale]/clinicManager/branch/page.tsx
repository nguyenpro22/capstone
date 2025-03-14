"use client";
import React, { useState } from "react";
import {
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  Package,
  FileText,
  Layers,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetBranchesQuery,
  useLazyGetBranchByIdQuery,
  useUpdateBranchMutation,
} from "@/features/clinic/api";
import { useTranslations } from "next-intl";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import Modal from "@/components/systemStaff/Modal";
import BranchForm from "@/components/clinicManager/BranchForm"; // Import the new BranchForm
import EditBranchForm from "@/components/clinicManager/EditBranchForm";
import Pagination from "@/components/common/Pagination/Pagination";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";
import { Branch } from "@/features/clinic/types";

const BranchesList: React.FC = () => {
  const t = useTranslations("branch");

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [viewBranch, setViewBranch] = useState<any | null>(null);
  const [editBranch, setEditBranch] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false); // State for create form
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;

  const { data, isLoading, error, refetch } = useGetBranchesQuery({
    pageIndex,
    pageSize,
    searchTerm,
  });
  const [updateBranch] = useUpdateBranchMutation();
  const [fetchBranchById] = useLazyGetBranchByIdQuery();
  
  const branches = data?.value.items || [];
  const totalCount = data?.value.totalCount || 0;
  const hasNextPage = data?.value.hasNextPage || false;
  const hasPreviousPage = data?.value.hasPreviousPage || false;

  const handleToggleMenu = (branchId: string) => {
    setMenuOpen(menuOpen === branchId ? null : branchId);
  };

  const handleMenuAction = async (action: string, branchId: string) => {
    if (action === "view") {
      try {
        const result = await fetchBranchById(branchId).unwrap();
        setViewBranch(result.value);
      } catch (error) {
        toast.error(t("fetchBranchError") + error);
        setViewBranch(null);
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchBranchById(branchId).unwrap();
        setEditBranch(result.value);
        setShowEditForm(true);
      } catch (error) {
        toast.error(t("fetchBranchError") + error);
        setEditBranch(null);
      }
    }

    setMenuOpen(null);
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        // await deleteBranch(branchId).unwrap(); // Uncomment if you have a delete API
        toast.success(t("deleteSuccess") + branchId);
        refetch();
      } catch (error) {
        console.error(error);
        toast.error(t("deleteFailed"));
      }
    }
  };

  const handleCloseForm = () => {
    setViewBranch(null);
    setShowEditForm(false);
    setEditBranch(null);
    setShowCreateForm(false); // Close create form as well
  };

  const handleToggleStatus = async (id: string) => {
    const branch = branches.find((branch: Branch) => branch.id === id);
    if (!branch) return;

    try {
      const updatedFormData = new FormData();
      updatedFormData.append("branchId", branch.id || "");
      updatedFormData.append("isActivated", (!branch.isActivated).toString());

      await updateBranch({ data: updatedFormData }).unwrap();
      toast.success(t("statusUpdated"));
      refetch();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error(t("statusUpdateFailed"));
    }
  };
  

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(branches);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Branches");
    XLSX.writeFile(workbook, "Branches.xlsx");
  };

  if (isLoading) return <div className="text-center text-gray-600">{t("loading")}</div>;
  if (error) return <div className="text-center text-red-600">{t("errorFetching")}</div>;

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50 shadow-xl rounded-xl">
      <h1 className="text-3xl font-serif font-semibold mb-6 text-gray-800 tracking-wide">
        {t("branchesList")}
      </h1>

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
            placeholder={t("searchByBranchName")}
            className="w-full max-w-md px-5 py-3 bg-white/80 border border-gray-200 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="font-medium">{t("createNewBranch")}</span>
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg shadow-2xl bg-white/95 backdrop-blur-sm">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
            <tr>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">
                {t("fullName")}
              </th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">
                {t("email")}
              </th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">
                {t("address")}
              </th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">
                {t("operatingLicenseExpiryDate")}
              </th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">
                {t("action")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {branches.map((branch: Branch) => (
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
              <td className="p-3 border">
                    <input
                      type="checkbox"
                      checked={branch.isActivated}
                      className="toggle-checkbox"
                      onChange={() => handleToggleStatus(branch.id)}
                    />
                  
                    <span className={branch.isActivated ? "text-green-600" : "text-red-600"}>
                      {branch.isActivated ? "Active" : "Inactive"}
                    </span>
                  </td>
                <td className="p-4 relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMenu(branch.id);
                    }}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </motion.button>

                  {menuOpen === branch.id && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-4 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg text-sm py-2 z-50"
                    >
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors duration-150"
                        onClick={() => handleMenuAction("view", branch.id)}
                      >
                        {t("viewBranchDetail")}
                      </li>
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors duration-150"
                        onClick={() => handleMenuAction("edit", branch.id)}
                      >
                        {t("editBranch")}
                      </li>
                      <li
                        className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                        onClick={() => handleDeleteBranch(branch.id)}
                      >
                        {t("deleteBranch")}
                      </li>
                    </motion.ul>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={setPageIndex}
        />
     

      {/* View Branch Modal */}
      {viewBranch && (
        <Modal onClose={() => setViewBranch(null)}>
          <div className="max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-xl font-serif tracking-wide text-gray-800">Chi Tiết Chi Nhánh</h2>
              <div className="w-16 h-1 mx-auto bg-gradient-to-r from-pink-200 to-purple-200 rounded-full" />
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Branch Name */}
                <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
                  <Layers className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Tên chi nhánh</div>
                    <div className="text-base font-medium text-gray-800">{viewBranch.name}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
                  <FileText className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="text-gray-700">{viewBranch.email}</div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
                  <CreditCard className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
                    <div className="text-gray-700">{viewBranch.phoneNumber}</div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Địa chỉ</div>
                    <div className="text-gray-700">{viewBranch.address}</div>
                  </div>
                </div>

                {/* Profile Picture */}
                {viewBranch.profilePictureUrl && (
                  <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
                    <FileText className="w-5 h-5 text-pink-400 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Ảnh đại diện</div>
                      <a
                        href={viewBranch.profilePictureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        Xem ảnh đại diện
                      </a>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
                  {viewBranch.isActivated ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mt-1" />
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        viewBranch.isActivated
                          ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700"
                          : "bg-gradient-to-r from-red-50 to-red-100 text-red-700"
                      }`}
                    >
                      {viewBranch.isActivated ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setViewBranch(null)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-purple-300 font-medium tracking-wide"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Branch Form */}
      {showEditForm && editBranch && (
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
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseForm}
          />

          {/* Modal Content */}
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
                handleCloseForm();
                refetch();
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
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseForm}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <BranchForm
              onClose={handleCloseForm}
              onSaveSuccess={() => {
                handleCloseForm();
                refetch();
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BranchesList;