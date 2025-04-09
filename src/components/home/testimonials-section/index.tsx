"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedText } from "@/components/ui/animated-text";

export function TestimonialsSection() {
  const t = useTranslations("home");
  const testimonials = t.raw("testimonials.items");
  const testimonialsList = Array.isArray(testimonials) ? testimonials : [];
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            {t("testimonials.badge")}
          </Badge>
          <AnimatedText
            text={t("testimonials.title")}
            variant="h2"
            className="mb-4"
          />
          <p className="text-muted-foreground font-light">
            {t("testimonials.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsList.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-primary/10"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-primary/20" />
                </div>
                <p className="text-muted-foreground italic mb-6 flex-grow">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage
                      src="https://thispersondoesnotexist.com/"
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.treatment}
                    </div>
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
