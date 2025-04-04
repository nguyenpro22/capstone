"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppointments } from "@/hooks/use-appointments";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useArrayState } from "@/hooks/use-array-state";
import { Appointment, AppointmentStatus } from "../types";
import toast from "react-hot-toast";

interface TreatmentFormProps {
  appointment: Appointment;
}

const treatmentFormSchema = z.object({
  notes: z.string().min(1, {
    message: "Treatment notes are required.",
  }),
  recommendations: z.string().optional(),
  followUpDate: z.string().optional(),
});

type TreatmentFormValues = z.infer<typeof treatmentFormSchema>;

export default function TreatmentForm({ appointment }: TreatmentFormProps) {
  const { updateAppointment } = useAppointments();
  const [isLoading, setIsLoading] = useState(false);
  const {
    array: images,
    setArray: setImages,
    push: addImage,
    remove: removeImage,
  } = useArrayState<string>(appointment.treatmentResults?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const t = useTranslations("doctorAppointments.treatmentForm");

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: {
      notes: appointment.treatmentResults?.notes || "",
      recommendations: appointment.treatmentResults?.recommendations || "",
      followUpDate: appointment.treatmentResults?.followUpDate || "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImages(true);

    // Simulate image upload
    setTimeout(() => {
      const newImages = Array.from(e.target.files!).map((file) => {
        // In a real app, you would upload the file to a server and get a URL back
        // For this demo, we'll use a placeholder
        return `https://placehold.co/300x300`;
      });

      newImages.forEach((image) => addImage(image));
      setUploadingImages(false);

      toast.success(
        "Images uploaded" +
          `${newImages.length} image(s) uploaded successfully.`
      );
    });
  };

  function onSubmit(data: TreatmentFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateAppointment({
        ...appointment,
        status: AppointmentStatus.COMPLETED,
        treatmentResults: {
          notes: data.notes,
          recommendations: data.recommendations || "",
          followUpDate: data.followUpDate || "",
          images: images,
          completedAt: new Date().toISOString(),
        },
      });

      toast.success(t("successMessage"), {
        id: "success-toast",
      });

      setIsLoading(false);
    }, 1000);
  }

  const isFormDisabled = appointment.status === AppointmentStatus.COMPLETED;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("notes.placeholder")}
                      className="min-h-[120px]"
                      disabled={isFormDisabled}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("notes.description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("recommendations.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("recommendations.placeholder")}
                      className="min-h-[80px]"
                      disabled={isFormDisabled}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("recommendations.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="followUpDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("followUpDate.label")}</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isFormDisabled} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("followUpDate.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>{t("images.label")}</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "https://placehold.co/100x100"}
                      alt={`Treatment ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-md border"
                    />
                    {!isFormDisabled && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {!isFormDisabled && (
                  <div
                    className={cn(
                      "h-24 w-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
                      uploadingImages && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="image-upload"
                      onChange={handleImageUpload}
                      disabled={uploadingImages || isFormDisabled}
                    />
                    <label
                      htmlFor="image-upload"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                    >
                      {uploadingImages ? (
                        <div className="flex flex-col items-center">
                          <Upload className="h-6 w-6 text-muted-foreground animate-pulse" />
                          <span className="text-xs text-muted-foreground mt-1">
                            {t("images.uploading")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ImagePlus className="h-6 w-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-1">
                            {t("images.addImages")}
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>
              <FormDescription className="mt-2">
                {t("images.description")}
              </FormDescription>
            </div>

            {!isFormDisabled && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("saving") : t("saveButton")}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
