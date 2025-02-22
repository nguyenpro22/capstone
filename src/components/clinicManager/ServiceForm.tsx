"use client";
import { useState } from "react";
import { useCreateServiceMutation, useGetServicesQuery } from "@/features/clinic-service/api";
import { useGetCategoriesQuery } from "@/features/category-service/api"; // 🆕 Import API lấy danh mục

interface ServiceFormProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ServiceForm({ onClose, onSaveSuccess }: ServiceFormProps) {
  

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null); // Ảnh bìa
  const [descriptionImages, setDescriptionImages] = useState<File[]>([]); // Ảnh mô tả
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [createService, { isLoading }] = useCreateServiceMutation();
  const { refetch } = useGetServicesQuery(undefined);

  // 🆕 Lấy danh sách categories từ API
  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategoriesQuery({
    pageIndex: 1,
    pageSize: 100,
    searchTerm: "",
  });
  const categories = categoryData?.value || [];
  console.log("Category Data Add:", categories); // Debug


  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleDescriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDescriptionImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    // Kiểm tra input
    if (!name.trim() || !description.trim() || price === "" || !categoryId) {
      setErrorMessages(["⚠️ Please fill in all required fields."]);
      return;
    }

    // 🔵 Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append("clinicId", "798aae17-766b-4b96-8f53-f75012e63bb1");
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("categoryId", categoryId);

    if (coverImage) {
      formData.append("coverImages", coverImage);
    }

    descriptionImages.forEach((file) => {
      formData.append("descriptionImages", file);
    });

    try {
      const response = await createService({ data: formData }).unwrap();
      console.log("✅ API response:", response);

      if (response.isSuccess) {
        await refetch();
        onSaveSuccess();
        onClose();
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
        <h2 className="text-xl font-bold mb-4">Add New Service</h2>

        {/* Hiển thị lỗi */}
        {errorMessages.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessages.map((msg, index) => (
              <p key={index}>⚠️ {msg}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="block text-sm font-medium">Service Name</label>
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

          <div className="mb-3">
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* 🆕 Dropdown chọn Category */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border p-2 rounded"
              required
              disabled={isCategoriesLoading}
            >
              <option value="">Select Category</option>
              {categoryData?.value?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Cover Image */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverFileChange} className="w-full border p-2 rounded" />
          </div>

          {/* Upload Description Images */}
          <div className="mb-3">
            <label className="block text-sm font-medium">Description Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleDescriptionFileChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
