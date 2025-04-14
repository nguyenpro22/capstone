"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl"; // Import useTranslations

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onChange: (field: keyof CustomerInfo, value: string) => void;
}

export function CustomerInfoForm({
  customerInfo,
  onChange,
}: CustomerInfoFormProps) {
  const t = useTranslations("bookingFlow"); // Use the hook with the namespace

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          >
            {t("fullName")}{" "}
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <div className="flex">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-l-md border border-r-0 border-purple-200 dark:border-purple-800/30">
              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <Input
              id="name"
              placeholder={t("enterFullName")}
              value={customerInfo.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="rounded-l-none border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
          >
            {t("phoneNumber")}{" "}
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <div className="flex">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-l-md border border-r-0 border-purple-200 dark:border-purple-800/30">
              <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <Input
              id="phone"
              placeholder={t("enterPhoneNumber")}
              value={customerInfo.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="rounded-l-none border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
              required
              type="tel"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-800 dark:text-gray-200"
        >
          {t("email")}
        </label>
        <div className="flex">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-l-md border border-r-0 border-purple-200 dark:border-purple-800/30">
            <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <Input
            id="email"
            placeholder={t("enterEmailOptional")}
            value={customerInfo.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="rounded-l-none border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
            type="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="notes"
          className="text-sm font-medium text-gray-800 dark:text-gray-200"
        >
          {t("notes")}
        </label>
        <Textarea
          id="notes"
          placeholder={t("enterNotesOptional")}
          value={customerInfo.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className="min-h-[100px] border-purple-200 dark:border-purple-800/30 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400"
        />
      </div>
    </div>
  );
}
