"use client";

import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                variant="outline"
                className="bg-white/50 backdrop-blur-sm border-primary/20 text-primary"
              >
                Premium Beauty & Aesthetic Center
              </Badge>

              <AnimatedText
                text="Discover Your Natural Beauty"
                className="tracking-tight"
              />

              <p className="text-lg text-muted-foreground font-light max-w-[90%] leading-relaxed">
                Experience premium aesthetic treatments tailored to enhance your
                unique beauty, delivered by expert professionals in a luxurious
                environment.
              </p>

              <div className="flex flex-wrap gap-4">
                <GradientButton size="lg">Book Consultation</GradientButton>
                <Button size="lg" variant="outline" className="rounded-full">
                  Explore Services
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                {[
                  { number: "15+", label: "Years Experience" },
                  { number: "10k+", label: "Happy Clients" },
                  { number: "30+", label: "Expert Doctors" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground font-light">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
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
                    <div className="font-medium">Excellent Service</div>
                    <div className="text-sm text-muted-foreground">
                      5.0 Rating
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
                    <div className="font-medium">Certified Experts</div>
                    <div className="text-sm text-muted-foreground">
                      Professional Team
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

      {/* Featured Services */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Our Services
            </Badge>
            <AnimatedText
              text="Premium Beauty Treatments"
              variant="h2"
              className="mb-4"
            />
            <p className="text-muted-foreground font-light">
              Discover our range of luxury treatments designed to enhance your
              natural beauty
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Facial Treatments",
                description:
                  "Advanced skincare solutions for radiant, youthful skin",
                price: "From $199",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Body Contouring",
                description:
                  "Sculpt and define your body with non-invasive treatments",
                price: "From $299",
                image: "/placeholder.svg?height=300&width=400",
              },
              {
                title: "Laser Therapy",
                description:
                  "State-of-the-art laser treatments for skin perfection",
                price: "From $249",
                image: "/placeholder.svg?height=300&width=400",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-primary/10 dark:bg-gray-800/50"
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={service.image || "/placeholder.svg"}
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
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
