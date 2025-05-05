"use client";

import type React from "react";

import { useTranslations } from "next-intl";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useGetEventsQuery } from "@/features/event/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function EventsSection() {
  const t = useTranslations("events");
  const router = useRouter();
  const { data: eventsData } = useGetEventsQuery({
    pageIndex: 1,
    pageSize: 100,
    searchTerm: "",
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const events = eventsData?.value.items || [];
  const totalItems = events.length;

  // Handle manual navigation
  const scrollToIndex = (index: number, smooth = true) => {
    if (!sliderRef.current || !totalItems) return;

    // Normalize index to handle wrapping
    let normalizedIndex = index;
    if (index < 0) normalizedIndex = totalItems - 1;
    if (index >= totalItems) normalizedIndex = 0;

    setActiveIndex(normalizedIndex);

    const slideWidth = sliderRef.current.clientWidth / 3; // Show 3 items at once on desktop
    const scrollPosition = normalizedIndex * slideWidth;

    sliderRef.current.scrollTo({
      left: scrollPosition,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    scrollToIndex(activeIndex + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    scrollToIndex(activeIndex - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setAutoScrollEnabled(false);
      setTimeout(() => setAutoScrollEnabled(true), 10000); // Re-enable auto scroll after 10 seconds
    }

    setIsPaused(false);
  };

  // Auto scroll
  useEffect(() => {
    if (!totalItems || !autoScrollEnabled) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, autoScrollEnabled, totalItems]);

  // Handle scroll snap
  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current || isTransitioning) return;

      const slideWidth = sliderRef.current.clientWidth / 3;
      const scrollPosition = sliderRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / slideWidth);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalItems) {
        setActiveIndex(newIndex);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex, isTransitioning, totalItems]);

  const formatDateShort = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM");
    } catch (error) {
      return dateString;
    }
  };

  const handleViewAll = () => {
    router.push("/livestream-view?tab=events");
  };

  const handleCardClick = (eventId: string) => {
    router.push(`/livestream-view?tab=events&eventId=${eventId}`);
  };

  if (!events.length) {
    return null;
  }

  // Create a circular array for infinite effect
  const displayItems = [...events, ...events.slice(0, 3)];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center group">
            <Calendar className="h-6 w-6 mr-3 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              {t("upcomingEvents")}
            </span>
          </h2>
          <Button
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/30 transition-all duration-300"
            onClick={handleViewAll}
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Slider Container with Navigation */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-purple-700 dark:text-purple-400" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-purple-700 dark:text-purple-400" />
          </button>

          {/* Infinite Slider */}
          <div
            className="overflow-hidden rounded-xl shadow-lg"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={sliderRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {displayItems.map((event, index) => (
                <div
                  key={`${event.id}-${index}`}
                  className="min-w-[280px] sm:min-w-[33.333%] px-3 snap-center"
                  onClick={() => handleCardClick(event.id)}
                >
                  <div
                    className={cn(
                      "rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer h-full",
                      "bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900/50",
                      "transform hover:-translate-y-1 hover:scale-[1.02]"
                    )}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          event.imageUrl ||
                          `/placeholder.svg?height=400&width=600&query=beauty event ${
                            event.name || "/placeholder.svg"
                          }`
                        }
                        alt={event.name}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      />

                      {/* Date overlay */}
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 rounded-lg px-3 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {formatDateShort(event.startDate)}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {event.name}
                      </h3>
                      <div className="mt-3 flex justify-end">
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                          {t("learnMore")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  index === activeIndex % totalItems
                    ? "bg-purple-600 dark:bg-purple-400 w-6"
                    : "bg-purple-200 dark:bg-purple-800 hover:bg-purple-300 dark:hover:bg-purple-700"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
