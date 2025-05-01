"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Edit, Plus, Trash, Clock, Calendar } from "lucide-react";
import type { Shift } from "@/features/configs/types";
import { useGetAllShiftsQuery } from "@/features/configs/api";
import { Badge } from "@/components/ui/badge";
import { CreateShiftDialog } from "@/components/clinicManager/configs/create-shift-dialog";
import { EditShiftDialog } from "@/components/clinicManager/configs/edit-shift-dialog";
import { DeleteShiftDialog } from "@/components/clinicManager/configs/delete-shift-dialog";

export function ShiftTable() {
  const t = useTranslations("configs");

  // State
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // API hooks
  const { data, isLoading, refetch } = useGetAllShiftsQuery({
    pageIndex,
    pageSize,
  });

  // Derived data
  const shifts = data?.value?.items || [];
  const totalPages = Math.ceil((data?.value?.totalCount || 0) / pageSize);

  // Handlers
  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setIsEditOpen(true);
  };

  const handleDelete = (shift: Shift) => {
    setSelectedShift(shift);
    setIsDeleteOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    requestAnimationFrame(() => {
      setSelectedShift(null);
    });
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    requestAnimationFrame(() => {
      setSelectedShift(null);
    });
  };

  const handleDialogSuccess = () => {
    refetch();
  };

  // Formatters
  const formatTime = (timeString: string) => {
    try {
      return format(new Date(`2000-01-01T${timeString}`), "hh:mm a");
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("shifts.actions.create")}
        </Button>
      </div>

      <div className="rounded-lg border border-purple-100 dark:border-purple-800/20 overflow-hidden shadow-sm mx-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/5 dark:to-indigo-900/5">
            <TableRow>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300 w-1/6 text-center">
                {t("shifts.columns.name")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300 w-1/6 text-center">
                {t("shifts.columns.startTime")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300 w-1/6 text-center">
                {t("shifts.columns.endTime")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300 w-1/6 text-center">
                {t("shifts.columns.note")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300 w-1/6 text-center">
                {t("shifts.columns.createdAt")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300 w-1/6 text-center">
                {t("shifts.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
                    <p className="text-sm text-muted-foreground">
                      {t("shifts.loading")}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : shifts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Clock className="h-10 w-10 text-purple-300" />
                    <p>{t("shifts.noShifts")}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreateOpen(true)}
                      className="mt-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("shifts.actions.create")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              shifts.map((shift) => (
                <TableRow
                  key={shift.id}
                  className="hover:bg-purple-50/50 dark:hover:bg-purple-900/5 transition-colors"
                >
                  <TableCell className="font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {shift.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      {formatTime(shift.startTime)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      {formatTime(shift.endTime)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-center">
                    {shift.note ? (
                      shift.note
                    ) : (
                      <span className="text-muted-foreground italic text-sm">
                        No notes
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      {formatDate(shift.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(shift)}
                        className="h-8 border-purple-200 text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="ml-1">{t("shifts.actions.edit")}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(shift)}
                        className="h-8 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="ml-1">
                          {t("shifts.actions.delete")}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && shifts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground w-28">
            {t("pagination.page")} {pageIndex} {t("pagination.of")} {totalPages}
          </p>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                {pageIndex === 1 ? (
                  <Button
                    variant="outline"
                    size="icon"
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  >
                    <span className="sr-only">{t("pagination.previous")}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-left"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPageIndex(Math.max(1, pageIndex - 1))}
                    className="border-purple-100 dark:border-purple-800/20 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                  >
                    <span className="sr-only">{t("pagination.previous")}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-left"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                )}
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <Button
                      variant={page === pageIndex ? "default" : "outline"}
                      size="icon"
                      onClick={() => setPageIndex(page)}
                      className={
                        page === pageIndex
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          : "border-purple-100 dark:border-purple-800/20 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                      }
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                {pageIndex === totalPages ? (
                  <Button
                    variant="outline"
                    size="icon"
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  >
                    <span className="sr-only">{t("pagination.next")}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-right"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setPageIndex(Math.min(totalPages, pageIndex + 1))
                    }
                    className="border-purple-100 dark:border-purple-800/20 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                  >
                    <span className="sr-only">{t("pagination.next")}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-right"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs */}
      <CreateShiftDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleDialogSuccess}
      />

      <EditShiftDialog
        open={isEditOpen}
        onOpenChange={(open) => !open && handleCloseEdit()}
        shift={selectedShift}
        onSuccess={handleDialogSuccess}
      />

      <DeleteShiftDialog
        open={isDeleteOpen}
        onOpenChange={(open) => !open && handleCloseDelete()}
        shift={selectedShift}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
