"use client";

import { RegisterClinicForm } from "@/components/home/contact-section";
import { useTranslations } from "next-intl";

export default function RegisterClinicPage() {
  const t = useTranslations("registerClinic");

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <RegisterClinicForm />
      </div>
    </div>
  );
}
