"use client";

import { useState } from "react";
import {
  useGetPackagesQuery,
  useChangeStatusPackageMutation,
  useLazyGetPackagesByIdQuery,
  useDeletePackageMutation, 
} from "@/features/package/api";
import PackageForm from "@/components/systemAdmin/PackageForm";
import EditPackageForm from "@/components/systemAdmin/EditPackageForm";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoreVertical, X } from "lucide-react"; // Import icon ba chấm và icon đóng
import Modal from "@/components/systemAdmin/Modal"; // Component popup để hiển thị thông tin gói

export default function Voucher() {
  const [viewPackage, setViewPackage] = useState<any | null>(null); // Cho popup "Xem thông tin"
const [editPackage, setEditPackage] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  const { data, error, isLoading, refetch } = useGetPackagesQuery({ 
                                                                pageIndex, 
                                                                pageSize,
                                                                searchTerm });
console.log("API Response:", data);
  const [changeStatusPackage] = useChangeStatusPackageMutation();
  const [fetchPackageById, { data: packageDetail, isFetching }] = useLazyGetPackagesByIdQuery();
  const [deletePackage] = useDeletePackageMutation();

  const packages = data?.value?.items || [];
  console.log("Package Data:", packages); // Debug

  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage;
  const hasPreviousPage = data?.value?.hasPreviousPage;

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  // const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

  const handleToggleMenu = (packageId: string) => {
    setMenuOpen(menuOpen === packageId ? null : packageId);
  };

  const handleToggleStatus = async (packageId: string) => {
    try {
      await changeStatusPackage({packageId}).unwrap();
      console.log("Package Data:", packageId); // Debug
      toast.success("Trạng thái gói đã được cập nhật!");
      refetch();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleCloseMenu = () => {
    setMenuOpen(null);
  };

  const handleMenuAction = async (action: string, pkgId: string) => {
    if (action === "view") {
      try {
        const result = await fetchPackageById(pkgId).unwrap();
        setViewPackage(result.value); // Chỉ đặt giá trị cho View
      } catch (error) {
        toast.error("Không thể lấy thông tin gói!");
        setViewPackage({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        });
      }
    }
  
    if (action === "edit") {
      try {
        const result = await fetchPackageById(pkgId).unwrap();
        setEditPackage(result.value); // Chỉ đặt giá trị cho Edit
      } catch (error) {
        toast.error("Không thể lấy thông tin gói!");
        setEditPackage({
          name: "",
          description: "",
          price: "0",
          duration: "",
          isActivated: false,
        });
      }
      setShowEditForm(true); // Chỉ mở form, không mở popup
    }
  
    setMenuOpen(null);
  };
  
  const handleDeletePackage = async (packageId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        await deletePackage(packageId).unwrap();
        toast.success("Gói đã được xóa thành công!");
        refetch();
      } catch (error) {
        toast.error("Xóa gói thất bại!");
      }
    }
  };

  return (
    <div className="p-6" onClick={handleCloseMenu}>
      <ToastContainer />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Package Lists</h1>
        <input
          type="text"
          placeholder="Search By Package Name"
          className="border px-4 py-2 rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Add new Package
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded-lg relative">
        {isLoading && <p className="text-gray-500">Loading packages...</p>}
        {error && <p className="text-red-600">Failed to load packages.</p>}
        {!isLoading && !error && packages.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">No.</th>
                <th className="p-3 border">Package Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Duration</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              
              {packages.map((pkg: any, index: number) => (
                <tr key={pkg.documentId} className="border-t">
                  <td className="p-3 border">{(pageIndex - 1) * pageSize + index + 1}</td>
                  <td className="p-3 border">{pkg.name}</td>
                  <td className="p-3 border">{pkg.description}</td>
                  <td className="p-3 border">{pkg.price}</td>
                  <td className="p-3 border">{pkg.duration}</td>
                  <td className="p-3 border">
                    <input
                      type="checkbox"
                      checked={pkg.isActivated}
                      className="toggle-checkbox"
                      onChange={() => handleToggleStatus(pkg.documentId)}
                    />
                  
                    <span className={pkg.isActivated ? "text-green-600" : "text-red-600"}>
                      {pkg.isActivated ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 border relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMenu(pkg.documentId);
                      }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {menuOpen === pkg.documentId && (
                      <ul className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md text-sm py-2 z-50">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleMenuAction("view", pkg.documentId)}
                        >
                          Xem thông tin gói
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleMenuAction("edit", pkg.documentId)}>
                          Chỉnh sửa thông tin gói
                        </li>
                        <li className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                        onClick={()=> handleDeletePackage(pkg.documentId)}>
                          Xóa gói</li>
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No packages available.</p>
        )}
      </div>

      {showForm && (
        <PackageForm
          onClose={() => setShowForm(false)}
          onSaveSuccess={() => {
            setShowForm(false);
            refetch();
            toast.success(" Package added successfully!");
          }}
        />
      )}
          {showEditForm && editPackage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditPackageForm
            initialData={editPackage}
            onClose={() => {
              setShowEditForm(false);
              setEditPackage(null);
            }}
            onSaveSuccess={() => {
              setShowEditForm(false);
              setEditPackage(null);
              refetch();
            }}
          />
        </div>
      )}



      <div className="flex items-center justify-between mt-4">
        <button
          disabled={!hasPreviousPage}
          onClick={() => setPageIndex((prev) => prev - 1)}
          className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900"
        >
          Prev
        </button>

        <span className="text-sm text-gray-500">
          Page {pageIndex} - {Math.ceil(totalCount / pageSize)}
        </span>

        <button
          disabled={!hasNextPage}
          onClick={() => setPageIndex((prev) => prev + 1)}
          className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900"
        >
          Next
        </button>
      </div>

      {viewPackage  && (
  <Modal onClose={() => setViewPackage(null)}>
    <h2 className="text-xl font-bold mb-4">Thông tin gói</h2>
    <p><strong>Tên gói:</strong> {viewPackage .name}</p>
    <p><strong>Mô tả:</strong> {viewPackage .description}</p>
    <p><strong>Giá:</strong> {new Intl.NumberFormat("vi-VN").format(Number(viewPackage?.price || 0))} đ</p>
    <p><strong>Thời gian:</strong> {viewPackage .duration} tháng</p>
    <p>
      <strong>Trạng thái:</strong>{" "}
      <span className={viewPackage .isActivated ? "text-green-600" : "text-red-600"}>
        {viewPackage .isActivated ? "Active" : "Inactive"}
      </span>
    </p>
  </Modal>
)}

    </div>
  );
}
