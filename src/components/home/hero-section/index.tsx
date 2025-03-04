"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedText } from "@/components/ui/animated-text";

export function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="bg-white/50 backdrop-blur-sm border-primary/20 text-primary"
            >
              {t("hero.badge")}
            </Badge>

            <AnimatedText text={t("hero.title")} className="tracking-tight" />

            <p className="text-lg text-muted-foreground font-light max-w-[90%] leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <GradientButton size="lg">
                {t("hero.buttons.bookConsultation")}
              </GradientButton>
              <Button size="lg" variant="outline" className="rounded-full">
                {t("hero.buttons.exploreServices")}
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4"></div>
          </div>

          <div className="relative">
            <div className="relative h-[600px] w-full">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Beauty Treatment"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl" />
            </div>

            {/* Floating Cards */}
            <div className="absolute -left-12 top-1/4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {t("hero.cards.rating.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("hero.cards.rating.subtitle")}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-1/4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="font-medium">
                    {t("hero.cards.experts.title")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("hero.cards.experts.subtitle")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
