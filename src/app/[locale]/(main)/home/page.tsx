"use client";

import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Star,
  ArrowRight,
  CheckCircle,
  Quote,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import SiteHeader from "@/components/home/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <SiteHeader />
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

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-rose-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Luxury Spa Environment"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-6 -bottom-6 w-64 h-64 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="h-full flex flex-col justify-between">
                  <div className="text-4xl font-bold text-primary">15+</div>
                  <div>
                    <div className="text-xl font-medium mb-2">
                      Years of Excellence
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Providing premium beauty services with consistent quality
                      and innovation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Badge variant="outline" className="mb-2">
                Why Choose Us
              </Badge>
              <AnimatedText
                text="Elevate Your Beauty Experience"
                variant="h2"
                className="mb-6"
              />

              <div className="space-y-6">
                {[
                  {
                    title: "Expert Professionals",
                    description:
                      "Our team consists of certified specialists with years of experience in aesthetic treatments",
                  },
                  {
                    title: "Cutting-Edge Technology",
                    description:
                      "We invest in the latest equipment and techniques to deliver superior results",
                  },
                  {
                    title: "Personalized Approach",
                    description:
                      "Every treatment is tailored to your unique needs and beauty goals",
                  },
                  {
                    title: "Luxurious Environment",
                    description:
                      "Experience treatments in our serene, spa-like setting designed for your comfort",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="rounded-full">
                Learn About Our Approach{" "}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Client Testimonials
            </Badge>
            <AnimatedText
              text="What Our Clients Say"
              variant="h2"
              className="mb-4"
            />
            <p className="text-muted-foreground font-light">
              Hear from our satisfied clients about their transformative
              experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophia Anderson",
                treatment: "Facial Rejuvenation",
                image: "/placeholder.svg?height=100&width=100",
                quote:
                  "The facial treatment completely transformed my skin. I've never received so many compliments on my complexion before!",
              },
              {
                name: "Emma Thompson",
                treatment: "Body Contouring",
                image: "/placeholder.svg?height=100&width=100",
                quote:
                  "After just three sessions, I saw remarkable results. The staff was professional and made me feel comfortable throughout the process.",
              },
              {
                name: "Michael Roberts",
                treatment: "Laser Hair Removal",
                image: "/placeholder.svg?height=100&width=100",
                quote:
                  "I was hesitant at first, but the team was so knowledgeable and the results exceeded my expectations. Highly recommend!",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-primary/10"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-6">
                    <Quote className="h-10 w-10 text-primary/20" />
                  </div>
                  <p className="text-muted-foreground italic mb-6 flex-grow">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage
                        src={testimonial.image}
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

      {/* Before & After Gallery */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Transformation Gallery
            </Badge>
            <AnimatedText
              text="Real Results, Real People"
              variant="h2"
              className="mb-4"
            />
            <p className="text-muted-foreground font-light">
              See the transformative results our clients have experienced
            </p>
          </div>

          <Tabs defaultValue="facial" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <TabsTrigger value="facial">Facial Treatments</TabsTrigger>
                <TabsTrigger value="body">Body Contouring</TabsTrigger>
                <TabsTrigger value="skin">Skin Rejuvenation</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="facial" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <Card
                    key={item}
                    className="overflow-hidden border-primary/10"
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2">
                        <div className="relative h-64">
                          <Image
                            src="/placeholder.svg?height=300&width=200"
                            alt="Before Treatment"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 text-sm">
                            Before
                          </div>
                        </div>
                        <div className="relative h-64">
                          <Image
                            src="/placeholder.svg?height=300&width=200"
                            alt="After Treatment"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-primary/80 text-white px-3 py-1 text-sm">
                            After
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">Facial Rejuvenation</h3>
                        <p className="text-sm text-muted-foreground">
                          After 3 sessions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="body" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <Card
                    key={item}
                    className="overflow-hidden border-primary/10"
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2">
                        <div className="relative h-64">
                          <Image
                            src="/placeholder.svg?height=300&width=200"
                            alt="Before Treatment"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 text-sm">
                            Before
                          </div>
                        </div>
                        <div className="relative h-64">
                          <Image
                            src="/placeholder.svg?height=300&width=200"
                            alt="After Treatment"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-primary/80 text-white px-3 py-1 text-sm">
                            After
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">Body Contouring</h3>
                        <p className="text-sm text-muted-foreground">
                          After 5 sessions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skin" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <Card
                    key={item}
                    className="overflow-hidden border-primary/10"
                  >
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2">
                        <div className="relative h-64">
                          <Image
                            src="/placeholder.svg?height=300&width=200"
                            alt="Before Treatment"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-black/60 text-white px-3 py-1 text-sm">
                            Before
                          </div>
                        </div>
                        <div className="relative h-64">
                          <Image
                            src="/placeholder.svg?height=300&width=200"
                            alt="After Treatment"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 bg-primary/80 text-white px-3 py-1 text-sm">
                            After
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">Skin Rejuvenation</h3>
                        <p className="text-sm text-muted-foreground">
                          After 4 sessions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Meet Our Experts */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Our Team
            </Badge>
            <AnimatedText
              text="Meet Our Expert Specialists"
              variant="h2"
              className="mb-4"
            />
            <p className="text-muted-foreground font-light">
              Our team of certified professionals is dedicated to providing you
              with exceptional care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Medical Director",
                image: "/placeholder.svg?height=400&width=300",
                specialties: ["Facial Aesthetics", "Injectables"],
              },
              {
                name: "Dr. David Chen",
                role: "Aesthetic Physician",
                image: "/placeholder.svg?height=400&width=300",
                specialties: ["Laser Therapy", "Skin Rejuvenation"],
              },
              {
                name: "Emily Williams",
                role: "Senior Aesthetician",
                image: "/placeholder.svg?height=400&width=300",
                specialties: ["Advanced Facials", "Chemical Peels"],
              },
              {
                name: "Jessica Martinez",
                role: "Body Specialist",
                image: "/placeholder.svg?height=400&width=300",
                specialties: ["Body Contouring", "Cellulite Treatments"],
              },
            ].map((expert, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-primary/10 dark:bg-gray-800/50"
              >
                <CardContent className="p-0">
                  <div className="relative h-72">
                    <Image
                      src={expert.image || "/placeholder.svg"}
                      alt={expert.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-medium">{expert.name}</h3>
                      <p className="text-sm opacity-90">{expert.role}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-medium mb-2">Specialties:</div>
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((specialty, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-secondary/10 text-secondary"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-rose-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Limited Time
            </Badge>
            <AnimatedText
              text="Special Offers & Packages"
              variant="h2"
              className="mb-4"
            />
            <p className="text-muted-foreground font-light">
              Take advantage of our exclusive promotions and save on premium
              treatments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-primary/10 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      alt="New Client Special"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white">30% OFF</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        New Client Special
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        First-time clients receive 30% off any facial treatment
                        of your choice
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Valid for all facial treatments</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Includes skin consultation</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Expires in 30 days</span>
                        </li>
                      </ul>
                    </div>
                    <GradientButton>Book Now</GradientButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/10 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      alt="Summer Package"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white">SAVE 25%</Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Summer Glow Package
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Prepare for summer with our special package designed for
                        radiant skin
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>3 Facial treatments</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>1 Body contouring session</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Complimentary skincare kit</span>
                        </li>
                      </ul>
                    </div>
                    <GradientButton>Learn More</GradientButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Booking Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="mb-2">
                Get In Touch
              </Badge>
              <AnimatedText
                text="Book Your Consultation"
                variant="h2"
                className="mb-6"
              />

              <p className="text-muted-foreground">
                Schedule a consultation with our experts to discuss your beauty
                goals and create a personalized treatment plan.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Visit Us</h3>
                    <p className="text-muted-foreground text-sm">
                      123 Beauty Lane, Suite 100, New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Call Us</h3>
                    <p className="text-muted-foreground text-sm">
                      (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Email Us</h3>
                    <p className="text-muted-foreground text-sm">
                      info@beautyaesthetic.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Opening Hours</h3>
                    <p className="text-muted-foreground text-sm">
                      Monday - Saturday: 9am - 7pm
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="h-5 w-5 text-primary" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Twitter className="h-5 w-5 text-primary" />
                </a>
              </div>
            </div>

            <div>
              <Card className="border-primary/10 dark:bg-gray-800/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-6">
                    Request an Appointment
                  </h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input id="phone" placeholder="Enter your phone number" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="service" className="text-sm font-medium">
                        Service Interested In
                      </label>
                      <select
                        id="service"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a service</option>
                        <option value="facial">Facial Treatments</option>
                        <option value="body">Body Contouring</option>
                        <option value="laser">Laser Therapy</option>
                        <option value="skin">Skin Rejuvenation</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message (Optional)
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about what you're looking for"
                        rows={4}
                      />
                    </div>

                    <GradientButton className="w-full">
                      Request Appointment
                    </GradientButton>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-primary/10">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Beauty Aesthetic</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Premium beauty and aesthetic center dedicated to enhancing your
                natural beauty with advanced treatments.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="h-4 w-4 text-primary" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="h-4 w-4 text-primary" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Twitter className="h-4 w-4 text-primary" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Facial Treatments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Body Contouring
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Laser Therapy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Skin Rejuvenation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Anti-Aging Solutions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for exclusive offers and beauty
                tips.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="h-10" />
                <Button variant="outline" size="sm" className="h-10">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-primary/10 mt-12 pt-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Beauty Aesthetic. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
