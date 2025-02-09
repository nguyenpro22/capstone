"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, CheckCircle, Key, Mail } from "lucide-react";
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
import { createRegisterSchema } from "@/validations";
import { useEffect, useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
type RegisterFormValues = z.infer<typeof createRegisterSchema>;

export default function RegisterPage() {
  const [register] = useRegisterMutation();
  const [verify] = useVerifyMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await register(data).unwrap();
      console.log(response);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error(error);
    }
  };

  // 🕒 Countdown Effect (Cập nhật mỗi giây)
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

  // ✅ Reset countdown khi mở lại popup nhập mã
  useEffect(() => {
    if (showVerifyPopup) {
      setCountdown(60); // Reset về 3 phút khi mở lại popup
    }
  }, [showVerifyPopup]);

  // 🕒 Format thời gian (mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVerifyCodeSubmit = async () => {
    console.log("Verifying code:", verifyCode);
    // Gửi mã xác minh lên server
    try {
      const email = getValues("Email");
      const response = await verify({
        email: email,
        code: verifyCode,
        type: 0,
      }).unwrap();
      console.log(response);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
    // Sau khi xác minh thành công, chuyển hướng đến login
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-gray-600 text-lg">
          Please fill in the details below to register.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="Email">Email</Label>
          <Input
            {...formRegister("Email")}
            id="Email"
            type="email"
            placeholder="you@example.com"
          />
          {errors.Email && (
            <p className="text-red-500 text-sm">{errors.Email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="Password">Password</Label>
          <div className="relative">
            <Input
              {...formRegister("Password")}
              id="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.Password && (
            <p className="text-red-500 text-sm">{errors.Password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="ConfirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              {...formRegister("ConfirmPassword")}
              id="ConfirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.ConfirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.ConfirmPassword.message}
            </p>
          )}
        </div>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="FirstName">First Name</Label>
            <Input
              {...formRegister("FirstName")}
              id="FirstName"
              type="text"
              placeholder="John"
            />
            {errors.FirstName && (
              <p className="text-red-500 text-sm">{errors.FirstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="LastName">Last Name</Label>
            <Input
              {...formRegister("LastName")}
              id="LastName"
              type="text"
              placeholder="Doe"
            />
            {errors.LastName && (
              <p className="text-red-500 text-sm">{errors.LastName.message}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="PhoneNumber">Phone Number</Label>
          <Input
            {...formRegister("PhoneNumber")}
            id="PhoneNumber"
            type="tel"
            placeholder="+84901234567"
          />
          {errors.PhoneNumber && (
            <p className="text-red-500 text-sm">{errors.PhoneNumber.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="DateOfBirth">Date of Birth</Label>
          <Input
            {...formRegister("DateOfBirth")}
            id="DateOfBirth"
            type="date"
          />
          {errors.DateOfBirth && (
            <p className="text-red-500 text-sm">{errors.DateOfBirth.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="Address">Address</Label>
          <Input
            {...formRegister("Address")}
            id="Address"
            type="text"
            placeholder="Enter your address"
          />
          {errors.Address && (
            <p className="text-red-500 text-sm">{errors.Address.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
        >
          Sign in
          <ArrowRight className="inline-block ml-1 h-4 w-4" />
        </Link>
      </p>
      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-green-600">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle className="h-8 w-8" />
                </div>
                Đăng ký thành công!
              </DialogTitle>
              <DialogDescription className="pt-4 text-base">
                Mã xác minh đã được gửi đến email của bạn. Vui lòng nhập mã để
                hoàn tất đăng ký.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Mail className="h-16 w-16 text-blue-500" />
              </motion.div>
            </div>
            <DialogFooter className="mt-8 sm:justify-start">
              <Button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setShowVerifyPopup(true);
                }}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Nhập mã xác minh
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Verify Code Popup */}
      <Dialog open={showVerifyPopup} onOpenChange={setShowVerifyPopup}>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-blue-600">
                <div className="rounded-full bg-blue-100 p-2">
                  <Key className="h-8 w-8" />
                </div>
                Nhập mã xác minh
              </DialogTitle>
              <DialogDescription className="pt-4 text-base">
                Vui lòng kiểm tra email của bạn và nhập mã xác minh.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <Input
                type="text"
                placeholder="Nhập mã xác minh"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Time remaining: </span>
              <span className="font-medium text-indigo-600">
                {formatTime(countdown)}
              </span>
            </div>
            <DialogFooter className="mt-8 sm:justify-start">
              <Button
                onClick={handleVerifyCodeSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
