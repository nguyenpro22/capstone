import React, { useState } from "react";
import { Clinic } from "@/features/clinic/types";
import { useUpdateClinicMutation } from "@/features/clinic/api";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, AlertCircle, FileText } from 'lucide-react';
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditClinicFormProps {
  initialData: Partial<Clinic>;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const EditClinicForm: React.FC<EditClinicFormProps> = ({ initialData, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState<Partial<Clinic>>(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [updateClinic, { isLoading }] = useUpdateClinicMutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);

    if (!formData.id) {
      setErrorMessages(["Clinic ID is missing"]);
      return;
    }

    const updatedFormData = new FormData();
    updatedFormData.append("clinicId", formData.id);
    updatedFormData.append("name", formData.name || "");
    updatedFormData.append("email", formData.email || "");
    updatedFormData.append("phoneNumber", formData.phoneNumber || "");
    updatedFormData.append("address", formData.address || "");
    if (selectedFile) {
      updatedFormData.append("profilePicture", selectedFile);
    }

    try {
      await updateClinic({ clinicId: formData.id, data: updatedFormData }).unwrap();
      toast.success("Cập nhật Clinic thành công!");
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      console.error("Update failed:", error);
      if (error?.data?.status === 422 && error?.data?.errors) {
        const messages = error.data.errors.map((err: any) => err.message);
        setErrorMessages(messages);
      } else {
        setErrorMessages(["Failed to update clinic. Please try again."]);
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
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full translate-x-16 -translate-y-16" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-pink-100/20 to-transparent rounded-full -translate-x-16 translate-y-16" />

    <div className="relative p-4 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-serif tracking-wide text-gray-800">Edit Clinic</h2>
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
            className="mb-6 max-h-32 overflow-y-auto"
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

          {/* Form (unchanged except for spacing) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Other fields remain the same, just adjust textarea rows if needed */}
        
        <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Clinic Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter clinic name"
                required
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 
                         focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 
                         transition-all duration-200"
                placeholder="Enter email"
                readOnly
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter clinic address"
                required
              />
            </div>

            {/* Profile Picture */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 
                         focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
              />
              {formData.profilePictureUrl && (
                <div className="mt-2">
                  <Image
                    src={formData.profilePictureUrl}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 
                         hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
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
                    <div className="w Ries-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditClinicForm;