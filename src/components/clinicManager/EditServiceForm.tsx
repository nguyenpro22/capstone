"use client";
import React, { useState } from "react";
import { useUpdateServiceMutation } from "@/features/clinic-service/api";
import { Service } from "@/features/clinic-service/types";
import Image from "next/image";

interface EditServiceFormProps {
  initialData: Partial<Service>;
  categories: { id: string; name: string; description?: string }[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

const EditServiceForm: React.FC<EditServiceFormProps> = ({
  initialData,
  categories,
  onClose,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    ...initialData,
    coverImage: initialData.coverImage || [],
  });
  const [selectedCoverFiles, setSelectedCoverFiles] = useState<File[]>([]);
  const [selectedDescriptionFiles, setSelectedDescriptionFiles] = useState<File[]>([]);
  const [updateService, { isLoading }] = useUpdateServiceMutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = categories.find((cat) => cat.id === e.target.value);
    if (category) {
      setFormData((prev) => ({
        ...prev,
        category: { id: category.id, name: category.name, description: category.description || "" },
      }));
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedCoverFiles(Array.from(e.target.files));
    }
  };

  const handleDescriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedDescriptionFiles(Array.from(e.target.files));
    }
  };

  const handleSaveChanges = async () => {
    if (!formData.id) return;

    const updatedFormData = new FormData();
    updatedFormData.append("id", formData.id);
    updatedFormData.append("name", formData.name || "");
    updatedFormData.append("description", formData.description || "");
    updatedFormData.append("price", String(formData.price || 0));
    updatedFormData.append("categoryId", formData.category?.id || "");

    selectedCoverFiles.forEach((file) => {
      updatedFormData.append("coverImage", file);
    });

    selectedDescriptionFiles.forEach((file) => {
      updatedFormData.append("descriptionImages", file);
    });

    try {
      await updateService({ documentId: formData.id, data: updatedFormData }).unwrap();
      alert("Service updated successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update service.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg w-[600px] max-h-[90vh]">
      <h2 className="text-xl font-semibold mb-4">Edit Service</h2>

      {/* Nội dung có thể cuộn */}
      <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2">
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleFormChange}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Service Name"
          required
        />

        <label className="block font-semibold">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description || ""}
          onChange={handleFormChange}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Description"
          required
        />

        <label className="block font-semibold">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleFormChange}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Price"
          required
        />

        <label className="block font-semibold">Category</label>
        <select
          name="category"
          value={formData.category?.id || ""}
          onChange={handleCategoryChange}
          className="w-full border px-4 py-2 rounded-md"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="block font-semibold">Cover Image</label>
        {formData.coverImage && formData.coverImage?.length > 0 && (
          <div className="flex gap-2">
            {formData.coverImage?.map((imgUrl, index) => (
              <Image key={index} src={imgUrl} alt={`Cover ${index}`} width={100} height={100} className="rounded-md" />
            ))}
          </div>
        )}
        <input type="file" multiple onChange={handleCoverFileChange} className="w-full border px-4 py-2 rounded-md" />

        <label className="block font-semibold">Description Images</label>
        {formData.descriptionImages && formData.descriptionImages?.length > 0 && (
          <div className="flex gap-2">
            {formData.descriptionImages?.map((imgUrl, index) => (
              <Image key={index} src={imgUrl} alt={`Description ${index}`} width={100} height={100} className="rounded-md" />
            ))}
          </div>
        )}
        <input type="file" multiple onChange={handleDescriptionFileChange} className="w-full border px-4 py-2 rounded-md" />
      </div>

      {/* Nút lưu và hủy */}
      <div className="flex justify-end mt-4 space-x-2">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleSaveChanges}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EditServiceForm;
