"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, XIcon } from "lucide-react";

interface AuthExpiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void; // Added to control dialog state
  redirectUrl?: string;
  countdownTime?: number; // in seconds
  onRedirect?: (url: string) => void; // callback for redirection
}

const AuthExpiryDialog = ({
  open,
  onOpenChange,
  redirectUrl = "/login",
  countdownTime = 5,
  onRedirect,
}: AuthExpiryDialogProps) => {
  const [countdown, setCountdown] = useState(countdownTime);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle countdown timer
  useEffect(() => {
    if (!open) return;

    // Reset countdown when dialog opens
    setCountdown(countdownTime);
    setIsRedirecting(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, redirectUrl, countdownTime, onRedirect]);

  // Handle redirection
  const handleRedirect = () => {
    if (isRedirecting) return;

    setIsRedirecting(true);
    // Close the dialog first
    onOpenChange(false);

    // Then redirect after a short delay
    setTimeout(() => {
      if (onRedirect) {
        onRedirect(redirectUrl);
      } else {
        window.location.href = redirectUrl;
      }
    }, 100);
  };

  // Handle immediate redirect
  const handleRedirectNow = () => {
    handleRedirect();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-purple-700 dark:text-purple-400">
            Phiên đăng nhập đã hết hạn
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp
            tục sử dụng dịch vụ.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center p-4">
          <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <Loader2 className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin" />
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Bạn sẽ được chuyển đến trang đăng nhập sau
          <span className="font-bold mx-1 text-purple-600 dark:text-purple-400">
            {countdown}
          </span>
          giây
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-2">
          <Button
            variant="default"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            onClick={handleRedirectNow}
          >
            Đăng nhập ngay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthExpiryDialog;
