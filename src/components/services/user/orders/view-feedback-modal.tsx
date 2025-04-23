"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/orderHelpers";
import type { ScheduleDetail } from "@/features/order/types";

interface ViewFeedbackModalProps {
  order: ScheduleDetail;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewFeedbackModal({
  order,
  isOpen,
  onClose,
}: ViewFeedbackModalProps) {
  const t = useTranslations("orderMessages.bookingHistory");

  const renderStars = (rating: number | null) => {
    if (rating === null) return null;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`h-5 w-5 ${
              value <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  // Parse feedback images if they exist
  const feedbackImages = order.feedbackImages
    ? (JSON.parse(order.feedbackImages) as string[])
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-indigo-950 border-purple-100 dark:border-indigo-800/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("feedback.viewTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t("feedback.overallRating")}</h3>
              {renderStars(order.feedbackRating)}
            </div>

            <div className="bg-purple-50 dark:bg-indigo-900/20 p-4 rounded-md">
              <p>{order.feedbackContent || t("feedback.noContent")}</p>
            </div>

            {feedbackImages.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">{t("feedback.images")}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {feedbackImages.map((image, index) => (
                    <a
                      key={index}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Feedback image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md hover:opacity-90 transition-opacity border border-purple-100 dark:border-indigo-800/30"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {order.customerSchedules.some(
            (schedule) => schedule.doctorFeedbackRating !== null
          ) && (
            <>
              <Separator className="bg-purple-100 dark:bg-indigo-800/30" />

              <div className="space-y-4">
                <h3 className="font-semibold">
                  {t("feedback.doctorFeedbacks")}
                </h3>

                {order.customerSchedules
                  .filter((schedule) => schedule.doctorFeedbackRating !== null)
                  .map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-purple-50 dark:bg-indigo-900/20 p-4 rounded-md space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {schedule.doctorName}
                        </span>
                        {renderStars(schedule.doctorFeedbackRating)}
                      </div>

                      <p>
                        {schedule.feedbackContent || t("feedback.noContent")}
                      </p>

                      <div className="text-sm text-gray-500 dark:text-indigo-300/70">
                        {schedule.feedbackCreatedOnUtc && (
                          <p>
                            {t("feedback.createdOn")}:{" "}
                            {formatDate(schedule.feedbackCreatedOnUtc)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple-200 dark:border-indigo-800/30"
          >
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
