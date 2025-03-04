"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedText } from "@/components/ui/animated-text";

export function ServicesSection() {
  const t = useTranslations("home");
  const services = t.raw("services.items");
  const serviceList = Array.isArray(services) ? services : [];
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("services.badge")}
          </Badge>
          <AnimatedText
            text={t("services.title")}
            variant="h2"
            className="mb-4"
          />
          <p className="text-muted-foreground font-light">
            {t("services.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {serviceList.map((service, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-primary/10 dark:bg-gray-800/50"
            >
              <CardContent className="p-0">
                <div className="relative h-48">
                  <Image
                    src={`/placeholder.svg?height=300&width=400`}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">
                      {service.price}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full group-hover:translate-x-2 transition-transform"
                    >
                      {t("services.learnMore")}{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
