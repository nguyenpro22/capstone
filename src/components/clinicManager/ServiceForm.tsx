"use client";

import type React from "react";
import { useState } from "react";
import {
  useCreateServiceMutation,
  useGetServicesQuery,
} from "@/features/clinic-service/api";
import { useGetCategoriesQuery } from "@/features/category-service/api";
import {  useGetBranchesQuery } from "@/features/clinic/api";

import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Check, AlertCircle } from "lucide-react";

interface ServiceFormProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ServiceForm({ onClose, onSaveSuccess }: ServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [descriptionImages, setDescriptionImages] = useState<File[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<{ value: string; label: string }[]>([]);

  const [createService, { isLoading }] = useCreateServiceMutation();
  const { refetch: refetchServices } = useGetServicesQuery(undefined);
  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategoriesQuery({
    pageIndex: 1,
    pageSize: 100,
    searchTerm: "",
  });
  const { data: branchesData, isLoading: isBranchesLoading } = useGetBranchesQuery({
    pageIndex: 1,
    pageSize: 100,
    serchTerm: "",
  });

  const categories = Array.isArray(categoryData?.value?.items) ? categoryData.value.items : [];
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: cat.name,
  }));

  const branches = Array.isArray(branchesData?.value?.items) ? branchesData.value.items : [];
  const branchOptions = branches.map((branch: any) => ({
    value: branch.id,
    label: branch.name,
  }));

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

    if (!name.trim() || !description.trim() || !categoryId || selectedBranches.length === 0) {
      setErrorMessages(["Please fill in all required fields, including at least one branch"]);
      return;
    }

    const formData = new FormData();
    formData.append("clinicId", JSON.stringify(selectedBranches.map((branch) => branch.value)));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("categoryId", categoryId);

    if (coverImage) {
      formData.append("coverImages", coverImage);
    }

    descriptionImages.forEach((file) => {
      formData.append("descriptionImages", file);
    });

    try {
      const response = await createService({ data: formData }).unwrap();
      if (response.isSuccess) {
        await refetchServices();
        onSaveSuccess();
        onClose();
      }
    } catch (err: any) {
      if (err?.data?.status === 422 && err?.data?.errors) {
        const messages = err.data.errors.map((error: any) => error.message);
        setErrorMessages(messages);
      } else {
        setErrorMessages(["An unexpected error occurred"]);
      }
    }
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      border: "1px solid #e2e8f0",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e1",
      },
    }),
    option: (base: any, state: { isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected ? "#f8f9fa" : "white",
      color: "#1e293b",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#f1f5f9",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#4a5568",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#a0aec0",
      "&:hover": {
        color: "#718096",
        backgroundColor: "#e2e8f0",
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-pink-100/20 to-transparent rounded-full -translate-x-16 translate-y-16" />

        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif tracking-wide text-gray-800">Add New Service</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <AnimatePresence>
            {errorMessages.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 max-h-24 overflow-y-auto"
              >
                {errorMessages.map((msg, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{msg}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Service Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                required
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select
                value={categoryOptions.find((option: any) => option.value === categoryId)}
                onChange={(selected) => setCategoryId(selected?.value || "")}
                options={categoryOptions}
                isDisabled={isCategoriesLoading}
                isSearchable
                placeholder="Select Category"
                styles={selectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Branch Selection (Multiple) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Branches</label>
              <Select
                isMulti
                value={selectedBranches}
                onChange={(selected) => setSelectedBranches(selected as { value: string; label: string }[])}
                options={branchOptions}
                isDisabled={isBranchesLoading}
                isSearchable
                placeholder="Select Branches"
                styles={selectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cover Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                    id="cover-image"
                  />
                  <label
                    htmlFor="cover-image"
                    className={`flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed
                      ${coverImage ? "border-purple-300 bg-purple-50" : "border-gray-300 hover:border-purple-300"}
                      transition-all duration-200 cursor-pointer`}
                  >
                    {coverImage ? (
                      <div className="flex items-center gap-2 text-purple-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">{coverImage.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-600">
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Upload cover image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Description Images Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description Images</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDescriptionFileChange}
                    className="hidden"
                    id="description-images"
                  />
                  <label
                    htmlFor="description-images"
                    className={`flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed
                      ${descriptionImages.length > 0 ? "border-purple-300 bg-purple-50" : "border-gray-300 hover:border-purple-300"}
                      transition-all duration-200 cursor-pointer`}
                  >
                    {descriptionImages.length > 0 ? (
                      <div className="flex items-center gap-2 text-purple-600">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">{descriptionImages.length} images selected</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-600">
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Upload description images</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white
                         hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50
                         disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Service"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}