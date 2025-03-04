import React from "react";

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
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(pageIndex - 1)}
        className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 disabled:opacity-50"
      >
      ← Previous
      </button>

      <span className="text-sm text-gray-500">
        Page {pageIndex} of {totalPages}
      </span>

      <button
        disabled={!hasNextPage}
        onClick={() => onPageChange(pageIndex + 1)}
        className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 disabled:opacity-50"
      >
        Next →
      </button>
    </div>
   
  );
};

export default Pagination;
