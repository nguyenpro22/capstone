"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon, Loader2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useCreateFeedbacksMutation,
  useGetScheduleDetailQuery,
  useLazyGetScheduleDetailQuery,
} from "@/features/order/api";
import {
  CreateFeedbackPayload,
  ScheduleFeedback,
} from "@/features/order/types";
import { createFeedbackFormData } from "@/hooks/useOrderBookingData";

interface FeedbackDialogProps {
  orderId: string;
  children: React.ReactNode;
  onFeedbackSubmitted?: () => void;
}

export function FeedbackDialog({
  orderId,
  children,
  onFeedbackSubmitted,
}: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useGetScheduleDetailQuery(orderId, {
      skip: !open,
    });
  const [createFeedback, { isLoading: isSubmitting }] =
    useCreateFeedbacksMutation();

  // State for overall feedback
  const [overallRating, setOverallRating] = useState(5);
  const [overallContent, setOverallContent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // State for individual schedule feedbacks
  const [scheduleFeedbacks, setScheduleFeedbacks] = useState<
    Record<string, { rating: number; content: string }>
  >({});

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Set rating for a specific schedule
  const setScheduleRating = (scheduleId: string, rating: number) => {
    setScheduleFeedbacks((prev) => ({
      ...prev,
      [scheduleId]: {
        ...prev[scheduleId],
        rating,
      },
    }));
  };

  // Set content for a specific schedule
  const setScheduleContent = (scheduleId: string, content: string) => {
    setScheduleFeedbacks((prev) => ({
      ...prev,
      [scheduleId]: {
        ...prev[scheduleId],
        content,
      },
    }));
  };

  // Initialize schedule feedbacks when data is loaded
  const scheduleDetail = scheduleData?.value;
  if (scheduleDetail && Object.keys(scheduleFeedbacks).length === 0) {
    const initialFeedbacks: Record<
      string,
      { rating: number; content: string }
    > = {};
    scheduleDetail.customerSchedules.forEach((schedule) => {
      initialFeedbacks[schedule.id] = { rating: 5, content: "" };
    });
    setScheduleFeedbacks(initialFeedbacks);
  }

  // Submit feedback
  const handleSubmitFeedback = async () => {
    try {
      if (!scheduleDetail) return;

      // Prepare schedule feedbacks array
      const schedulePayloads: ScheduleFeedback[] =
        scheduleDetail.customerSchedules.map((schedule) => ({
          customerScheduleId: schedule.id,
          Rating: scheduleFeedbacks[schedule.id]?.rating || 5,
          Content:
            scheduleFeedbacks[schedule.id]?.content ||
            `Good service from ${schedule.doctorName}`,
        }));

      // Create feedback payload
      const feedbackPayload: CreateFeedbackPayload = {
        orderId,
        content: overallContent,
        rating: overallRating,
        scheduleFeedbacks: schedulePayloads,
        images: images.length > 0 ? images : undefined,
      };

      // Convert to FormData and submit
      const formData = createFeedbackFormData(feedbackPayload);
      await createFeedback(formData).unwrap();

      // Show success message
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
        variant: "default",
      });

      // Close dialog and reset state
      setOpen(false);
      setOverallRating(5);
      setOverallContent("");
      setImages([]);
      setScheduleFeedbacks({});

      // Call callback if provided
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
        </DialogHeader>

        {isLoadingSchedule ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : scheduleDetail ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Service
                </h3>
                <p className="text-base font-medium">
                  {scheduleDetail.serviceName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order Date
                </h3>
                <p className="text-base font-medium">
                  {format(parseISO(scheduleDetail.orderDate), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Amount
                </h3>
                <p className="text-base font-medium text-purple-600 dark:text-purple-400">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(scheduleDetail.finalAmount)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </h3>
                <p className="text-base font-medium">{scheduleDetail.status}</p>
              </div>
            </div>

            <Separator />

            {/* Overall Feedback */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Overall Feedback</h3>

              {/* Rating */}
              <div className="space-y-2">
                <Label htmlFor="overall-rating">Rating</Label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          star <= overallRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="overall-content">Comments</Label>
                <Textarea
                  id="overall-content"
                  value={overallContent}
                  onChange={(e) => setOverallContent(e.target.value)}
                  placeholder="Share your overall experience with this service..."
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Upload Images (Optional)</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(img) || "/placeholder.svg"}
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Individual Schedule Feedbacks */}
            {scheduleDetail.customerSchedules.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Doctor Feedback</h3>
                <div className="grid gap-4">
                  {scheduleDetail.customerSchedules.map((schedule) => (
                    <Card key={schedule.id}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full bg-cover bg-center"
                            style={{
                              backgroundImage: schedule.profileUrl
                                ? `url(${schedule.profileUrl})`
                                : "url(/placeholder.svg?height=48&width=48)",
                            }}
                          />
                          <div>
                            <h4 className="font-medium">
                              {schedule.doctorName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {format(parseISO(schedule.date), "dd/MM/yyyy", {
                                locale: vi,
                              })}{" "}
                              • {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                          <Label htmlFor={`rating-${schedule.id}`}>
                            Rating
                          </Label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setScheduleRating(schedule.id, star)
                                }
                                className="focus:outline-none"
                              >
                                <StarIcon
                                  className={`h-5 w-5 ${
                                    star <=
                                    (scheduleFeedbacks[schedule.id]?.rating ||
                                      5)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <Label htmlFor={`content-${schedule.id}`}>
                            Comments
                          </Label>
                          <Textarea
                            id={`content-${schedule.id}`}
                            value={
                              scheduleFeedbacks[schedule.id]?.content || ""
                            }
                            onChange={(e) =>
                              setScheduleContent(schedule.id, e.target.value)
                            }
                            placeholder={`Share your experience with Dr. ${schedule.doctorName}...`}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              Failed to load schedule details. Please try again.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
