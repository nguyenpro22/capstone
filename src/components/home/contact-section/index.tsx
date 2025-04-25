"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Upload,
  Building,
  Phone,
  MapPin,
  FileText,
  Calendar,
} from "lucide-react";
import { showError, showSuccess } from "@/utils";
import { useClinicRegistrationMutation } from "@/features/landing/api";
import {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
} from "@/features/address/api";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
}: {
  label: string;
  file: File | null;
  previewUrl?: string | null; // ⬅️ Thêm props này
  onChange: (file: File | null) => void;
  accept?: string;
  t: any;
  error?: string;
}) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
        {label}
        <span className="text-purple-500">*</span>
      </p>
      {file ? (
        <div className="relative h-28 w-full group">
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
              onClick={() => document.getElementById(`${label}-input`)?.click()}
              className="h-8"
            >
              {t("form.fileUpload.change")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`${label}-input`}
            className={`flex flex-col items-center justify-center w-full h-28 border border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              error
                ? "border-red-300 dark:border-red-600"
                : "border-gray-300 dark:border-gray-600"
            } transition-colors duration-200`}
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
            <Input
              id={`${label}-input`}
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    alert(t("form.fileUpload.sizeError"));
                    return;
                  }
                  onChange(file);
                }
              }}
            />
          </label>
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export function RegisterClinicForm() {
  const t = useTranslations("registerClinic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerClinic] = useClinicRegistrationMutation();
  const router = useRouter();
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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

  // First, add the state for terms acceptance near the other states
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  useEffect(() => {
    let operatingLicenseURL: string | null = null;
    let businessLicenseURL: string | null = null;
    let profilePictureURL: string | null = null;

    if (files) {
      if (files.operatingLicense) {
        operatingLicenseURL = URL.createObjectURL(files.operatingLicense);
        setimageOperatingLicensePreview(operatingLicenseURL);
      } else {
        setimageOperatingLicensePreview(null);
      }

      if (files.businessLicense) {
        businessLicenseURL = URL.createObjectURL(files.businessLicense);
        setimageBusinessLicensePreview(businessLicenseURL);
      } else {
        setimageBusinessLicensePreview(null);
      }

      if (files.profilePictureUrl) {
        profilePictureURL = URL.createObjectURL(files.profilePictureUrl);
        setimageProfilePicturePreview(profilePictureURL);
      } else {
        setimageProfilePicturePreview(null);
      }
    }

    // Cleanup để tránh memory leak
    return () => {
      if (operatingLicenseURL) URL.revokeObjectURL(operatingLicenseURL);
      if (businessLicenseURL) URL.revokeObjectURL(businessLicenseURL);
      if (profilePictureURL) URL.revokeObjectURL(profilePictureURL);
    };
  }, [files]);
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
    console.log(`Input change: ${name} = ${value}`);

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
        districtId: "",
        districtName: "",
        wardId: "",
        wardName: "",
      }));
      setValue("city", province?.name || "");
    } else if (name === "districtId" && districts) {
      const district = districts.data.find((d) => d.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        districtId: value,
        districtName: district?.name || "",
        wardId: "",
        wardName: "",
      }));
      setValue("district", district?.name || "");
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

  // Validate form manually
  const validateForm = () => {
    // Get values directly from React Hook Form
    const formValues = getValues();
    console.log("Form values from getValues():", formValues);

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

    // Check for file errors
    const newFileErrors: any = {};
    let hasFileError = false;

    if (!files.operatingLicense) {
      newFileErrors.operatingLicense = t(
        "form.validation.operatingLicenseRequired"
      );
      hasFileError = true;
    }

    if (!files.businessLicense) {
      newFileErrors.businessLicense = t(
        "form.validation.businessLicenseRequired"
      );
      hasFileError = true;
    }

    if (!files.profilePictureUrl) {
      newFileErrors.profilePictureUrl = t(
        "form.validation.profilePictureRequired"
      );
      hasFileError = true;
    }

    // Add terms validation
    if (!acceptTerms) {
      setTermsError(true);
      return false;
    }
    setTermsError(false);

    // Set validation errors
    if (hasValidationError) {
      console.log("Manual validation errors:", newValidationErrors);
      setValidationErrors(newValidationErrors);
    }

    // Set file errors
    if (hasFileError) {
      console.log("File errors:", newFileErrors);
      setFileErrors(newFileErrors);
    }

    return !hasValidationError && !hasFileError;
  };

  // Form submission handler
  const onSubmit = async (
    data: z.infer<typeof formSchema>,
    e?: React.BaseSyntheticEvent
  ) => {
    // Prevent default form submission
    e?.preventDefault();

    console.log("Form submitted with data:", data);

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

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      clearErrors();
      setFileErrors({});
      setValidationErrors({});
      setValue("name", "");
      setValue("email", "");
      setValue("phoneNumber", "");
      setValue("taxCode", "");
      setValue("bankName", "");
      setValue("bankAccountNumber", "");
      setValue("address", "");
      setValue("city", "");
      setValue("district", "");
      setValue("ward", "");
      setValue("operatingLicenseExpiryDate", "");

      // Reset the ref values for input elements
      if (nameInputRef.current) nameInputRef.current.value = "";
      if (emailInputRef.current) emailInputRef.current.value = "";
      if (phoneInputRef.current) phoneInputRef.current.value = "";
      if (taxCodeInputRef.current) taxCodeInputRef.current.value = "";
      if (addressInputRef.current) addressInputRef.current.value = "";

      setFiles({
        operatingLicense: null,
        businessLicense: null,
        profilePictureUrl: null,
      });

      setAddressDetail({
        provinceId: "",
        provinceName: "",
        districtId: "",
        districtName: "",
        wardId: "",
        wardName: "",
        streetAddress: "",
      });
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
          const newFileErrors: any = {};

          // Set errors for each field
          error.data.errors.forEach(
            (err: { code: string; message: string }) => {
              const fieldName =
                fieldMapping[err.code] || err.code.toLowerCase();
              console.log(
                `Setting error for field: ${fieldName}, message: ${err.message}`
              );

              // Check if it's a file field
              if (
                fieldName === "operatingLicense" ||
                fieldName === "businessLicense" ||
                fieldName === "profilePictureUrl"
              ) {
                newFileErrors[fieldName] = err.message;
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

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    router.push("/");
  };

  return (
    <Card className="border-purple-200/30 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Clinic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <Building className="h-5 w-5 text-purple-500" />
              {t("form.sections.clinicInfo")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <Phone className="h-5 w-5 text-purple-500" />
              {t("form.sections.contactInfo")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <MapPin className="h-5 w-5 text-purple-500" />
              {t("form.sections.address")}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          {/* License Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <FileText className="h-5 w-5 text-purple-500" />
              {t("form.sections.licenseInfo")}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
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
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-gray-800">
              <FileText className="h-5 w-5 text-purple-500" />
              {t("form.sections.documents")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FileUploadField
                label={t("form.fields.operatingLicense")}
                file={files.operatingLicense}
                previewUrl={imageOperatingLicensePreview}
                onChange={(file) => {
                  setFiles({ ...files, operatingLicense: file });
                  if (fileErrors.operatingLicense) {
                    setFileErrors((prev) => ({
                      ...prev,
                      operatingLicense: undefined,
                    }));
                  }
                }}
                t={t}
                error={fileErrors.operatingLicense}
              />
              <FileUploadField
                label={t("form.fields.businessLicense")}
                file={files.businessLicense}
                previewUrl={imageBusinessLicensePreview}
                onChange={(file) => {
                  setFiles({ ...files, businessLicense: file });
                  if (fileErrors.businessLicense) {
                    setFileErrors((prev) => ({
                      ...prev,
                      businessLicense: undefined,
                    }));
                  }
                }}
                t={t}
                error={fileErrors.businessLicense}
              />
              <FileUploadField
                label={t("form.fields.profilePictureUrl")}
                file={files.profilePictureUrl}
                previewUrl={imageProfilePicturePreview}
                onChange={(file) => {
                  setFiles({ ...files, profilePictureUrl: file });
                  if (fileErrors.profilePictureUrl) {
                    setFileErrors((prev) => ({
                      ...prev,
                      profilePictureUrl: undefined,
                    }));
                  }
                }}
                t={t}
                accept="image/*"
                error={fileErrors.profilePictureUrl}
              />
            </div>
          </div>

          {/* Hidden inputs to connect with React Hook Form */}
          <input type="hidden" {...register("city")} />
          <input type="hidden" {...register("district")} />
          <input type="hidden" {...register("ward")} />

          {/* Terms and Services - Add this before the Submit Button */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (e.target.checked) {
                    setTermsError(false);
                  }
                }}
                className={`h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800 ${
                  termsError ? "border-red-500 dark:border-red-600" : ""
                }`}
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {t("form.terms.text")}{" "}
                <Link
                  href="/policy"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                  target="_blank"
                >
                  {t("form.terms.link")}
                </Link>
              </label>
            </div>
            {termsError && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {t("form.terms.required")}
              </p>
            )}
          </div>

          {/* Submit Button - Update the disabled condition */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isSubmitting || !acceptTerms}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                t("form.submit")
              )}
            </Button>
          </div>
        </form>
        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center justify-center text-xl">
                <CheckCircle className="h-6 w-6 text-green-500" />
                {t("dialog.success.title")}
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                {t("dialog.success.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-3 py-3">
              <p className="text-center text-muted-foreground">
                {t("dialog.success.emailSent")}
              </p>
              <p className="text-center text-muted-foreground">
                {t("dialog.success.checkEmail")}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">
                  {t("dialog.success.nextSteps")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("dialog.success.processingTime")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("dialog.success.contactSupport")}
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-center sm:justify-center">
              <Button
                onClick={() => handleCloseSuccessDialog()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {t("dialog.success.close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
