"use client";

import type React from "react";

import { useState } from "react";
import {
  useCreatePackageMutation,
  useGetPackagesQuery,
} from "@/features/package/api";
import { motion, AnimatePresence } from "framer-motion";
import { Package, X, AlertCircle, DollarSign, Clock } from "lucide-react";
import { useTranslations } from "next-intl"; // Import useTranslations

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
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [createPackage, { isLoading }] = useCreatePackageMutation();
  const { refetch } = useGetPackagesQuery(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

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
        onSaveSuccess();
        await refetch();
        onClose();
      } else {
        setErrorMessages([t("notifications.unexpectedError")]);
      }
    } catch (err: any) {
      console.error("API Error:", err);

      if (err?.data?.status === 422 && err?.data?.errors) {
        const messages = err.data.errors.map((error: any) => error.message);
        setErrorMessages(messages);
      } else {
        setErrorMessages([t("notifications.unexpectedError")]);
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                  placeholder={t("placeholders.enterPackageName")}
                />
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                  placeholder={t("placeholders.enterDescription")}
                />
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                           focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                    placeholder={t("placeholders.enterPrice")}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                           focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                    placeholder={t("placeholders.enterDuration")}
                  />
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                  placeholder={t("placeholders.enterLimitBranches")}
                />
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                  placeholder={t("placeholders.enterLimitLiveStream")}
                />
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                           focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                    placeholder={t("placeholders.enterPriceBranchAddition")}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                           focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                    required
                    placeholder={t("placeholders.enterPriceLiveStreamAddition")}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                  required
                  placeholder={t("placeholders.enterEnhancedView")}
                />
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
