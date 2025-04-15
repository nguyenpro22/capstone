"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Add the IUser interface at the top of the file
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string; // You can use string for ISO date format or Date if you're parsing it
  email: string;
  phone: string;
  profilePicture: string | null; // Profile picture can either be a string (URL) or null
  city: string | null; // City can be a string or null
  district: string | null; // District can be a string or null
  ward: string | null; // Ward can be a string or null
  address: string | null; // Address can be a string or null
  fullAddress: string; // Full address is a string, can be empty
}

// Import the RTK Query hooks at the top of the file
import {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
} from "@/features/address/api";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/features/home/api";
import { toast } from "react-toastify";

// Import the useGetUserProfileQuery hook

interface DoctorProfileFormProps {
  onProfileUpdated?: () => void;
  refetch: () => void;
}

export default function DoctorProfileForm({
  onProfileUpdated,
  refetch,
}: DoctorProfileFormProps) {
  const t = useTranslations("doctorProfile");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [profileImageError, setProfileImageError] = useState<string | null>(
    null
  );

  const [addressDetail, setAddressDetail] = useState({
    provinceId: "",
    provinceName: "",
    districtId: "",
    districtName: "",
    wardId: "",
    wardName: "",
    streetAddress: "",
  });

  // Add this to the component's state declarations
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    ward?: string;
  }>({});

  // Inside the DoctorProfileForm component, add this after the state declarations:
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetUserProfileQuery();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const user = profile?.value;

  // Replace the mock data fetching with RTK Query hooks
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

  // Form validation schema
  const formSchema = z.object({
    firstName: z.string().min(1, t("firstNameRequired")),
    lastName: z.string().min(1, t("lastNameRequired")),
    dateOfBirth: z.date({
      required_error: t("dateOfBirthRequired"),
    }),
    email: z.string().email(t("invalidEmail")),
    phone: z.string().regex(/^\+?[0-9\s]{10,15}$/, t("invalidPhone")),
    city: z.string().nullable(),
    district: z.string().nullable(),
    ward: z.string().nullable(),
    address: z.string().nullable(),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      email: "",
      phone: "",
      city: null,
      district: null,
      ward: null,
      address: null,
    },
  });

  // Update the useEffect for loading user data to use the actual user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Use the actual user data from the API
        if (!user) return;

        form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth
            ? new Date(user.dateOfBirth)
            : undefined,
          email: user.email,
          phone: user.phone,
          city: user.city,
          district: user.district,
          ward: user.ward,
          address: user.address,
        });

        // Set profile image preview
        if (user.profilePicture) {
          setProfileImagePreview(user.profilePicture);
        }

        // Set address details if provinces are loaded
        if (provinces?.data && user.city) {
          const province = provinces.data.find((p) => p.name === user.city);
          if (province) {
            setAddressDetail((prev) => ({
              ...prev,
              provinceId: province.id,
              provinceName: province.name,
              streetAddress: user.address || "",
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast.error(t("errorLoadingProfile"));
      }
    };

    if (user) {
      loadUserData();
    }
  }, [form, toast, t, user, provinces]);

  // Load district data when province changes or when initial province is set
  useEffect(() => {
    const loadDistrictData = async () => {
      if (!user || !districts?.data || !addressDetail.provinceId) return;

      if (user.district) {
        const district = districts.data.find((d) => d.name === user.district);
        if (district) {
          setAddressDetail((prev) => ({
            ...prev,
            districtId: district.id,
            districtName: district.name,
          }));
        }
      }
    };

    loadDistrictData();
  }, [user, districts, addressDetail.provinceId]);

  // Load ward data when district changes or when initial district is set
  useEffect(() => {
    const loadWardData = async () => {
      if (!user || !wards?.data || !addressDetail.districtId) return;

      if (user.ward) {
        const ward = wards.data.find((w) => w.name === user.ward);
        if (ward) {
          setAddressDetail((prev) => ({
            ...prev,
            wardId: ward.id,
            wardName: ward.name,
          }));
        }
      }
    };

    loadWardData();
  }, [user, wards, addressDetail.districtId]);

  // Replace the handleAddressChange function with this implementation
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
      form.setValue("city", province?.name || "");
    } else if (name === "districtId" && districts) {
      const district = districts.data.find((d) => d.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        districtId: value,
        districtName: district?.name || "",
        wardId: "",
        wardName: "",
      }));
      form.setValue("district", district?.name || "");
    } else if (name === "wardId" && wards) {
      const ward = wards.data.find((w) => w.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        wardId: value,
        wardName: ward?.name || "",
      }));
      form.setValue("ward", ward?.name || "");
    } else if (name === "streetAddress") {
      setAddressDetail((prev) => ({
        ...prev,
        streetAddress: value,
      }));
      form.setValue("address", value);
    }
  };

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setProfileImageError(null); // Clear any previous error
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Check if profile image is provided
    if (!profileImage && !profileImagePreview) {
      setProfileImageError(t("profileImageRequired"));
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append(
        "dateOfBirth",
        values.dateOfBirth.toISOString().split("T")[0]
      );
      formData.append("phoneNumber", values.phone);

      // Use address details from the state
      if (addressDetail.provinceName)
        formData.append("city", addressDetail.provinceName);
      if (addressDetail.districtName)
        formData.append("district", addressDetail.districtName);
      if (addressDetail.wardName)
        formData.append("ward", addressDetail.wardName);
      if (addressDetail.streetAddress)
        formData.append("address", addressDetail.streetAddress);
      if (profileImage) formData.append("profilePicture", profileImage);

      // Use the actual API call
      const response = await updateUserProfile(formData).unwrap();
      refetch();

      if (response.isSuccess) {
        toast.success(t("profileUpdated"));

        // Call the callback if provided
        if (onProfileUpdated) {
          onProfileUpdated();
        }
      } else {
        throw new Error(t("errorUpdatingProfile"));
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(t("errorUpdatingProfile"));
    } finally {
      setIsLoading(false);
    }
  };

  // Add loading state for the profile
  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <div className="text-red-500 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-1">{t("errorLoadingProfile")}</h3>
        <p className="text-muted-foreground mb-4">{t("tryAgainLater")}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {t("tryAgain")}
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <div className="text-amber-500 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2"
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
        <h3 className="text-xl font-medium mb-1">{t("noProfileFound")}</h3>
        <p className="text-muted-foreground">
          {t("profileNotFoundDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/20">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t("personalInformation")}
              </CardTitle>
              <CardDescription>{t("personalInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative">
                  {profileImagePreview ? (
                    <Avatar className="w-24 h-24 border-2 border-purple-200 dark:border-purple-700">
                      <AvatarImage
                        src={profileImagePreview || "/placeholder.svg"}
                        alt={form.getValues("firstName")}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xl">
                        {form.getValues("firstName").charAt(0)}
                        {form.getValues("lastName").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-purple-200 dark:border-purple-700">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-purple-400 mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground">
                          {t("uploadImage")}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2">
                    <Label htmlFor="profile-picture" className="cursor-pointer">
                      <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md border border-purple-200 dark:border-purple-700">
                        <Upload className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </Label>
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    {form.getValues("firstName")} {form.getValues("lastName")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {form.getValues("email")}
                  </p>
                  {profileImageError && (
                    <p className="text-sm text-red-500 mt-1">
                      {profileImageError}
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Image Required Alert */}
              {!profileImagePreview && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("profileImageRequired")}</AlertTitle>
                  <AlertDescription>
                    {t("profileImageRequiredDescription")}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("firstName")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("lastName")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("dateOfBirth")}</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Day Select */}
                        <select
                          value={
                            field.value ? new Date(field.value).getDate() : ""
                          }
                          onChange={(e) => {
                            const day = Number.parseInt(e.target.value);
                            if (isNaN(day)) return;

                            const currentDate = field.value
                              ? new Date(field.value)
                              : new Date();
                            currentDate.setDate(day);
                            field.onChange(currentDate);
                          }}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">{t("day")}</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            )
                          )}
                        </select>

                        {/* Month Select */}
                        <select
                          value={
                            field.value ? new Date(field.value).getMonth() : ""
                          }
                          onChange={(e) => {
                            const month = Number.parseInt(e.target.value);
                            if (isNaN(month)) return;

                            const currentDate = field.value
                              ? new Date(field.value)
                              : new Date();
                            currentDate.setMonth(month);

                            // Adjust for month length
                            const daysInMonth = new Date(
                              currentDate.getFullYear(),
                              month + 1,
                              0
                            ).getDate();
                            if (currentDate.getDate() > daysInMonth) {
                              currentDate.setDate(daysInMonth);
                            }

                            field.onChange(currentDate);
                          }}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">{t("month")}</option>
                          {Array.from({ length: 12 }, (_, i) => i).map(
                            (month) => (
                              <option key={month} value={month}>
                                {t(`months.${month}`)}
                              </option>
                            )
                          )}
                        </select>

                        {/* Year Select */}
                        <select
                          value={
                            field.value
                              ? new Date(field.value).getFullYear()
                              : ""
                          }
                          onChange={(e) => {
                            const year = Number.parseInt(e.target.value);
                            if (isNaN(year)) return;

                            const currentDate = field.value
                              ? new Date(field.value)
                              : new Date();
                            currentDate.setFullYear(year);

                            // Adjust for leap years
                            if (
                              currentDate.getMonth() === 1 &&
                              currentDate.getDate() > 28
                            ) {
                              const daysInMonth = new Date(
                                year,
                                2,
                                0
                              ).getDate();
                              if (currentDate.getDate() > daysInMonth) {
                                currentDate.setDate(daysInMonth);
                              }
                            }

                            field.onChange(currentDate);
                          }}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">{t("year")}</option>
                          {Array.from(
                            { length: 100 },
                            (_, i) => new Date().getFullYear() - i
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      {field.value && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {t("formattedDate", {
                            date: field.value.getDate(),
                            month: t(`months.${field.value.getMonth()}`),
                            year: field.value.getFullYear(),
                          })}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/20">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t("addressInformation")}
              </CardTitle>
              <CardDescription>{t("addressInfoDescription")}</CardDescription>
            </CardHeader>
            {/* Replace the address information card content with this implementation */}
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center gap-1.5">
                    {t("streetAddress")}
                    <span className="text-purple-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...form.register("address")}
                    placeholder={t("enterStreetAddress")}
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
                    {t("city")}
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
                      form.setValue("city", selectedProvince?.name || "");
                      handleAddressChange(e);
                    }}
                    className={`w-full px-3 py-2 h-10 border ${
                      validationErrors.city
                        ? "border-red-300 dark:border-red-600 focus:ring-red-200 dark:focus:ring-red-700/50 focus:border-red-500 dark:focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                    } rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                  >
                    <option value="">{t("selectCity")}</option>
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
                    {t("district")}
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
                      form.setValue("district", selectedDistrict?.name || "");
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
                        ? t("selectCityFirst")
                        : isLoadingDistricts
                        ? "Loading districts..."
                        : t("selectDistrict")}
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
                    {t("ward")}
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
                      form.setValue("ward", selectedWard?.name || "");
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
                        ? t("selectDistrictFirst")
                        : isLoadingWards
                        ? "Loading wards..."
                        : t("selectWard")}
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

              {/* Full Address Preview */}
              {(addressDetail.streetAddress ||
                addressDetail.wardName ||
                addressDetail.districtName ||
                addressDetail.provinceName) && (
                <div className="mt-4">
                  <Label>{t("fullAddress")}</Label>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-purple-100 dark:border-purple-800/30 mt-1">
                    {[
                      addressDetail.streetAddress,
                      addressDetail.wardName,
                      addressDetail.districtName,
                      addressDetail.provinceName,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onProfileUpdated}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("saveChanges")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
