"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import {
  PencilIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AtSignIcon,
  UserIcon,
  WalletIcon,
  HomeIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  HistoryIcon,
  Loader2,
} from "lucide-react";

// API and Utilities
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/features/home/api";
import {
  useGetProvincesQuery,
  useGetDistrictsQuery,
  useGetWardsQuery,
} from "@/features/address/api";
import { cn } from "@/lib/utils";
import type { IUser } from "@/features/home/types";

// Components
import { RecentTransactions } from "@/components/home/profile/transaction/recent-transactions";
import { DepositFlow } from "@/components/home/profile/deposit/deposit-flow";
import { WithdrawFlow } from "@/components/home/profile/withdraw/withdraw-flow";
import TransactionHistory from "@/components/home/profile/transaction/transaction-history";
import { useSearchParams } from "next/navigation";

// Types
type TabType = "profile" | "wallet" | "deposit" | "withdraw" | "history";

const initialProfile: IUser = {
  id: "",
  firstName: "",
  lastName: "",
  fullName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  profilePicture: null,
  city: null,
  district: null,
  ward: null,
  address: null,
  fullAddress: "",
  balance: 0,
};

export default function ProfilePage() {
  // API Hooks
  const { data: profileData, refetch } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const searchParams = useSearchParams();
  console.log(searchParams);

  // Profile state
  const [profile, setProfile] = useState<IUser>(initialProfile);
  const [formData, setFormData] = useState<IUser>(initialProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [profileImageError, setProfileImageError] = useState<string | null>(
    null
  );
  const [depositAmount, setDepositAmount] = useState(0);

  // Address state
  const [addressDetail, setAddressDetail] = useState({
    provinceId: "",
    provinceName: "",
    districtId: "",
    districtName: "",
    wardId: "",
    wardName: "",
    streetAddress: "",
  });

  // Tab navigation
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Address data queries
  const { data: provinces } = useGetProvincesQuery();
  const { data: districts } = useGetDistrictsQuery(addressDetail.provinceId, {
    skip: !addressDetail.provinceId,
  });
  const { data: wards } = useGetWardsQuery(addressDetail.districtId, {
    skip: !addressDetail.districtId,
  });

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const amountParam = searchParams.get("amount");

    if (
      tabParam &&
      ["profile", "wallet", "deposit", "withdraw", "history"].includes(tabParam)
    ) {
      setActiveTab(tabParam as TabType);
    }

    if (tabParam === "deposit" && amountParam && !isNaN(Number(amountParam))) {
      setDepositAmount(Number(amountParam));
    }
  }, []);

  // Initialize profile data
  useEffect(() => {
    if (profileData?.value) {
      const userData = profileData.value;

      // Set profile and form data
      const mergedProfile: IUser = {
        ...initialProfile,
        ...userData,
      };

      setProfile(mergedProfile);
      setFormData(mergedProfile);

      // Set profile image preview if available
      if (userData.profilePicture) {
        setProfileImagePreview(userData.profilePicture);
      }
    }
  }, [profileData]);

  // Initialize address data when provinces are loaded
  useEffect(() => {
    if (provinces?.data && profile.city) {
      const province = provinces.data.find((p) => p.name === profile.city);
      if (province) {
        setAddressDetail((prev) => ({
          ...prev,
          provinceId: province.id,
          provinceName: province.name,
          streetAddress: profile.address || "",
        }));
      }
    }
  }, [provinces, profile]);

  // Load district data when province changes
  useEffect(() => {
    if (districts?.data && profile.district && addressDetail.provinceId) {
      const district = districts.data.find((d) => d.name === profile.district);
      if (district) {
        setAddressDetail((prev) => ({
          ...prev,
          districtId: district.id,
          districtName: district.name,
        }));
      }
    }
  }, [districts, profile, addressDetail.provinceId]);

  // Load ward data when district changes
  useEffect(() => {
    if (wards?.data && profile.ward && addressDetail.districtId) {
      const ward = wards.data.find((w) => w.name === profile.ward);
      if (ward) {
        setAddressDetail((prev) => ({
          ...prev,
          wardId: ward.id,
          wardName: ward.name,
        }));
      }
    }
  }, [wards, profile, addressDetail.districtId]);

  // Handle input changes for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle address changes
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
      setFormData((prev) => ({
        ...prev,
        city: province?.name || null,
        district: null,
        ward: null,
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
      setFormData((prev) => ({
        ...prev,
        district: district?.name || null,
        ward: null,
      }));
    } else if (name === "wardId" && wards) {
      const ward = wards.data.find((w) => w.id === value);
      setAddressDetail((prev) => ({
        ...prev,
        wardId: value,
        wardName: ward?.name || "",
      }));
      setFormData((prev) => ({ ...prev, ward: ward?.name || null }));
    } else if (name === "streetAddress") {
      setAddressDetail((prev) => ({
        ...prev,
        streetAddress: value,
      }));
      setFormData((prev) => ({ ...prev, address: value || null }));
    }
  };

  // Handle profile image change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileImageError("Kích thước ảnh vượt quá 5MB.");
      return;
    }

    setProfileImageError(null);
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Create FormData for submission
      const formDataPayload = new FormData();

      // Add basic profile information
      formDataPayload.append("firstName", formData.firstName);
      formDataPayload.append("lastName", formData.lastName);

      // Format date properly
      if (formData.dateOfBirth) {
        const dateValue =
          typeof formData.dateOfBirth === "string"
            ? formData.dateOfBirth
            : formData.dateOfBirth;
        formDataPayload.append("dateOfBirth", dateValue.split("T")[0]);
      }

      // Add phone number (API expects phoneNumber, not phone)
      formDataPayload.append("phoneNumber", formData.phone);

      // Add address information
      if (addressDetail.streetAddress) {
        formDataPayload.append("address", addressDetail.streetAddress);
      }

      if (addressDetail.provinceName) {
        formDataPayload.append("city", addressDetail.provinceName);
      }

      if (addressDetail.districtName) {
        formDataPayload.append("district", addressDetail.districtName);
      }

      if (addressDetail.wardName) {
        formDataPayload.append("ward", addressDetail.wardName);
      }

      // Add profile picture if changed
      if (profileImage) {
        formDataPayload.append("profilePicture", profileImage);
      }

      // Submit the form
      const response = await updateUserProfile(formDataPayload).unwrap();

      // Update UI and show success message
      if (response.isSuccess) {
        toast.success("Cập nhật thông tin thành công");
        await refetch();
        setIsEditing(false);
      } else {
        throw new Error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(profile);
    setProfileImagePreview(profile.profilePicture);
    setProfileImage(null);
    setProfileImageError(null);
    setIsEditing(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Handle balance update from deposit or withdraw
  const handleBalanceUpdate = (newBalance: number) => {
    setProfile((prev) => ({ ...prev, balance: newBalance }));
  };

  return (
    <div className="h-[90vh] overflow-hidden">
      <div className="max-w-6xl mx-auto pt-6 h-[90%]">
        <div className="flex h-full gap-4 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-xl dark:shadow-purple-900/20 p-4 flex flex-col">
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12 border-2 border-purple-200 dark:border-purple-800">
                <AvatarImage
                  src={profile.profilePicture || ""}
                  alt={profile.fullName}
                />
                <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white truncate">
                  {profile.fullName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-purple-50/70 dark:bg-purple-900/20 rounded-lg p-3 mb-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Số dư ví
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(profile.balance || 0)}
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-0 flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "profile"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("profile")}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                Thông tin cá nhân
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "wallet"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("wallet")}
              >
                <WalletIcon className="h-5 w-5 mr-3" />
                Ví của tôi
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "deposit"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("deposit")}
              >
                <ArrowDownIcon className="h-5 w-5 mr-3" />
                Nạp tiền
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "withdraw"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("withdraw")}
              >
                <ArrowUpIcon className="h-5 w-5 mr-3" />
                Rút tiền
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === "history"
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
                onClick={() => setActiveTab("history")}
              >
                <HistoryIcon className="h-5 w-5 mr-3" />
                Lịch sử giao dịch
              </Button>
            </nav>

            {/* Home Button */}
            <div className="">
              <Button
                variant="outline"
                className="w-full border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Quay lại trang chủ
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card className="h-full border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="pb-2 px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                        Thông tin cá nhân
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Xem và quản lý thông tin cá nhân của bạn
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                        >
                          {isLoading && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Lưu thay đổi
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Personal Information Section */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                      <h2 className="text-base font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Thông tin cá nhân
                      </h2>

                      {isEditing ? (
                        <>
                          <div className="mb-4">
                            <Label
                              htmlFor="profile-picture"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                              Ảnh đại diện
                            </Label>
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <Avatar className="h-16 w-16 border-2 border-purple-200 dark:border-purple-800">
                                  <AvatarImage
                                    src={
                                      profileImagePreview ||
                                      profile.profilePicture ||
                                      ""
                                    }
                                    alt={profile.fullName}
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                                    {profile.firstName.charAt(0)}
                                    {profile.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  <Label
                                    htmlFor="profile-picture-upload"
                                    className="cursor-pointer"
                                  >
                                    <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-purple-200 dark:border-purple-700">
                                      <PencilIcon className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                    </div>
                                  </Label>
                                  <Input
                                    id="profile-picture-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                  />
                                </div>
                              </div>
                              {profileImageError && (
                                <p className="text-sm text-red-500">
                                  {profileImageError}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="firstName"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Tên
                              </Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="lastName"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Họ
                              </Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="dateOfBirth"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Ngày sinh
                              </Label>
                              <Input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={
                                  formData.dateOfBirth
                                    ? formData.dateOfBirth
                                        .toString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={handleInputChange}
                                className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Họ và tên
                            </h3>
                            <p className="text-lg font-medium text-gray-800 dark:text-white">
                              {profile.fullName}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Ngày sinh
                            </h3>
                            <p className="text-gray-800 dark:text-white flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              {formatDate(profile.dateOfBirth)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-purple-50/70 dark:bg-purple-900/20 rounded-lg p-4 shadow-sm">
                      <h2 className="text-base font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        Thông tin liên hệ
                      </h2>

                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="email"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              disabled
                              className="bg-white/80 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="phone"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Số điện thoại
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="bg-white/80 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <div className="bg-purple-100 dark:bg-purple-800/30 p-1.5 rounded-full shrink-0">
                              <AtSignIcon className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                Email
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm break-all">
                                {profile.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-purple-100 dark:bg-purple-800/30 p-1.5 rounded-full shrink-0">
                              <PhoneIcon className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                Số điện thoại
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {profile.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Address Information Section */}
                    <div className="bg-indigo-50/70 dark:bg-indigo-900/20 rounded-lg p-4 shadow-sm">
                      <h2 className="text-base font-semibold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Thông tin địa chỉ
                      </h2>

                      {isEditing ? (
                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="city"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Thành phố/Tỉnh
                              </Label>
                              <select
                                id="city"
                                name="provinceId"
                                value={addressDetail.provinceId}
                                onChange={(e) => handleAddressChange(e)}
                                className="w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                              >
                                <option value="">Chọn Thành phố/Tỉnh</option>
                                {provinces?.data?.map((province) => (
                                  <option key={province.id} value={province.id}>
                                    {province.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="district"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Quận/Huyện
                              </Label>
                              <select
                                id="district"
                                name="districtId"
                                value={addressDetail.districtId}
                                onChange={(e) => handleAddressChange(e)}
                                disabled={!addressDetail.provinceId}
                                className="w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
                              >
                                <option value="">
                                  {!addressDetail.provinceId
                                    ? "Vui lòng chọn Thành phố/Tỉnh trước"
                                    : "Chọn Quận/Huyện"}
                                </option>
                                {districts?.data?.map((district) => (
                                  <option key={district.id} value={district.id}>
                                    {district.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="ward"
                                className="text-gray-700 dark:text-gray-300"
                              >
                                Phường/Xã
                              </Label>
                              <select
                                id="ward"
                                name="wardId"
                                value={addressDetail.wardId}
                                onChange={(e) => handleAddressChange(e)}
                                disabled={!addressDetail.districtId}
                                className="w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
                              >
                                <option value="">
                                  {!addressDetail.districtId
                                    ? "Vui lòng chọn Quận/Huyện trước"
                                    : "Chọn Phường/Xã"}
                                </option>
                                {wards?.data?.map((ward) => (
                                  <option key={ward.id} value={ward.id}>
                                    {ward.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="streetAddress"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Địa chỉ chi tiết
                            </Label>
                            <Input
                              id="streetAddress"
                              name="streetAddress"
                              value={addressDetail.streetAddress}
                              onChange={(e) => handleAddressChange(e)}
                              placeholder="Số nhà, tên đường, khu vực..."
                              className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                            />
                          </div>

                          {/* Full Address Preview */}
                          {(addressDetail.streetAddress ||
                            addressDetail.wardName ||
                            addressDetail.districtName ||
                            addressDetail.provinceName) && (
                            <div className="mt-2">
                              <Label className="text-gray-700 dark:text-gray-300">
                                Địa chỉ đầy đủ
                              </Label>
                              <div className="p-3 mt-1 bg-white/80 dark:bg-gray-800/50 border border-indigo-100 dark:border-indigo-800/30 rounded-md">
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
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-start gap-2">
                            <div className="bg-indigo-100 dark:bg-indigo-800/30 p-1.5 rounded-full shrink-0">
                              <MapPinIcon className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                Địa chỉ
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {profile.address || ""}
                              </p>
                            </div>
                          </div>
                          <div className="md:ml-4">
                            <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                              Khu vực
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {[profile.ward, profile.district, profile.city]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wallet Tab */}
            {activeTab === "wallet" && (
              <Card className="h-full border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="pb-2 px-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                    Ví của tôi
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Quản lý ví và xem số dư của bạn
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 py-4 flex-1 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white/90">
                          Số dư hiện tại
                        </h3>
                        <WalletIcon className="h-6 w-6 text-white/80" />
                      </div>
                      <div className="text-3xl font-bold mb-1">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        }).format(profile.balance || 0)}
                      </div>
                      <p className="text-white/80 text-sm">
                        Cập nhật lần cuối:{" "}
                        {format(new Date(), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        className="h-16 bg-green-500 hover:bg-green-600 text-white shadow-md"
                        onClick={() => setActiveTab("deposit")}
                      >
                        <ArrowDownIcon className="h-5 w-5 mr-2" />
                        Nạp tiền vào ví
                      </Button>
                      <Button
                        className="h-16 bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                        onClick={() => setActiveTab("withdraw")}
                      >
                        <ArrowUpIcon className="h-5 w-5 mr-2" />
                        Rút tiền từ ví
                      </Button>
                    </div>

                    {/* Recent Transactions */}
                    <RecentTransactions
                      onViewAllClick={() => setActiveTab("history")}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deposit Tab */}
            {activeTab === "deposit" && (
              <DepositFlow
                currentBalance={profile.balance || 0}
                onBalanceUpdate={handleBalanceUpdate}
                onComplete={() => setActiveTab("wallet")}
                defaultAmount={searchParams.get("amount") || ""}
              />
            )}

            {/* Withdraw Tab */}
            {activeTab === "withdraw" && (
              <WithdrawFlow
                currentBalance={profile.balance || 0}
                onBalanceUpdate={handleBalanceUpdate}
                onComplete={() => setActiveTab("wallet")}
              />
            )}

            {/* Transaction History Tab */}
            {activeTab === "history" && <TransactionHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}
