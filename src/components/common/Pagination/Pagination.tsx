"use client";

import type React from "react";
import { useTranslations } from "next-intl"; // Assuming you're using next-intl

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageSize,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}) => {
  const t = useTranslations("pagination");
  const totalPages = Math.ceil(totalCount / pageSize);

  // Luôn hiển thị phân trang nếu có dữ liệu, bất kể đang ở trang nào
  // Chỉ ẩn khi thực sự chỉ có 1 trang
  if (totalCount <= pageSize && totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(pageIndex - 1)}
        className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("previous")}
      </button>

      <span className="text-sm text-gray-500">
        {t("pageOf", { page: pageIndex, total: totalPages })}
      </span>

      <button
        disabled={!hasNextPage}
        onClick={() => onPageChange(pageIndex + 1)}
        className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("next")}
      </button>
    </div>
  );
};

export default Pagination;
