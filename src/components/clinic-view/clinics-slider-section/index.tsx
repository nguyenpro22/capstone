"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Heart, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { AnimatedText } from "@/components/ui/animated-text"
import { useTranslations } from "next-intl"
import { useGetClinicsQuery } from "@/features/clinic/api"

export function ClinicsSliderSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("home.clinic")
  // Sample data - replace with your actual data
  const clinics = [
    {
      id: "1",
      name: "Skin Care Đà Nẵng",
      location: "Đà Nẵng",
      rating: 4.8,
      branchCount: 3,
      status: "pending", // "pending" or "active"
      imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Skin+Care+Đà+Nẵng",
    },
    {
      id: "2",
      name: "Beauty Center Sài Gòn",
      location: "Hồ Chí Minh",
      rating: 4.8,
      branchCount: 5,
      status: "pending",
      imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Beauty+Center+Sài+Gòn",
    },
    {
      id: "3",
      name: "Hanoi Beauty Spa",
      location: "Hà Nội",
      rating: 4.8,
      branchCount: 2,
      status: "active",
      imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Hanoi+Beauty+Spa",
    },
  ]

  const { data } = useGetClinicsQuery({
    pageIndex: 1,
    pageSize: 10, // Increased to get more items for scrolling
    searchTerm: "",
  })

  console.log(data)

  // Calculate the maximum index based on the actual data
  const clinicItems = data?.isSuccess ? data.value.items : clinics
  const maxIndex = Math.max(0, clinicItems.length - 3)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
    // Pause auto-scrolling temporarily when user interacts
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 5000) // Resume after 5 seconds
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    // Pause auto-scrolling temporarily when user interacts
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 5000) // Resume after 5 seconds
  }

  // Auto-scrolling effect
  useEffect(() => {
    if (isPaused || maxIndex === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // If we're at the end, go back to the beginning
        if (prevIndex >= maxIndex) {
          return 0
        }
        // Otherwise, go to the next slide
        return prevIndex + 1
      })
    }, 3000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [maxIndex, isPaused])

  // Handle mouse enter/leave to pause/resume auto-scrolling
  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center justify-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 bg-white dark:bg-gray-800 border-primary/20 text-primary">
            {t("ourPartners")}
          </Badge>
          <AnimatedText text={t("trustedClinics")} variant="h2" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mt-3 mx-auto">{t("clinicsDescription")}</p>

          <div className="mt-6">
            <Link href="/clinic-view">
              <Button variant="default" className="rounded-full text-white bg-primary hover:bg-primary/90">
                {t("viewAllClinics")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md -ml-4 ${
                  currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:bg-gray-100"
                }`}
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md -mr-4 ${
                  currentIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:bg-gray-100"
                }`}
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-gray-700 dark:text-gray-300"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div
            className="overflow-hidden"
            ref={sliderRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${currentIndex * (100 / 3)}%`,
              }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              {data?.isSuccess &&
                data.value.items.map((clinic) => (
                  <Card
                    key={clinic.id}
                    className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)] border-0 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                  >
                    <div className="relative">
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={clinic.profilePictureUrl || "/placeholder.svg"}
                          alt={clinic.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                      </div>

                      {/* Clinic name and location */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <h3 className="font-bold text-xl mb-2">{clinic.name}</h3>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1.5 text-white/80" />
                          <span className="text-white/90">{clinic.fullAddress}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-primary/70" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {clinic.totalBranches} {clinic.totalBranches > 1 ? t("branchs") : t("branch")}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="px-5 pb-5 pt-0 flex justify-between">
                      <Link href={`/clinic-view/${clinic.id}`} className="flex-grow">
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-primary/20 text-primary hover:bg-primary/5"
                        >
                          {t("viewDetails")}
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 text-primary ml-2">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </motion.div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: Math.min(maxIndex + 1, clinicItems.length) }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i)
                  // Pause auto-scrolling temporarily when user interacts
                  setIsPaused(true)
                  setTimeout(() => setIsPaused(false), 5000)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-primary w-6" : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
