"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useUpdatePackageMutation } from "@/features/package/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  X,
  AlertCircle,
  Package,
  FileText,
  DollarSign,
  Clock,
  Building2,
  Video,
  Users,
  PlusCircle,
} from "lucide-react";
import { useTranslations } from "next-intl"; // Import useTranslations

interface EditPackageFormProps {
  initialData: any;
  onClose: () => void;
  onSaveSuccess: () => void;
}

interface ValidationErrors {
  id?: string;
  name?: string;
  description?: string;
  price?: string;
  duration?: string;
  limitBranch?: string;
  limitLiveStream?: string;
  enhancedViewer?: string;
  priceBranchAddition?: string;
  priceLiveStreamAddition?: string;
}

export default function EditPackageForm({
  initialData,
  onClose,
  onSaveSuccess,
}: EditPackageFormProps) {
  // Get translations for the package namespace
  const t = useTranslations();

  const [formData, setFormData] = useState(initialData);
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Ref to track the currently focused input
  const focusedInputRef = useRef<string | null>(null);
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});
  const inputTypes = useRef<Record<string, string>>({});

  // Effect to restore focus after re-render
  useEffect(() => {
    if (focusedInputRef.current && inputRefs.current[focusedInputRef.current]) {
      const input = inputRefs.current[focusedInputRef.current];
      if (input) {
        // Just focus the input without trying to set selection range
        input.focus();

        // Only set selection range for text inputs and textareas
        const inputType = inputTypes.current[focusedInputRef.current];
        if (
          input instanceof HTMLTextAreaElement ||
          (input instanceof HTMLInputElement && inputType === "text")
        ) {
          const length = input.value.length;
          try {
            input.setSelectionRange(length, length);
          } catch (error) {
            console.log("Could not set selection range for this input type");
          }
        }
      }
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Store the name of the input being edited
    focusedInputRef.current = name;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePackage(formData).unwrap();
      toast.success(t("package.notifications.packageUpdated"));
      onSaveSuccess();
    } catch (error: any) {
      console.log("Error response:", error);
      if (error?.status === 400 || error?.status === 422) {
        const validationErrors = error?.data?.errors || [];
        if (validationErrors.length > 0) {
          const newErrors: Record<string, string> = {};
          validationErrors.forEach((err: { code: string; message: string }) => {
            newErrors[err.code.toLowerCase()] = err.message;
          });
          setValidationErrors(newErrors);
        }
        toast.error(
          error?.data?.detail || t("package.notifications.invalidData")
        );
      } else {
        toast.error(t("package.notifications.errorOccurred"));
      }
    }
  };

  // Prevent modal from closing when clicking inside
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Input field with icon component
  const InputField = ({
    label,
    name,
    value,
    type = "text",
    placeholder,
    icon: Icon,
    readOnly = false,
    required = true,
    error,
  }: {
    label: string;
    name: string;
    value: any;
    type?: string;
    placeholder?: string;
    icon: React.ElementType;
    readOnly?: boolean;
    required?: boolean;
    error?: string;
  }) => {
    // Store the input type for later reference
    useEffect(() => {
      inputTypes.current[name] = type;
    }, [name, type]);

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              error ? "border-red-300 bg-red-50" : "border-gray-200"
            } ${
              readOnly ? "bg-gray-50" : ""
            } focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200`}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            ref={(el) => {
              inputRefs.current[name] = el;
            }}
            onFocus={() => {
              focusedInputRef.current = name;
            }}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-pink-100/20 to-transparent rounded-full -translate-x-16 translate-y-16" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-pink-100/10 to-transparent rounded-full translate-x-8 translate-y-8" />
        <div className="absolute top-1/2 left-0 w-16 h-16 bg-gradient-to-r from-purple-100/10 to-transparent rounded-full -translate-x-8" />

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-serif tracking-wide text-gray-800">
                {t("package.editPackage")}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Error Messages */}
          <AnimatePresence>
            {Object.keys(validationErrors).length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 max-h-32 overflow-y-auto"
              >
                {Object.entries(validationErrors).map(
                  ([field, message], index) =>
                    message && (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 mb-2"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{message}</p>
                      </div>
                    )
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden ID field - data is still in formData but not visible */}
            <input type="hidden" name="id" value={formData.id} />

            {/* Name */}
            <InputField
              label={t("package.fields.packageName")}
              name="name"
              value={formData.name}
              icon={Package}
              placeholder={t("package.placeholders.enterPackageName")}
              error={validationErrors.name}
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("package.fields.description")}
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    validationErrors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  } focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200`}
                  placeholder={t("package.placeholders.enterDescription")}
                  required
                  ref={(el) => {
                    inputRefs.current["description"] = el;
                  }}
                  onFocus={() => {
                    focusedInputRef.current = "description";
                  }}
                />
              </div>
              {validationErrors.description && (
                <p className="text-red-500 text-sm">
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Two-column layout for smaller fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <InputField
                label={t("package.fields.price")}
                name="price"
                value={formData.price}
                type="number"
                icon={DollarSign}
                placeholder={t("package.placeholders.enterPrice")}
                error={validationErrors.price}
              />

              {/* Duration */}
              <InputField
                label={t("package.fields.duration")}
                name="duration"
                value={formData.duration}
                type="number"
                icon={Clock}
                placeholder={t("package.placeholders.enterDuration")}
                error={validationErrors.duration}
              />

              {/* Branch Limit */}
              <InputField
                label={t("package.fields.limitBranches")}
                name="limitBranch"
                value={formData.limitBranch}
                type="number"
                icon={Building2}
                placeholder={t("package.placeholders.enterLimitBranches")}
                error={validationErrors.limitBranch}
              />

              {/* Live Stream Limit */}
              <InputField
                label={t("package.fields.limitLiveStream")}
                name="limitLiveStream"
                value={formData.limitLiveStream}
                type="number"
                icon={Video}
                placeholder={t("package.placeholders.enterLimitLiveStream")}
                error={validationErrors.limitLiveStream}
              />

              {/* Price More Branch */}
              <InputField
                label={t("package.fields.priceBranchAddition")}
                name="priceBranchAddition"
                value={formData.priceBranchAddition || ""}
                type="number"
                icon={PlusCircle}
                placeholder={t("package.placeholders.enterPriceBranchAddition")}
                error={validationErrors.priceBranchAddition}
              />

              {/* Price More Livestream */}
              <InputField
                label={t("package.fields.priceLiveStreamAddition")}
                name="priceLiveStreamAddition"
                value={formData.priceLiveStreamAddition || ""}
                type="number"
                icon={PlusCircle}
                placeholder={t(
                  "package.placeholders.enterPriceLiveStreamAddition"
                )}
                error={validationErrors.priceLiveStreamAddition}
              />
            </div>

            {/* Enhanced Viewer - Full width */}
            <InputField
              label={t("package.fields.enhancedView")}
              name="enhancedViewer"
              value={formData.enhancedViewer}
              type="number"
              icon={Users}
              placeholder={t("package.placeholders.enterEnhancedView")}
              error={validationErrors.enhancedViewer}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 mt-2 border-t">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                {t("package.cancel")}
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>{t("package.saving")}</span>
                  </div>
                ) : (
                  t("package.saveChanges")
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
