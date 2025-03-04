"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-text";

export function WhyChooseUsSection() {
  const t = useTranslations("home");
  const reasons = t.raw("whyChooseUs.reasons");
  const reasonList = Array.isArray(reasons) ? reasons : [];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-rose-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Luxury Spa Environment"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -right-6 -bottom-6 w-64 h-64 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <div className="h-full flex flex-col justify-between">
                <div className="text-4xl font-bold text-primary">
                  {t("whyChooseUs.experience.years")}
                </div>
                <div>
                  <div className="text-xl font-medium mb-2">
                    {t("whyChooseUs.experience.title")}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("whyChooseUs.experience.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Badge variant="outline" className="mb-2">
              {t("whyChooseUs.badge")}
            </Badge>
            <AnimatedText
              text={t("whyChooseUs.title")}
              variant="h2"
              className="mb-6"
            />

            <div className="space-y-6">
              {reasonList.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="rounded-full">
              {t("whyChooseUs.learnMore")}{" "}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
