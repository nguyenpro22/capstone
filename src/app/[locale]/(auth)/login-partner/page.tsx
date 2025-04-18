"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Loader2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginSchema, type LoginFormValues } from "@/validations";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDispatch } from "react-redux";
import { useLoginStaffMutation } from "@/features/auth/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { rememberMe as rememberMeCookie, getCookie } from "@/utils";
import { CookieStorageKey } from "@/constants";
import { handleLogin } from "@/features/auth/utils";
import type { ValidationErrorResponse } from "@/lib/api";

export default function StaffLoginPage() {
  const t = useTranslations("login");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const [loginStaff, loginStaffResult] = useLoginStaffMutation();

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(useLoginSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Theo dõi trạng thái lỗi từ RTK Query
  React.useEffect(() => {
    if (loginStaffResult.isError && loginStaffResult.error) {
      console.log(
        "Login error detected via RTK Query:",
        loginStaffResult.error
      );

      // Trích xuất dữ liệu lỗi từ RTK Query error
      if (loginStaffResult.error && "detail" in loginStaffResult.error) {
        const errorData = loginStaffResult.error as ValidationErrorResponse;
        console.log("Error data extracted:", errorData);

        // Hiển thị toast với thông báo lỗi cụ thể
        toast.error(errorData.detail || t("generalError") || "Đã xảy ra lỗi", {
          position: "top-right",
          autoClose: 3000,
        });

        // Gọi hàm xử lý lỗi để cập nhật UI
        handleErrorResponse(errorData);
      }
    }
  }, [loginStaffResult.isError, loginStaffResult.error]);

  // Xử lý lỗi dựa trên dữ liệu lỗi
  const handleErrorResponse = (errorData: ValidationErrorResponse) => {
    console.log("Handling error response:", errorData);

    if (errorData.detail === "Wrong password") {
      setAuthError(t("wrongPassword") || "Mật khẩu không đúng");
    } else if (errorData.detail === "User Not Found") {
      setAuthError(t("userNotFound") || "Không tìm thấy người dùng");
    } else {
      // Lỗi khác
      setAuthError(errorData.detail || t("generalError") || "Lỗi đăng nhập");
    }
  };

  // Replace the onSubmit function with this improved implementation
  // Xử lý đăng nhập đối tác
  const onSubmit = async (data: LoginFormValues) => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const result = await handleLogin({
        email: data.email,
        password: data.password,
        t,
        login: loginStaff,
        dispatch,
        router,
        rememberMe,
        setRememberMeCookie: rememberMeCookie,
        getCookie,
        CookieStorageKey,
      });

      if (result.success) {
        // Form đã được reset và chuyển hướng trong hàm handleStaffLogin
        reset();
      } else if (result.errorData) {
        // Xử lý lỗi dựa trên dữ liệu lỗi chi tiết
        handleErrorResponse(result.errorData);
      } else {
        setAuthError(result.error || null);
      }
    } catch (error) {
      console.error("Staff login error:", error);

      // Generic error handling
      setAuthError(t("generalError") || "Lỗi đăng nhập");

      toast.error(t("generalError") || "Đã xảy ra lỗi", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/50 p-3">
              <Building className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {t("partnerLogin") || "Đăng nhập đối tác"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
            {t("enterPartnerDetails") ||
              "Nhập thông tin đăng nhập đối tác của bạn"}
          </p>
        </div>

        {/* Hiển thị lỗi xác thực */}
        {authError && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("email")}
            </label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              disabled={isAuthenticating || isSubmitting}
              className="h-14 px-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
              placeholder={t("emailPlaceholder")}
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("password")}
            </label>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isAuthenticating || isSubmitting}
                className="h-14 px-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
                placeholder={t("passwordPlaceholder")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                disabled={isAuthenticating || isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setRememberMe(checked as boolean)
              }
              disabled={isAuthenticating || isSubmitting}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              {t("rememberMe")}
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full h-14 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
              isSubmitting || isAuthenticating ? "animate-pulse" : ""
            }`}
            disabled={isSubmitting || isAuthenticating}
          >
            {isSubmitting || isAuthenticating ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t("signingIn")}
              </div>
            ) : (
              t("partnerSignIn") || "Đăng nhập đối tác"
            )}
          </Button>
        </form>

        {/* Back to regular login */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t("backToRegularLogin") || "Quay lại đăng nhập thông thường?"}
          <div>
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
              tabIndex={isAuthenticating || isSubmitting ? -1 : 0}
            >
              {t("regularLogin") || "Đăng nhập"}
              <ArrowRight className="inline-block ml-1 h-4 w-4" />
            </Link>
          </div>
        </p>
      </div>
    </div>
  );
}
