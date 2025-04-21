"use client";

import type React from "react";
import { useState } from "react";
import { useUpdateCategoryMutation } from "@/features/category-service/api";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { SubCategory } from "@/features/category-service/types";
import { useTranslations } from "next-intl"; // Import useTranslations

interface EditSubCategoryFormProps {
  initialData: SubCategory;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function EditSubCategoryForm({
  initialData,
  onClose,
  onSaveSuccess,
}: EditSubCategoryFormProps) {
  // Get translations for the category namespace
  const t = useTranslations("category");

  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [isActivated, setIsActivated] = useState(initialData.isDeleted);

  const [updateSubCategory, { isLoading }] = useUpdateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t("validations.subcategoryNameRequired"));
      return;
    }

    try {
      await updateSubCategory({
        data: {
          id: initialData.id,
          name,
          description,
          parentId: initialData.parentId,
        },
      }).unwrap();

      toast.success(t("notifications.subcategoryUpdated"));
      onSaveSuccess();
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error(t("notifications.subcategoryUpdateFailed"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900 w-full max-w-md"
    >
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 p-5 rounded-t-xl">
        <h2 className="text-2xl font-bold text-white">
          {t("actions.editSubcategory")}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("subcategory.subcategoryName")}
          </label>
          <input
            type="text"
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("placeholders.enterSubcategoryName")}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("subcategory.description")}
          </label>
          <textarea
            className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 transition-all min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("placeholders.enterSubcategoryDescription")}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? t("saving") : t("saveChanges")}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
