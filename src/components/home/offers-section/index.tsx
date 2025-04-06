"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedText } from "@/components/ui/animated-text";

export function OffersSection() {
  const t = useTranslations("home");
  const newClient = t.raw("offers.newClient.features");
  const newClientList = Array.isArray(newClient) ? newClient : [];
  const summerPackage = t.raw("offers.summerPackage.features");
  const summerPackageList = Array.isArray(summerPackage) ? summerPackage : [];
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-rose-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("offers.badge")}
          </Badge>
          <AnimatedText
            text={t("offers.title")}
            variant="h2"
            className="mb-4"
          />
          <p className="text-muted-foreground font-light">
            {t("offers.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden border-primary/10 bg-white dark:bg-gray-800">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="https://placehold.co/300x400.png"
                    alt="New Client Special"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-white">
                      {t("offers.newClient.discount")}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      {t("offers.newClient.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {t("offers.newClient.description")}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {newClientList.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <GradientButton>
                    {t("offers.newClient.button")}
                  </GradientButton>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-primary/10 bg-white dark:bg-gray-800">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="https://placehold.co/300x400.png"
                    alt="Summer Package"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-white">
                      {t("offers.summerPackage.discount")}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-medium mb-2">
                      {t("offers.summerPackage.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {t("offers.summerPackage.description")}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {summerPackageList.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <GradientButton>
                    {t("offers.summerPackage.button")}
                  </GradientButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
