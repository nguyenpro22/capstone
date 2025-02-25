import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AnimatedText } from "@/components/ui/animated-text";
import { GradientButton } from "@/components/ui/gradient-button";
import { Search, Grid, List, Star, Clock, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Services Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 container px-4 mx-auto text-center text-white">
          <Badge
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-4"
          >
            Our Services
          </Badge>
          <AnimatedText
            text="Transform Your Beauty Journey"
            className="mb-4 text-white"
          />
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary">Services</span>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                Filters
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              </h3>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Categories
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="facial">Facial Treatments</SelectItem>
                      <SelectItem value="body">Body Treatments</SelectItem>
                      <SelectItem value="laser">Laser Therapy</SelectItem>
                      <SelectItem value="hair">Hair Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Duration
                  </label>
                  <RadioGroup defaultValue="30">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="30" />
                      <label htmlFor="30" className="text-sm">
                        Under 30 mins
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="60" id="60" />
                      <label htmlFor="60" className="text-sm">
                        30-60 mins
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="120" id="120" />
                      <label htmlFor="120" className="text-sm">
                        1-2 hours
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-4 block">
                    Price Range
                  </label>
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={50}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>

                {/* Promotions */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Promotions
                  </label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="promo" />
                    <label htmlFor="promo" className="text-sm">
                      Show promotional items
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Services */}
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="font-semibold mb-4">Popular Services</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt={`Popular Service ${item}`}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-medium">
                        Premium Facial Treatment
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs text-muted-foreground">
                          4.9 (120)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="facial">Facial</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="laser">Laser</TabsTrigger>
                <TabsTrigger value="hair">Hair</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card
                      key={item}
                      className="group overflow-hidden border-primary/10"
                    >
                      <CardContent className="p-0">
                        <div className="relative h-48">
                          <Image
                            src="/placeholder.svg?height=200&width=300"
                            alt={`Service ${item}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          {item % 2 === 0 && (
                            <Badge className="absolute top-4 right-4 bg-primary">
                              20% OFF
                            </Badge>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-serif font-semibold mb-2">
                            Premium Facial Treatment
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="text-sm ml-1">4.9</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              (120 reviews)
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            Advanced skincare treatment for radiant and youthful
                            skin using premium products.
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                60 mins
                              </span>
                            </div>
                            <div className="text-right">
                              {item % 2 === 0 && (
                                <span className="text-sm text-muted-foreground line-through mr-2">
                                  $299
                                </span>
                              )}
                              <span className="text-lg font-semibold text-primary">
                                $239
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1" variant="outline">
                              View Details
                            </Button>
                            <GradientButton className="flex-1">
                              Book Now
                            </GradientButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-10 h-10 p-0">
                  1
                </Button>
                <Button variant="outline" className="w-10 h-10 p-0">
                  2
                </Button>
                <Button variant="outline" className="w-10 h-10 p-0">
                  3
                </Button>
                <span className="mx-2">...</span>
                <Button variant="outline" className="w-10 h-10 p-0">
                  10
                </Button>
              </div>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Ready to Transform Your Beauty?
            </h2>
            <p className="text-muted-foreground mb-8">
              Book a free consultation with our experts and start your beauty
              journey today.
            </p>
            <GradientButton size="lg">Book Free Consultation</GradientButton>
          </div>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10k+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.9</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
