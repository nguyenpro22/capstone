"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useChangePasswordStaffMutation } from "@/features/auth/api";

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
import {
  clearCookieStorage,
  getAccessToken,
  GetDataByToken,
  type TokenData,
} from "@/utils";
import { processAuthSuccess } from "@/features/auth/utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";

interface FirstLoginFlowProps {
  onComplete: () => void;
}

export default function FirstLoginFlow({ onComplete }: FirstLoginFlowProps) {
  const t = useTranslations("login");
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [clinicHours, setClinicHours] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [changePasswordStaff] = useChangePasswordStaffMutation();
  // Handle logout
  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  // Handle actual logout after confirmation
  const handleConfirmedLogout = () => {
    clearCookieStorage();
    router.push("/login");
  };
  // Create schemas with translated error messages
  const clinicHoursSchema = z.object({
    workingTimeStart: z.string().min(1, t("enterWorkingTimeStart")),
    workingTimeEnd: z.string().min(1, t("enterWorkingTimeEnd")),
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

  // Step 2 form - Password change
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
  const onSubmitPasswordChange = async (data: PasswordChangeFormValues) => {
    if (!clinicHours) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine data from both steps
      const changePasswordData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        workingTimeStart: clinicHours.workingTimeStart,
        workingTimeEnd: clinicHours.workingTimeEnd,
      };

      // Call the API to change password
      const response = await changePasswordStaff(changePasswordData).unwrap();

      toast.success(t("updateSuccess"), {
        position: "top-right",
        autoClose: 3000,
      });

      // Get current user data from token
      const token = getAccessToken();
      // Add null check for token
      const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
      const isFirstLogin = tokenData?.isFirstLogin || "";
      if (token) {
        try {
          // Use processAuthSuccess to handle redirection based on user role
          await processAuthSuccess({
            loginResponse: { accessToken: token },
            t,
            dispatch,
            router,
            isFirstLogin,
            // Don't skip redirection this time - we want to redirect properly
          });

          // If onComplete callback is provided, call it as well
          if (onComplete) {
            onComplete();
          }
        } catch (error) {
          console.error("Error processing auth success:", error);
          // Fallback to manual redirection if processAuthSuccess fails
          router.push("/dashboard");
        }
      } else {
        // Fallback to manual redirection if token is not available
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Password change error:", error);

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

  // Handle logout

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
              totalSteps={2}
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
            {currentStep === 2 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
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
                currentStep === 1 ? "clinic-hours-form" : "password-change-form"
              }
              className="ml-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </div>
              ) : currentStep === 1 ? (
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
    </div>
  );
}
