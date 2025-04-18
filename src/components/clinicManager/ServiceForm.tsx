"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  useCreateServiceMutation,
  useGetServicesQuery,
} from "@/features/clinic-service/api";
import { useGetCategoriesQuery } from "@/features/category-service/api";
import { useGetBranchesQuery } from "@/features/clinic/api";

import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, FileText, ImageIcon, Trash2 } from "lucide-react";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full border rounded-md bg-muted/20 animate-pulse" />
  ),
});

interface ServiceFormProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function ServiceForm({
  onClose,
  onSaveSuccess,
}: ServiceFormProps) {
  const t = useTranslations("service");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<
    { value: string; label: string }[]
  >([]);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [depositPercent, setDepositPercent] = useState<number>(0);
  const [isRefundable, setIsRefundable] = useState<boolean>(true);

  const [createService, { isLoading }] = useCreateServiceMutation();
  const { refetch: refetchServices } = useGetServicesQuery(undefined);
  const { data: categoryData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({
      pageIndex: 1,
      pageSize: 100,
      searchTerm: "",
    });
  const token = getAccessToken() as string;
  const { clinicId } = GetDataByToken(token) as TokenData;

  const {
    data: branchesData,
    isLoading: isLoadingBranches,
    error,
    refetch,
  } = useGetBranchesQuery(clinicId || "");

  // Ensure editor is loaded
  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const categories = Array.isArray(categoryData?.value?.items)
    ? categoryData.value.items
    : [];
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: cat.name,
  }));

  // Extract branches from the response, handling both possible structures
  const getBranchesFromResponse = () => {
    if (!branchesData) return [];

    // Check if the response has branches in the nested structure
    if (
      branchesData.value?.branches?.items &&
      Array.isArray(branchesData.value.branches.items)
    ) {
      return branchesData.value.branches.items;
    }

    // If we have a single branch with nested branches
    if (branchesData.value?.id && branchesData.value?.branches?.items) {
      return branchesData.value.branches.items;
    }

    return [];
  };

  const branches = getBranchesFromResponse();
  console.log("data branches: ", branchesData);
  console.log("extracted branches: ", branches);

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array and append to existing images
    const newFiles = Array.from(files);
    setCoverImages((prevImages) => [...prevImages, ...newFiles]);

    // Create previews for all new files
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prevPreviews) => [
          ...prevPreviews,
          reader.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setCoverImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreview((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    if (
      !name.trim() ||
      !description.trim() ||
      !categoryId ||
      selectedBranches.length === 0 ||
      coverImages.length === 0
    ) {
      setErrorMessages([t("addService.requiredFields")]);
      toast.error(t("addService.requiredFields"));
      return;
    }

    const formData = new FormData();
    formData.append(
      "clinicId",
      JSON.stringify(selectedBranches.map((branch) => branch.value))
    );
    formData.append("name", name);
    formData.append("description", description);
    formData.append("categoryId", categoryId);

    // Append all cover images to the formData
    coverImages.forEach((image) => {
      formData.append("coverImages", image);
    });

    formData.append("depositPercent", depositPercent.toString());
    formData.append("isRefundable", isRefundable.toString());

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
        className="relative w-full max-w-2xl bg-white shadow-2xl rounded-[20px] flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Gradient header inside the border radius */}
        <div className="w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />

        {/* Fixed header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 flex justify-between items-center border-b">
          <h2 className="text-2xl font-medium text-gray-800">
            {t("addService.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence>
            {errorMessages.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 max-h-24 overflow-y-auto"
              >
                {errorMessages.map((msg, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 mb-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{msg}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("addService.serviceName")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder={t("addService.serviceNamePlaceholder")}
                required
              />
            </div>

            {/* Description - Quill Editor */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                {t("addService.description")}
              </label>
              {editorLoaded && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginBottom: "80px", // Extreme margin to ensure no overlap
                    position: "relative", // Create a new stacking context
                    zIndex: 1, // Lower z-index
                  }}
                >
                  <QuillEditor
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder={t("addService.descriptionPlaceholder")}
                  />
                </div>
              )}
            </div>

            {/* Category Selection - Now with explicit styling to ensure visibility */}
            <div
              className="space-y-2"
              style={{
                marginTop: "80px", // Extreme margin to push it down
                position: "relative", // Create a new stacking context
                zIndex: 2, // Higher z-index to ensure it's above the editor
              }}
            >
              <label
                className="text-sm font-medium text-gray-700 block py-2"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  position: "relative", // Create a new stacking context
                  zIndex: 3, // Even higher z-index for the label
                }}
              >
                {t("addService.category")}
              </label>
              <Select
                value={categoryOptions.find(
                  (option: any) => option.value === categoryId
                )}
                onChange={(selected) => setCategoryId(selected?.value || "")}
                options={categoryOptions}
                isDisabled={isCategoriesLoading}
                isSearchable
                placeholder={t("addService.categoryPlaceholder")}
                styles={{
                  ...selectStyles,
                  container: (base) => ({
                    ...base,
                    position: "relative",
                    zIndex: 2,
                  }),
                }}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Branch Selection (Multiple) */}
            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {t("addService.branches")}
              </label>
              <Select
                isMulti
                value={selectedBranches}
                onChange={(selected) =>
                  setSelectedBranches(
                    selected as { value: string; label: string }[]
                  )
                }
                options={branchOptions}
                isDisabled={isLoadingBranches}
                isSearchable
                placeholder={t("addService.branchesPlaceholder")}
                styles={selectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
              {branchOptions.length === 0 && !isLoadingBranches && (
                <p className="text-sm text-amber-600">
                  {t("addService.noBranches")}
                </p>
              )}
            </div>

            {/* Multiple Images Upload */}
            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {t("addService.coverImages")}
              </label>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                    id="cover-images"
                    multiple
                  />
                  <label
                    htmlFor="cover-images"
                    className={`flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed
                      ${
                        coverImages.length > 0
                          ? "border-purple-300 bg-purple-50"
                          : "border-gray-300 hover:border-purple-300"
                      }
                      transition-all duration-200 cursor-pointer`}
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-sm">
                        {coverImages.length > 0
                          ? t("addService.filesSelected", {
                              count: coverImages.length,
                            })
                          : t("addService.selectCoverImages")}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreview.map((preview, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          width={100}
                          height={100}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Deposit Percentage */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("addService.depositPercent") || "Phần trăm đặt cọc (%)"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={depositPercent}
                  onChange={(e) => setDepositPercent(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {t("addService.depositPercentInfo") ||
                  "Số tiền khách hàng phải đặt cọc khi đặt dịch vụ (0-100%)"}
              </p>
            </div>

            {/* Is Refundable */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRefundable}
                  onChange={(e) => setIsRefundable(e.target.checked)}
                  className="rounded border-gray-300 text-purple-500 focus:ring-purple-200"
                />
                <span className="text-sm font-medium text-gray-700">
                  {t("addService.isRefundable") || "Cho phép hoàn tiền"}
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                {t("addService.isRefundableInfo") ||
                  "Khách hàng có thể được hoàn tiền cho dịch vụ này"}
              </p>
            </div>

            {/* Add extra space at the bottom to account for fixed footer */}
            <div className="h-20"></div>
          </form>
        </div>

        {/* Fixed footer with buttons */}
        <div className="sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white
                     hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50
                     disabled:cursor-not-allowed shadow-lg shadow-purple-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{t("addService.saving")}</span>
              </div>
            ) : (
              t("addService.save")
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
