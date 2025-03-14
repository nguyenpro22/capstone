import { useState } from "react";
import { useUpdatePackageMutation } from "@/features/package/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, AlertCircle } from "lucide-react";

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
}

export default function EditPackageForm({ initialData, onClose, onSaveSuccess }: EditPackageFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
      toast.success("Package updated successfully!");
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
              <h2 className="text-2xl font-serif tracking-wide text-gray-800">Edit Package</h2>
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
            {/* ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Package ID</label>
              <input
                type="text"
                name="id"
                value={formData.documentId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                readOnly
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Package Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter package name"
                required
              />
              {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter package description"
                required
              />
              {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price (VND)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter price"
                required
              />
              {validationErrors.price && <p className="text-red-500 text-sm">{validationErrors.price}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Duration (Months)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-200"
                placeholder="Enter duration"
                required
              />
              {validationErrors.duration && <p className="text-red-500 text-sm">{validationErrors.duration}</p>}
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
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}