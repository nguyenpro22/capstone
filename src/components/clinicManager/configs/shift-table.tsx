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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ShiftForm } from "./shift-form";
import { toast } from "react-toastify";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
  Clock,
  Calendar,
} from "lucide-react";
import type { Shift } from "@/features/configs/types";
import {
  useDeleteShiftMutation,
  useGetAllShiftsQuery,
} from "@/features/configs/api";
import { Badge } from "@/components/ui/badge";

export function ShiftTable() {
  const t = useTranslations("configs");

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const { data, isLoading, refetch } = useGetAllShiftsQuery({
    pageIndex,
    pageSize,
  });

  const [deleteShift, { isLoading: isDeleting }] = useDeleteShiftMutation();

  const shifts = data?.value?.items || [];
  const totalPages = data?.value?.totalCount || 1;

  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setIsEditOpen(true);
  };

  const handleDelete = (shift: Shift) => {
    setSelectedShift(shift);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedShift) return;

    try {
      await deleteShift({ id: selectedShift.id }).unwrap();
      toast.success(t("shifts.messages.deleteSuccess"), {
        className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
        progressClassName: "bg-white",
      });
      refetch();
    } catch (error) {
      toast.error("Failed to delete shift");
    } finally {
      setIsDeleteOpen(false);
      setSelectedShift(null);
    }
  };

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

      <div className="rounded-lg border border-purple-100 dark:border-purple-800/20 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/5 dark:to-indigo-900/5">
            <TableRow>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300">
                {t("shifts.columns.name")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300">
                {t("shifts.columns.startTime")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300">
                {t("shifts.columns.endTime")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300">
                {t("shifts.columns.note")}
              </TableHead>
              <TableHead className="font-semibold text-purple-800 dark:text-purple-300">
                {t("shifts.columns.createdAt")}
              </TableHead>
              <TableHead className="text-right font-semibold text-purple-800 dark:text-purple-300">
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
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {shift.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      {formatTime(shift.startTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      {formatTime(shift.endTime)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {shift.note ? (
                      shift.note
                    ) : (
                      <span className="text-muted-foreground italic text-sm">
                        No notes
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      {formatDate(shift.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-purple-50 dark:hover:bg-purple-900/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-purple-100 dark:border-purple-800/20 shadow-lg"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEdit(shift)}
                          className="hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4 text-purple-600" />
                          {t("shifts.actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(shift)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          {t("shifts.actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Create Shift Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md border-purple-100 dark:border-purple-800/20 shadow-lg">
          <DialogHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/5 dark:to-indigo-900/5 p-6 -mx-6 -mt-6 rounded-t-lg">
            <DialogTitle className="text-xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t("shifts.actions.create")}
            </DialogTitle>
            <DialogDescription className="text-purple-600/80 dark:text-purple-400/80">
              {t("shifts.createDescription")}
            </DialogDescription>
          </DialogHeader>
          <ShiftForm
            onSuccess={() => {
              setIsCreateOpen(false);
              refetch();
            }}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md border-purple-100 dark:border-purple-800/20 shadow-lg">
          <DialogHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/5 dark:to-indigo-900/5 p-6 -mx-6 -mt-6 rounded-t-lg">
            <DialogTitle className="text-xl text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {t("shifts.actions.edit")}
            </DialogTitle>
            <DialogDescription className="text-purple-600/80 dark:text-purple-400/80">
              {t("shifts.editDescription")}
            </DialogDescription>
          </DialogHeader>
          {selectedShift && (
            <ShiftForm
              shift={selectedShift}
              onSuccess={() => {
                setIsEditOpen(false);
                refetch();
                setSelectedShift(null);
              }}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedShift(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md border-purple-100 dark:border-purple-800/20 shadow-lg">
          <DialogHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/5 dark:to-red-800/10 p-6 -mx-6 -mt-6 rounded-t-lg">
            <DialogTitle className="text-xl text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash className="h-5 w-5" />
              {t("shifts.actions.delete")}
            </DialogTitle>
            <DialogDescription className="text-red-600/80 dark:text-red-400/80">
              {t("shifts.messages.deleteConfirm")}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50/50 dark:bg-red-900/5 p-4 rounded-lg border border-red-100 dark:border-red-800/20">
            <p className="text-sm text-red-600/80 dark:text-red-400/80 flex items-center gap-2">
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
                className="lucide lucide-alert-triangle"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              {t("shifts.messages.deleteWarning")}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-purple-100 dark:border-purple-800/20 hover:bg-purple-50 dark:hover:bg-purple-900/10"
            >
              {t("shifts.actions.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white mr-2"></div>
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              {t("shifts.actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
