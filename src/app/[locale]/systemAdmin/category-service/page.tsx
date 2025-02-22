"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useLazyGetCategoryByIdQuery,
  useDeleteCategoryMutation, 
} from "@/features/category-service/api";
import CategoryForm from "@/components/systemAdmin/CategoryForm";
import EditCategoryForm from "@/components/systemAdmin/EditCategoryForm";
import Pagination from "@/components/common/Pagination/Pagination";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MoreVertical } from "lucide-react"; // Import icon ba chấm và icon đóng

export default function Voucher() {
const [editCategory, setEditCategory] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  const { data, error, isLoading, refetch } = useGetCategoriesQuery({ 
                                                                pageIndex, 
                                                                pageSize,
                                                                searchTerm });
console.log("API Response:", data);
  const [fetchCategoryById] = useLazyGetCategoryByIdQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.value?.items || [];
  console.log("Category Data:", categories); // Debug

  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage;
  const hasPreviousPage = data?.value?.hasPreviousPage;

  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleToggleMenu = (CategoryId: string) => {
    setMenuOpen(menuOpen === CategoryId ? null : CategoryId);
  };


  const handleCloseMenu = () => {
    setMenuOpen(null);
  };

  const handleMenuAction = async (action: string, pkgId: string) => {
  
    if (action === "edit") {
      try {
        const result = await fetchCategoryById(pkgId).unwrap();
        setEditCategory(result.value); // Chỉ đặt giá trị cho Edit
      } catch (error) {
        console.error(error);
        toast.error("Không thể lấy thông tin gói!");
        setEditCategory({
          name: "",
          description: "",
          isActivated: false,
        });
      }
      setShowEditForm(true); // Chỉ mở form, không mở popup
    }
  
    setMenuOpen(null);
  };
  
  const handleDeleteCategory = async (CategoryId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        await deleteCategory(CategoryId).unwrap();
        toast.success("Gói đã được xóa thành công!");
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Xóa gói thất bại!");
      }
    }
  };

  return (
    <div className="p-6" onClick={handleCloseMenu}>
      <ToastContainer />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Category Lists</h1>
        <input
          type="text"
          placeholder="Search By Category Name"
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
          Add new Category
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded-lg relative">
        {isLoading && <p className="text-gray-500">Loading Categories...</p>}
        {error && <p className="text-red-600">Failed to load Categories.</p>}
        {!isLoading && !error && categories.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">No.</th>
                <th className="p-3 border">Category Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              
              {categories.map((pkg: any, index: number) => (
                <tr key={pkg.documentId} className="border-t">
                  <td className="p-3 border">{(pageIndex - 1) * pageSize + index + 1}</td>
                  <td className="p-3 border">{pkg.name}</td>
                  <td className="p-3 border">{pkg.description}</td>
          
                  
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
                
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleMenuAction("edit", pkg.documentId)}>
                          Chỉnh sửa thông tin gói
                        </li>
                        <li className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                        onClick={()=> handleDeleteCategory(pkg.documentId)}>
                          Xóa gói</li>
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No Categorys available.</p>
        )}
      </div>

      {showForm && (
        <CategoryForm
          onClose={() => setShowForm(false)}
          onSaveSuccess={() => {
            setShowForm(false);
            refetch();
            toast.success(" Category added successfully!");
          }}
        />
      )}
      {showEditForm && editCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditCategoryForm
            initialData={editCategory}
            onClose={() => {
              setShowEditForm(false);
              setEditCategory(null);
            }}
            onSaveSuccess={() => {
              setShowEditForm(false);
              setEditCategory(null);
              refetch();
            }}
          />
        </div>
      )}



<Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setPageIndex}
      />

    </div>
  );
}
