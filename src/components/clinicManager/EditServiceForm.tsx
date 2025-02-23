"use client";
import React, { useState } from "react";
import { useUpdateServiceMutation } from "@/features/clinic-service/api";
import { Service } from "@/features/clinic-service/types";
import Image from "next/image";

interface EditServiceFormProps {
  initialData: Partial<Service>;
  categories: { id: string; name: string }[]; // Danh sách danh mục để chọn
  onClose: () => void;
  onSaveSuccess: () => void;
}

const EditServiceForm: React.FC<EditServiceFormProps> = ({
  initialData,
  categories,
  onClose,
  onSaveSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<Service>>(initialData);
  const [selectedCoverFiles, setSelectedCoverFiles] = useState<File[]>([]);
  const [selectedDescriptionFiles, setSelectedDescriptionFiles] = useState<
    File[]
  >([]);
  const [updateService, { isLoading }] = useUpdateServiceMutation();

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedCoverFiles(Array.from(e.target.files));
    }
  };

  const handleDescriptionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      await updateService({
        documentId: formData.id,
        data: updatedFormData,
      }).unwrap();
      alert("Service updated successfully!");
      onSaveSuccess();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update service.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
      <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleFormChange}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Service Name"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description || ""}
          onChange={handleFormChange}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleFormChange}
          className="w-full border px-4 py-2 rounded-md"
          placeholder="Price"
          required
        />
        <select
          name="category"
          value={formData.category?.id || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              category: { id: e.target.value, name: "" },
            }))
          }
          className="w-full border px-4 py-2 rounded-md"
          required
        >
          <option value="">Select Category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Upload Cover Image */}
        <label className="block font-semibold">Cover Image</label>
        <input
          type="file"
          multiple
          onChange={handleCoverFileChange}
          className="w-full border px-4 py-2 rounded-md"
        />
        {(formData?.coverImage?.length ?? 0) > 0 && (
          <div className="flex gap-2">
            {formData.coverImage?.map((imgUrl, index) => (
              <Image
                key={index}
                src={imgUrl}
                alt={`Cover ${index}`}
                className="w-24 h-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        {/* Upload Description Images */}
        <label className="block font-semibold">Description Images</label>
        <input
          type="file"
          multiple
          onChange={handleDescriptionFileChange}
          className="w-full border px-4 py-2 rounded-md"
        />
        {(formData.descriptionImages?.length ?? 0) > 0 && (
          <div className="flex gap-2">
            {formData.descriptionImages?.map((imgUrl, index) => (
              <Image
                key={index}
                src={imgUrl}
                alt={`Description ${index}`}
                className="w-24 h-24 object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
          onClick={onClose}
        >
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
