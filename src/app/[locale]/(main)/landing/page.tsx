"use client";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Testimonials from "@/components/landing/Testimonials";
import { useTranslations } from "next-intl";
import RegistrationForm from "@/components/landing/ClinicRegistrationForm";

export default function Home() {
  const t = useTranslations("landing");
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero t={t} />
      <RegistrationForm t={t} />
      <Services t={t} />
      <Testimonials t={t} />
      <Footer t={t} />
    </main>
  );
}
