"use client";

import { useState } from "react";
import { useCreateBranchMutation } from "@/features/clinic/api"; // Adjust import path as needed
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, AlertCircle, FileText } from "lucide-react";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";

interface BranchFormProps {
  onClose: () => void;
  onSaveSuccess: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  operatingLicense?: string;
  operatingLicenseExpiryDate?: string;
  profilePictureUrl?: string;
}

export default function BranchForm({ onClose, onSaveSuccess }: BranchFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    operatingLicense: null as File | null,
    operatingLicenseExpiryDate: "",
    profilePictureUrl: null as File | null,
  });
//   const token = getAccessToken() as string;
//   const { clinicId } = GetDataByToken(token) as TokenData;
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [createBranch, { isLoading }] = useCreateBranchMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "operatingLicense" | "profilePictureUrl") => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.files![0],
      }));
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("address", formData.address);
    if (formData.operatingLicense) {
      formDataToSend.append("operatingLicense", formData.operatingLicense);
    }
    if (formData.profilePictureUrl) {
      formDataToSend.append("profilePictureUrl", formData.profilePictureUrl);
    }
    if (formData.operatingLicenseExpiryDate) {
      formDataToSend.append("operatingLicenseExpiryDate", formData.operatingLicenseExpiryDate);
    }

    try {
      await createBranch({ data: formDataToSend }).unwrap();
      toast.success("Branch created successfully!");
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error response:", error);
      if (error?.status === 400 || error?.status === 422) {
        const validationErrors = error?.data?.errors || [];
        const newErrors: ValidationErrors = {};
        validationErrors.forEach((err: { code: string; message: string }) => {
          newErrors[err.code.toLowerCase() as keyof ValidationErrors] = err.message;
        });
        setValidationErrors(newErrors);
        toast.error(error?.data?.detail || "Invalid data provided!");
      } else {
        toast.error("An error occurred, please try again!");
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
        className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-pink-100/20 to-transparent rounded-full -translate-x-16 translate-y-16" />

        <div className="relative p-4 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-serif tracking-wide text-gray-800">Create Branch</h2>
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
            {Object.keys(validationErrors).length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 max-h-32 overflow-y-auto"
              >
                {Object.entries(validationErrors).map(([field, message], index) => (
                  message && (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 mb-2"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <p className="text-sm">{message}</p>
                    </div>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Branch Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter branch name"
                required
              />
              {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter email"
                required
              />
              {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter phone number"
                required
              />
              {validationErrors.phoneNumber && <p className="text-red-500 text-sm">{validationErrors.phoneNumber}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter address"
                required
              />
              {validationErrors.address && <p className="text-red-500 text-sm">{validationErrors.address}</p>}
            </div>

            {/* Operating License (File Upload) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Operating License</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "operatingLicense")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                accept="application/pdf,image/*"
              />
              {validationErrors.operatingLicense && <p className="text-red-500 text-sm">{validationErrors.operatingLicense}</p>}
            </div>

            {/* Operating License Expiry Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Operating License Expiry Date</label>
              <input
                type="date"
                name="operatingLicenseExpiryDate"
                value={formData.operatingLicenseExpiryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                required
              />
              {validationErrors.operatingLicenseExpiryDate && <p className="text-red-500 text-sm">{validationErrors.operatingLicenseExpiryDate}</p>}
            </div>

            {/* Profile Picture (File Upload) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "profilePictureUrl")}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                accept="image/*"
              />
              {validationErrors.profilePictureUrl && <p className="text-red-500 text-sm">{validationErrors.profilePictureUrl}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Create Branch"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}