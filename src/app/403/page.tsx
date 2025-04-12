"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 rounded-full bg-pink-100 p-6 mx-auto w-24 h-24 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-pink-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
          Truy cập bị từ chối
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Bạn không có quyền truy cập vào trang này. Vui lòng quay lại trang
          trước hoặc liên hệ với chúng tôi nếu bạn cần hỗ trợ.
        </p>
        <Button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    </div>
  );
}
