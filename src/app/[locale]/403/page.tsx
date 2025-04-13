"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeftCircle } from "lucide-react";

import { ROLE } from "@/constants/role.constant";
import { roleRoutesMap, routeAccess } from "@/constants/route.constant";
import { getAccessToken } from "@/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Forbidden(): JSX.Element {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 🔐 Lấy thông tin người dùng từ Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.roleName || ROLE.GUEST;

  // ✅ Kiểm tra đã đăng nhập chưa
  const isLoggedIn = !!getAccessToken();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    try {
      const referrer = document.referrer;
      const origin = window.location.origin;

      if (referrer && referrer.startsWith(origin)) {
        const refPath = new URL(referrer).pathname;

        // 🛡️ Kiểm tra quyền truy cập bằng routeAccess
        if (routeAccess(refPath, role, isLoggedIn)) {
          router.push(refPath);
          return;
        }
      }
    } catch (error) {
      console.warn("Không thể lấy referrer:", error);
    }

    // 🚪 Nếu không hợp lệ → về route mặc định theo role
    const defaultRoute = roleRoutesMap[role]?.[0] || "/home";
    router.push(defaultRoute);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="absolute top-1/3 left-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ transform: "translateX(-50%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm p-10 max-w-md w-full z-10 text-white"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-5 rounded-full shadow-lg mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <path d="M9 9h.01M15 9h.01" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            403 - Truy cập bị từ chối
          </h1>
          <p className="text-gray-400 text-lg">
            Bạn không có quyền truy cập vào trang này.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleGoBack}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            Quay lại nơi phù hợp
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
