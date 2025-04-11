"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  PencilIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AtSignIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useGetUserProfileQuery } from "@/features/home/api";

// Define the profile data type
interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  profilePicture: string | null;
  city: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  fullAddress?: string | null;
}

// Initial profile data from the provided JSON with added address information
const initialProfile: ProfileData = {
  id: "d3b41ade-91c0-43e2-92e7-9d145609b566",
  firstName: "Dung",
  lastName: "Cao",
  fullName: "Dung Cao",
  dateOfBirth: "2002-09-25",
  email: "nguyenpro2080@gmail.com",
  phone: "+84846030005",
  profilePicture: null,
  city: "Ho Chi Minh City",
  district: "District 1",
  ward: "Ben Nghe Ward",
  address: "123 Nguyen Hue Boulevard",
  fullAddress:
    "123 Nguyen Hue Boulevard, Ben Nghe Ward, District 1, Ho Chi Minh City",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { data: profileData } = useGetUserProfileQuery();
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [formData, setFormData] = useState<ProfileData>(initialProfile);

  useEffect(() => {
    if (profileData) {
      // Ensure all required fields are present, fall back to initialProfile for missing fields
      const mergedProfile: ProfileData = {
        ...initialProfile,
        ...profileData.value,
        // Ensure these fields are strings or null, not undefined
        city: profileData.value.city || null,
        district: profileData.value.district || null,
        ward: profileData.value.ward || null,
        address: profileData.value.address || null,
      };
      setProfile(mergedProfile);
      setFormData(mergedProfile);
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    // Here you would typically send the updated data to your API
    console.log("Saving profile:", formData);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/30 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl dark:shadow-purple-900/20 rounded-xl">
          <div className="h-24 sm:h-28 bg-gradient-to-r from-purple-900/90 to-indigo-900/80 relative">
            <div className="absolute -bottom-12 sm:-bottom-14 left-6">
              <div className="relative">
                <Avatar className="h-24 sm:h-28 w-24 sm:w-28 border-4 border-white dark:border-gray-900 shadow-lg">
                  <AvatarImage
                    src={profile.profilePicture || ""}
                    alt={profile.fullName}
                  />
                  <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-2 right-2 rounded-full h-8 w-8 p-0 bg-white/90 dark:bg-gray-800/90 border-purple-200 dark:border-purple-800/50 hover:bg-white dark:hover:bg-gray-800"
                  >
                    <PencilIcon className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                    <span className="sr-only">Change avatar</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <CardHeader className="pt-16 sm:pt-16 pb-2 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  View and manage your personal information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-6 py-4">
            <div className="space-y-4">
              {/* Personal Information Section */}
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
                <h2 className="text-base font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Personal Information
                </h2>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="firstName"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        First Name
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
                        Last Name
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
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="bg-white/50 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </h3>
                      <p className="text-lg font-medium text-gray-800 dark:text-white">
                        {profile.fullName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date of Birth
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
                  Contact Information
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
                        onChange={handleInputChange}
                        className="bg-white/80 dark:bg-gray-800/50 border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Phone Number
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
                          Phone
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
                  Address Information
                </h2>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5 md:col-span-1">
                      <Label
                        htmlFor="address"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-1">
                      <Label
                        htmlFor="ward"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Ward
                      </Label>
                      <Input
                        id="ward"
                        name="ward"
                        value={formData.ward || ""}
                        onChange={handleInputChange}
                        placeholder="Ward"
                        className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-1">
                      <Label
                        htmlFor="district"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        District
                      </Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district || ""}
                        onChange={handleInputChange}
                        placeholder="District"
                        className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-1">
                      <Label
                        htmlFor="city"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="bg-white/80 dark:bg-gray-800/50 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-indigo-100 dark:bg-indigo-800/30 p-1.5 rounded-full shrink-0">
                        <MapPinIcon className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                          Address
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {profile.address || ""}
                        </p>
                      </div>
                    </div>
                    <div className="md:ml-4">
                      <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                        Location
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
      </div>
    </div>
  );
}
