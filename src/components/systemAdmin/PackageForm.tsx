"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  useCreatePackageMutation,
  useGetPackagesQuery,
} from "@/features/package/api";
import { motion } from "framer-motion";
import { Package, X, AlertCircle, DollarSign, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

interface PackageFormProps {
  initialData?: any;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function PackageForm({
  onClose,
  onSaveSuccess,
}: PackageFormProps) {
  // Get translations for the package namespace
  const t = useTranslations("package");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [limitBranches, setLimitBranches] = useState("0");
  const [limitLiveStream, setLimitLiveStream] = useState("0");
  const [priceBranchAddition, setPriceBranchAddition] = useState("");
  const [priceLiveStreamAddition, setPriceLiveStreamAddition] = useState("");
  const [enhancedView, setEnhancedView] = useState("0");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent mouse wheel from changing number input values
  const preventWheelChange = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const [createPackage, { isLoading }] = useCreatePackageMutation();
  const { refetch } = useGetPackagesQuery(undefined);

  // Show toast when general error occurs
  useEffect(() => {
    if (errors.general) {
      toast.error(errors.general, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [errors.general]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await createPackage({
        name,
        description,
        price: Number.parseFloat(price),
        duration: Number.parseInt(duration),
        limitBranches: Number.parseInt(limitBranches),
        limitLiveStream: Number.parseInt(limitLiveStream),
        priceBranchAddition: Number.parseFloat(priceBranchAddition),
        priceLiveStreamAddition: Number.parseFloat(priceLiveStreamAddition),
        enhancedView: Number.parseInt(enhancedView),
      }).unwrap();

      if (response.isSuccess) {
        toast.success(t("notifications.packageCreated"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onSaveSuccess();
        await refetch();
        onClose();
      } else {
        setErrors({ general: t("notifications.unexpectedError") });
      }
    } catch (err: any) {
      console.error("API Error:", err);

      if (err?.data?.status === 422 && err?.data?.errors) {
        const newErrors: Record<string, string> = {};
        let hasFieldErrors = false;

        err.data.errors.forEach((error: any) => {
          // Convert PascalCase to camelCase for field mapping
          const convertToCamelCase = (str: string) => {
            return str.charAt(0).toLowerCase() + str.slice(1);
          };

          // Get the field name from the error code and convert to camelCase
          const fieldName = error.code
            ? convertToCamelCase(error.code)
            : "general";

          if (fieldName !== "general") {
            hasFieldErrors = true;
          }

          // If there's already an error for this field, append the new error message
          if (newErrors[fieldName]) {
            newErrors[fieldName] += "; " + error.message;
          } else {
            newErrors[fieldName] = error.message;
          }
        });

        // If there are field-specific errors, also show a general toast
        if (hasFieldErrors) {
          toast.error(t("notifications.pleaseCheckFields"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        setErrors(newErrors);
      } else {
        setErrors({ general: t("notifications.unexpectedError") });
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

        <div className="relative flex flex-col max-h-[90vh]">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-serif tracking-wide text-gray-800">
                  {t("addNewPackage")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form with scroll */}
          <div className="px-8 overflow-y-auto">
            <form
              id="package-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Package Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("packageName")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                  required
                  placeholder={t("placeholders.enterPackageName")}
                />
                {errors.name && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.name}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("description")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                  required
                  placeholder={t("placeholders.enterDescription")}
                />
                {errors.description && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.description}</p>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("price")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onWheel={preventWheelChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.price
                        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    required
                    placeholder={t("placeholders.enterPrice")}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.price && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.price}</p>
                  </div>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("duration")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    onWheel={preventWheelChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.duration
                        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    required
                    placeholder={t("placeholders.enterDuration")}
                  />
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.duration && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.duration}</p>
                  </div>
                )}
              </div>

              {/* Limit Branches */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("branchLimit")}
                </label>
                <input
                  type="number"
                  value={limitBranches}
                  onChange={(e) => setLimitBranches(e.target.value)}
                  onWheel={preventWheelChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.limitBranches
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                  required
                  placeholder={t("placeholders.enterLimitBranches")}
                />
                {errors.limitBranches && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.limitBranches}</p>
                  </div>
                )}
              </div>

              {/* Limit Live Stream */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("liveStreamLimit")}
                </label>
                <input
                  type="number"
                  value={limitLiveStream}
                  onChange={(e) => setLimitLiveStream(e.target.value)}
                  onWheel={preventWheelChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.limitLiveStream
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                  required
                  placeholder={t("placeholders.enterLimitLiveStream")}
                />
                {errors.limitLiveStream && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.limitLiveStream}</p>
                  </div>
                )}
              </div>

              {/* Price More Branch */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("additionalBranchPrice")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={priceBranchAddition}
                    onChange={(e) => setPriceBranchAddition(e.target.value)}
                    onWheel={preventWheelChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.priceBranchAddition
                        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    required
                    placeholder={t("placeholders.enterPriceBranchAddition")}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.priceBranchAddition && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.priceBranchAddition}</p>
                  </div>
                )}
              </div>

              {/* Price More Livestream */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("additionalLivestreamPrice")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={priceLiveStreamAddition}
                    onChange={(e) => setPriceLiveStreamAddition(e.target.value)}
                    onWheel={preventWheelChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.priceLiveStreamAddition
                        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                    required
                    placeholder={t("placeholders.enterPriceLiveStreamAddition")}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.priceLiveStreamAddition && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.priceLiveStreamAddition}</p>
                  </div>
                )}
              </div>

              {/* Enhanced View */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("enhancedViewerCapacity")}
                </label>
                <input
                  type="number"
                  value={enhancedView}
                  onChange={(e) => setEnhancedView(e.target.value)}
                  onWheel={preventWheelChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.enhancedView
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  } focus:ring focus:ring-opacity-50 transition-all duration-200`}
                  required
                  placeholder={t("placeholders.enterEnhancedView")}
                />
                {errors.enhancedView && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <p>{errors.enhancedView}</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Form Actions - Fixed at bottom */}
          <div className="p-8 pt-4 mt-auto">
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 
                         hover:bg-gray-50 transition-colors duration-200"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                form="package-form"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white
                         hover:from-pink-600 hover:to-purple-600 transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>{t("saving")}</span>
                  </div>
                ) : (
                  t("savePackage")
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
