"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import {
  Loader2,
  Clock,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  LogOut,
  CreditCard,
  Search,
} from "lucide-react";
import { useChangePasswordStaffMutation } from "@/features/auth/api";
import { useUpdateClinicMutation } from "@/features/clinic/api";
import { useGetBanksQuery } from "@/features/bank/api";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Stepper } from "./stepper";
import { clearCookieStorage, TokenData } from "@/utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import ConfirmationDialog from "@/components/ui/confirmation-dialogv2";
import type { Bank } from "@/features/bank/types";
import { getAccessToken, GetDataByToken } from "@/utils";

interface FirstLoginFlowProps {
  onComplete: () => void;
}

export default function FirstLoginFlow({ onComplete }: FirstLoginFlowProps) {
  const t = useTranslations("login");
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [clinicHours, setClinicHours] = useState<any>(null);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  // Add countdown timer state
  const [countdown, setCountdown] = useState(5);
  // Add ref to track if component is mounted
  const isMounted = useRef(true);

  // Bank selection states
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  const [changePasswordStaff] = useChangePasswordStaffMutation();
  const [updateClinic] = useUpdateClinicMutation();
  const { data: bankData, isLoading: isBanksLoading } = useGetBanksQuery();

  // Set up countdown timer when success dialog is shown
  useEffect(() => {
    if (showSuccessDialog) {
      // Reset countdown when dialog opens
      setCountdown(5);

      // Set up interval to decrement countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          // If countdown reaches 0, redirect
          if (prev <= 1) {
            clearInterval(timer);
            handleSuccessConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Clean up interval on unmount or when dialog closes
      return () => {
        clearInterval(timer);
      };
    }
  }, [showSuccessDialog]);

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle logout
  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  // Handle actual logout after confirmation
  const handleConfirmedLogout = () => {
    clearCookieStorage();
    router.push("/login-partner");
  };

  // Handle success dialog confirmation
  const handleSuccessConfirm = () => {
    // Only proceed if component is still mounted
    if (isMounted.current) {
      setShowSuccessDialog(false);
      // if (onComplete) onComplete();
      clearCookieStorage();
      router.push("/login-partner");
    }
  };

  // Create schemas with translated error messages
  const clinicHoursSchema = z.object({
    workingTimeStart: z.string().min(1, t("enterWorkingTimeStart")),
    workingTimeEnd: z.string().min(1, t("enterWorkingTimeEnd")),
  });

  const bankInfoSchema = z.object({
    bankName: z.string().min(1, t("enterBankName") || "Please enter bank name"),
    bankAccountNumber: z
      .string()
      .min(1, t("enterAccountNumber") || "Please enter account number"),
  });

  const passwordChangeSchema = z
    .object({
      oldPassword: z.string().min(1, t("enterOldPassword")),
      newPassword: z.string().min(6, t("passwordMinLength")),
      confirmPassword: z.string().min(1, t("enterConfirmPassword")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  type ClinicHoursFormValues = z.infer<typeof clinicHoursSchema>;
  type BankInfoFormValues = z.infer<typeof bankInfoSchema>;
  type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

  // Step 1 form - Clinic operating hours
  const {
    register: registerClinicHours,
    handleSubmit: handleSubmitClinicHours,
    formState: { errors: clinicHoursErrors },
  } = useForm<ClinicHoursFormValues>({
    resolver: zodResolver(clinicHoursSchema),
    defaultValues: {
      workingTimeStart: "",
      workingTimeEnd: "",
    },
  });

  // Step 2 form - Bank information
  const {
    register: registerBankInfo,
    handleSubmit: handleSubmitBankInfo,
    setValue: setBankInfoValue,
    formState: { errors: bankInfoErrors },
  } = useForm<BankInfoFormValues>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: {
      bankName: "",
      bankAccountNumber: "",
    },
  });

  // Step 3 form - Password change
  const {
    register: registerPasswordChange,
    handleSubmit: handleSubmitPasswordChange,
    formState: { errors: passwordChangeErrors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle Step 1 submission
  const onSubmitClinicHours = (data: ClinicHoursFormValues) => {
    setClinicHours(data);
    setCurrentStep(2);
  };

  // Handle Step 2 submission
  const onSubmitBankInfo = (data: BankInfoFormValues) => {
    setBankInfo(data);
    setCurrentStep(3);
  };

  // Handle bank selection
  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setBankInfoValue("bankName", bank.shortName);
    setBankSearchTerm("");
    setShowBankDropdown(false);
  };

  // Filter banks based on search term
  const filteredBanks =
    bankData?.data?.filter(
      (bank) =>
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
        bank.shortName.toLowerCase().includes(bankSearchTerm.toLowerCase())
    ) || [];

  // Handle Step 3 submission
  const onSubmitPasswordChange = async (data: PasswordChangeFormValues) => {
    if (!clinicHours || !bankInfo) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get clinicId from token
      const token = getAccessToken();
      const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
      const clinicId = tokenData?.clinicId || "";

      if (!clinicId) {
        throw new Error("Clinic ID not found");
      }

      // Create FormData for clinic update (only bank information)
      const clinicFormData = new FormData();
      clinicFormData.append("clinicId", clinicId);
      clinicFormData.append("bankName", bankInfo.bankName);
      clinicFormData.append("bankAccountNumber", bankInfo.bankAccountNumber);

      // Call both APIs in parallel
      const [updateClinicResponse, changePasswordResponse] = await Promise.all([
        updateClinic({
          clinicId: clinicId,
          data: clinicFormData,
        }).unwrap(),
        changePasswordStaff({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          workingTimeStart: clinicHours.workingTimeStart,
          workingTimeEnd: clinicHours.workingTimeEnd,
        }).unwrap(),
      ]);

      // Show success toast
      toast.success(t("updateSuccess"), {
        position: "top-right",
        autoClose: 3000,
      });

      // Show success dialog
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Update error:", error);

      // Handle API error
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as any;
        setError(errorData?.detail || t("updateError"));
      } else {
        setError(t("updateError"));
      }

      toast.error(t("updateError"), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2" />
          <CardHeader className="pt-8 pb-4">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogoutClick}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              {t("firstLoginTitle")}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              {t("firstLoginDescription")}
            </CardDescription>

            <Stepper
              currentStep={currentStep}
              totalSteps={3}
              className="mt-6"
            />
          </CardHeader>

          <CardContent className="px-8">
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 animate-fadeIn border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
              >
                <AlertDescription className="text-red-800 dark:text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {currentStep === 1 ? (
              <form
                id="clinic-hours-form"
                onSubmit={handleSubmitClinicHours(onSubmitClinicHours)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="workingTimeStart"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <Clock className="h-4 w-4 text-blue-500" />
                    {t("workingTimeStart")}
                  </Label>
                  <div className="relative">
                    <Input
                      {...registerClinicHours("workingTimeStart")}
                      id="workingTimeStart"
                      type="time"
                      className="h-12 pl-4 pr-4 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {clinicHoursErrors.workingTimeStart && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                      {clinicHoursErrors.workingTimeStart.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="workingTimeEnd"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <Clock className="h-4 w-4 text-blue-500" />
                    {t("workingTimeEnd")}
                  </Label>
                  <div className="relative">
                    <Input
                      {...registerClinicHours("workingTimeEnd")}
                      id="workingTimeEnd"
                      type="time"
                      className="h-12 pl-4 pr-4 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {clinicHoursErrors.workingTimeEnd && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                      {clinicHoursErrors.workingTimeEnd.message}
                    </p>
                  )}
                </div>
              </form>
            ) : currentStep === 2 ? (
              <form
                id="bank-info-form"
                onSubmit={handleSubmitBankInfo(onSubmitBankInfo)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="bankName"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    {t("bankName") || "Bank Name"}
                  </Label>
                  <div className="relative" ref={bankDropdownRef}>
                    {isBanksLoading ? (
                      <div className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        {t("loadingBanks") || "Loading banks..."}
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
                            className="w-full pl-10 pr-3 py-2 md:py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                            placeholder={t("searchBank") || "Search bank"}
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="hidden"
                            {...registerBankInfo("bankName")}
                          />
                        </div>

                        {selectedBank && (
                          <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                            {selectedBank.logo && (
                              <Image
                                src={selectedBank.logo || "/placeholder.svg"}
                                alt={selectedBank.shortName}
                                className="h-6 w-auto"
                                width={100}
                                height={100}
                              />
                            )}
                            <span className="font-medium text-blue-700 dark:text-blue-300">
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
                                  className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
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
                                {t("noBanksFound") || "No banks found"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {bankInfoErrors.bankName && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                      {bankInfoErrors.bankName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bankAccountNumber"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    {t("bankAccountNumber") || "Bank Account Number"}
                  </Label>
                  <div className="relative">
                    <Input
                      {...registerBankInfo("bankAccountNumber")}
                      id="bankAccountNumber"
                      type="text"
                      className="h-12 pl-4 pr-4 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={
                        t("enterAccountNumber") || "Enter account number"
                      }
                    />
                  </div>
                  {bankInfoErrors.bankAccountNumber && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                      {bankInfoErrors.bankAccountNumber.message}
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <form
                id="password-change-form"
                onSubmit={handleSubmitPasswordChange(onSubmitPasswordChange)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="oldPassword"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <KeyRound className="h-4 w-4 text-blue-500" />
                    {t("oldPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      {...registerPasswordChange("oldPassword")}
                      id="oldPassword"
                      type="password"
                      className="h-12 pl-4 pr-4 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {passwordChangeErrors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                      {passwordChangeErrors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <KeyRound className="h-4 w-4 text-blue-500" />
                    {t("newPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      {...registerPasswordChange("newPassword")}
                      id="newPassword"
                      type="password"
                      className="h-12 pl-4 pr-4 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {passwordChangeErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                      {passwordChangeErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium"
                  >
                    <KeyRound className="h-4 w-4 text-blue-500" />
                    {t("confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      {...registerPasswordChange("confirmPassword")}
                      id="confirmPassword"
                      type="password"
                      className="h-12 pl-4 pr-4 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {passwordChangeErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                      {passwordChangeErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-between px-8 py-6 bg-gray-50 dark:bg-gray-800/50">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isSubmitting}
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout when back button is not shown
            )}

            <Button
              type="submit"
              form={
                currentStep === 1
                  ? "clinic-hours-form"
                  : currentStep === 2
                  ? "bank-info-form"
                  : "password-change-form"
              }
              className="ml-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </div>
              ) : currentStep < 3 ? (
                <div className="flex items-center">
                  {t("next")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center">
                  {t("update")}
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleConfirmedLogout}
        title={t("logoutConfirmation")}
        message={
          t("logoutConfirmationMessage") || "Bạn có chắc chắn muốn đăng xuất?"
        }
        confirmButtonText={t("logout") || "Đăng xuất"}
        cancelButtonText={t("cancel") || "Hủy"}
        type="warning"
      />

      {/* Success Dialog with Countdown */}
      <ConfirmationDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessConfirm}
        onConfirm={handleSuccessConfirm}
        title={t("setupCompleteTitle")}
        message={
          <>
            {t("setupCompleteMessage")}
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("redirectingIn")}{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {countdown}
              </span>{" "}
              {t("seconds")}...
            </div>
          </>
        }
        confirmButtonText={`${t("login")} (${countdown})`}
        cancelButtonText={null}
        type="success"
        icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
      />
    </div>
  );
}
