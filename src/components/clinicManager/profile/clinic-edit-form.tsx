"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useUpdateClinicMutation } from "@/features/clinic/api";
import {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
} from "@/features/address/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  X,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  ImageIcon,
  Search,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useGetBanksQuery } from "@/features/bank/api";
import type { Bank } from "@/features/bank/types";
// Add the import for useTranslations at the top of the file, after the other imports
import { useTranslations } from "next-intl"; // Add this import

// Interfaces
interface ClinicEditFormProps {
  initialData: any;
  onClose: () => void;
  onSaveSuccess: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  bankName?: string;
  bankAccountNumber?: string;
  profilePicture?: string;
}

interface AddressDetail {
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
  streetAddress: string;
}

export default function ClinicEditForm({
  initialData,
  onClose,
  onSaveSuccess,
}: ClinicEditFormProps) {
  const t = useTranslations("clinicProfile.updateProfile");
  const [formData, setFormData] = useState({
    ...initialData,
    bankName: initialData.bankName || "",
    bankAccountNumber: initialData.bankAccountNumber || "",
    workingTimeStart: initialData.workingTimeStart || "",
    workingTimeEnd: initialData.workingTimeEnd || "",
  });

  const [addressDetail, setAddressDetail] = useState<AddressDetail>({
    provinceId: "",
    provinceName: initialData.city || "",
    districtId: "",
    districtName: initialData.district || "",
    wardId: "",
    wardName: initialData.ward || "",
    streetAddress: initialData.address || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [updateClinic, { isLoading }] = useUpdateClinicMutation();

  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
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

  const { data: bankData, isLoading: isBanksLoading } = useGetBanksQuery();

  // Find province ID by name when provinces are loaded
  useEffect(() => {
    if (
      provinces?.data &&
      addressDetail.provinceName &&
      !addressDetail.provinceId
    ) {
      const province = provinces.data.find(
        (p) => p.name === addressDetail.provinceName
      );
      if (province) {
        setAddressDetail((prev) => ({
          ...prev,
          provinceId: province.id,
        }));
      }
    }
  }, [provinces, addressDetail.provinceName, addressDetail.provinceId]);

  // Add this after the useEffect that finds province ID by name
  useEffect(() => {
    if (provinces?.data && !isLoadingProvinces) {
      console.log("Provinces loaded successfully");
    }
  }, [provinces, isLoadingProvinces]);

  // Find district ID by name when districts are loaded
  useEffect(() => {
    if (
      districts?.data &&
      addressDetail.districtName &&
      !addressDetail.districtId
    ) {
      const district = districts.data.find(
        (d) => d.name === addressDetail.districtName
      );
      if (district) {
        setAddressDetail((prev) => ({
          ...prev,
          districtId: district.id,
        }));
      }
    }
  }, [districts, addressDetail.districtName, addressDetail.districtId]);

  // Add this after the useEffect that finds district ID by name
  useEffect(() => {
    if (districts?.data && !isLoadingDistricts && addressDetail.provinceId) {
      console.log(
        "Districts loaded successfully for province:",
        addressDetail.provinceName
      );
    }
  }, [
    districts,
    isLoadingDistricts,
    addressDetail.provinceId,
    addressDetail.provinceName,
  ]);

  // Find ward ID by name when wards are loaded
  useEffect(() => {
    if (wards?.data && addressDetail.wardName && !addressDetail.wardId) {
      const ward = wards.data.find((w) => w.name === addressDetail.wardName);
      if (ward) {
        setAddressDetail((prev) => ({
          ...prev,
          wardId: ward.id,
        }));
      }
    }
  }, [wards, addressDetail.wardName, addressDetail.wardId]);

  // Add this after the useEffect that finds ward ID by name
  useEffect(() => {
    if (wards?.data && !isLoadingWards && addressDetail.districtId) {
      console.log(
        "Wards loaded successfully for district:",
        addressDetail.districtName
      );
    }
  }, [
    wards,
    isLoadingWards,
    addressDetail.districtId,
    addressDetail.districtName,
  ]);

  useEffect(() => {
    if (bankData?.data && formData.bankName && !selectedBank) {
      const matchingBank = bankData.data.find(
        (bank) =>
          bank.name === formData.bankName ||
          bank.shortName === formData.bankName
      );
      if (matchingBank) {
        setSelectedBank(matchingBank);
      } else if (formData.bankName) {
        toast.warning(
          `Could not find bank "${formData.bankName}" in our database`
        );
      }
    }
  }, [bankData, formData.bankName, selectedBank]);

  // Close bank dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBankDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [bankDropdownRef]);

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

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setFormData((prev: any) => ({ ...prev, bankName: bank.name }));
    setBankSearchTerm("");
    setShowBankDropdown(false);
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

    // Send address components separately
    updatedFormData.append("address", addressDetail.streetAddress);
    updatedFormData.append("city", addressDetail.provinceName);
    updatedFormData.append("district", addressDetail.districtName);
    updatedFormData.append("ward", addressDetail.wardName);

    // Add banking information
    updatedFormData.append("bankName", formData.bankName);
    updatedFormData.append("bankAccountNumber", formData.bankAccountNumber);

    // Add working hours information
    updatedFormData.append("workingTimeStart", formData.workingTimeStart);
    updatedFormData.append("workingTimeEnd", formData.workingTimeEnd);

    if (selectedFile) {
      updatedFormData.append("profilePicture", selectedFile);
    }

    try {
      await updateClinic({
        clinicId: formData.id,
        data: updatedFormData,
      }).unwrap();
      toast.success("Clinic updated successfully!");
      // Call onSaveSuccess before closing the form
      onSaveSuccess();
      // Then close the form
      onClose();
    } catch (error: any) {
      console.error("Update failed:", error);
      if (error?.data?.status === 422 && error?.data?.errors) {
        const messages = error.data.errors.map((err: any) => err.message);
        setErrorMessages(messages);
        toast.error("Please fix the validation errors");
      } else if (error?.status === "FETCH_ERROR") {
        toast.error(
          "Network error. Please check your connection and try again."
        );
        setErrorMessages([
          "Network error. Please check your connection and try again.",
        ]);
      } else {
        toast.error("Failed to update clinic. Please try again.");
        setErrorMessages(["Failed to update clinic. Please try again."]);
      }
    }
  };

  const filteredBanks =
    bankData?.data?.filter(
      (bank) =>
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
        bank.shortName.toLowerCase().includes(bankSearchTerm.toLowerCase())
    ) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto p-4 pt-10 pb-10"
      onClick={(e) => {
        // Only close the modal when clicking on the backdrop, not when clicking on the content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-gray-900 my-4 overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent event propagation
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">{t("editClinic")}</h2>
          <p className="text-purple-100 dark:text-purple-200 mt-1">
            {t("updateClinicInfo")}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={t("close")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col max-h-[calc(90vh-120px)]">
          <div className="p-4 md:p-6 overflow-y-auto flex-grow">
            {/* Error Messages */}
            {errorMessages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-lg border border-red-200 dark:border-red-800 overflow-hidden"
              >
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <p className="text-red-700 dark:text-red-300 font-medium">
                    {t("fixErrors")}:
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 space-y-2">
                  {errorMessages.map((message, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <span className="mt-0.5">•</span>
                      <span>{message}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>{t("basicInfo")}</span>
                </h3>
                <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("clinicName")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleFormChange}
                        className="w-full pl-3 md:pl-4 pr-10 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder={t("enterClinicName")}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleFormChange}
                        className="w-full pl-3 md:pl-4 pr-10 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder={t("enterEmail")}
                        readOnly
                      />
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("phoneNumber")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={(e) => {
                          // Only allow numbers and some special characters
                          const value = e.target.value.replace(
                            /[^\d\s+()-]/g,
                            ""
                          );
                          setFormData((prev: any) => ({
                            ...prev,
                            phoneNumber: value,
                          }));
                        }}
                        pattern="[0-9\s+()-]{10,15}"
                        className="w-full pl-3 md:pl-4 pr-10 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder={t("enterPhoneNumber")}
                        title={t("validPhoneNumber")}
                        required
                      />
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>{t("bankingInfo")}</span>
                </h3>

                <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("bankName")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={bankDropdownRef}>
                      {isBanksLoading ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          {t("loadingBanks")}
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative">
                            <input
                              type="text"
                              value={bankSearchTerm}
                              onChange={(e) => {
                                setBankSearchTerm(e.target.value);
                                setShowBankDropdown(true);
                              }}
                              onFocus={() => setShowBankDropdown(true)}
                              className="w-full pl-3 md:pl-4 pr-3 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                              placeholder={t("searchBank")}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          </div>

                          {selectedBank && (
                            <div className="mt-2 flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800">
                              {selectedBank.logo && (
                                <Image
                                  src={selectedBank.logo || "/placeholder.svg"}
                                  alt={selectedBank.shortName}
                                  className="h-6 w-auto"
                                  width={100}
                                  height={100}
                                />
                              )}
                              <span className="font-medium text-purple-700 dark:text-purple-300">
                                {selectedBank.name}
                              </span>
                            </div>
                          )}

                          {showBankDropdown && bankSearchTerm && (
                            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                              {filteredBanks.length > 0 ? (
                                filteredBanks.map((bank) => (
                                  <div
                                    key={bank.id}
                                    className="flex items-center gap-2 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer"
                                    onClick={() => handleBankSelect(bank)}
                                  >
                                    {bank.logo && (
                                      <Image
                                        src={bank.logo || "/placeholder.svg"}
                                        alt={bank.shortName}
                                        className="h-6 w-auto"
                                        width={100}
                                        height={100}
                                      />
                                    )}
                                    <div>
                                      <div className="font-medium text-gray-800 dark:text-gray-200">
                                        {bank.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {bank.shortName}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                                  {t("noBanksFound")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("bankAccountNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleFormChange}
                        className="w-full pl-3 md:pl-4 pr-10 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder={t("enterAccountNumber")}
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>{t("workingHours")}</span>
                </h3>

                <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("openingTime")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="workingTimeStart"
                        value={formData.workingTimeStart}
                        onChange={handleFormChange}
                        className="w-full pl-3 md:pl-4 pr-10 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        required
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("closingTime")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="workingTimeEnd"
                        value={formData.workingTimeEnd}
                        onChange={handleFormChange}
                        className="w-full pl-3 md:pl-4 pr-10 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        required
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>{t("addressDetails")}</span>
                </h3>

                <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                  {/* Province Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("provinceCity")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {isLoadingProvinces ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          {t("loadingProvinces")}
                        </div>
                      ) : (
                        <select
                          name="provinceId"
                          value={addressDetail.provinceId}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                          required
                        >
                          <option value="">{t("selectProvinceCity")}</option>
                          {provinces?.data.map((province) => (
                            <option key={province.id} value={province.id}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {!addressDetail.provinceId &&
                        addressDetail.provinceName && (
                          <div className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                            {t("current")}: {addressDetail.provinceName}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* District Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("district")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {!addressDetail.provinceId ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          {t("selectProvinceFirst")}
                        </div>
                      ) : isLoadingDistricts ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          {t("loadingDistricts")}
                        </div>
                      ) : (
                        <select
                          name="districtId"
                          value={addressDetail.districtId}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                          required
                        >
                          <option value="">{t("selectDistrict")}</option>
                          {districts?.data.map((district) => (
                            <option key={district.id} value={district.id}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {!addressDetail.districtId &&
                        addressDetail.districtName && (
                          <div className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                            {t("current")}: {addressDetail.districtName}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Ward Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("ward")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {!addressDetail.districtId ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          {t("selectDistrictFirst")}
                        </div>
                      ) : isLoadingWards ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          {t("loadingWards")}
                        </div>
                      ) : (
                        <select
                          name="wardId"
                          value={addressDetail.wardId}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                          required
                        >
                          <option value="">{t("selectWard")}</option>
                          {wards?.data.map((ward) => (
                            <option key={ward.id} value={ward.id}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                      )}
                      {!addressDetail.wardId && addressDetail.wardName && (
                        <div className="mt-1 text-sm text-amber-600 dark:text-amber-500">
                          {t("current")}: {addressDetail.wardName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {t("streetAddress")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={addressDetail.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full pl-3 md:pl-4 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      placeholder={t("enterStreetAddress")}
                      required
                    />
                  </div>
                </div>

                {/* Preview Full Address */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-100 dark:border-purple-800"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {t("fullAddress")}:
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                    {addressDetail.streetAddress &&
                      `${addressDetail.streetAddress}, `}
                    {addressDetail.wardName && `${addressDetail.wardName}, `}
                    {addressDetail.districtName &&
                      `${addressDetail.districtName}, `}
                    {addressDetail.provinceName}
                  </p>
                </motion.div>
              </div>

              {/* Profile Picture */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  <span>{t("profilePicture")}</span>
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    {t("profilePicture")}{" "}
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">
                      ({t("optional")})
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-900 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500/30 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                      accept=".jpg, .jpeg, .png"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("acceptedFormats")}
                  </p>

                  {formData.profilePictureUrl && (
                    <div className="mt-2 flex items-center gap-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("currentImage")}:
                      </p>
                      <Image
                        src={formData.profilePictureUrl || "/placeholder.svg"}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions - Fixed at bottom */}
            </form>
          </div>{" "}
          {/* Close the overflow-y-auto div */}
          <div className="sticky bottom-0 left-0 right-0 p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-xl shadow-md z-10">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>{t("saving")}</span>
                  </>
                ) : (
                  <span>{t("saveChanges")}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
