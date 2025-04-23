"use client";

import type React from "react";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { Star, X, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScheduleDetail } from "@/features/order/types";

interface CreateFeedbackModalProps {
  order: ScheduleDetail;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  isSubmitting: boolean;
}

interface ScheduleFeedback {
  customerScheduleId: string;
  Rating: number;
  Content: string;
}

export function CreateFeedbackModal({
  order,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateFeedbackModalProps) {
  const t = useTranslations("orderMessages.bookingHistory");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [scheduleFeedbacks, setScheduleFeedbacks] = useState<
    ScheduleFeedback[]
  >(
    order.customerSchedules.map((schedule) => ({
      customerScheduleId: schedule.id,
      Rating: 0,
      Content: "",
    }))
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 5) {
        toast.warning(t("feedback.errors.tooManyImages"));
        return;
      }
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScheduleRatingChange = (scheduleId: string, value: number) => {
    setScheduleFeedbacks((prev) =>
      prev.map((feedback) =>
        feedback.customerScheduleId === scheduleId
          ? { ...feedback, Rating: value }
          : feedback
      )
    );
  };

  const handleScheduleContentChange = (scheduleId: string, value: string) => {
    setScheduleFeedbacks((prev) =>
      prev.map((feedback) =>
        feedback.customerScheduleId === scheduleId
          ? { ...feedback, Content: value }
          : feedback
      )
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error(t("feedback.errors.ratingRequired"));
      return;
    }

    if (content.trim() === "") {
      toast.error(t("feedback.errors.contentRequired"));
      return;
    }

    // Validate schedule feedbacks
    const invalidScheduleFeedback = scheduleFeedbacks.find(
      (feedback) => feedback.Rating === 0
    );
    if (invalidScheduleFeedback) {
      toast.error(t("feedback.errors.scheduleRatingRequired"));
      return;
    }

    const payload = {
      orderId: order.id,
      content,
      rating,
      scheduleFeedbacks,
      images,
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-indigo-950 border-purple-100 dark:border-indigo-800/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("feedback.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label htmlFor="overall-rating">
              {t("feedback.overallRating")}
            </Label>
            <div className="flex items-center gap-1" id="overall-rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-content">{t("feedback.content")}</Label>
            <Textarea
              id="feedback-content"
              placeholder={t("feedback.contentPlaceholder")}
              className="bg-purple-50 dark:bg-indigo-900/20 border-purple-100 dark:border-indigo-800/30"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("feedback.images")}</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Feedback image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border border-purple-100 dark:border-indigo-800/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <div className="border-2 border-dashed border-purple-200 dark:border-indigo-800/30 rounded-md flex items-center justify-center h-24 cursor-pointer hover:border-purple-400 dark:hover:border-indigo-600/50 transition-colors">
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-1" />
                    <span className="text-sm text-gray-500 dark:text-indigo-300/70">
                      {t("feedback.uploadImage")}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple
                    />
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-indigo-300/70">
              {t("feedback.maxImages", { count: 5 })}
            </p>
          </div>

          {order.customerSchedules.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">{t("feedback.doctorFeedbacks")}</h3>

              {order.customerSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-purple-50 dark:bg-indigo-900/20 p-4 rounded-md space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{schedule.doctorName}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => {
                        const currentFeedback = scheduleFeedbacks.find(
                          (f) => f.customerScheduleId === schedule.id
                        );
                        const currentRating = currentFeedback
                          ? currentFeedback.Rating
                          : 0;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              handleScheduleRatingChange(schedule.id, value)
                            }
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                value <= currentRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Textarea
                    placeholder={t("feedback.doctorFeedbackPlaceholder")}
                    className="bg-white dark:bg-indigo-950/50 border-purple-100 dark:border-indigo-800/30"
                    value={
                      scheduleFeedbacks.find(
                        (f) => f.customerScheduleId === schedule.id
                      )?.Content || ""
                    }
                    onChange={(e) =>
                      handleScheduleContentChange(schedule.id, e.target.value)
                    }
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-purple-200 dark:border-indigo-800/30"
          >
            {t("common.cancel")}
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                {t("common.submitting")}
              </>
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
