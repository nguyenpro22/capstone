"use client";
import { useState } from "react";
import { useCreateCategoryMutation, useGetCategoriesQuery } from "@/features/category-service/api";

interface CategoryFormProps {
  initialData?: any; // Thêm optional prop để nhận dữ liệu chỉnh sửa
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function CategoryForm({ onClose, onSaveSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { refetch } = useGetCategoriesQuery(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    try {
      const response = await createCategory({
        name,
        description,
      }).unwrap();

      console.log("✅ API response:", response);

      if (response.isSuccess) {
        await refetch(); // Làm mới danh sách
        onSaveSuccess(); // 🟢 Hiển thị toast thành công
        onClose(); // 🔴 Chỉ đóng form khi lưu thành công
      } else {
        setErrorMessages(["⚠️ An unexpected error occurred. Please try again."]);
      }
    } catch (err: any) {
      console.error("❌ API Error:", err);

      if (err?.data?.status === 422 && err?.data?.errors) {
        const messages = err.data.errors.map((error: any) => `${error.code}: ${error.message}`);
        setErrorMessages(messages);
      } else {
        setErrorMessages(["⚠️ An unexpected error occurred. Please try again."]);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>

        {/* Hiển thị lỗi */}
        {errorMessages.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessages.map((msg, index) => (
              <p key={index}>⚠️ {msg}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
