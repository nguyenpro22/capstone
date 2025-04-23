"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Upload,
  Building,
  Phone,
  MapPin,
  FileText,
  Calendar,
  LogOut,
  Home,
} from "lucide-react";
import { clearCookieStorage, showError, showSuccess } from "@/utils";
import { useClinicRegistrationMutation } from "@/features/landing/api";
import { useGetApplicationQuery } from "@/features/partnership/api";
import {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
} from "@/features/address/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Validation errors interface
interface ValidationErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  operatingLicense?: string;
  operatingLicenseExpiryDate?: string;
  profilePictureUrl?: string;
  taxCode?: string;
  bankName?: string;
  bankAccountNumber?: string;
}

// File upload component
const FileUploadField = ({
  label,
  file,
  previewUrl,
  onChange,
  accept = "image/*,.pdf",
  t,
  error,
  fieldName,
}: {
  label: string;
  file: File | null;
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
  accept?: string;
  t: any;
  error?: string;
  fieldName: string;
}) => {
  // Use state to store the input element instead of a ref
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  // Create a unique ID for this file input
  const inputId = `file-input-${fieldName}`;

  // Log when the component renders
  useEffect(() => {
    console.log(
      `FileUploadField for ${label} rendered, fieldName: ${fieldName}`
    );
  }, [label, fieldName]);

  // Function to handle the file change button click
  const handleChangeClick = () => {
    console.log(`Clicking change button for ${label} (${fieldName})`);

    // Create a new file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.style.display = "none";

    // Add the change handler
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      console.log(`File input changed for ${label}`, target.files);
      const selectedFile = target.files?.[0];
      if (selectedFile) {
        if (selectedFile.size > 10 * 1024 * 1024) {
          alert(t("form.fileUpload.sizeError"));
          return;
        }
        onChange(selectedFile);
      }
      // Remove the input from the DOM after use
      document.body.removeChild(input);
    };

    // Add to DOM, click, and then remove after the dialog is closed
    document.body.appendChild(input);
    input.click();
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
        {label}
        <span className="text-purple-500">*</span>
      </p>
      {file ? (
        <div className="relative h-24 w-full group">
          {file.type.startsWith("image/") && previewUrl ? (
            <div className="h-full w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt={`Preview of ${label}`}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-1 text-purple-500/70" />
                <p className="text-sm font-medium text-center px-2 truncate max-w-[200px]">
                  {file.name}
                </p>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
            <Button
              type="button"
              size="sm"
              onClick={() => onChange(null)}
              className="h-8 bg-purple-600 hover:bg-purple-700"
            >
              {t("form.fileUpload.remove")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleChangeClick}
              className="h-8"
            >
              {t("form.fileUpload.change")}
            </Button>
          </div>
        </div>
      ) : previewUrl ? (
        // Display existing image from API
        <div className="relative h-24 w-full group">
          <div className="h-full w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt={`Preview of ${label}`}
              className="h-full w-full object-cover"
              width={100}
              height={100}
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleChangeClick}
              className="h-8"
            >
              {t("form.fileUpload.change")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={inputId}
            className={`flex flex-col items-center justify-center w-full h-24 border border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              error
                ? "border-red-300 dark:border-red-600"
                : "border-gray-300 dark:border-gray-600"
            } transition-colors duration-200`}
            onClick={(e) => {
              // Prevent the default behavior to handle it ourselves
              e.preventDefault();
              handleChangeClick();
            }}
          >
            <div className="flex flex-col items-center justify-center pt-4 pb-4">
              <Upload
                className={`w-8 h-8 mb-2 ${
                  error ? "text-red-500/70" : "text-purple-500/70"
                }`}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">
                  {t("form.fileUpload.clickToUpload")}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {accept === "image/*,.pdf" ? "JPG, PNG, PDF" : "JPG, PNG"} (max
                10MB)
              </p>
            </div>
          </label>
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Success message component
const SuccessMessage = ({ onGoHome }: { onGoHome: () => void }) => {
  clearCookieStorage();
  const t = useTranslations("registerClinic.reRegister");

  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {t("success.title") || "Registration Submitted Successfully!"}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {t("success.message") ||
          "Your request is now being processed. The approval process typically takes 2-5 business days. Thank you for your patience."}
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={onGoHome} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          {t("success.goHome") || "Go to Home"}
        </Button>
      </div>
    </div>
  );
};

export function ReRegisterClinicForm() {
  const t = useTranslations("registerClinic.reRegister");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registerClinic] = useClinicRegistrationMutation();
  const { data: applicationData, isLoading: isLoadingApplication } =
    useGetApplicationQuery("");

  const [fileErrors, setFileErrors] = useState<{
    operatingLicense?: string;
    businessLicense?: string;
    profilePictureUrl?: string;
  }>({});
  const [imageOperatingLicensePreview, setimageOperatingLicensePreview] =
    useState<string | null>(null);
  const [imageBusinessLicensePreview, setimageBusinessLicensePreview] =
    useState<string | null>(null);
  const [imageProfilePicturePreview, setimageProfilePicturePreview] = useState<
    string | null
  >(null);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Files state
  const [files, setFiles] = useState<{
    operatingLicense: File | null;
    businessLicense: File | null;
    profilePictureUrl: File | null;
  }>({
    operatingLicense: null,
    businessLicense: null,
    profilePictureUrl: null,
  });

  // Address details state
  const [addressDetail, setAddressDetail] = useState({
    provinceId: "",
    provinceName: "",
    districtId: "",
    districtName: "",
    wardId: "",
    wardName: "",
    streetAddress: "",
  });

  // Debug logging for application data
  useEffect(() => {
    console.log("Application data received:", applicationData);
    if (applicationData?.value) {
      console.log("Application value data:", applicationData.value);
      console.log("Name:", applicationData.value.name);
      console.log("Email:", applicationData.value.email);
      console.log("Phone:", applicationData.value.phoneNumber);
      console.log("Tax Code:", applicationData.value.taxCode);
    }
  }, [applicationData]);

  // Update file previews when files change
  useEffect(() => {
    let operatingLicenseURL: string | null = null;
    let businessLicenseURL: string | null = null;
    let profilePictureURL: string | null = null;

    // Create object URLs for file previews
    if (files.operatingLicense) {
      operatingLicenseURL = URL.createObjectURL(files.operatingLicense);
      setimageOperatingLicensePreview(operatingLicenseURL);
    } else if (applicationData?.value?.operatingLicense) {
      setimageOperatingLicensePreview(applicationData.value.operatingLicense);
    } else {
      setimageOperatingLicensePreview(null);
    }

    if (files.businessLicense) {
      businessLicenseURL = URL.createObjectURL(files.businessLicense);
      setimageBusinessLicensePreview(businessLicenseURL);
    } else if (applicationData?.value?.businessLicense) {
      setimageBusinessLicensePreview(applicationData.value.businessLicense);
    } else {
      setimageBusinessLicensePreview(null);
    }

    if (files.profilePictureUrl) {
      profilePictureURL = URL.createObjectURL(files.profilePictureUrl);
      setimageProfilePicturePreview(profilePictureURL);
    } else if (applicationData?.value?.profilePictureUrl) {
      setimageProfilePicturePreview(applicationData.value.profilePictureUrl);
    } else {
      setimageProfilePicturePreview(null);
    }

    // Debug log for file state
    console.log("Current files state:", {
      operatingLicense: files.operatingLicense?.name || "none",
      businessLicense: files.businessLicense?.name || "none",
      profilePictureUrl: files.profilePictureUrl?.name || "none",
    });

    // Cleanup to avoid memory leak
    return () => {
      if (operatingLicenseURL) URL.revokeObjectURL(operatingLicenseURL);
      if (businessLicenseURL) URL.revokeObjectURL(businessLicenseURL);
      if (profilePictureURL) URL.revokeObjectURL(profilePictureURL);
    };
  }, [files, applicationData]);

  // New state for general error message
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Fetch address data
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

  // Form validation schema - bank fields are optional now
  const formSchema = z.object({
    name: z.string().min(2, t("form.validation.nameRequired")),
    email: z.string().email(t("form.validation.emailInvalid")),
    phoneNumber: z
      .string()
      .min(1, t("form.validation.phoneRequired"))
      .regex(/^[0-9]{10,11}$/, t("form.validation.phoneInvalid")),
    taxCode: z.string().min(1, t("form.validation.taxCodeRequired")),
    bankName: z.string().optional(), // Optional now
    bankAccountNumber: z.string().optional(), // Optional now
    address: z.string().min(1, t("form.validation.addressRequired")),
    city: z.string().min(1, t("form.validation.cityRequired")),
    district: z.string().min(1, t("form.validation.districtRequired")),
    ward: z.string().min(1, t("form.validation.wardRequired")),
    operatingLicenseExpiryDate: z
      .string()
      .min(1, t("form.validation.expiryDateRequired")),
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    clearErrors,
    trigger,
    getValues,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      taxCode: "",
      bankName: "",
      bankAccountNumber: "",
      address: "",
      city: "",
      district: "",
      ward: "",
      operatingLicenseExpiryDate: "",
    },
  });

  // Populate form with application data when it loads
  useEffect(() => {
    if (applicationData?.value && applicationData.isSuccess) {
      console.log("Setting form values with data:", applicationData.value);
      const data = applicationData.value;

      // Set form values using reset to ensure all fields are updated
      reset({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        taxCode: data.taxCode || "",
        bankName: data.bankName || "",
        bankAccountNumber: data.bankAccountNumber || "",
        address: data.address?.split(",")[0]?.trim() || "",
        city: data.city || "",
        district: data.district || "",
        ward: data.ward || "",
        operatingLicenseExpiryDate: data.operatingLicenseExpiryDate
          ? new Date(data.operatingLicenseExpiryDate)
              .toISOString()
              .split("T")[0]
          : "",
      });

      // Set address details
      setAddressDetail((prev) => ({
        ...prev,
        provinceName: data.city || "",
        districtName: data.district || "",
        wardName: data.ward || "",
        streetAddress: data.address?.split(",")[0]?.trim() || "",
      }));

      // Directly update the input refs to ensure the DOM elements reflect the values
      if (nameInputRef.current) nameInputRef.current.value = data.name || "";
      if (emailInputRef.current) emailInputRef.current.value = data.email || "";
      if (phoneInputRef.current)
        phoneInputRef.current.value = data.phoneNumber || "";
      if (taxCodeInputRef.current)
        taxCodeInputRef.current.value = data.taxCode || "";
      if (addressInputRef.current)
        addressInputRef.current.value =
          data.address?.split(",")[0]?.trim() || "";
    }
  }, [applicationData, reset]);

  // Also, add this useEffect to ensure the province, district, and ward IDs are properly set
  // Add this after the existing useEffects:
  useEffect(() => {
    const setAddressIds = async () => {
      if (
        applicationData?.value &&
        provinces?.data &&
        !addressDetail.provinceId
      ) {
        // Only set province if it hasn't been manually selected yet
        const province = provinces.data.find(
          (p) => p.name === applicationData.value.city
        );
        if (province) {
          setAddressDetail((prev) => ({
            ...prev,
            provinceId: province.id,
          }));
        }
      }
    };

    setAddressIds();
  }, [applicationData, provinces, addressDetail.provinceId]);

  // Load district data when province is selected or changed
  useEffect(() => {
    if (
      addressDetail.provinceId &&
      districts?.data &&
      applicationData?.value &&
      !addressDetail.districtId
    ) {
      // Only set district if it hasn't been manually selected yet
      const district = districts.data.find(
        (d) => d.name === applicationData.value.district
      );
      if (district) {
        setAddressDetail((prev) => ({
          ...prev,
          districtId: district.id,
        }));
      }
    }
  }, [
    districts,
    addressDetail.provinceId,
    applicationData,
    addressDetail.districtId,
  ]);

  // Load ward data when district is selected or changed
  useEffect(() => {
    if (
      addressDetail.districtId &&
      wards?.data &&
      applicationData?.value &&
      !addressDetail.wardId
    ) {
      // Only set ward if it hasn't been manually selected yet
      const ward = wards.data.find(
        (w) => w.name === applicationData.value.ward
      );
      if (ward) {
        setAddressDetail((prev) => ({
          ...prev,
          wardId: ward.id,
        }));
      }
    }
  }, [wards, addressDetail.districtId, applicationData, addressDetail.wardId]);

  // Refs for input elements to handle autofill
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const taxCodeInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Handle autofill detection
  useEffect(() => {
    // Function to check if inputs have been autofilled
    const checkAutofill = () => {
      if (nameInputRef.current && nameInputRef.current.value) {
        setValue("name", nameInputRef.current.value);
      }
      if (emailInputRef.current && emailInputRef.current.value) {
        setValue("email", emailInputRef.current.value);
      }
      if (phoneInputRef.current && phoneInputRef.current.value) {
        setValue(
          "phoneNumber",
          phoneInputRef.current.value.replace(/[^0-9]/g, "")
        );
      }
      if (taxCodeInputRef.current && taxCodeInputRef.current.value) {
        setValue("taxCode", taxCodeInputRef.current.value);
      }
      if (addressInputRef.current && addressInputRef.current.value) {
        const value = addressInputRef.current.value;
        setAddressDetail((prev) => ({
          ...prev,
          streetAddress: value,
        }));
        setValue("address", value);
      }
    };

    // Check immediately and then periodically
    checkAutofill();
    const intervalId = setInterval(checkAutofill, 1000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, [setValue]);

  // Update validation errors when React Hook Form errors change
  useEffect(() => {
    if (isSubmitted && Object.keys(errors).length > 0) {
      const newValidationErrors: ValidationErrors = {};

      if (errors.name) {
        newValidationErrors.name = errors.name.message as string;
      }
      if (errors.email) {
        newValidationErrors.email = errors.email.message as string;
      }
      if (errors.phoneNumber) {
        newValidationErrors.phoneNumber = errors.phoneNumber.message as string;
      }
      if (errors.taxCode) {
        newValidationErrors.taxCode = errors.taxCode.message as string;
      }
      if (errors.address) {
        newValidationErrors.address = errors.address.message as string;
      }
      if (errors.city) {
        newValidationErrors.city = errors.city.message as string;
      }
      if (errors.district) {
        newValidationErrors.district = errors.district.message as string;
      }
      if (errors.ward) {
        newValidationErrors.ward = errors.ward.message as string;
      }
      if (errors.operatingLicenseExpiryDate) {
        newValidationErrors.operatingLicenseExpiryDate = errors
          .operatingLicenseExpiryDate.message as string;
      }

      setValidationErrors(newValidationErrors);
    }
  }, [errors, isSubmitted]);

  // Handle input change to clear validation errors
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  // Handle address field changes
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Clear validation errors for address fields
    if (
      validationErrors.address ||
      validationErrors.city ||
      validationErrors.district ||
      validationErrors.ward
    ) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (name === "streetAddress" || name === "address")
          delete newErrors.address;
        if (name === "provinceId") delete newErrors.city;
        if (name === "districtId") delete newErrors.district;
        if (name === "wardId") delete newErrors.ward;
        return newErrors;
      });
    }

    if (name === "provinceId" && provinces) {
      const province = provinces.data.find((p) => p.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        provinceId: value,
        provinceName: province?.name || "",
        districtId: "", // Clear district when province changes
        districtName: "",
        wardId: "", // Clear ward when province changes
        wardName: "",
      }));
      setValue("city", province?.name || "");
      setValue("district", ""); // Clear district value
      setValue("ward", ""); // Clear ward value
    } else if (name === "districtId" && districts) {
      const district = districts.data.find((d) => d.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        districtId: value,
        districtName: district?.name || "",
        wardId: "", // Clear ward when district changes
        wardName: "",
      }));
      setValue("district", district?.name || "");
      setValue("ward", ""); // Clear ward value
    } else if (name === "wardId" && wards) {
      const ward = wards.data.find((w) => w.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        wardId: value,
        wardName: ward?.name || "",
      }));
      setValue("ward", ward?.name || "");
    } else if (name === "streetAddress") {
      setAddressDetail((prev) => ({
        ...prev,
        streetAddress: value,
      }));
      setValue("address", value);
    }
  };

  // File change handlers
  const handleOperatingLicenseChange = (file: File | null) => {
    console.log("Operating license changed:", file?.name || "null");
    setFiles((prev) => ({ ...prev, operatingLicense: file }));
    if (fileErrors.operatingLicense) {
      setFileErrors((prev) => ({ ...prev, operatingLicense: undefined }));
    }
  };

  const handleBusinessLicenseChange = (file: File | null) => {
    console.log("Business license changed:", file?.name || "null");
    setFiles((prev) => ({ ...prev, businessLicense: file }));
    if (fileErrors.businessLicense) {
      setFileErrors((prev) => ({ ...prev, businessLicense: undefined }));
    }
  };

  const handleProfilePictureChange = (file: File | null) => {
    console.log("Profile picture changed:", file?.name || "null");
    setFiles((prev) => ({ ...prev, profilePictureUrl: file }));
    if (fileErrors.profilePictureUrl) {
      setFileErrors((prev) => ({ ...prev, profilePictureUrl: undefined }));
    }
  };

  // Validate form manually
  const validateForm = () => {
    // Get values directly from React Hook Form
    const formValues = getValues();

    // Manual validation for required fields
    const newValidationErrors: ValidationErrors = {};
    let hasValidationError = false;

    // Check each field
    if (!formValues.name || formValues.name.trim() === "") {
      newValidationErrors.name = t("form.validation.nameRequired");
      hasValidationError = true;
    }

    if (!formValues.email || formValues.email.trim() === "") {
      newValidationErrors.email = t("form.validation.emailInvalid");
      hasValidationError = true;
    }

    if (!formValues.phoneNumber || formValues.phoneNumber.trim() === "") {
      newValidationErrors.phoneNumber = t("form.validation.phoneRequired");
      hasValidationError = true;
    }

    if (!formValues.taxCode || formValues.taxCode.trim() === "") {
      newValidationErrors.taxCode = t("form.validation.taxCodeRequired");
      hasValidationError = true;
    }

    if (!formValues.address || formValues.address.trim() === "") {
      newValidationErrors.address = t("form.validation.addressRequired");
      hasValidationError = true;
    }

    if (!formValues.city || formValues.city.trim() === "") {
      newValidationErrors.city = t("form.validation.cityRequired");
      hasValidationError = true;
    }

    if (!formValues.district || formValues.district.trim() === "") {
      newValidationErrors.district = t("form.validation.districtRequired");
      hasValidationError = true;
    }

    if (!formValues.ward || formValues.ward.trim() === "") {
      newValidationErrors.ward = t("form.validation.wardRequired");
      hasValidationError = true;
    }

    if (
      !formValues.operatingLicenseExpiryDate ||
      formValues.operatingLicenseExpiryDate.trim() === ""
    ) {
      newValidationErrors.operatingLicenseExpiryDate = t(
        "form.validation.expiryDateRequired"
      );
      hasValidationError = true;
    }

    // Check for file errors - for re-registration, we don't require new files if they already exist
    const newFileErrors: any = {};
    let hasFileError = false;

    if (!files.operatingLicense && !applicationData?.value?.operatingLicense) {
      newFileErrors.operatingLicense = t(
        "form.validation.operatingLicenseRequired"
      );
      hasFileError = true;
    }

    if (!files.businessLicense && !applicationData?.value?.businessLicense) {
      newFileErrors.businessLicense = t(
        "form.validation.businessLicenseRequired"
      );
      hasFileError = true;
    }

    if (
      !files.profilePictureUrl &&
      !applicationData?.value?.profilePictureUrl
    ) {
      newFileErrors.profilePictureUrl = t(
        "form.validation.profilePictureRequired"
      );
      hasFileError = true;
    }

    // Set validation errors
    if (hasValidationError) {
      setValidationErrors(newValidationErrors);
    }

    // Set file errors
    if (hasFileError) {
      setFileErrors(newFileErrors);
    }

    return !hasValidationError && !hasFileError;
  };

  // Handle logout
  const handleLogout = () => {
    clearCookieStorage();
    router.push("/login");
  };

  // Handle navigation to home
  const handleGoHome = () => {
    clearCookieStorage();
    router.push("/");
  };

  // Form submission handler
  const onSubmit = async (
    data: z.infer<typeof formSchema>,
    e?: React.BaseSyntheticEvent
  ) => {
    // Prevent default form submission
    e?.preventDefault();

    console.log("Form submitted with data:", data);
    console.log("Files to be submitted:", {
      operatingLicense: files.operatingLicense?.name || "Using existing file",
      businessLicense: files.businessLicense?.name || "Using existing file",
      profilePictureUrl: files.profilePictureUrl?.name || "Using existing file",
    });

    // Reset errors
    setFileErrors({});
    setValidationErrors({});
    setGeneralError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Rest of your submission code...
      data.city = addressDetail.provinceName;
      data.district = addressDetail.districtName;
      data.ward = addressDetail.wardName;
      data.address = addressDetail.streetAddress;

      // Bank fields are passed as undefined
      data.bankName = data.bankName || undefined;
      data.bankAccountNumber = data.bankAccountNumber || undefined;

      // Create FormData
      const formData = new FormData();

      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        } else {
          formData.append(key, "");
        }
      });

      // Add files with null checks
      if (files.operatingLicense) {
        formData.append("operatingLicense", files.operatingLicense);
      }
      if (files.businessLicense) {
        formData.append("businessLicense", files.businessLicense);
      }
      if (files.profilePictureUrl) {
        formData.append("profilePictureUrl", files.profilePictureUrl);
      }

      // Submit to API
      await registerClinic(formData).unwrap();

      // Show success message
      showSuccess(t("form.toast.success.title"));

      // Set success state to show success page
      setIsSuccess(true);
    } catch (error: any) {
      // Keep the existing error handling code
      console.error("Error submitting form:", error);

      // Clear previous errors
      clearErrors();
      setFileErrors({});
      setValidationErrors({});
      setGeneralError(null);

      // Handle validation errors
      if (error.data.status === 422) {
        // Map field codes to form field names
        const fieldMapping: Record<string, string> = {
          Name: "name",
          Email: "email",
          PhoneNumber: "phoneNumber",
          TaxCode: "taxCode",
          BankName: "bankName",
          BankAccountNumber: "bankAccountNumber",
          Address: "address",
          City: "city",
          District: "district",
          Ward: "ward",
          OperatingLicenseExpiryDate: "operatingLicenseExpiryDate",
          BusinessLicense: "businessLicense",
          OperatingLicense: "operatingLicense",
          ProfilePictureUrl: "profilePictureUrl",
        };

        if (error.data?.errors && error.data.errors.length > 0) {
          // Create new validation errors object
          const newValidationErrors: ValidationErrors = {};
          const newFileErrors: {
            operatingLicense?: string;
            businessLicense?: string;
            profilePictureUrl?: string;
          } = {};

          // Set errors for each field
          error.data.errors.forEach(
            (err: { code: string; message: string }) => {
              const fieldName =
                fieldMapping[err.code] || err.code.toLowerCase();

              // Check if it's a file field
              if (
                fieldName === "operatingLicense" ||
                fieldName === "businessLicense" ||
                fieldName === "profilePictureUrl"
              ) {
                newFileErrors[fieldName as keyof typeof newFileErrors] =
                  err.message;
              } else if (fieldName) {
                newValidationErrors[fieldName as keyof ValidationErrors] =
                  err.message;
              }
            }
          );

          // Update validation errors state
          setValidationErrors(newValidationErrors);
          setFileErrors(newFileErrors);

          // Don't set general error for validation errors
        } else {
          // Don't show toast for validation errors
          showError(t("form.toast.error.validation"));
        }
      } else if (error.status === 400) {
        // Handle 400 errors
        if (error.data?.detail) {
          if (error.data.detail === "Clinics Request is handling !") {
            setGeneralError(t("form.toast.error.pendingRequest"));
            showError(t("form.toast.error.pendingRequest"));
          } else if (error.data.detail.includes("already exists")) {
            // Extract which fields already exist
            const detailMessage = error.data.detail;
            const newValidationErrors: ValidationErrors = {};

            // Check for each field in the error message
            if (detailMessage.includes("Email")) {
              newValidationErrors.email =
                t("form.validation.emailExists") || "Email already exists";
            }
            if (detailMessage.includes("Tax Code")) {
              newValidationErrors.taxCode =
                t("form.validation.taxCodeExists") || "Tax Code already exists";
            }
            if (detailMessage.includes("Phone Number")) {
              newValidationErrors.phoneNumber =
                t("form.validation.phoneNumberExists") ||
                "Phone Number already exists";
            }

            // Set validation errors for the specific fields
            setValidationErrors(newValidationErrors);

            // Don't show toast for duplicate info errors
            showError(t("form.toast.error.duplicateInfo"));
          } else {
            // Only show toast for other types of errors
            showError(error.data.detail || t("form.toast.error.title"));
          }
        } else {
          // Only show toast for general errors
          showError(t("form.toast.error.title"));
        }
      } else {
        // Only show toast for general errors
        showError(t("form.toast.error.title"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingApplication) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="ml-2 text-lg">
          {t("loading") || "Loading application data..."}
        </p>
      </div>
    );
  }

  if (!applicationData?.isSuccess) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-500">
          {t("loadError") ||
            "Failed to load application data. Please try again later."}
        </p>
      </div>
    );
  }

  // Show success page if registration was successful
  if (isSuccess) {
    return (
      <Card className="border-purple-200/30 shadow-lg max-w-7xl mx-auto">
        <CardContent className="p-6">
          <SuccessMessage onGoHome={handleGoHome} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200/30 shadow-lg max-w-7xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t("title") || "Re-Register Clinic"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("description") ||
                "Update your clinic registration information"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            {t("logout") || "Logout"}
          </Button>
        </div>

        {applicationData?.value?.rejectReason && (
          <div className="mt-4 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <h3 className="font-medium text-red-800 dark:text-red-400">
              {t("rejectionReason") || "Rejection Reason:"}
            </h3>
            <p className="mt-1 text-red-700 dark:text-red-300">
              {applicationData.value.rejectReason}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Clinic Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <Building className="h-5 w-5 text-purple-500" />
              {t("form.sections.clinicInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                  {t("form.fields.name")}
                  <span className="text-purple-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  ref={nameInputRef}
                  placeholder={t("form.placeholders.name")}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.name
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                  {t("form.fields.email")}
                  <span className="text-purple-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  ref={emailInputRef}
                  placeholder={t("form.placeholders.email")}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.email
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <Phone className="h-5 w-5 text-purple-500" />
              {t("form.sections.contactInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                  {t("form.fields.phoneNumber")}
                  <span className="text-purple-500">*</span>
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  ref={phoneInputRef}
                  placeholder={t("form.placeholders.phoneNumber")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setValue("phoneNumber", value);
                    handleInputChange({ ...e, target: { ...e.target, value } });
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.phoneNumber
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
                {validationErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                  {t("form.fields.taxCode")}
                  <span className="text-purple-500">*</span>
                </label>
                <input
                  type="text"
                  id="taxCode"
                  {...register("taxCode")}
                  ref={taxCodeInputRef}
                  placeholder={t("form.placeholders.taxCode")}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.taxCode
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
                {validationErrors.taxCode && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.taxCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Hidden bank fields - not displayed but still included in the form */}
          <input type="hidden" {...register("bankName")} />
          <input type="hidden" {...register("bankAccountNumber")} />

          {/* Address */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <MapPin className="h-5 w-5 text-purple-500" />
              {t("form.sections.address")}
            </h2>

            {/* Street Address - Full width */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                {t("form.fields.address")}
                <span className="text-purple-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                ref={addressInputRef}
                placeholder={t("form.placeholders.address")}
                value={addressDetail.streetAddress}
                onChange={(e) => {
                  handleAddressChange({
                    ...e,
                    target: { ...e.target, name: "streetAddress" },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className={`w-full px-3 py-2 h-10 border ${
                  validationErrors.address
                    ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              />
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {validationErrors.address}
                </p>
              )}
            </div>

            {/* City, District, Ward in one row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  {t("form.fields.city")}
                  <span className="text-purple-500">*</span>
                </label>
                <select
                  id="city"
                  name="provinceId"
                  value={addressDetail.provinceId}
                  onChange={(e) => {
                    const selectedProvince = provinces?.data.find(
                      (p) => p.id === e.target.value
                    );
                    setValue("city", selectedProvince?.name || "");
                    handleAddressChange(e);
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.city
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                >
                  <option value="">{t("form.placeholders.city")}</option>
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
                {validationErrors.city && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                  {t("form.fields.district")}
                  <span className="text-purple-500">*</span>
                </label>
                <select
                  id="district"
                  name="districtId"
                  value={addressDetail.districtId}
                  onChange={(e) => {
                    const selectedDistrict = districts?.data.find(
                      (d) => d.id === e.target.value
                    );
                    setValue("district", selectedDistrict?.name || "");
                    handleAddressChange(e);
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.district
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-70 disabled:cursor-not-allowed`}
                  disabled={!addressDetail.provinceId || isLoadingDistricts}
                >
                  <option value="">
                    {!addressDetail.provinceId
                      ? t("form.placeholders.selectCityFirst")
                      : isLoadingDistricts
                      ? "Loading districts..."
                      : t("form.placeholders.district")}
                  </option>
                  {districts?.data.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {validationErrors.district && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.district}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                  {t("form.fields.ward")}
                  <span className="text-purple-500">*</span>
                </label>
                <select
                  id="ward"
                  name="wardId"
                  value={addressDetail.wardId}
                  onChange={(e) => {
                    const selectedWard = wards?.data.find(
                      (w) => w.id === e.target.value
                    );
                    setValue("ward", selectedWard?.name || "");
                    handleAddressChange(e);
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.ward
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-70 disabled:cursor-not-allowed`}
                  disabled={!addressDetail.districtId || isLoadingWards}
                >
                  <option value="">
                    {!addressDetail.districtId
                      ? t("form.placeholders.selectDistrictFirst")
                      : isLoadingWards
                      ? "Loading wards..."
                      : t("form.placeholders.ward")}
                  </option>
                  {wards?.data.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
                {validationErrors.ward && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.ward}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* License Information */}
            <div className="col-span-4 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
                <FileText className="h-5 w-5 text-purple-500" />
                {t("form.sections.licenseInfo")}
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-500 inline mr-1" />
                  {t("form.fields.operatingLicenseExpiryDate")}
                  <span className="text-purple-500">*</span>
                </label>
                <input
                  type="date"
                  id="operatingLicenseExpiryDate"
                  {...register("operatingLicenseExpiryDate")}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className={`w-full px-3 py-2 h-10 border ${
                    validationErrors.operatingLicenseExpiryDate
                      ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                  } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                />
                {validationErrors.operatingLicenseExpiryDate && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {validationErrors.operatingLicenseExpiryDate}
                  </p>
                )}
              </div>
            </div>

            {/* File Uploads */}
            <div className="col-span-8 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
                <FileText className="h-5 w-5 text-purple-500" />
                {t("form.sections.documents")}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <FileUploadField
                  label={t("form.fields.operatingLicense")}
                  file={files.operatingLicense}
                  previewUrl={imageOperatingLicensePreview}
                  onChange={handleOperatingLicenseChange}
                  t={t}
                  error={fileErrors.operatingLicense}
                  fieldName="operating-license" // Add this fixed ID
                />
                <FileUploadField
                  label={t("form.fields.businessLicense")}
                  file={files.businessLicense}
                  previewUrl={imageBusinessLicensePreview}
                  onChange={handleBusinessLicenseChange}
                  t={t}
                  error={fileErrors.businessLicense}
                  fieldName="business-license" // Add this fixed ID
                />
                <FileUploadField
                  label={t("form.fields.profilePictureUrl")}
                  file={files.profilePictureUrl}
                  previewUrl={imageProfilePicturePreview}
                  onChange={handleProfilePictureChange}
                  t={t}
                  accept="image/*"
                  error={fileErrors.profilePictureUrl}
                  fieldName="profile-picture" // Add this fixed ID
                />
              </div>
            </div>
          </div>

          {/* Hidden inputs to connect with React Hook Form */}
          <input type="hidden" {...register("city")} />
          <input type="hidden" {...register("district")} />
          <input type="hidden" {...register("ward")} />

          {/* Submit Button */}
          <div className="pt-2 flex justify-center">
            <Button
              type="submit"
              className="px-8 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                t("form.submit") || "Re-Submit Application"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
