import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import {
  Star,
  Clock,
  CalendarIcon,
  MessageCircle,
  Phone,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";

export default function ServiceDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Service Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 container px-4 mx-auto">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href="/services"
                className="hover:text-primary transition-colors"
              >
                Services
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="#" className="hover:text-primary transition-colors">
                Facial Treatments
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary">Premium Facial Treatment</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Popular</Badge>
              <Badge variant="destructive">20% OFF</Badge>
              <Badge variant="outline" className="bg-white/10">
                New
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
              Premium Facial Treatment
            </h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="ml-2">5.0</span>
              </div>
              <span className="text-white/60">(128 reviews)</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <Carousel className="mb-12">
              <CarouselContent>
                {[1, 2, 3, 4].map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt={`Gallery Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            {/* Service Details */}
            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="procedure">Procedure</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="experts">Experts</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Our Premium Facial Treatment is a comprehensive skincare
                    solution designed to rejuvenate and transform your skin
                    using advanced technologies and premium products.
                  </p>

                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Benefits
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[
                      "Deep cleansing and exfoliation",
                      "Improved skin texture and tone",
                      "Reduced fine lines and wrinkles",
                      "Enhanced skin hydration",
                      "Brighter complexion",
                      "Minimized pores",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Suitable For
                  </h3>
                  <ul className="list-disc list-inside mb-8 space-y-2">
                    <li>All skin types</li>
                    <li>Ages 25 and above</li>
                    <li>Those concerned with aging signs</li>
                    <li>Dull or uneven skin tone</li>
                  </ul>

                  <div className="relative rounded-lg overflow-hidden mb-8">
                    <Image
                      src="/placeholder.svg?height=400&width=800"
                      alt="Treatment Process"
                      width={800}
                      height={400}
                      className="object-cover"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  {/* Rating Overview */}
                  <div className="grid md:grid-cols-2 gap-8 p-6 bg-muted rounded-lg">
                    <div>
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold mb-2">4.9</div>
                        <div className="flex justify-center mb-2">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Based on 128 reviews
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-4">
                          <div className="w-12 text-sm text-muted-foreground">
                            {rating} star
                          </div>
                          <Progress
                            value={rating === 5 ? 85 : rating === 4 ? 10 : 5}
                            className="flex-1"
                          />
                          <div className="w-12 text-sm text-muted-foreground text-right">
                            {rating === 5 ? "85%" : rating === 4 ? "10%" : "5%"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="p-6 bg-card rounded-lg border border-border"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <Image
                            src="/placeholder.svg?height=40&width=40"
                            alt="Reviewer"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">Sarah Johnson</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                1 month ago
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Amazing results! The treatment was so relaxing and my
                          skin looks absolutely radiant. The staff was
                          professional and knowledgeable. Highly recommend!
                        </p>
                        <div className="flex gap-2">
                          <Image
                            src="/placeholder.svg?height=80&width=80"
                            alt="Review Image"
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                          <Image
                            src="/placeholder.svg?height=80&width=80"
                            alt="Review Image"
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-primary/10 shadow-lg mb-6">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-primary mb-1">
                      $239
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-muted-foreground line-through">
                        $299
                      </span>
                      <Badge variant="destructive">Save 20%</Badge>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>60 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <span>No downtime</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <GradientButton className="w-full" size="lg">
                      Book Now
                    </GradientButton>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Chat with Us
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">
                      Need help?
                    </div>
                    <div className="font-semibold text-lg flex items-center justify-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      1-800-BEAUTIFY
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Booking</h3>
                  <form className="space-y-4">
                    <div>
                      <Input placeholder="Your Name" />
                    </div>
                    <div>
                      <Input placeholder="Phone Number" />
                    </div>
                    <div>
                      <Input placeholder="Email (Optional)" />
                    </div>
                    <div>
                      <Calendar className="rounded-md border" />
                    </div>
                    <div>
                      <Textarea placeholder="Additional Notes (Optional)" />
                    </div>
                    <Button className="w-full">Submit Booking Request</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-8">
            Related Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((service) => (
              <Card
                key={service}
                className="group overflow-hidden border-primary/10"
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt={`Related Service ${service}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-semibold mb-2">
                      Advanced Facial Treatment
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        (48)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">
                        $199
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Ready to Transform Your Beauty?
            </h2>
            <p className="text-muted-foreground mb-8">
              Book your Premium Facial Treatment today and enjoy special
              first-time customer discount.
            </p>
            <GradientButton size="lg">Book Your Treatment Now</GradientButton>
          </div>
        </div>
      </section>
    </div>
  );
}
