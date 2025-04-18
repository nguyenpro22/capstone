"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletIcon, XIcon } from "lucide-react";

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: () => void;
  amountNeeded?: number;
}

export function InsufficientBalanceModal({
  isOpen,
  onClose,
  onDeposit,
  amountNeeded,
}: InsufficientBalanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-800 dark:text-purple-300">
            Số dư không đủ
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 pt-2">
            Số dư trong ví của bạn không đủ để đặt dịch vụ này.
            {amountNeeded && (
              <div className="mt-2 font-medium">
                Bạn cần nạp thêm ít nhất{" "}
                <span className="text-purple-700 dark:text-purple-300">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(amountNeeded)}
                </span>{" "}
                để tiếp tục.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-purple-50/70 dark:bg-purple-900/20 p-4 rounded-lg my-2">
          <p className="text-sm text-purple-700 dark:text-purple-400">
            Bạn có muốn nạp tiền vào ví để tiếp tục đặt dịch vụ không?
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple-200 dark:border-purple-800/30"
          >
            <XIcon className="h-4 w-4 mr-2" />
            Hủy đặt dịch vụ
          </Button>
          <Button
            onClick={onDeposit}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <WalletIcon className="h-4 w-4 mr-2" />
            Nạp tiền ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
