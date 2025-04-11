"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createLoginSchema, type LoginFormValues } from "@/validations";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
} from "@/features/auth/api";

import {
  getAccessToken,
  rememberMe as rememberMeCookie,
  isRememberMe,
  clearToken,
  getCookie,
} from "@/utils";
import { CookieStorageKey } from "@/constants";
import {
  handleLogin,
  handleGoogleLogin,
  handleLogout,
  checkAuthStatus,
} from "@/features/auth/utils";

export default function LoginPage() {
  const t = useTranslations("login");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [loginGoogle] = useLoginWithGoogleMutation();

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Kiểm tra trạng thái đăng nhập khi trang được tải
  useEffect(() => {
    const { isAuthenticated: isAuth, userData: user } = checkAuthStatus();
    setIsAuthenticated(isAuth);
    setUserData(user);

    // Khôi phục thông tin "Remember Me"
    if (isRememberMe()) {
      const token = getAccessToken();
      if (token) {
        const user = checkAuthStatus().userData;
        if (user?.email) {
          setValue("email", user.email);
          setRememberMe(true);
        }
      }
    }
  }, [setValue]);

  // Xử lý đăng nhập
  const onSubmit = async (data: LoginFormValues) => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const result = await handleLogin({
        email: data.email,
        password: data.password,
        t,
        login,
        dispatch,
        router,
        rememberMe,
        setRememberMeCookie: rememberMeCookie,
        getCookie,
        CookieStorageKey,
      });

      if (result.success) {
        // Cập nhật trạng thái đăng nhập
        const { isAuthenticated: isAuth, userData: user } = checkAuthStatus();
        setIsAuthenticated(isAuth);
        setUserData(user);
        reset();
      } else {
        setAuthError(result.error || null);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(t("generalError") || "Lỗi đăng nhập");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Xử lý đăng nhập Google
  const onGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const result = await handleGoogleLogin({
        t,
        loginGoogle,
        dispatch,
        router,
        rememberMe,
        setRememberMeCookie: rememberMeCookie,
        getCookie,
        CookieStorageKey,
      });

      if (result.success) {
        // Cập nhật trạng thái đăng nhập
        const { isAuthenticated: isAuth, userData: user } = checkAuthStatus();
        setIsAuthenticated(isAuth);
        setUserData(user);
      } else {
        setAuthError(result.error || null);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setAuthError(
        t("providerLoginError", { provider: "Google" }) ||
          "Đăng nhập với Google thất bại"
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Xử lý đăng xuất
  const onLogout = async () => {
    setIsAuthenticating(true);

    try {
      const result = await handleLogout({
        router,
      });

      if (result.success) {
        // Cập nhật trạng thái đăng nhập
        setIsAuthenticated(false);
        setUserData(null);
        setRememberMe(false);
        reset();
        clearToken();
      } else {
        setAuthError(result.error || null);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError(t("logoutError") || "Đăng xuất thất bại");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Kiểm tra trạng thái để hiển thị form
  const showForm = !isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {t("welcomeBack")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
            {t("enterDetails")}
          </p>
        </div>

        {/* Hiển thị lỗi xác thực */}
        {authError && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {showForm && (
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
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
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
                tabIndex={isAuthenticating || isSubmitting ? -1 : 0}
              >
                {t("forgotPassword")}
              </Link>
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
                t("signIn")
              )}
            </Button>
          </form>
        )}

        {/* Logout Button (hiển thị khi đã xác thực) */}
        {isAuthenticated && (
          <Button
            onClick={onLogout}
            className="w-full h-14 text-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
            disabled={isAuthenticating}
          >
            {(() => {
              try {
                return t("logout");
              } catch (error) {
                return "Đăng xuất";
              }
            })()}
          </Button>
        )}

        {/* Divider */}
        {showForm && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-14 text-base font-medium transition-all duration-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 relative"
                onClick={onGoogleLogin}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>{t("signingIn")}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {t("continueWithGoogle")}
                  </div>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Signup Link */}
        {showForm && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t("dontHaveAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
              tabIndex={isAuthenticating || isSubmitting ? -1 : 0}
            >
              {t("signUp")}
              <ArrowRight className="inline-block ml-1 h-4 w-4" />
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
