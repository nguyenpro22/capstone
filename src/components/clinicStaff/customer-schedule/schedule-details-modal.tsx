"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Stethoscope,
  Building,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import type { CustomerSchedule } from "@/features/customer-schedule/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useSendMessageMutation } from "@/features/inbox/api"; // Adjust the import path based on your project structure
import { useToast } from "@/hooks/use-toast";

interface SendMessageBody {
  entityId: string;
  content: string;
  isClinic: boolean;
}

interface ScheduleDetailsModalProps {
  schedule: CustomerSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  disableCheckout?: boolean;
  handleProtectedAction?: (action: () => void, fallback: () => void) => void;
  setShowLoginModal?: (show: boolean) => void;
  setPostLoginAction?: (action: () => void) => void;
}

export default function ScheduleDetailsModal({
  schedule,
  isOpen,
  onClose,
  onCheckout,
  disableCheckout = false,
  handleProtectedAction,
  setShowLoginModal,
  setPostLoginAction,
}: ScheduleDetailsModalProps) {
  const t = useTranslations("customerSchedule");
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { toast } = useToast();
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  if (!schedule) return null;

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleChat = () => {
    // Check if we have necessary data
    if (!schedule.userId) {
      toast({
        title: "Không thể liên hệ",
        description: "Thiếu thông tin phòng khám. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    const data: SendMessageBody = {
      entityId: schedule.userId,
      content: `Nếu bạn có thắc mắc gì về lịch hẹn vào ngày ${schedule.bookingDate} lúc ${schedule.startTime}, xin vui lòng liên hệ với tôi nhé!!`,
      isClinic: true,
    };

    sendMessage(data)
      .then((response) => {
        console.log("Message sent successfully:", response);
        router.push(`inbox`);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        toast({
          title: "Lỗi",
          description: "Không thể gửi tin nhắn. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      });
  };

  const handleChatNow = () => {
    if (handleProtectedAction && setPostLoginAction && setShowLoginModal) {
      handleProtectedAction(handleChat, () => {
        setPostLoginAction(() => handleChat);
        setShowLoginModal(true);
      });
    } else {
      // Fallback if authentication handling props aren't provided
      handleChat();
    }
  };

  // Get status color based on status and theme
  const getStatusColorClass = () => {
    const status = schedule.status.toLowerCase();

    if (status === "confirmed") {
      return isDark ? "bg-emerald-700 text-emerald-100" : "bg-emerald-500";
    } else if (status === "pending") {
      return isDark ? "bg-amber-700 text-amber-100" : "bg-amber-500";
    } else {
      return isDark ? "bg-rose-700 text-rose-100" : "bg-rose-500";
    }
  };

  // Background gradient based on theme
  const cardBgClass = isDark
    ? "bg-gradient-to-r from-gray-800 to-gray-900 shadow-md"
    : "bg-gradient-to-r from-pink-50 to-purple-50";

  // Secondary card background
  const secondaryCardBgClass = isDark ? "bg-gray-800" : "bg-gray-50";

  // Text colors
  const primaryTextClass = isDark ? "text-white" : "text-gray-700";
  const secondaryTextClass = isDark ? "text-gray-300" : "text-gray-600";
  const accentTextClass = isDark ? "text-pink-300" : "text-pink-700";

  // Icon colors
  const iconColorClass = isDark ? "text-pink-400" : "text-pink-500";

  // Check if this is being viewed from the All Schedules section (history view)
  const isHistoryView =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/history") ||
      window.location.search.includes("history=true") ||
      (schedule.status.toLowerCase() !== "confirmed" &&
        schedule.status.toLowerCase() !== "pending"));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif dark:text-white">
            {t("scheduleDetails")}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {t("viewScheduleDetails")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto pr-1">
          <div
            className={`${cardBgClass} p-4 rounded-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium ${accentTextClass}`}>
                {t("appointmentInformation")}
              </h3>
              <Badge
                className={`${getStatusColorClass()} font-medium px-3 py-1`}
              >
                {schedule.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className={`h-5 w-5 ${iconColorClass} mt-0.5`} />
                <div>
                  <p className={`font-medium ${primaryTextClass}`}>
                    {t("customer")}
                  </p>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    {schedule.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className={`h-5 w-5 ${iconColorClass} mt-0.5`} />
                <div>
                  <p className={`font-medium ${primaryTextClass}`}>
                    {t("phone")}
                  </p>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    {schedule.customerPhoneNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope className={`h-5 w-5 ${iconColorClass} mt-0.5`} />
                <div>
                  <p className={`font-medium ${primaryTextClass}`}>
                    {t("service")}
                  </p>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    {schedule.serviceName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className={`h-5 w-5 ${iconColorClass} mt-0.5`} />
                <div>
                  <p className={`font-medium ${primaryTextClass}`}>
                    {t("doctor")}
                  </p>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    {schedule.doctorName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className={`h-5 w-5 ${iconColorClass} mt-0.5`} />
                <div>
                  <p className={`font-medium ${primaryTextClass}`}>
                    {t("date")}
                  </p>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    {schedule.bookingDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className={`h-5 w-5 ${iconColorClass} mt-0.5`} />
                <div>
                  <p className={`font-medium ${primaryTextClass}`}>
                    {t("time")}
                  </p>
                  <p className={`text-sm ${secondaryTextClass}`}>
                    {formatTimeRange(schedule.startTime, schedule.endTime)}
                  </p>
                </div>
              </div>

              {schedule.amount && (
                <div className="flex items-start gap-3">
                  <CreditCard className={`h-5 w-5 ${iconColorClass} mt-0.5`} />
                  <div>
                    <p className={`font-medium ${primaryTextClass}`}>
                      {t("price")}
                    </p>
                    <p
                      className={`text-sm ${secondaryTextClass} font-semibold`}
                    >
                      {formatPrice(schedule.amount)}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleChatNow}
                  size="sm"
                  disabled={isSendingMessage}
                  className={`${
                    isDark
                      ? "bg-gray-800 text-pink-300 border-pink-800 hover:bg-gray-700"
                      : "text-pink-600 border-pink-200 hover:bg-pink-50"
                  } h-8 px-2 py-1 w-full`}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {isSendingMessage
                    ? t("sending") || "Đang gửi..."
                    : t("contact") || "Liên hệ"}
                </Button>
              </div>
            </div>
          </div>

          {schedule.note && (
            <div
              className={`${secondaryCardBgClass} p-4 rounded-lg border ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className={`font-medium ${primaryTextClass} mb-2`}>
                {t("notes")}
              </h3>
              <p className={`text-sm ${secondaryTextClass}`}>{schedule.note}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            {t("close")}
          </Button>

          {!isHistoryView && (
            <Button
              onClick={onCheckout}
              className={`${
                isDark
                  ? "bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white"
                  : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              } transition-all duration-300`}
              disabled={
                disableCheckout || schedule.status.toLowerCase() === "pending"
              }
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {t("proceedToCheckout")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
