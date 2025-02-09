"use client";
import React, { useState } from "react";
import {
  useGetClinicsQuery,
  useUpdateClinicMutation,
  useGetClinicByIdQuery,
} from "@/features/clinic/api";
import { Clinic } from "@/features/clinic/types";
import * as XLSX from "xlsx";

const ClinicsList: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, refetch } = useGetClinicsQuery({ 
                                                                pageIndex,
                                                                 pageSize,
                                                                searchTerm });
  const clinics = data?.value.items || [];
  const totalCount = data?.value.totalCount || 0;
  const hasNextPage = data?.value.hasNextPage || false;
  const hasPreviousPage = data?.value.hasPreviousPage || false;

  const [formData, setFormData] = useState<Partial<Clinic> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  


  const [updateClinic, { isLoading: isUpdating }] = useUpdateClinicMutation();

  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const { data: clinicDataDetail, isLoading: isLoadingClinic } = useGetClinicByIdQuery(
    selectedClinicId ?? "", 
    { skip: !selectedClinicId } 
  );
  
  const clinicDetail = clinicDataDetail?.value; // Lấy đúng dữ liệu

  const handleEditClinic = (id: string) => {
    setSelectedClinicId(id); // Chỉ cập nhật ID, không set formData ngay
  };
  
  // Khi clinicDataDetail có dữ liệu, cập nhật formData
  React.useEffect(() => {
    if (clinicDataDetail?.value) {
      setFormData(clinicDataDetail.value);
    }
  }, [clinicDataDetail]);

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
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedClinicId || !formData) return;
  
    const updatedFormData = new FormData();
    updatedFormData.append("clinicId", formData.id || "");
    updatedFormData.append("name", formData.name || "");
    updatedFormData.append("email", formData.email || "");
    updatedFormData.append("phoneNumber", formData.phoneNumber || "");
    updatedFormData.append("address", formData.address || "");
  
    if (selectedFile) {
      updatedFormData.append("profilePicture", selectedFile);
    }
  
    try {
      await updateClinic({ clinicId: selectedClinicId, data: updatedFormData }).unwrap();
      alert("Clinic updated successfully!");
      setSelectedClinicId(null); // Ẩn modal sau khi update
      refetch();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update clinic.");
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
          {clinics.map((clinic) => (
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
              <td className="p-3 flex space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEditClinic(clinic.id)}
                >
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 PHÂN TRANG */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
          disabled={!hasPreviousPage}
        >
          ← Previous
        </button>

        <span className="text-lg">
          Page {pageIndex} / {Math.ceil(totalCount / pageSize)}
        </span>

        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPageIndex((prev) => prev + 1)}
          disabled={!hasNextPage}
        >
          Next →
        </button>
      </div>

      {/* 🔥 FORM CHỈNH SỬA */}
      {selectedClinicId && (
  <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
      {isLoadingClinic ? (
        <p>Loading clinic details...</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Edit Clinic</h2>
          <div className="space-y-4">
            {/* Name */}
            <input 
              type="text" 
              name="name" 
              value={formData?.name || ""} 
              onChange={handleFormChange} 
              className="w-full border px-4 py-2 rounded-md" 
              placeholder="Clinic Name"
            />

            {/* Email */}
            <input 
              type="email" 
              name="email" 
              value={formData?.email || ""} 
              onChange={handleFormChange} 
              className="w-full border px-4 py-2 rounded-md" 
              placeholder="Email"
              readOnly
            />

            {/* Phone Number */}
            <input 
              type="text" 
              name="phoneNumber" 
              value={formData?.phoneNumber || ""} 
              onChange={handleFormChange} 
              className="w-full border px-4 py-2 rounded-md" 
              placeholder="Phone Number"
            />

            {/* Address */}
            <input 
              type="text" 
              name="address" 
              value={formData?.address || ""} 
              onChange={handleFormChange} 
              className="w-full border px-4 py-2 rounded-md" 
              placeholder="Address"
            />

            {/* Upload Profile Picture */}
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="w-full border px-4 py-2 rounded-md"
            />

            {/* Hiển thị ảnh hiện tại nếu có */}
            {formData?.profilePictureUrl && (
              <img 
                src={formData.profilePictureUrl} 
                alt="Profile" 
                className="w-24 h-24 object-cover rounded-md"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4 space-x-2">
            <button 
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={() => setSelectedClinicId(null)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleSaveChanges}
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ClinicsList;
