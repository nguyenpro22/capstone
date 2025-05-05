"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCreateDoctorCertificateMutation } from "@/features/doctor/api";
import { useGetAllCategoriesV2Query } from "@/features/category-service/api";
import { toast } from "react-toastify";
import { X, Upload, Calendar, ChevronDown } from "lucide-react";
import type { CategoryDetail } from "@/features/category-service/types";

interface DoctorCertificateFormProps {
  doctorId: string;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function DoctorCertificateForm({
  doctorId,
  onClose,
  onSaveSuccess,
}: DoctorCertificateFormProps) {
  const [certificateName, setCertificateName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [note, setNote] = useState(" ");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createCertificate, { isLoading }] =
    useCreateDoctorCertificateMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesV2Query();

  const categories = categoriesData?.value?.items || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateName || !expiryDate || !certificateFile || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("doctorId", doctorId);
      formData.append("certificateName", certificateName);
      formData.append("certificateFile", certificateFile);
      formData.append("expiryDate", expiryDate);
      formData.append("categoryId", categoryId);

      if (note) {
        formData.append("note", note);
      }

      await createCertificate(formData).unwrap();
      onSaveSuccess();
    } catch (error) {
      console.error("Error creating certificate:", error);
      toast.error("Failed to create certificate. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
          Add Doctor Certificate
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Certificate Name *
            </label>
            <input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:text-white appearance-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category: CategoryDetail) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
            </div>
            {isCategoriesLoading && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Loading categories...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiry Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Certificate File *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-3 py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <Upload className="w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {certificateFile
                  ? certificateFile.name
                  : "Click to upload certificate file"}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 rounded-md hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Saving..." : "Save Certificate"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
