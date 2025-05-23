"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Folder, ArrowRightLeft, Loader2 } from "lucide-react";
import type {
  CategoryDetail,
  SubCategory,
} from "@/features/category-service/types";
import { useTranslations } from "next-intl"; // Import useTranslations

interface MoveSubCategoryModalProps {
  subCategory: SubCategory;
  categories: CategoryDetail[];
  onClose: () => void;
  onSubmit: (destinationCategoryId: string) => void;
  isLoading: boolean;
}

export default function MoveSubCategoryModal({
  subCategory,
  categories,
  onClose,
  onSubmit,
  isLoading,
}: MoveSubCategoryModalProps) {
  // Get translations for the category namespace
  const t = useTranslations("category");

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategoryId) {
      onSubmit(selectedCategoryId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 w-full max-w-md overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <ArrowRightLeft className="w-5 h-5 mr-2" />
          {t("actions.moveSubcategory")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {t("subcategory.movingSubcategory")}
            </p>
            <div className="font-medium text-purple-700 dark:text-purple-400 flex items-center">
              <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mr-2"></div>
              {subCategory.name}
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("subcategory.selectDestinationCategory")}
          </label>

          {categories.length > 0 ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors flex items-center ${
                    selectedCategoryId === category.id
                      ? "bg-purple-50 dark:bg-purple-900/30"
                      : ""
                  }`}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  <input
                    type="radio"
                    name="destinationCategory"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={selectedCategoryId === category.id}
                    onChange={() => setSelectedCategoryId(category.id)}
                    className="mr-3 text-purple-600 dark:text-purple-500 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="flex items-center cursor-pointer flex-1"
                  >
                    <Folder className="w-4 h-4 text-purple-500 dark:text-purple-400 mr-2" />
                    <span className="dark:text-gray-200">{category.name}</span>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                {t("subcategory.noDestinationCategories")}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-600 dark:focus:ring-offset-gray-800"
            disabled={isLoading}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 border border-transparent rounded-md hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-500 dark:hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-600 dark:focus:ring-offset-gray-800 flex items-center disabled:opacity-70"
            disabled={!selectedCategoryId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("subcategory.processing")}
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                {t("subcategory.moveCategory")}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
