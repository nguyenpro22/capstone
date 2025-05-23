"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  Stethoscope,
  Calendar,
  FileText,
  ExternalLink,
  AlertCircle,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";
import { useUpdateDoctorMutation } from "@/features/clinic/api";
import {
  useUpdateDoctorCertificateMutation,
  useDeleteDoctorCertificateMutation,
} from "@/features/doctor/api";
import {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
} from "@/features/address/api";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import type { Staff, Certificate } from "@/features/clinic/types";
import Image from "next/image";
import type { AddressDetail } from "@/features/address/types";
import { useTheme } from "next-themes";

// Define the form schema with additional fields for doctors
const doctorSchema = z.object({
  id: z.string(),
  clinicId: z.string(),
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  // Additional fields for doctors
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

// Define proper types for the component props
interface EditDoctorFormProps {
  initialData: Staff;
  onClose: () => void;
  onSaveSuccess: () => void;
  onSaveSuccessCertificate: (doctorId: string) => void;
}

const EditDoctorForm: React.FC<EditDoctorFormProps> = ({
  initialData,
  onClose,
  onSaveSuccess,
  onSaveSuccessCertificate,
}) => {
  const t = useTranslations("staffDoctor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateDoctor] = useUpdateDoctorMutation();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("basic");
  const { theme } = useTheme();

  // Certificate editing states
  const [editingCertificateId, setEditingCertificateId] = useState<
    string | null
  >(null);
  const [editCertificateData, setEditCertificateData] = useState<{
    certificateName: string;
    expiryDate: string;
    note: string;
    certificateFile: File | null;
  }>({
    certificateName: "",
    expiryDate: "",
    note: "",
    certificateFile: null,
  });
  const [confirmDeleteCertificate, setConfirmDeleteCertificate] = useState<
    string | null
  >(null);
  const [updateCertificate, { isLoading: isUpdatingCertificate }] =
    useUpdateDoctorCertificateMutation();
  const [deleteCertificate, { isLoading: isDeletingCertificate }] =
    useDeleteDoctorCertificateMutation();
  const certificateFileInputRef = useRef<HTMLInputElement>(null);

  // Get the token and extract clinicId
  const token = getAccessToken();
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || initialData.clinicId || "";

  // Address state
  const [addressDetail, setAddressDetail] = useState<AddressDetail>({
    provinceId: "",
    provinceName: initialData.city || "",
    districtId: "",
    districtName: initialData.district || "",
    wardId: "",
    wardName: initialData.ward || "",
    streetAddress: initialData.address || "",
  });

  // RTK Query hooks for address data
  const { data: provinces, isLoading: isLoadingProvinces } =
    useGetProvincesQuery();
  const { data: districts, isLoading: isLoadingDistricts } =
    useGetDistrictsQuery(addressDetail.provinceId, {
      skip: !addressDetail.provinceId,
    });
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery(
    addressDetail.districtId,
    {
      skip: !addressDetail.districtId,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      id: initialData.id,
      clinicId: clinicId,
      email: initialData.email || "",
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      phoneNumber: initialData.phoneNumber || "",
      address: initialData.address || "",
    },
  });

  // Handle address selection changes
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "provinceId" && provinces) {
      const province = provinces.data.find((p) => p.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        provinceId: value,
        provinceName: province?.name || "",
        districtId: "",
        districtName: "",
        wardId: "",
        wardName: "",
      }));
    } else if (name === "districtId" && districts) {
      const district = districts.data.find((d) => d.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        districtId: value,
        districtName: district?.name || "",
        wardId: "",
        wardName: "",
      }));
    } else if (name === "wardId" && wards) {
      const ward = wards.data.find((w) => w.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        wardId: value,
        wardName: ward?.name || "",
      }));
    } else if (name === "streetAddress") {
      setAddressDetail((prev) => ({
        ...prev,
        streetAddress: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);

      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Clean up the preview URL when component unmounts or when a new file is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Get full address for display purposes
  const getFullAddress = (): string => {
    const parts: string[] = [];

    if (addressDetail.streetAddress) parts.push(addressDetail.streetAddress);
    if (addressDetail.wardName) parts.push(addressDetail.wardName);
    if (addressDetail.districtName) parts.push(addressDetail.districtName);
    if (addressDetail.provinceName) parts.push(addressDetail.provinceName);

    return parts.join(", ");
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Check if a certificate is expired
  const isExpired = (dateString: string): boolean => {
    try {
      const expiryDate = new Date(dateString);
      const today = new Date();
      return expiryDate < today;
    } catch (error) {
      return false;
    }
  };

  // Updated to use FormData with all fields
  const onSubmit = async (data: DoctorFormValues) => {
    setIsSubmitting(true);

    // Check if clinicId is available
    if (!clinicId) {
      toast.error(
        t("clinicIdNotFound") ||
          "Clinic ID not found. Please try again or contact support."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("userId", initialData.employeeId);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      // Add address components
      formData.append("address", addressDetail.streetAddress);
      formData.append("city", addressDetail.provinceName);
      formData.append("district", addressDetail.districtName);
      formData.append("ward", addressDetail.wardName);

      // Add phone number
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);

      // Add profile picture if selected
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await updateDoctor({
        id: clinicId,
        data: formData,
      }).unwrap();

      toast.success(
        t("doctorUpdatedSuccess") || "Doctor updated successfully!"
      );
      onSaveSuccess();
    } catch (error) {
      console.error("Failed to update doctor:", error);
      toast.error(
        t("doctorUpdatedFailed") || "Failed to update doctor. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open certificate in new tab
  const openCertificate = (url: string) => {
    window.open(url, "_blank");
  };

  // Certificate editing functions
  // Start editing a certificate
  const handleStartEditCertificate = (cert: Certificate) => {
    setEditingCertificateId(cert.id);

    // Parse the expiry date to get date component only
    const expiryDate = new Date(cert.expiryDate);
    const dateStr = expiryDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    setEditCertificateData({
      certificateName: cert.certificateName,
      expiryDate: dateStr,
      note: cert.note || "",
      certificateFile: null,
    });
  };

  // Cancel editing a certificate
  const handleCancelEditCertificate = () => {
    setEditingCertificateId(null);
  };

  // Handle certificate file change
  const handleCertificateFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setEditCertificateData((prev) => ({
        ...prev,
        certificateFile: e.target.files![0],
      }));
    }
  };

  // Update certificate
  // Update the handleUpdateCertificate function to include the ID in the FormData
  const handleUpdateCertificate = async (certId: string) => {
    if (
      !editCertificateData.certificateName ||
      !editCertificateData.expiryDate
    ) {
      toast.error(
        t("certificateNameAndExpiryRequired") ||
          "Certificate name and expiry date are required"
      );
      return;
    }

    try {
      // Format the date to ISO format (set time to end of day)
      const formattedDate = new Date(editCertificateData.expiryDate);
      formattedDate.setHours(23, 59, 59, 999); // Set to end of day
      const isoDateString = formattedDate.toISOString();

      const formData = new FormData();

      // Include the ID in the FormData
      formData.append("id", certId);

      // Always include the certificate name and expiry date
      formData.append("certificateName", editCertificateData.certificateName);
      formData.append("expiryDate", isoDateString);

      // Include the note field regardless of whether it's empty or not
      // This ensures we're sending back the original note if it wasn't changed
      formData.append("note", editCertificateData.note);

      // Only include the certificate file if a new one was selected
      if (editCertificateData.certificateFile) {
        formData.append("certificateFile", editCertificateData.certificateFile);
      }

      await updateCertificate({
        id: certId,
        formData: formData,
      }).unwrap();

      toast.success(
        t("certificateUpdatedSuccess") || "Certificate updated successfully!"
      );
      setEditingCertificateId(null);
      onSaveSuccessCertificate(initialData.employeeId); // Pass the doctor ID
    } catch (error: any) {
      console.error("Failed to update certificate:", error);

      // Handle validation errors
      if (error.data.status === 422 && error.data?.errors?.length > 0) {
        // Display each validation error message
        error.data.errors.forEach((err: { code: string; message: string }) => {
          toast.error(`${err.message}`);
        });
      } else if (error.data?.message) {
        // Display the error message if available
        toast.error(error.data.message);
      } else {
        // Fallback to generic error message
        toast.error(
          t("certificateUpdateFailed") ||
            "Failed to update certificate. Please try again."
        );
      }
    }
  };

  // Delete certificate
  const handleDeleteCertificate = async (certId: string) => {
    try {
      await deleteCertificate(certId).unwrap();
      toast.success(
        t("certificateDeletedSuccess") || "Certificate deleted successfully!"
      );
      setConfirmDeleteCertificate(null);
      onSaveSuccessCertificate(initialData.employeeId); // Pass the doctor ID
    } catch (error: any) {
      console.error("Failed to delete certificate:", error);

      // Handle validation errors
      if (error.status === 422 && error.data?.errors?.length > 0) {
        // Display each validation error message
        error.data.errors.forEach((err: { code: string; message: string }) => {
          toast.error(`${err.message}`);
        });
      } else if (error.data?.message) {
        // Display the error message if available
        toast.error(error.data.message);
      } else {
        // Fallback to generic error message
        toast.error(
          t("certificateDeleteFailed") ||
            "Failed to delete certificate. Please try again."
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 p-6 text-white relative">
          <h2 className="text-2xl font-bold">
            {t("editDoctor") || "Edit Doctor"}
          </h2>
          <p className="text-purple-100 dark:text-purple-50 mt-1">
            {t("updateDoctorInfo") || "Update doctor information"}
          </p>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 overflow-x-auto">
          <button
            onClick={() => setActiveSection("basic")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "basic"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <User className="w-4 h-4" />
            {t("basicInfo") || "Basic Info"}
          </button>
          <button
            onClick={() => setActiveSection("certificates")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "certificates"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <FileText className="w-4 h-4" />
            {t("certificates") || "Certificates"}
          </button>
          <button
            onClick={() => setActiveSection("address")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "address"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <MapPin className="w-4 h-4" />
            {t("address") || "Address"}
          </button>
          <button
            onClick={() => setActiveSection("photo")}
            className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSection === "photo"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <Upload className="w-4 h-4" />
            {t("photo") || "Photo"}
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6 dark:bg-gray-900">
          <form
            id="doctor-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("clinicId")} />

            {/* Basic Information Section */}
            {activeSection === "basic" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("firstName") || "First Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("firstName")}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.firstName
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                        placeholder="John"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("lastName") || "Last Name"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("lastName")}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.lastName
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                        placeholder="Doe"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("email") || "Email"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.email
                          ? "border-red-300 dark:border-red-700"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                      placeholder="email@example.com"
                      readOnly
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("phoneNumber") || "Phone Number"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("phoneNumber")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="+1234567890"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Certificates Section */}
            {activeSection === "certificates" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    {t("doctorCertificates") || "Doctor Certificates"}
                  </h3>
                </div>

                {initialData.doctorCertificates &&
                initialData.doctorCertificates.length > 0 ? (
                  <div className="space-y-4">
                    {initialData.doctorCertificates.map((cert) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border ${
                          isExpired(cert.expiryDate)
                            ? "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30"
                            : "border-purple-100 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
                        }`}
                      >
                        {editingCertificateId === cert.id ? (
                          // Edit mode
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                                {t("editCertificate") || "Edit Certificate"}
                              </h4>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateCertificate(cert.id)
                                  }
                                  disabled={isUpdatingCertificate}
                                  className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full transition-colors flex items-center gap-1"
                                >
                                  <Save className="w-4 h-4" />
                                  <span className="text-sm">
                                    {t("save") || "Save"}
                                  </span>
                                </button>
                                <button
                                  onClick={handleCancelEditCertificate}
                                  className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors flex items-center gap-1"
                                >
                                  <X className="w-4 h-4" />
                                  <span className="text-sm">
                                    {t("cancel") || "Cancel"}
                                  </span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {t("certificateName") || "Certificate Name"} *
                                </label>
                                <input
                                  type="text"
                                  value={editCertificateData.certificateName}
                                  onChange={(e) =>
                                    setEditCertificateData((prev) => ({
                                      ...prev,
                                      certificateName: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {t("expiryDate") || "Expiry Date"} *
                                </label>
                                <input
                                  type="date"
                                  value={editCertificateData.expiryDate}
                                  onChange={(e) =>
                                    setEditCertificateData((prev) => ({
                                      ...prev,
                                      expiryDate: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("note") || "Note"} (
                                {t("optional") || "Optional"})
                              </label>
                              <textarea
                                value={editCertificateData.note}
                                onChange={(e) =>
                                  setEditCertificateData((prev) => ({
                                    ...prev,
                                    note: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("replaceCertificateFile") ||
                                  "Replace Certificate File"}{" "}
                                ({t("optional") || "Optional"})
                              </label>
                              <div
                                onClick={() =>
                                  certificateFileInputRef.current?.click()
                                }
                                className="w-full px-3 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                              >
                                <Upload className="w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {editCertificateData.certificateFile
                                    ? editCertificateData.certificateFile.name
                                    : t("clickToUploadNewFile") ||
                                      "Click to upload new certificate file"}
                                </p>
                                <input
                                  type="file"
                                  ref={certificateFileInputRef}
                                  onChange={handleCertificateFileChange}
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                              </div>
                            </div>

                            <div className="mt-2">
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {t("currentCertificate") ||
                                  "Current Certificate"}
                                :
                              </p>
                              <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                                <Image
                                  src={
                                    cert.certificateUrl || "/placeholder.svg"
                                  }
                                  alt={cert.certificateName}
                                  fill
                                  className="object-contain"
                                  onError={(e) => {
                                    // If image fails to load, replace with a placeholder
                                    (e.target as HTMLImageElement).src =
                                      "/formal-certificate.png";
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                {cert.certificateName}
                                {isExpired(cert.expiryDate) && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {t("expired") || "Expired"}
                                  </span>
                                )}
                              </h4>

                              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span>
                                  {t("expiryDate") || "Expiry Date"}:{" "}
                                  {formatDate(cert.expiryDate)}
                                </span>
                              </div>

                              {cert.note && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">
                                    {t("note") || "Note"}:
                                  </span>{" "}
                                  {cert.note}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleStartEditCertificate(cert)}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                title={
                                  t("editCertificate") || "Edit Certificate"
                                }
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmDeleteCertificate(cert.id)
                                }
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                title={
                                  t("deleteCertificate") || "Delete Certificate"
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              {/* View Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  openCertificate(cert.certificateUrl)
                                }
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-full transition-colors"
                                title={
                                  t("viewCertificate") || "View Certificate"
                                }
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("noCertificates") || "No certificates available"}
                    </p>
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {t("certificateNote") ||
                        "You can edit or delete certificates directly from this tab. Changes to certificates will be saved immediately."}
                    </span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Address Information Section */}
            {activeSection === "address" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Province Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("city") || "Province/City"}
                    </label>
                    <select
                      name="provinceId"
                      value={addressDetail.provinceId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">
                        {addressDetail.provinceName || "Select Province/City"}
                      </option>
                      {isLoadingProvinces ? (
                        <option disabled>Loading provinces...</option>
                      ) : (
                        provinces?.data.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* District Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("district") || "District"}
                    </label>
                    <select
                      name="districtId"
                      value={addressDetail.districtId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      disabled={!addressDetail.provinceId || isLoadingDistricts}
                    >
                      <option value="">
                        {addressDetail.districtName ||
                          (!addressDetail.provinceId
                            ? "Select province first"
                            : isLoadingDistricts
                            ? "Loading districts..."
                            : "Select District")}
                      </option>
                      {districts?.data.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ward Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("ward") || "Ward"}
                    </label>
                    <select
                      name="wardId"
                      value={addressDetail.wardId}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      disabled={!addressDetail.districtId || isLoadingWards}
                    >
                      <option value="">
                        {addressDetail.wardName ||
                          (!addressDetail.districtId
                            ? "Select district first"
                            : isLoadingWards
                            ? "Loading wards..."
                            : "Select Ward")}
                      </option>
                      {wards?.data.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("address") || "Street Address"}
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={addressDetail.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="123 Main St"
                    />
                  </div>
                </div>

                {/* Preview Full Address */}
                {(addressDetail.provinceName ||
                  addressDetail.provinceId ||
                  addressDetail.streetAddress) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-100 dark:border-purple-700"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("fullAddress") || "Full Address"}:
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                      {getFullAddress()}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Profile Picture Section */}
            {activeSection === "photo" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                      {t("profilePicture") || "Profile Picture"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("uploadProfilePictureDesc") ||
                        "Upload a profile picture for this doctor"}
                    </p>
                  </div>

                  {initialData.profilePictureUrl && !profilePicture && (
                    <div className="mb-6">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                        <Image
                          src={
                            initialData.profilePictureUrl || "/placeholder.svg"
                          }
                          alt={initialData.fullName || "Doctor"}
                          className="w-full h-full object-cover"
                          width={160}
                          height={160}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                        {t("currentPhoto") || "Current photo"}
                      </p>
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors bg-gray-50 dark:bg-gray-800 overflow-hidden relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      {profilePicture ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {previewUrl ? (
                            <Image
                              src={previewUrl || "/placeholder.svg"}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                              width={100}
                              height={100}
                            />
                          ) : (
                            <Check className="w-10 h-10 text-green-500 dark:text-green-400" />
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center absolute bottom-2 bg-white/70 dark:bg-gray-800/70 w-full py-1">
                            {profilePicture.name.length > 20
                              ? profilePicture.name.substring(0, 20) + "..."
                              : profilePicture.name}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {t("uploadImage") || "Upload Image"}
                          </span>
                        </>
                      )}
                    </div>
                  </label>

                  {profilePicture && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                        }
                      }}
                      className="mt-4 px-3 py-1 text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      {t("remove") || "Remove"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Footer with Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-2"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activeSection === "basic"
                  ? t("editingBasicInfo") || "Editing basic information"
                  : activeSection === "certificates"
                  ? t("viewingCertificates") || "Viewing certificates"
                  : activeSection === "address"
                  ? t("editingAddress") || "Editing address information"
                  : t("editingPhoto") || "Editing profile photo"}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="submit"
                form="doctor-form"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-500 dark:hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("saving") || "Saving..."}
                  </>
                ) : (
                  t("save") || "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Certificate Confirmation Dialog */}
      {confirmDeleteCertificate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {t("deleteCertificate") || "Delete Certificate"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("deleteCertificateConfirmation") ||
                  "Are you sure you want to delete this certificate? This action cannot be undone."}
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setConfirmDeleteCertificate(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {t("cancel") || "Cancel"}
                </button>
                <button
                  onClick={() =>
                    confirmDeleteCertificate &&
                    handleDeleteCertificate(confirmDeleteCertificate)
                  }
                  disabled={isDeletingCertificate}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 rounded-md hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeletingCertificate
                    ? t("deleting") || "Deleting..."
                    : t("deleteCertificate") || "Delete Certificate"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EditDoctorForm;
