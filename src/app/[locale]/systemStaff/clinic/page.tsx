"use client";
import React, { useState } from "react";
import { Clock, CreditCard, CheckCircle2, XCircle, Package, FileText, Layers } from "lucide-react"
import { motion } from 'framer-motion';
import {
  useGetClinicsQuery,
  useLazyGetClinicByIdQuery,
  useUpdateClinicMutation,
} from "@/features/clinic/api";
import { useTranslations } from 'next-intl';
import * as XLSX from "xlsx";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/systemStaff/Modal";
import EditClinicForm from "@/components/systemStaff/EditClinicForm";
import Pagination from "@/components/common/Pagination/Pagination";
import { Clinic } from "@/features/clinic/types";

const ClinicsList: React.FC = () => {
  const t = useTranslations('clinic'); // Sử dụng namespace "dashboard"
  
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [viewClinic, setViewClinic] = useState<any | null>(null); // Cho popup "Xem thông tin"
  const [editClinic, setEditClinic] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const { data, isLoading, error, refetch } = useGetClinicsQuery({
    pageIndex,
    pageSize,
    searchTerm,
  });
  const [updateClinic] = useUpdateClinicMutation();

  const clinics = data?.value.items || [];
  const totalCount = data?.value.totalCount || 0;
  const hasNextPage = data?.value.hasNextPage || false;
  const hasPreviousPage = data?.value.hasPreviousPage || false;

  // const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [fetchClinicById] = useLazyGetClinicByIdQuery();

  // const clinicDetail = clinicDataDetail?.value; // Lấy đúng dữ liệu

  const handleToggleMenu = (clinicId: string) => {
    setMenuOpen(menuOpen === clinicId ? null : clinicId);
  };

  const handleMenuAction = async (action: string, clinicId: string) => {
    if (action === "view") {
      try {
        const result = await fetchClinicById(clinicId).unwrap();
        setViewClinic(result.value); // Chỉ đặt giá trị cho View
      } catch (error) {
        toast.error("Không thể lấy thông tin phòng khám!" + error);
        setViewClinic(null);
      }
    }
  
    if (action === "edit") {
      try {
        const result = await fetchClinicById(clinicId).unwrap();
        setEditClinic(result.value); // Chỉ đặt giá trị cho Edit
      } catch (error) {
        toast.error("Không thể lấy thông tin phòng khám!"+ error);
        setEditClinic(null);
      }
      setShowEditForm(true); // Chỉ mở form, không mở popup
    }
  
    setMenuOpen(null);
  };
  
  const handleDeleteClinic = async (clinicId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        // await deleteClinic(clinicId).unwrap();
        toast.success("Gói đã được xóa thành công!"+ clinicId);
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Xóa gói thất bại!");
      }
    }
  };
  
  const handleCloseEditForm = () => {
    setViewClinic(null);
    setShowEditForm(false);
    setEditClinic(null);
    console.log("After Update - showEditForm:", showEditForm, "viewClinic:", viewClinic);

  };
  
  
  
  const handleToggleStatus = async (id: string) => {
    const clinic = clinics.find((clinic) => clinic.id === id);
    if (!clinic) return;
  
    try {
      const updatedFormData = new FormData();
      updatedFormData.append("clinicId", clinic.id || "");
      updatedFormData.append("isActivated", (!clinic.isActivated).toString());
  
      await updateClinic({ clinicId: id, data: updatedFormData }).unwrap();
      // alert("Clinic status updated successfully!");
      refetch(); // Refresh danh sách
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status!");
    }
  };
  
 
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clinics);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clinics");
    XLSX.writeFile(workbook, "Clinics.xlsx");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-white via-gray-50 to-pink-50 shadow-xl rounded-xl">
      <h1 className="text-3xl font-serif font-semibold mb-6 text-gray-800 tracking-wide">
        {t('clinicsList')}
      </h1>

      {/* Export Excel Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-6 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={exportToExcel}
      >
        <span className="flex items-center gap-2">
          📥 <span className="font-medium">{t('exportExcel')}</span>
        </span>
      </motion.button>
      {/* Search Input */}
      <input
        type="text"
        placeholder={t('searchByPackageName')}
        className="w-full max-w-md mb-6 px-5 py-3 bg-white/80 border border-gray-200 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
            <tr>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("fullName")}</th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("email")}</th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("address")}</th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("totalBranches")}</th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("status")}</th>
              <th className="p-4 text-left font-sans font-medium text-sm uppercase tracking-wider">{t("action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clinics.map((clinic: Clinic) => (
              <motion.tr
                key={clinic.id}
                whileHover={{ backgroundColor: "rgba(250, 245, 255, 0.5)" }}
                className="transition-colors duration-200"
              >
                <td className="p-4 text-gray-800 font-serif">{clinic.name}</td>
                <td className="p-4 text-gray-600">{clinic.email}</td>
                <td className="p-4 text-gray-600">{clinic.address}</td>
                <td className="p-4 text-gray-600">{clinic.totalBranches}</td>
                <td className="p-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={clinic.isActivated}
                      className="w-5 h-5 rounded-full border-gray-300 text-pink-500 focus:ring-pink-300 transition-colors duration-200"
                      onChange={() => handleToggleStatus(clinic.id)}
                    />
                    <span className={`font-medium ${clinic.isActivated ? "text-emerald-600" : "text-gray-500"}`}>
                      {clinic.isActivated ? "Active" : "Inactive"}
                    </span>
                  </label>
                </td>
                <td className="p-4 relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMenu(clinic.id);
                    }}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </motion.button>

                  {menuOpen === clinic.id && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-4 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg text-sm py-2 z-50"
                    >
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors duration-150"
                        onClick={() => handleMenuAction("view", clinic.id)}
                      >
                        {t("viewClinicDetail")}
                      </li>
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer transition-colors duration-150"
                        onClick={() => handleMenuAction("edit", clinic.id)}
                      >
                        {t("editClinic")}
                      </li>
                      <li
                        className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                        onClick={() => handleDeleteClinic(clinic.id)}
                      >
                        {t("deleteClinic")}
                      </li>
                    </motion.ul>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
     

      {/* Pagination */}
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


      {/* 🔥 FORM CHỈNH SỬA */}

      {viewClinic && (
  <Modal onClose={() => setViewClinic(null)}>
    <div className="max-w-2xl mx-auto p-6 bg-white/95 backdrop-blur rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-xl font-serif tracking-wide text-gray-800">Chi Tiết Phòng Khám</h2>
        <div className="w-16 h-1 mx-auto bg-gradient-to-r from-pink-200 to-purple-200 rounded-full" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Clinic Name */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <Layers className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Tên phòng khám</div>
              <div className="text-base font-medium text-gray-800">{viewClinic.name}</div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <FileText className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="text-gray-700">{viewClinic.email}</div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <CreditCard className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
              <div className="text-gray-700">{viewClinic.phoneNumber}</div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <Clock className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Địa chỉ</div>
              <div className="text-gray-700">{viewClinic.address}</div>
            </div>
          </div>

          {/* Tax Code */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <FileText className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Mã số thuế</div>
              <div className="text-gray-700">{viewClinic.taxCode}</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Business License */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <FileText className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Giấy phép kinh doanh</div>
              <a
                href={viewClinic.businessLicenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                Xem giấy phép
              </a>
            </div>
          </div>

          {/* Operating License */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <FileText className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Giấy phép hoạt động</div>
              <a
                href={viewClinic.operatingLicenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                Xem giấy phép
              </a>
            </div>
          </div>

          {/* Operating License Expiry Date */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <Clock className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Ngày hết hạn giấy phép</div>
              <div className="text-gray-700">
                {new Intl.DateTimeFormat("vi-VN").format(new Date(viewClinic.operatingLicenseExpiryDate))}
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          {viewClinic.profilePictureUrl && (
            <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
              <FileText className="w-5 h-5 text-pink-400 mt-1" />
              <div>
                <div className="text-xs text-gray-500 mb-1">Ảnh đại diện</div>
                <a
                  href={viewClinic.profilePictureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Xem ảnh đại diện
                </a>
              </div>
            </div>
          )}

          {/* Total Branches */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            <Layers className="w-5 h-5 text-pink-400 mt-1" />
            <div>
              <div className="text-xs text-gray-500 mb-1">Tổng số chi nhánh</div>
              <div className="text-gray-700">{viewClinic.totalBranches}</div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors duration-300">
            {viewClinic.isActivated ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 mt-1" />
            )}
            <div>
              <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  viewClinic.isActivated
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700"
                    : "bg-gradient-to-r from-red-50 to-red-100 text-red-700"
                }`}
              >
                {viewClinic.isActivated ? "Đang hoạt động" : "Ngừng hoạt động"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setViewClinic(null)}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-purple-300 font-medium tracking-wide"
        >
          Đóng
        </button>
      </div>
    </div>
  </Modal>
)}

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
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
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
              onSaveSuccess={() => {
                handleCloseEditForm()
                refetch()
              }}
            />
          </motion.div>
        </motion.div>
      )}

    </div>
  );
};

export default ClinicsList;
