"use client";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { ShiftForm } from "./shift-form";
import type { Shift } from "@/features/configs/types";

interface EditShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  onSuccess: () => void;
}

export function EditShiftDialog({
  open,
  onOpenChange,
  shift,
  onSuccess,
}: EditShiftDialogProps) {
  const t = useTranslations("configs");

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        {shift && (
          <ShiftForm
            shift={shift}
            onSuccess={() => {
              handleClose();
              onSuccess();
            }}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
