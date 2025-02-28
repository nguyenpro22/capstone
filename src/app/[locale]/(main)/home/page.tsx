"use client";

import { ContactSection } from "@/components/home/contact-section";
import { ExpertsSection } from "@/components/home/experts-section";
import { FooterSection } from "@/components/home/Footer";
import { GallerySection } from "@/components/home/gallery-section";
import SiteHeader from "@/components/home/Header";
import { HeroSection } from "@/components/home/hero-section";
import { OffersSection } from "@/components/home/offers-section";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <SiteHeader />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <GallerySection />
      <ExpertsSection />
      <OffersSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}
