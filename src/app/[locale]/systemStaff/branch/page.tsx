"use client";
import type React from "react";
import { useState } from "react";
import {
  XCircle,
  Search,
  Download,
  MoreVertical,
  Loader2,
  Eye,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetClinicsQuery,
  useLazyGetClinicByIdQuery,
  useUpdateClinicMutation,
  useChangeStatusBranchMutation,
} from "@/features/clinic/api";
import { useTranslations } from "next-intl";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditClinicForm from "@/components/systemStaff/EditClinicForm";
import Pagination from "@/components/common/Pagination/Pagination";
import type { Clinic } from "@/features/clinic/types";
import { MenuPortal } from "@/components/ui/menu-portal";
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch";
import { useTheme } from "next-themes";
import ClinicDetailModal from "@/components/systemStaff/ClinicDetailModal";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";

const ClinicsList: React.FC = () => {
  const { theme } = useTheme();
  const t = useTranslations("clinic");
  // Use your existing functions to get token data
  const token = getAccessToken();
  console.log("token: ", token);
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  console.log("dataa: ", tokenData);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [viewClinic, setViewClinic] = useState<any | null>(null);
  const [editClinic, setEditClinic] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const { data, isLoading, error, refetch } = useGetClinicsQuery({
    pageIndex,
    pageSize,
    searchTerm,
  });

  // Use the delayed refetch hook
  const delayedRefetch = useDelayedRefetch(refetch);

  const [updateClinic] = useUpdateClinicMutation();

  const clinics = data?.value.items || [];
  const totalCount = data?.value.totalCount || 0;
  const hasNextPage = data?.value.hasNextPage || false;
  const hasPreviousPage = data?.value.hasPreviousPage || false;

  const [fetchClinicById] = useLazyGetClinicByIdQuery();

  const handleCloseMenu = () => {
    setMenuOpen(null);
  };

  const handleToggleMenu = (clinicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    // Store the position of the button
    setTriggerRect(e.currentTarget.getBoundingClientRect());
    setMenuOpen(menuOpen === clinicId ? null : clinicId);
  };

  const handleMenuAction = async (action: string, clinicId: string) => {
    if (action === "view") {
      try {
        const result = await fetchClinicById(clinicId).unwrap();
        setViewClinic(result.value);
      } catch (error) {
        toast.error("Không thể lấy thông tin phòng khám!" + error);
        setViewClinic(null);
      }
    }

    if (action === "edit") {
      try {
        const result = await fetchClinicById(clinicId).unwrap();
        setEditClinic(result.value);
      } catch (error) {
        toast.error("Không thể lấy thông tin phòng khám!" + error);
        setEditClinic(null);
      }
      setShowEditForm(true);
    }

    setMenuOpen(null);
  };

  const handleCloseEditForm = () => {
    setViewClinic(null);
    setShowEditForm(false);
    setEditClinic(null);
  };

  const handleSaveSuccess = () => {
    // Thêm hàm này để xử lý khi lưu thành công
    delayedRefetch(); // Use delayed refetch instead of immediate refetch
    handleCloseEditForm();
  };

  const [changeStatusBranch] = useChangeStatusBranchMutation();

  const handleToggleStatus = async (id: string) => {
    const clinic = clinics.find((clinic) => clinic.id === id);
    if (!clinic) return;

    try {
      await changeStatusBranch({ id }).unwrap();
      toast.success("Trạng thái phòng khám đã được cập nhật!");
      delayedRefetch(); // Use delayed refetch instead of immediate refetch
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clinics);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clinics");
    XLSX.writeFile(workbook, "Clinics.xlsx");
  };

  return (
    <div
      className="container mx-auto p-8 bg-gradient-to-br from-white via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 shadow-xl rounded-2xl border border-indigo-100/50 dark:border-indigo-900/50"
      onClick={handleCloseMenu}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-indigo-950 dark:text-indigo-100 tracking-tight">
            {t("clinicsList")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {totalCount} {totalCount === 1 ? "clinic" : "clinics"} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder={t("searchByName")}
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-300 dark:focus:border-indigo-600 transition-all duration-200 dark:text-gray-100"
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
            <Loader2 className="h-10 w-10 text-indigo-500 dark:text-indigo-400 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Loading clinics...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center text-red-500 dark:text-red-400">
            <XCircle className="h-10 w-10 mb-4" />
            <p className="text-lg font-medium">Error fetching data</p>
            <button
              onClick={() => delayedRefetch()} // Use delayed refetch instead of immediate refetch
              className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Table Section */}
      {!isLoading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 text-slate-700 dark:text-slate-300">
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t("fullName")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t("email")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t("address")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t("totalBranches")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t("status")}
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-sm uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {clinics.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                    >
                      No clinics found
                    </td>
                  </tr>
                ) : (
                  clinics.map((clinic: Clinic) => (
                    <motion.tr
                      key={clinic.id}
                      whileHover={{
                        backgroundColor:
                          theme === "dark"
                            ? "rgba(30, 41, 59, 0.5)"
                            : "rgba(238, 242, 255, 0.5)",
                      }}
                      className="transition-colors duration-200 h-16 dark:text-gray-100"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {clinic.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {clinic.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {clinic.fullAddress || clinic.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
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
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 dark:peer-checked:bg-indigo-600"></div>
                          </label>
                          <span
                            className={`text-sm font-medium ${
                              clinic.isActivated
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {clinic.isActivated ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                          onClick={(e) => handleToggleMenu(clinic.id, e)}
                        >
                          <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </motion.button>

                        <AnimatePresence>
                          {menuOpen === clinic.id && (
                            <MenuPortal
                              isOpen={menuOpen === clinic.id}
                              onClose={() => setMenuOpen(null)}
                              triggerRect={triggerRect}
                            >
                              <li
                                className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuAction("view", clinic.id);
                                }}
                              >
                                <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                {t("viewClinicDetail")}
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer flex items-center gap-2 transition-colors dark:text-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuAction("edit", clinic.id);
                                }}
                              >
                                <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                {t("editClinic")}
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

      {/* Clinic Detail Modal */}
      <ClinicDetailModal
        clinic={viewClinic}
        onClose={() => setViewClinic(null)}
      />

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
            <EditClinicForm
              initialData={editClinic}
              onClose={handleCloseEditForm}
              onSaveSuccess={handleSaveSuccess}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ClinicsList;
