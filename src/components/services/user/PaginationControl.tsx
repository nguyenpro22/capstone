// components/PaginationControl.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  t: any;
  currentPage: number;
  setCurrentPage: (n: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  totalPages: number;
  filteredLength: number;
  totalCount: number;
}

export const PaginationControl: React.FC<Props> = ({
  t,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  filteredLength,
  totalCount,
}) => {
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-t border-gray-200 dark:border-indigo-800/30 gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-indigo-300/70">
          {t("pagination.rowsPerPage")}:
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-[80px] h-8 bg-white dark:bg-indigo-950/60 dark:border-indigo-800/30 dark:text-indigo-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-indigo-950 dark:border-indigo-800/30">
            {[5, 10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 dark:text-indigo-300/70">
          {t("pagination.showing", {
            count: filteredLength,
            total: totalCount,
          })}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-gray-500 dark:text-indigo-300/70 mx-2">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
