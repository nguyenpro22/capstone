"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import type { Shift } from "@/features/configs/types";
import { useDeleteShiftMutation } from "@/features/configs/api";

interface DeleteShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  onSuccess: () => void;
}

export function DeleteShiftDialog({
  open,
  onOpenChange,
  shift,
  onSuccess,
}: DeleteShiftDialogProps) {
  const t = useTranslations("configs");
  const [deleteShift, { isLoading: isDeleting }] = useDeleteShiftMutation();

  const handleClose = () => {
    onOpenChange(false);
  };

  const confirmDelete = async () => {
    if (!shift) return;

    try {
      await deleteShift({ id: shift.id }).unwrap();
      toast.success(t("shifts.messages.deleteSuccess"), {
        className: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
        progressClassName: "bg-white",
      });
      onSuccess();
    } catch (error) {
      toast.error("Failed to delete shift");
    } finally {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={handleClose}
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
  );
}
