"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetClinicByIdQuery } from "@/features/clinic/api";
import { useChangePasswordStaffMutation } from "@/features/auth/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  PenSquare,
  MapPinned,
  Award,
  Landmark,
  BanknoteIcon,
  Clock,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCurrency,
  getAccessToken,
  GetDataByToken,
  type TokenData,
  clearToken,
} from "@/utils";
import { Button } from "@/components/ui/button";
import ClinicEditForm from "@/components/clinicManager/profile/clinic-edit-form";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";

export default function ClinicProfilePage() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { theme } = useTheme();
  const t = useTranslations("clinicProfile");

  // Get clinicId from token
  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";

  // Redirect if no clinicId is found
  useEffect(() => {
    if (!clinicId) {
      router.push("/login-partner");
    }
  }, [clinicId, router]);

  const { data, isLoading, error, refetch } = useGetClinicByIdQuery(clinicId);
  const clinic = data?.value;

  const handleEditSuccess = () => {
    refetch();
  };

  // Function to calculate remaining days
  const calculateRemainingDays = (expiryDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const expiryDate = new Date(expiryDateStr);
    expiryDate.setHours(0, 0, 0, 0); // Reset time to start of day

    // Calculate difference in milliseconds and convert to days
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Return 0 if negative (already expired)
    return Math.max(0, diffDays);
  };

  function PasswordChangeForm() {
    const [changePassword, { isLoading, isSuccess, isError, error }] =
      useChangePasswordStaffMutation();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
      null
    );
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Handle redirect countdown after successful password change
    useEffect(() => {
      if (isSuccess && !showSuccessDialog) {
        setShowSuccessDialog(true);
        setRedirectCountdown(3);
      }

      if (redirectCountdown !== null && redirectCountdown > 0) {
        const timer = setTimeout(() => {
          setRedirectCountdown(redirectCountdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
      }

      if (redirectCountdown === 0) {
        // Remove token and redirect to login
        clearToken();
        router.push("/login-partner");
      }
    }, [isSuccess, redirectCountdown, router, showSuccessDialog]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage("");

      if (newPassword !== confirmPassword) {
        setErrorMessage(t("passwordsDoNotMatch"));
        return;
      }

      if (newPassword.length < 6) {
        setErrorMessage(t("passwordTooShort"));
        return;
      }

      try {
        await changePassword({
          oldPassword,
          newPassword,
        }).unwrap();

        // Reset form on success
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        console.error("Failed to change password:", err);
        setErrorMessage(t("failedToChangePassword"));
      }
    };

    const handleCloseDialog = () => {
      setShowSuccessDialog(false);
      // Immediately redirect to login
      clearToken();
      router.push("/login-partner");
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600 dark:text-green-400"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {t("passwordChangedSuccessfully")}
              </DialogTitle>
              <DialogDescription>{t("pleaseLoginAgain")}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <LogOut className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                {t("redirectingToLogin", { seconds: redirectCountdown })}
              </div>
              <Button onClick={handleCloseDialog} className="w-full sm:w-auto">
                {t("loginNow")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="overflow-hidden border-indigo-200 dark:border-indigo-500/50 shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/30 dark:to-purple-500/30 pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-600 dark:text-indigo-300"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {t("changePassword")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {(isError || errorMessage) && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                {errorMessage || t("passwordChangeError")}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="oldPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("currentPassword")}
                </label>
                <div className="relative">
                  <input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                    required
                    disabled={isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                    disabled={isSuccess}
                  >
                    {showOldPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                    required
                    disabled={isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                    disabled={isSuccess}
                  >
                    {showNewPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("confirmNewPassword")}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                    required
                    disabled={isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                    disabled={isSuccess}
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
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
                  ) : null}
                  {isLoading ? t("changing") : t("changePassword")}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!clinicId) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("authRequired")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("failedToLoad")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {clinic.profilePictureUrl ? (
              <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                <Image
                  src={clinic.profilePictureUrl || "/placeholder.svg"}
                  alt={clinic.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/30 shadow-xl">
                <Building2 className="w-16 h-16 text-white/80" />
              </div>
            )}
            <Badge
              variant={clinic.isActivated ? "default" : "outline"}
              className={`absolute -bottom-2 right-0 px-3 py-1 text-xs font-medium ${
                clinic.isActivated
                  ? "bg-green-500 hover:bg-green-500/90 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {clinic.isActivated ? t("active") : t("inactive")}
            </Badge>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {clinic.name}
            </h1>
            {/* Update the flex container for contact information with a vertical layout */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/70 flex-shrink-0" />
                <span className="text-sm text-white/90">{clinic.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/70 flex-shrink-0" />
                <span className="text-sm text-white/90">
                  {clinic.phoneNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinned className="w-4 h-4 text-white/70 flex-shrink-0" />
                <span className="text-sm text-white/90">
                  {clinic.fullAddress || clinic.city}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-none shadow-md"
            size="sm"
          >
            <PenSquare className="h-4 w-4 mr-2" />
            {t("editProfile")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Clinic Info Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-600/40 dark:to-indigo-600/40 px-6 py-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {t("clinicDetails")}
              </h3>
            </div>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-500/40 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("address")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {clinic.fullAddress || clinic.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-500/40 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("taxCode")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {clinic.taxCode}
                  </p>
                </div>
              </div>

              {/* Business License moved here */}
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-500/40 p-2 rounded-full">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("businessLicense")}
                  </p>
                  {clinic.businessLicenseUrl ? (
                    <a
                      href={clinic.businessLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 hover:underline transition-colors"
                    >
                      {t("viewBusinessLicense")}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {t("noBusinessLicense")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-500/40 p-2 rounded-full flex-shrink-0">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("workingHours")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {clinic.workingTimeStart && clinic.workingTimeEnd
                      ? `${formatTime(clinic.workingTimeStart)} - ${formatTime(
                          clinic.workingTimeEnd
                        )}`
                      : t("notSpecified")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Subscription Card - Redesigned to match the new image */}
          {clinic.currentSubscription && (
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 dark:bg-purple-600/40 px-6 py-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t("currentSubscription")}
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                        {clinic.currentSubscription.name}
                      </h4>
                    </div>
                    <Badge
                      variant={
                        clinic.currentSubscription.isActivated
                          ? "default"
                          : "outline"
                      }
                      className={`px-3 py-1 text-xs font-medium ${
                        clinic.currentSubscription.isActivated
                          ? "bg-green-500 hover:bg-green-500/90 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {clinic.currentSubscription.isActivated
                        ? t("active")
                        : t("inactive")}
                    </Badge>
                  </div>
                  {/* 
                  <p className="text-gray-600 dark:text-gray-400 mb-6 ml-7">{clinic.currentSubscription.description}</p> */}

                  <div className="flex flex-wrap justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                      <div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          {clinic.currentSubscription.duration}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                          {t("days")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                      <div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          {clinic.currentSubscription.limitBranch}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                          {t("branches")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-purple-500 dark:text-purple-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 10L19.5528 7.72361C19.8343 7.58281 20 7.30339 20 7V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V7C4 7.30339 4.16571 7.58281 4.44721 7.72361L9 10M15 10L9 10M15 10L15 16M9 10L9 16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 20H19C19.5523 20 20 19.5523 20 19V16.5C20 16.2239 19.8343 15.9445 19.5528 15.8037L15 13.5M9 13.5L4.44721 15.8037C4.16571 15.9445 4 16.2239 4 16.5V19C4 19.5523 4.44772 20 5 20Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          {clinic.currentSubscription.limitLiveStream}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                          {t("livestreams")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {t("price")}:
                    </span>
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {clinic.currentSubscription.price === 0
                        ? "Free"
                        : `${formatCurrency(
                            clinic.currentSubscription.price
                          )}`}{" "}
                      đ
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {t("purchaseDate")}:
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(
                          clinic.currentSubscription.dateBought
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {t("expiryDate")}:
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(
                          clinic.currentSubscription.dateExpired
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {t("daysRemaining")}:
                      </span>
                      {/* Calculate remaining days dynamically */}
                      <Badge
                        variant={
                          calculateRemainingDays(
                            clinic.currentSubscription.dateExpired
                          ) > 7
                            ? "default"
                            : "destructive"
                        }
                        className="px-2 py-0.5"
                      >
                        {calculateRemainingDays(
                          clinic.currentSubscription.dateExpired
                        )}{" "}
                        {t("days")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <Tabs defaultValue="bank" className="w-full">
              <div className="border-b dark:border-gray-700">
                <div className="px-6 py-3">
                  <TabsList className="grid w-full grid-cols-3 h-11">
                    <TabsTrigger
                      value="bank"
                      className="data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-500/40 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
                    >
                      <BanknoteIcon className="w-4 h-4 mr-2" />
                      {t("bankInformation")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="branches"
                      className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-500/40 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-200"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      {t("branches")} ({clinic.totalBranches})
                    </TabsTrigger>
                    <TabsTrigger
                      value="password"
                      className="data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-500/40 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mr-2"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      {t("changePassword")}
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Bank Information Tab */}
              <TabsContent value="bank" className="p-6 focus:outline-none">
                <div className="grid gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-purple-200 dark:border-purple-500/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-500/30 dark:to-purple-600/30 pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-purple-800 dark:text-purple-200">
                          <Landmark className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                          {t("bankDetails")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-purple-50 dark:bg-purple-500/30 p-4 rounded-lg">
                              <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                                {t("bankName")}
                              </p>
                              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {clinic.bankName}
                              </p>
                            </div>

                            <div className="bg-indigo-50 dark:bg-indigo-500/30 p-4 rounded-lg">
                              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1">
                                {t("accountNumber")}
                              </p>
                              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {clinic.bankAccountNumber}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/20 dark:to-indigo-500/20 p-4 rounded-lg border border-purple-100/50 dark:border-purple-500/40">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {t("paymentInformation")}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {t("paymentDescription")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Branches Tab */}
              <TabsContent value="branches" className="p-6 focus:outline-none">
                {clinic.branches.items.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {clinic.branches.items.map((branch, index) => (
                      <motion.div
                        key={branch.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden border-indigo-200 dark:border-indigo-500/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-400">
                          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/30 dark:to-purple-500/30 pb-3">
                            <CardTitle className="text-base flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                              {branch.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {branch.address}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      {t("noBranchesAvailable")}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {t("noBranchesDescription")}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Password Change Tab */}
              <TabsContent value="password" className="p-6 focus:outline-none">
                <PasswordChangeForm />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && clinic && (
        <ClinicEditForm
          initialData={clinic}
          onClose={() => setIsEditModalOpen(false)}
          onSaveSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

function ClinicProfileSkeleton() {
  return (
    <div className="container py-8 space-y-8 max-w-7xl">
      {/* Header Skeleton */}
      <div className="relative rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 dark:from-purple-600/40 dark:to-indigo-600/40 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-10 w-3/4 md:w-1/2" />
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <Skeleton className="h-7 w-40" />
            </div>
            <CardContent className="space-y-5 pt-5">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <Skeleton className="h-7 w-40" />
            </div>
            <CardContent className="pt-5">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <div className="border-b dark:border-gray-700 p-6">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-5 w-full" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
