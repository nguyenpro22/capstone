"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useGetClinicsQuery } from "@/features/clinic/api";

export function ClinicsSliderSection() {
  const t = useTranslations("home");
  const { data, isLoading, error } = useGetClinicsQuery({
    pageIndex: 1,
    pageSize: 10,
    searchTerm: "",
  });
  const clinics = data?.value?.items || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, clinics.length - 3);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  useEffect(() => {
    const handleResize = () => {
      // Reset current index on mobile
      if (window.innerWidth < 768) {
        setCurrentIndex(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 bg-white dark:bg-gray-800 border-primary/20 text-primary"
            >
              {t("ourPartners")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("trustedClinics")}
            </h2>
            <p className="text-muted-foreground">{t("clinicsDescription")}</p>
          </div>

          <div className="flex gap-2 mt-6 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isLoading}
              className="rounded-full h-10 w-10 border-primary/20 text-primary hover:bg-primary/5 dark:border-primary/30"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === maxIndex || isLoading}
              className="rounded-full h-10 w-10 border-primary/20 text-primary hover:bg-primary/5 dark:border-primary/30"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link href="/clinic-view">
              <Button
                variant="default"
                className="ml-4 rounded-full text-white bg-primary hover:bg-primary/90"
              >
                {t("viewAllClinics")}
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-10 w-28 rounded-full" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
            <p className="text-red-600 dark:text-red-400">
              {t("errorLoadingClinics")}
            </p>
            <Button variant="outline" className="mt-4">
              {t("tryAgain")}
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden" ref={sliderRef}>
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${currentIndex * (100 / 3)}%`,
              }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              {clinics.map((clinic) => (
                <Card
                  key={clinic.id}
                  className={cn(
                    "flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
                    clinic.isActivated
                      ? "border-green-200 dark:border-green-900/30"
                      : "border-amber-200 dark:border-amber-900/30"
                  )}
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={
                          clinic.profilePictureUrl ||
                          "https://placehold.co/60x60.png"
                        }
                        alt={clinic.name}
                        fill
                        className="object-cover"
                      />
                      {/* Status badge */}
                      <div className="absolute top-4 right-4">
                        <Badge
                          className={cn(
                            "px-2 py-1",
                            clinic.isActivated
                              ? "bg-green-500 text-white"
                              : "bg-amber-500 text-white"
                          )}
                        >
                          {clinic.isActivated ? t("active") : t("pending")}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-xl mb-1">
                          {clinic.name}
                        </h3>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-primary-foreground/80" />
                          <span className="line-clamp-1 text-primary-foreground/80">
                            {clinic.fullAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-primary/70" />
                          <span className="text-sm text-muted-foreground">
                            {clinic.totalBranches === 0
                              ? t("noBranches")
                              : t("branchCount", {
                                  count: clinic.totalBranches,
                                })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Link href={`/clinic-view/${clinic.id}`}>
                          <Button
                            variant="outline"
                            className="rounded-full border-primary/20 text-primary hover:bg-primary/5"
                          >
                            {t("viewDetails")}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-primary/5 text-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: Math.min(maxIndex + 1, 5) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-primary w-6"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
