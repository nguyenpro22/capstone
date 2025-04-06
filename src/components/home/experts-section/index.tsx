"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedText } from "@/components/ui/animated-text";

export function ExpertsSection() {
  const t = useTranslations("home");
  const experts = t.raw("experts.team");
  const expertsList = Array.isArray(experts) ? experts : [];

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("experts.badge")}
          </Badge>
          <AnimatedText
            text={t("experts.title")}
            variant="h2"
            className="mb-4"
          />
          <p className="text-muted-foreground font-light">
            {t("experts.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {expertsList.map((expert, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-primary/10 dark:bg-gray-800/50"
            >
              <CardContent className="p-0">
                <div className="relative h-72">
                  <Image
                    src="https://placehold.co/300x400.png"
                    alt={expert.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-medium">{expert.name}</h3>
                    <p className="text-sm opacity-90">{expert.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm font-medium mb-2">
                    {t("experts.specialtiesLabel")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {expert.specialties.map((specialty: any, i: number) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-secondary/10 text-secondary"
                      >
                        {specialty}
                      </Badge>
                    ))}
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
