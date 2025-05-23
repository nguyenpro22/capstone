"use client";

import type React from "react";

import { useState } from "react";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
} from "@/features/category-service/api";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, AlertCircle, FileText } from "lucide-react";
import { useTranslations } from "next-intl"; // Import useTranslations

interface CategoryFormProps {
  initialData?: any;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function CategoryForm({
  onClose,
  onSaveSuccess,
}: CategoryFormProps) {
  // Get translations for the category namespace
  const t = useTranslations("category");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { refetch } = useGetCategoriesQuery({
    pageIndex: 1,
    pageSize: 10,
    searchTerm: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    try {
      const response = await createCategory({
        name,
        description,
      }).unwrap();

      if (response.isSuccess) {
        await refetch();
        onSaveSuccess();
        onClose();
      } else {
        setErrorMessages(["An unexpected error occurred"]);
      }
    } catch (err: any) {
      console.error("API Error:", err);

      if (err?.data?.status === 422 && err?.data?.errors) {
        const messages = err.data.errors.map((error: any) => error.message);
        setErrorMessages(messages);
      } else {
        setErrorMessages(["An unexpected error occurred"]);
      }
    }
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
        className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-pink-100/20 to-transparent rounded-full -translate-x-16 translate-y-16" />

        <div className="relative p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-serif tracking-wide text-gray-800">
                {t("addNewCategory")}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Error Messages */}
          <AnimatePresence>
            {errorMessages.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6"
              >
                {errorMessages.map((msg, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 mb-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{msg}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("table.categoryName")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                           focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                  placeholder={t("table.categoryName")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("table.description")}
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                           focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                  placeholder={t("table.description")}
                />
                <FileText className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 
                         hover:bg-gray-50 transition-colors duration-200"
              >
                {/* We need to add "cancel" to the translations */}
                {t.rich("cancel", { defaultMessage: "Cancel" })}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white
                         hover:from-pink-600 hover:to-purple-600 transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>
                      {t.rich("saving", { defaultMessage: "Saving..." })}
                    </span>
                  </div>
                ) : (
                  t.rich("saveCategory", { defaultMessage: "Save Category" })
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
