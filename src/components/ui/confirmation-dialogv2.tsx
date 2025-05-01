"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Trash2, AlertCircle, HelpCircle, CheckCircle } from "lucide-react";

export type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode; // Changed from string to ReactNode to support JSX
  confirmButtonText?: string;
  cancelButtonText?: string | null;
  isLoading?: boolean;
  type?: "delete" | "warning" | "info" | "success";
  icon?: React.ReactNode;
};

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmButtonText = "Xác nhận",
  cancelButtonText = "Hủy",
  isLoading = false,
  type = "delete",
  icon,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  // Determine icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "delete":
        return {
          icon: icon || <Trash2 className="w-6 h-6 text-red-600" />,
          iconBg: "bg-red-100",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonText: confirmButtonText || "Xóa",
        };
      case "warning":
        return {
          icon: icon || <AlertCircle className="w-6 h-6 text-amber-600" />,
          iconBg: "bg-amber-100",
          buttonBg: "bg-amber-600 hover:bg-amber-700",
          buttonText: confirmButtonText || "Tiếp tục",
        };
      case "success":
        return {
          icon: icon || <CheckCircle className="w-6 h-6 text-green-600" />,
          iconBg: "bg-green-100",
          buttonBg: "bg-green-600 hover:bg-green-700",
          buttonText: confirmButtonText || "Đồng ý",
        };
      case "info":
      default:
        return {
          icon: icon || <HelpCircle className="w-6 h-6 text-blue-600" />,
          iconBg: "bg-blue-100",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          buttonText: confirmButtonText || "Đồng ý",
        };
    }
  };

  const { icon: typeIcon, iconBg, buttonBg, buttonText } = getTypeStyles();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${iconBg} dark:bg-opacity-20 rounded-full`}>
            {typeIcon}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
        </div>

        <div className="text-gray-600 dark:text-gray-300 mb-6">{message}</div>

        <div className="flex justify-end gap-3">
          {cancelButtonText !== null && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {cancelButtonText}
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg ${buttonBg} text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-70`}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                {type === "delete" && <Trash2 className="w-4 h-4" />}
                {type === "success" && <CheckCircle className="w-4 h-4" />}
                {buttonText}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
