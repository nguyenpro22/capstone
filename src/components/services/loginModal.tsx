"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalConfirmLoginProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ModalConfirmLogin({
  isOpen,
  onCancel,
  onConfirm,
}: ModalConfirmLoginProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn cần đăng nhập</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Vui lòng đăng nhập để tiếp tục thực hiện hành động này.
        </p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={onConfirm}>Đăng nhập</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
