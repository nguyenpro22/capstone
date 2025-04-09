"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Heart, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/ui/animated-text";
import { useTranslations } from "next-intl";

export function ClinicsSliderSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("home.clinic");
  // Sample data - replace with your actual data
  const clinics = [
    {
      id: "1",
      name: "Skin Care Đà Nẵng",
      location: "Đà Nẵng",
      rating: 4.8,
      branchCount: 3,
      status: "pending", // "pending" or "active"
      imageUrl:
        "https://placehold.co/600x400/e2e8f0/1e293b?text=Skin+Care+Đà+Nẵng",
    },
    {
      id: "2",
      name: "Beauty Center Sài Gòn",
      location: "Hồ Chí Minh",
      rating: 4.8,
      branchCount: 5,
      status: "pending",
      imageUrl:
        "https://placehold.co/600x400/e2e8f0/1e293b?text=Beauty+Center+Sài+Gòn",
    },
    {
      id: "3",
      name: "Hanoi Beauty Spa",
      location: "Hà Nội",
      rating: 4.8,
      branchCount: 2,
      status: "active",
      imageUrl:
        "https://placehold.co/600x400/e2e8f0/1e293b?text=Hanoi+Beauty+Spa",
    },
  ];

  const maxIndex = Math.max(0, clinics.length - 3);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center justify-center mb-10">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 bg-white dark:bg-gray-800 border-primary/20 text-primary"
          >
            {t("ourPartners")}
          </Badge>
          <AnimatedText text={t("trustedClinics")} variant="h2" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mt-3 mx-auto">
            {t("clinicsDescription")}
          </p>

          <div className="mt-6">
            <Link href="/clinic-view">
              <Button
                variant="default"
                className="rounded-full text-white bg-primary hover:bg-primary/90"
              >
                {t("viewAllClinics")}
              </Button>
            </Link>
          </div>
        </div>

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
                className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] border-0 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
              >
                <div className="relative">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={clinic.imageUrl || "/placeholder.svg"}
                      alt={clinic.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Status badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge
                        className={cn(
                          "px-3 py-1.5 font-medium",
                          clinic.status === "active"
                            ? "bg-green-500 text-white border-0"
                            : "bg-amber-500 text-white border-0"
                        )}
                      >
                        {clinic.status === "active"
                          ? t("active")
                          : t("pending")}
                      </Badge>
                    </div>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  </div>

                  {/* Clinic name and location */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-bold text-xl mb-2">{clinic.name}</h3>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1.5 text-white/80" />
                      <span className="text-white/90">{clinic.location}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-primary/70" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {clinic.branchCount}{" "}
                        {clinic.branchCount > 1 ? t("branchs") : t("branch")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">
                        {clinic.rating}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-5 pb-5 pt-0 flex justify-between">
                  <Link
                    href={`/clinic-view/${clinic.id}`}
                    className="flex-grow"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary/20 text-primary hover:bg-primary/5"
                    >
                      {t("viewDetails")}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/5 text-primary ml-2"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: Math.min(maxIndex + 1, clinics.length) }).map(
              (_, i) => (
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
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
