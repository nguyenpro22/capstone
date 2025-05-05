"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedText } from "@/components/ui/animated-text";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const t = useTranslations("home");
  const router = useRouter();

  const handleExploreServices = () => {
    router.push("/services");
  };

  return (
    <section className="relative pt-10 pb-16 md:pt-10 md:pb-10 lg:pt-10 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl">
            <Badge
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-primary/20 text-primary px-4 py-1.5 text-sm font-medium"
            >
              {t("hero.badge")}
            </Badge>

            <AnimatedText
              text={t("hero.title")}
              className="tracking-tight text-4xl md:text-5xl lg:text-6xl font-bold"
            />

            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                variant="outline"
                className="flex items-center rounded-full px-6 border-2 hover:bg-primary/5 transition-all duration-300"
                onClick={handleExploreServices}
              >
                {t("hero.buttons.exploreServices")}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[500px] md:h-[600px] w-full">
              <Image
                src="/images/hero.png"
                alt="Beauty Treatment"
                fill
                className="object-cover rounded-2xl shadow-xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>

            {/* Floating Cards */}
            <div className="absolute -left-6 md:-left-12 top-1/4 bg-white/90 dark:bg-gray-800/90 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-primary/10 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary fill-primary" />
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

            <div className="absolute -right-6 md:-right-8 bottom-1/4 bg-white/90 dark:bg-gray-800/90 rounded-xl p-4 shadow-lg backdrop-blur-sm border border-primary/10 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
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
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-primary/3 rounded-full blur-2xl" />
      </div>
    </section>
  );
}
