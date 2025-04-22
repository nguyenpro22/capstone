"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Key,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRegisterMutation, useVerifyMutation } from "@/features/auth/api";
// Import the createRegisterSchema but we'll enhance it with additional validations
import { createRegisterSchema } from "@/validations";
import { useEffect, useState, useCallback } from "react";
import type { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

type RegisterFormValues = z.infer<typeof createRegisterSchema>;

// Enhanced validation schema with more comprehensive checks
const enhancedRegisterSchema = createRegisterSchema
  .refine(
    (data) => {
      // Email format validation (more comprehensive than basic Zod email)
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(data.Email);
    },
    {
      message: "Please enter a valid email address",
      path: ["Email"],
    }
  )
  .refine(
    (data) => {
      // Check for whitespace in password
      return !/\s/.test(data.Password);
    },
    {
      message: "Password cannot contain spaces or whitespace characters",
      path: ["Password"],
    }
  )
  .refine(
    (data) => {
      // Password strength validation
      const hasUpperCase = /[A-Z]/.test(data.Password);
      const hasLowerCase = /[a-z]/.test(data.Password);
      const hasNumber = /[0-9]/.test(data.Password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.Password);
      return (
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        data.Password.length >= 8
      );
    },
    {
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      path: ["Password"],
    }
  )
  .refine(
    (data) => {
      // Confirm password matches password
      return data.Password === data.ConfirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["ConfirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Name validation - no numbers or special characters
      const nameRegex = /^[a-zA-Z\s]+$/;
      return nameRegex.test(data.FirstName);
    },
    {
      message: "First name should only contain letters",
      path: ["FirstName"],
    }
  )
  .refine(
    (data) => {
      // Name validation - no numbers or special characters
      const nameRegex = /^[a-zA-Z\s]+$/;
      return nameRegex.test(data.LastName);
    },
    {
      message: "Last name should only contain letters",
      path: ["LastName"],
    }
  )
  .refine(
    (data) => {
      // Phone number validation
      const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
      return phoneRegex.test(data.PhoneNumber);
    },
    {
      message: "Please enter a valid phone number",
      path: ["PhoneNumber"],
    }
  )
  .refine(
    (data) => {
      // Date of birth validation - must be at least 18 years old
      if (!data.DateOfBirth) return false;

      const dob = new Date(data.DateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      // If birth month is later in the year or same month but birth day is later
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        return age - 1 >= 18; // Not yet had birthday this year
      }

      return age >= 18;
    },
    {
      message: "You must be at least 18 years old to register",
      path: ["DateOfBirth"],
    }
  )
  .refine(
    (data) => {
      // Address validation - minimum length
      return data.Address.length >= 5;
    },
    {
      message: "Address must be at least 5 characters long",
      path: ["Address"],
    }
  );

// Define the error response type
interface ValidationError {
  code: string;
  message: string;
}

interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: ValidationError[];
}

// Add this function after the imports
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function RegisterPage() {
  const t = useTranslations("register");
  const [register] = useRegisterMutation();
  const [verify, { isLoading }] = useVerifyMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setError,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(enhancedRegisterSchema),
    mode: "onChange", // Changed from onSubmit to provide real-time validation feedback
  });

  // Add this function after the onInvalidSubmit function
  const validatePasswordStrength = (password: string) => {
    const criteria = [
      { regex: /.{8,}/, label: "8+ characters" },
      { regex: /[A-Z]/, label: "Uppercase letter" },
      { regex: /[a-z]/, label: "Lowercase letter" },
      { regex: /[0-9]/, label: "Number" },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, label: "Special character" },
    ];

    return criteria.map((criterion) => ({
      label: criterion.label,
      met: criterion.regex.test(password),
    }));
  };

  // Add this state for password strength
  const [passwordCriteria, setPasswordCriteria] = useState(() =>
    validatePasswordStrength("")
  );

  // Add this function after the validatePasswordStrength function
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Add this function to check for whitespace in password
  const containsWhitespace = (password: string) => {
    return /\s/.test(password);
  };

  // Add this state for email validation
  const [isEmailValid, setIsEmailValid] = useState(true);
  // Add this state to track whitespace in password
  const [hasWhitespace, setHasWhitespace] = useState(false);

  // Add this function after the validateEmail function
  const validateVerificationCode = (code: string) => {
    // Verification code should be 6 digits
    const codeRegex = /^\d{5}$/;
    return codeRegex.test(code);
  };

  // Add these debounced functions after the validateVerificationCode function
  const debouncedEmailValidation = useCallback(
    debounce((email: string) => {
      setIsEmailValid(validateEmail(email));
    }, 500),
    []
  );

  const debouncedPasswordValidation = useCallback(
    debounce((password: string) => {
      setPasswordCriteria(validatePasswordStrength(password));
    }, 300),
    []
  );

  // Add this effect to update password strength indicators
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "Password" && value.Password) {
        debouncedPasswordValidation(value.Password);
        // Check for whitespace in password
        setHasWhitespace(containsWhitespace(value.Password));
      }
      if (name === "Email" && value.Email) {
        debouncedEmailValidation(value.Email);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedPasswordValidation, debouncedEmailValidation]);

  // Hàm xử lý khi form hợp lệ
  const onValidSubmit = async (data: RegisterFormValues) => {
    console.log("Form data valid, submitting:", data);
    try {
      // Tạo một bản sao của dữ liệu và loại bỏ ConfirmPassword
      const { ConfirmPassword, ...submitData } = data;

      const response = await register(submitData).unwrap();
      console.log("Registration successful:", response);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle validation errors from the API
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as any;
        console.log("Error data:", errorData);

        // Luôn hiển thị thông báo detail cho lỗi 400
        if (errorData.status === 400 && errorData.detail) {
          toast.error(errorData.detail);
          return;
        }

        // Check if it's a validation error (status 422)
        if (errorData.status === 422) {
          // Process each validation error and set it on the corresponding field
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorData.errors.forEach((err: ValidationError) => {
              // The code property matches the field name in the form
              if (err.code && err.message) {
                // Set the error in the form for the specific field
                setError(err.code as keyof RegisterFormValues, {
                  type: "server",
                  message: err.message,
                });

                // Also show a toast for the error
                toast.error(err.message);
              }
            });

            // Show the general error message
            if (errorData.detail) {
              toast.error(errorData.detail);
            }
          }
        }
        // Handle other error responses with detail message
        else if (errorData.detail) {
          toast.error(errorData.detail);
        } else {
          // Generic error
          toast.error(t("unexpectedError"));
        }
      } else {
        // Handle other errors
        toast.error(t("unexpectedError"));
      }
    }
  };

  // Hàm xử lý khi form không hợp lệ
  const onInvalidSubmit = (errors: any) => {
    console.error("Form validation errors:", errors);
    // Hiển thị toast cho lỗi đầu tiên
    const firstError = Object.values(errors)[0] as { message?: string };
    if (firstError && firstError.message) {
      toast.error(firstError.message);
    }
  };

  // 🕒 Countdown Effect
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (showVerifyPopup && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [showVerifyPopup, countdown]);

  // ✅ Reset countdown when reopening the verification popup
  useEffect(() => {
    if (showVerifyPopup) {
      setCountdown(60);
    }
  }, [showVerifyPopup]);

  // 🕒 Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Update the setVerifyCode function to validate the code
  const handleVerifyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setVerifyCode(code);
    setIsCodeValid(validateVerificationCode(code) || code.length === 0);
  };

  // Updated verification handler with loading state and success toast
  const handleVerifyCodeSubmit = async () => {
    if (!verifyCode.trim()) {
      toast.error(t("pleaseEnterVerificationCode"));
      return;
    }

    if (!validateVerificationCode(verifyCode)) {
      toast.error(t("invalidVerificationCode"));
      return;
    }

    setIsVerifying(true); // Set loading state to true

    try {
      const email = getValues("Email");
      const response = await verify({
        email: email,
        code: verifyCode,
        type: 0,
      }).unwrap();

      console.log(response);

      // Show success toast
      toast.success(t("verificationSuccessful"));
      router.push("/login");
    } catch (error) {
      console.error(error);

      // Show error toast
      toast.error(t("verificationFailed"));
    } finally {
      setIsVerifying(false); // Reset loading state regardless of outcome
    }
  };

  // Add this state for verification code validation
  const [isCodeValid, setIsCodeValid] = useState(true);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {t("createAccount")}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
          {t("fillDetails")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
        className="space-y-6"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="Email" className="text-gray-700 dark:text-gray-300">
            {t("email")}
          </Label>
          <div className="relative">
            <Input
              {...formRegister("Email")}
              id="Email"
              type="email"
              placeholder={t("emailPlaceholder")}
              className={`h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 ${
                !isEmailValid && getValues("Email")?.length > 0
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500"
              } focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl pr-10`}
            />
            {getValues("Email")?.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isEmailValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {errors.Email && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.Email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label
            htmlFor="Password"
            className="text-gray-700 dark:text-gray-300"
          >
            {t("password")}
          </Label>
          <div className="relative">
            <Input
              {...formRegister("Password")}
              id="Password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              className={`h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 ${
                hasWhitespace
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500"
              } focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {hasWhitespace && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {t("passwordNoSpaces") ||
                "Password cannot contain spaces or whitespace characters"}
            </p>
          )}
          {errors.Password && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.Password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="ConfirmPassword"
            className="text-gray-700 dark:text-gray-300"
          >
            {t("confirmPassword")}
          </Label>
          <div className="relative">
            <Input
              {...formRegister("ConfirmPassword")}
              id="ConfirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.ConfirmPassword && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.ConfirmPassword.message}
            </p>
          )}
        </div>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="FirstName"
              className="text-gray-700 dark:text-gray-300"
            >
              {t("firstName")}
            </Label>
            <Input
              {...formRegister("FirstName")}
              id="FirstName"
              type="text"
              placeholder={t("firstNamePlaceholder")}
              className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
            />
            {errors.FirstName && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.FirstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="LastName"
              className="text-gray-700 dark:text-gray-300"
            >
              {t("lastName")}
            </Label>
            <Input
              {...formRegister("LastName")}
              id="LastName"
              type="text"
              placeholder={t("lastNamePlaceholder")}
              className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
            />
            {errors.LastName && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.LastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label
            htmlFor="PhoneNumber"
            className="text-gray-700 dark:text-gray-300"
          >
            {t("phoneNumber")}
          </Label>
          <Input
            {...formRegister("PhoneNumber")}
            id="PhoneNumber"
            type="tel"
            placeholder={t("phoneNumberPlaceholder")}
            className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
          />
          {errors.PhoneNumber && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.PhoneNumber.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label
            htmlFor="DateOfBirth"
            className="text-gray-700 dark:text-gray-300"
          >
            {t("dateOfBirth")}
          </Label>
          <Input
            {...formRegister("DateOfBirth")}
            id="DateOfBirth"
            type="date"
            className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
            max={new Date().toISOString().split("T")[0]} // Prevents future dates
          />
          {errors.DateOfBirth && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.DateOfBirth.message}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("mustBe18YearsOld")}
          </p>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="Address" className="text-gray-700 dark:text-gray-300">
            {t("address")}
          </Label>
          <Input
            {...formRegister("Address")}
            id="Address"
            type="text"
            placeholder={t("addressPlaceholder")}
            className="h-11 px-4 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl"
          />
          {errors.Address && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.Address.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full h-14 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
            isSubmitting ? "animate-pulse" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("registering") : t("register")}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
        >
          {t("signIn")}
          <ArrowRight className="inline-block ml-1 h-4 w-4" />
        </Link>
      </p>

      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-green-600 dark:text-green-500">
                <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2">
                  <CheckCircle className="h-8 w-8" />
                </div>
                {t("registrationSuccess")}
              </DialogTitle>
              <DialogDescription className="pt-4 text-base text-gray-600 dark:text-gray-400">
                {t("verificationCodeSent")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Mail className="h-16 w-16 text-blue-500 dark:text-blue-400" />
              </motion.div>
            </div>
            <DialogFooter className="mt-8 sm:justify-start">
              <Button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setShowVerifyPopup(true);
                }}
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                {t("enterVerificationCode")}
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Verify Code Popup */}
      <Dialog open={showVerifyPopup} onOpenChange={setShowVerifyPopup}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-blue-600 dark:text-blue-500">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                  <Key className="h-8 w-8" />
                </div>
                {t("enterVerificationCode")}
              </DialogTitle>
              <DialogDescription className="pt-4 text-base text-gray-600 dark:text-gray-400">
                {t("checkEmail")}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <Input
                type="text"
                placeholder={t("verificationCodePlaceholder")}
                value={verifyCode}
                onChange={handleVerifyCodeChange}
                className={`text-center text-2xl tracking-widest h-16 px-4 bg-white dark:bg-gray-800 border-2 ${
                  !isCodeValid && verifyCode.length > 0
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500"
                } focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-300 rounded-xl`}
                maxLength={6}
                disabled={isVerifying}
              />
              {!isCodeValid && verifyCode.length > 0 && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {t("invalidVerificationCode")}
                </p>
              )}
            </div>

            <div className="text-center text-sm mt-4">
              <span className="text-gray-600 dark:text-gray-400">
                {t("timeRemaining")}:{" "}
              </span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {formatTime(countdown)}
              </span>
            </div>
            <DialogFooter className="mt-8 sm:justify-start">
              <Button
                onClick={handleVerifyCodeSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("verifying")}</span>
                  </div>
                ) : (
                  t("confirm")
                )}
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
