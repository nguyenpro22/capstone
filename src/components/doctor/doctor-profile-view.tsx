"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Edit, Loader2, Mail, MapPin, Phone, User, Camera } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DoctorCertificates from "./doctor-certificates";
import DoctorProfileForm from "./doctor-profile-form";
import { useGetUserProfileQuery } from "@/features/home/api";

export default function DoctorProfileView() {
  const t = useTranslations("doctorProfile");
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: profile, isLoading, error, refetch } = useGetUserProfileQuery();
  const user = profile?.value;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
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

  // If in edit mode, show the form
  if (isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("editProfile")}
          </h2>
          <Button variant="outline" onClick={() => setIsEditMode(false)}>
            {t("cancelEdit")}
          </Button>
        </div>
        <DoctorProfileForm
          refetch={refetch}
          onProfileUpdated={() => setIsEditMode(false)}
        />
      </div>
    );
  }

  // Otherwise show the view-only profile
  return (
    <div className="space-y-8">
      <Card className="bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/20">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("personalInformation")}
            </CardTitle>
            <CardDescription>{t("personalInfoDescription")}</CardDescription>
          </div>
          <Button
            onClick={() => setIsEditMode(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("updateProfile")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {user.profilePicture ? (
              <Avatar className="w-24 h-24 border-2 border-purple-200 dark:border-purple-700">
                <AvatarImage
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.fullName}
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xl">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-purple-200 dark:border-purple-700">
                <div className="text-center">
                  <Camera className="h-8 w-8 text-purple-400 mx-auto mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("noProfileImage")}
                  </span>
                </div>
              </div>
            )}
            <div>
              <h3 className="font-medium text-lg">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {!user.profilePicture && (
                <p className="text-sm text-amber-500 mt-1">
                  {t("profileImageRequired")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("fullName")}
                  </p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("email")}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("dateOfBirth")}
                  </p>
                  <p className="font-medium">
                    {user.dateOfBirth
                      ? t("formattedDate", {
                          date: new Date(user.dateOfBirth).getDate(),
                          month: t(
                            `months.${new Date(user.dateOfBirth).getMonth()}`
                          ),
                          year: new Date(user.dateOfBirth).getFullYear(),
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("phone")}</p>
                  <p className="font-medium">{user.phone || "-"}</p>
                </div>
              </div>
            </div>
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
        <CardContent>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("fullAddress")}
              </p>
              <p className="font-medium">
                {user.fullAddress || (
                  <span className="text-muted-foreground italic">
                    {t("noAddressProvided")}
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <DoctorCertificates doctorId={user.id} />
    </div>
  );
}
