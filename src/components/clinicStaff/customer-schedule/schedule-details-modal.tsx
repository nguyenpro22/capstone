"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  Mail,
  X,
  Percent,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { SendMessageBody, useSendMessageMutation } from "@/features/inbox/api"; // Adjust the import path based on your project structure
import { useToast } from "@/hooks/use-toast";
import { CustomerSchedule } from "@/features/customer-schedule/types";

// Updated CustomerSchedule interface

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

  // Format time from hh:mm:ss to hh:mm if needed
  const formatTime = (time: string) => {
    if (!time) return "";
    // Check if time has seconds (hh:mm:ss format)
    if (time.split(":").length === 3) {
      // Return only hours and minutes
      return time.split(":").slice(0, 2).join(":");
    }
    return time;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Updated to use discountAmount and servicePrice
  const calculateDiscountPercentage = () => {
    if (!schedule.servicePrice || !schedule.discountAmount) return 0;
    return Math.round((schedule.discountAmount / schedule.servicePrice) * 100);
  };

  // Calculate remaining amount (if needed)
  const calculateRemainingAmount = () => {
    // If amount is provided, use it directly
    if (schedule.amount !== undefined) {
      return schedule.amount;
    }

    // Otherwise calculate: servicePrice - discountAmount - depositAmount
    const servicePrice = schedule.servicePrice || 0;
    const discountAmount = schedule.discountAmount || 0;
    const depositAmount = schedule.depositAmount || 0;

    return Math.max(0, servicePrice - discountAmount - depositAmount);
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
      content: `Nếu bạn có thắc mắc gì về lịch hẹn vào ngày ${
        schedule.bookingDate
      } lúc ${formatTime(
        schedule.startTime
      )}, xin vui lòng liên hệ với tôi nhé!!`,
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

  // Get status badge with updated colors
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
            {t("completed")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700">
            {t("pending")}
          </Badge>
        );
      case "in progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("inProgress")}
          </Badge>
        );
      case "uncompleted":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
            {t("uncompleted")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
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
        schedule.status.toLowerCase() !== "in progress" &&
        schedule.status.toLowerCase() !== "pending"));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-4xl max-h-[90vh] dark:bg-gray-900 dark:border-gray-700 rounded-lg p-0 overflow-hidden flex flex-col"
        style={{
          borderRadius: "0.5rem",
        }}
      >
        {/* Fixed header */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 rounded-t-lg">
          <div className="flex items-center justify-between p-4 pr-8">
            <div>
              <h2 className="text-xl font-serif dark:text-white">
                {t("scheduleDetails")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("viewScheduleDetails")}
              </p>
            </div>
            {getStatusBadge(schedule.status)}
          </div>

          {/* Fixed close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto p-4 pt-2 flex-grow"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          <div className="space-y-4">
            {/* Main content in 2-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column - Appointment Information */}
              <div className="space-y-4">
                {/* Appointment Information Section */}
                <div
                  className={`${cardBgClass} p-4 rounded-lg transition-all duration-200`}
                >
                  <h3 className={`font-medium ${accentTextClass} mb-3`}>
                    {t("appointmentInformation") || "Thông tin lịch hẹn"}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3">
                      <CreditCard
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("bookingId") || "Booking ID"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Stethoscope
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("service") || "Dịch vụ"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.serviceName} - {t("step") || "Bước"}{" "}
                          {schedule.stepIndex}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("serviceType") || "Loại dịch vụ"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.procedureName || ""} -{" "}
                          {schedule.procedurePriceTypeName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("date") || "Ngày"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.bookingDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("time") || "Thời gian"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {formatTime(schedule.startTime)} -{" "}
                          {formatTime(schedule.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Customer Information and Notes */}
              <div className="space-y-4">
                {/* Customer Information Section */}
                <div
                  className={`${cardBgClass} p-4 rounded-lg transition-all duration-200`}
                >
                  <h3 className={`font-medium ${accentTextClass} mb-3`}>
                    {t("customerInformation") || "Thông tin khách hàng"}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3">
                      <User
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("customer") || "Khách hàng"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.customerName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("phone") || "Số điện thoại"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.customerPhoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("email") || "Email"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.customerEmail || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Information - Moved below customer information */}
                <div
                  className={`${cardBgClass} p-4 rounded-lg transition-all duration-200`}
                >
                  <h3 className={`font-medium ${accentTextClass} mb-3`}>
                    {t("doctorInformation") || "Thông tin bác sĩ"}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3">
                      <Stethoscope
                        className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                      />
                      <div className="flex-grow">
                        <p className={`font-medium ${primaryTextClass}`}>
                          {t("doctor") || "Bác sĩ"}
                        </p>
                        <p className={`text-sm ${secondaryTextClass}`}>
                          {schedule.doctorName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                {schedule.doctorNote && (
                  <div
                    className={`${secondaryCardBgClass} p-4 rounded-lg border ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <h3 className={`font-medium ${primaryTextClass} mb-2`}>
                      {t("notes") || "Ghi chú"}
                    </h3>
                    <p className={`text-sm ${secondaryTextClass}`}>
                      {schedule.doctorNote}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Information Section - Always at the bottom */}
            <div
              className={`${cardBgClass} p-4 rounded-lg transition-all duration-200 mt-4`}
            >
              <h3 className={`font-medium ${accentTextClass} mb-3`}>
                {t("priceInformation") || "Thông tin giá"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CreditCard
                    className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                  />
                  <div className="flex-grow">
                    <p className={`font-medium ${primaryTextClass}`}>
                      {t("servicePrice") || "Giá dịch vụ"}
                    </p>
                    <p
                      className={`text-sm ${secondaryTextClass} font-semibold`}
                    >
                      {formatPrice(schedule.servicePrice || 0)}
                    </p>
                  </div>
                </div>

                {(schedule.discountAmount || schedule.discountAmount === 0) && (
                  <div className="flex items-start gap-3">
                    <Percent
                      className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                    />
                    <div className="flex-grow">
                      <p className={`font-medium ${primaryTextClass}`}>
                        {t("discount") || "Khuyến mãi"}
                      </p>
                      <p
                        className={`text-sm ${secondaryTextClass} font-semibold`}
                      >
                        {formatPrice(schedule.discountAmount)} (
                        {calculateDiscountPercentage()}%)
                      </p>
                    </div>
                  </div>
                )}

                {(schedule.depositAmount || schedule.depositAmount === 0) && (
                  <div className="flex items-start gap-3">
                    <Wallet
                      className={`h-5 w-5 ${iconColorClass} mt-0.5 flex-shrink-0`}
                    />
                    <div className="flex-grow">
                      <p className={`font-medium ${primaryTextClass}`}>
                        {t("deposit") || "Tiền cọc"}
                      </p>
                      <p
                        className={`text-sm ${secondaryTextClass} font-semibold`}
                      >
                        {formatPrice(schedule.depositAmount)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className={`font-medium text-lg ${primaryTextClass}`}>
                    {t("totalAmount") || "Tổng tiền cần thanh toán"}
                  </p>
                  <p
                    className={`text-lg text-pink-500 dark:text-pink-300 font-bold`}
                  >
                    {formatPrice(schedule.amount || calculateRemainingAmount())}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Button - Moved to bottom */}
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleChatNow}
                disabled={isSendingMessage}
                className={`${
                  isDark
                    ? "bg-gray-800 text-pink-300 border-pink-800 hover:bg-gray-700"
                    : "text-pink-600 border-pink-200 hover:bg-pink-50"
                } w-full`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {isSendingMessage
                  ? t("sending") || "Đang gửi..."
                  : t("contact") || "Liên hệ"}
              </Button>
            </div>

            {/* Add padding at the bottom to ensure content doesn't get hidden behind fixed footer */}
            <div className="pb-16"></div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="sticky bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 rounded-b-lg w-full">
          <div className="px-6 py-4 flex flex-row gap-2 justify-end">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
