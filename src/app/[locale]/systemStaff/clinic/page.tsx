"use client";
import React, { useState } from "react";
import {
  useGetClinicsQuery,
  useLazyGetClinicByIdQuery,
  useUpdateClinicMutation,
} from "@/features/clinic/api";
import * as XLSX from "xlsx";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/components/systemStaff/Modal";
import EditClinicForm from "@/components/systemStaff/EditClinicForm";
import Pagination from "@/components/common/Pagination/Pagination";

const ClinicsList: React.FC = () => {
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
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Clinics List</h1>

      {/* 🔥 Export Excel */}
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={exportToExcel}
      >
        📥 Export Excel
      </button>
      <input
        type="text"
        placeholder="Search By Package Name"
        className="border px-4 py-2 rounded-md w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      <table className="table-auto w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Full Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Total Branches</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic: any) => (
            <tr key={clinic.id} className="border-t">
              <td className="p-3">{clinic.name}</td>
              <td className="p-3">{clinic.email}</td>
              <td className="p-3">{clinic.address}</td>
              <td className="p-3">{clinic.totalBranches}</td>
              <td className="p-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={clinic.isActivated}
                    className="toggle-checkbox"
                    onChange={() => handleToggleStatus(clinic.id)}
                  />
                  <span>{clinic.isActivated ? "Active" : "Inactive"}</span>
                </label>
              </td>

              <td className="p-3 border relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleMenu(clinic.id);
                  }}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                    {menuOpen === clinic.id && (
                      <ul className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md text-sm py-2 z-50">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>  handleMenuAction("view", clinic.id)}
                        >
                          Xem thông tin gói
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleMenuAction("edit", clinic.id)}>
                          Chỉnh sửa thông tin gói
                        </li>
                        <li className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                        onClick={()=> handleDeleteClinic(clinic.id)}>
                          Xóa gói</li>
                      </ul>
                    )}
                  </td>

              
            </tr>
          ))}
        </tbody>
      </table>

       {/* 🔥 PHÂN TRANG */}
      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setPageIndex}
      />


      {/* 🔥 FORM CHỈNH SỬA */}

{viewClinic  && (
  <Modal onClose={() => setViewClinic(null)}>
    <h2 className="text-xl font-bold mb-4">Thông tin gói</h2>
    <p><strong>Tên gói:</strong> {viewClinic .name}</p>
    <p><strong>Mô tả:</strong> {viewClinic .description}</p>
    <p><strong>Giá:</strong> {new Intl.NumberFormat("vi-VN").format(Number(viewClinic?.price || 0))} đ</p>
    <p><strong>Thời gian:</strong> {viewClinic .duration} tháng</p>
    <p>
      <strong>Trạng thái:</strong>{" "}
      <span className={viewClinic .isActivated ? "text-green-600" : "text-red-600"}>
        {viewClinic .isActivated ? "Active" : "Inactive"}
      </span>
    </p>
  </Modal>
  )}

  {showEditForm && editClinic && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <EditClinicForm
              initialData={editClinic}
              onClose={handleCloseEditForm}
              onSaveSuccess={() => {
                handleCloseEditForm();
                refetch();
              }}
            />
          </div>
        )}

    </div>
  );
};

export default ClinicsList;
