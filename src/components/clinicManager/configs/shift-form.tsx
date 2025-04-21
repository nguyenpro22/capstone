"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import {
  useCreateShiftMutation,
  useUpdateShiftMutation,
} from "@/features/configs/api";
import type { Shift, ShiftPayLoad } from "@/features/configs/types";
import { Clock, Save, X } from "lucide-react";

interface ShiftFormProps {
  shift?: Shift;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ShiftForm({ shift, onSuccess, onCancel }: ShiftFormProps) {
  const t = useTranslations("configs");
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();
  const [updateShift, { isLoading: isUpdating }] = useUpdateShiftMutation();

  const isLoading = isCreating || isUpdating;
  const isEditing = !!shift;

  // Create form schema with validation
  const formSchema = z
    .object({
      name: z.string().min(1, { message: t("shifts.errors.nameRequired") }),
      startTime: z
        .string()
        .min(1, { message: t("shifts.errors.startTimeRequired") }),
      endTime: z
        .string()
        .min(1, { message: t("shifts.errors.endTimeRequired") }),
      note: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.startTime || !data.endTime) return true;
        return data.startTime < data.endTime;
      },
      {
        message: t("shifts.errors.timeInvalid"),
        path: ["endTime"],
      }
    );

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shift?.name || "",
      startTime: shift?.startTime || "",
      endTime: shift?.endTime || "",
      note: shift?.note || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && shift) {
        await updateShift({
          id: shift.id,
          ...values,
          note: values.note || "",
        }).unwrap();

        toast.success(t("shifts.messages.updateSuccess"), {
          className:
            "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
          progressClassName: "bg-white",
        });
      } else {
        await createShift(values as ShiftPayLoad).unwrap();

        toast.success(t("shifts.messages.createSuccess"), {
          className:
            "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
          progressClassName: "bg-white",
        });
      }

      onSuccess();
    } catch (error) {
      toast.error("Failed to save shift");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-800 dark:text-purple-300 font-medium">
                {t("shifts.form.name")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("shifts.form.namePlaceholder")}
                  {...field}
                  className="border-purple-100 dark:border-purple-800/20 focus-visible:ring-purple-500"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-800 dark:text-purple-300 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {t("shifts.form.startTime")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="border-purple-100 dark:border-purple-800/20 focus-visible:ring-purple-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-800 dark:text-purple-300 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {t("shifts.form.endTime")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="border-purple-100 dark:border-purple-800/20 focus-visible:ring-purple-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-purple-800 dark:text-purple-300 font-medium">
                {t("shifts.form.note")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("shifts.form.notePlaceholder")}
                  {...field}
                  className="min-h-[100px] border-purple-100 dark:border-purple-800/20 focus-visible:ring-purple-500 resize-none"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-purple-100 dark:border-purple-800/20 hover:bg-purple-50 dark:hover:bg-purple-900/10 gap-2"
          >
            <X className="h-4 w-4" />
            {t("shifts.actions.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? t("shifts.actions.save") : t("shifts.actions.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
