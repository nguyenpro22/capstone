"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useChangePasswordMutation,
  useSendRequestMutation,
  useVerifyMutation,
} from "@/features/auth/api";
import { clearToken, setAccessToken, showError, showSuccess } from "@/utils";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}

function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword");
  const [step, setStep] = useState<"email" | "otp" | "newPassword" | "success">(
    "email"
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [sendOTP] = useSendRequestMutation();
  const [verifyOTP] = useVerifyMutation();
  const [resetPassword] = useChangePasswordMutation();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // 🟢 Gửi yêu cầu quên mật khẩu (Bước 1)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await sendOTP({ email }).unwrap();
      showSuccess(t("otpSentSuccess"));
      setStep("otp");
      setCountdown(60);
    } catch (error) {
      showError(t("userNotExist"));
      setError(t("failedToSendOTP"));
    }
    setIsLoading(false);
  };

  // 🟢 Xác minh OTP (Bước 2)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await verifyOTP({ email, code: otp, type: 1 }).unwrap();
      setAccessToken(response.value.accessToken);
      console.log("OTP verified:", response);
      showSuccess(t("otpVerifiedSuccess"));
      setStep("newPassword");
    } catch (error) {
      showError(t("invalidOTP"));
      setError(t("invalidOTP"));
    }
    setIsLoading(false);
  };

  // 🟢 Đặt lại mật khẩu (Bước 3)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await resetPassword({ newPassword: password }).unwrap();
      clearToken();
      console.log("Password reset successful:", response);
      showSuccess(t("resetPasswordSuccess"));

      setStep("success");
    } catch (error) {
      setError(t("failedToResetPassword"));
      showError(t("failedToResetPassword"));
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await sendOTP({ email }).unwrap();
      showSuccess(t("otpResent"));
      setCountdown(60); // Reset countdown
    } catch (error) {
      showError(t("failedToResendOTP"));
    }
    setIsLoading(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderForm = () => {
    switch (step) {
      case "email":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                {t("forgotPassword")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className={`w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? t("submitting") : t("submit")}
                </Button>
              </form>
            </CardContent>
          </>
        );
      case "otp":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                {t("verifyCode")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="otp"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {t("verificationCode")}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-16 px-4 text-2xl tracking-[0.5em] text-center font-mono bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
                    placeholder="••••••"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="text-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("timeRemaining")}:{" "}
                  </span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {formatTime(countdown)}
                  </span>
                </div>
                <Button
                  type="submit"
                  className={`w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                  disabled={isLoading || countdown === 0}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? t("verifying") : t("verify")}
                </Button>
                {countdown === 0 && (
                  <Button
                    type="button"
                    onClick={handleResendOTP}
                    className="w-full h-11 text-base font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-300 rounded-xl"
                    disabled={isLoading}
                  >
                    {t("resendOTP")}
                  </Button>
                )}
              </form>
            </CardContent>
          </>
        );
      case "newPassword":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                {t("setNewPassword")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {t("newPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
                      placeholder={t("newPasswordPlaceholder")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {t("confirmNewPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
                      placeholder={t("confirmPasswordPlaceholder")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className={`w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? t("resettingPassword") : t("resetPassword")}
                </Button>
              </form>
            </CardContent>
          </>
        );
      case "success":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                {t("passwordResetSuccessful")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-4 text-gray-700 dark:text-gray-300">
                {t("passwordResetSuccessMessage")}
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg"
              >
                {t("backToLogin")}
              </Button>
            </CardContent>
          </>
        );
    }
  };

  return (
    <>
      {renderForm()}
      {step !== "success" && (
        <CardContent className="pt-0">
          <Link
            href="/login"
            className="block w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 mt-4"
          >
            <ArrowLeft className="inline-block mr-2 h-4 w-4" />
            {t("backToLogin")}
          </Link>
        </CardContent>
      )}
    </>
  );
}
