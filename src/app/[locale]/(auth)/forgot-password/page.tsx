"use client";

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
import { showError, showSuccess } from "@/utils";

export default function ForgotPasswordForm() {
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
  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await sendOTP({ email }).unwrap();
      showSuccess("Send OTP successfully, please check your email");
      setStep("otp");
      setCountdown(60);
    } catch (error) {
      showError("User is not existed, please try again!");
      setError("Failed to send OTP. Please try again.");
    }
    setIsLoading(false);
  };

  // 🟢 Xác minh OTP (Bước 2)
  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await verifyOTP({ email, code: otp, type: 1 }).unwrap();
      console.log("OTP verified:", response);
      showSuccess("Verified OTP successfully");
      setStep("newPassword");
    } catch (error) {
      showError("Invalid OTP. Please try again.");
      setError("Invalid OTP. Please try again.");
    }
    setIsLoading(false);
  };

  // 🟢 Đặt lại mật khẩu (Bước 3)
  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await resetPassword({ email, password }).unwrap();
      console.log("Password reset successful:", response);
      showSuccess("Reset password successfully");

      setStep("success");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
      showError("Failed to reset password. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    // Simulate API call for resending OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCountdown(60); // Reset countdown
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
              <CardTitle className="text-2xl font-semibold text-center">
                Forgot Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 px-4 text-base bg-white border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 rounded-xl"
                    placeholder="you@example.com"
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
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </CardContent>
          </>
        );
      case "otp":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Verify Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-16 px-4 text-2xl tracking-[0.5em] text-center font-mono bg-white border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 rounded-xl"
                    placeholder="••••••"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="text-center text-sm">
                  <span className="text-gray-600">Time remaining: </span>
                  <span className="font-medium text-indigo-600">
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
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
                {countdown === 0 && (
                  <Button
                    type="button"
                    onClick={handleResendOTP}
                    className="w-full h-11 text-base font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-300 rounded-xl"
                    disabled={isLoading}
                  >
                    Resend OTP
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
              <CardTitle className="text-2xl font-semibold text-center">
                Set New Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 px-4 text-base bg-white border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 rounded-xl"
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
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
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 px-4 text-base bg-white border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 rounded-xl"
                      placeholder="Re-enter your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
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
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            </CardContent>
          </>
        );
      case "success":
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Password Reset Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-4">
                Your password has been successfully reset.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg"
              >
                Back to Login
              </Button>
            </CardContent>
          </>
        );
    }
  };

  return (
    <>
      {" "}
      {renderForm()}
      {step !== "success" && (
        <CardContent className="pt-0">
          <Link
            href="/login"
            className="block w-full text-center text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300 mt-4"
          >
            <ArrowLeft className="inline-block mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </CardContent>
      )}
    </>
  );
}
