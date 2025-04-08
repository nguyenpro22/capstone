"use client";
import { useState } from "react";
import type React from "react";
import { useTranslations } from "next-intl";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { GradientButton } from "@/components/ui/gradient-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import {
  Clock,
  CalendarIcon,
  MessageCircle,
  Phone,
  ChevronRight,
  CheckCircle,
  MapPin,
  Mail,
  Percent,
} from "lucide-react";

// Next.js
import Image from "next/image";
import { useGetServiceByIdQuery } from "@/features/services/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background";
import { BookingFlow } from "@/components/services/booking/booking/booking-flow";
import { CalendarPicker } from "@/components/services/booking-calendar";

// Loading Skeleton Component
function ServiceDetailSkeleton() {
  const t = useTranslations("serviceDetail");

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner Section Skeleton */}
      <section className="relative h-[30vh] min-h-[250px] flex items-center">
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="relative z-10 container px-4 mx-auto">
          <div className="max-w-4xl">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-4 w-20" />
              <ChevronRight className="h-4 w-4 text-white/40" />
              <Skeleton className="h-4 w-24" />
              <ChevronRight className="h-4 w-4 text-white/40" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Badges Skeleton */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Title Skeleton */}
            <Skeleton className="h-12 w-3/4 mb-4" />

            {/* Rating Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-6">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            {/* Image Gallery Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>

            {/* Tabs Skeleton */}
            <div className="mb-6">
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-10 w-28 rounded-md shrink-0" />
                ))}
              </div>

              {/* Tab Content Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />

                <div className="pt-4">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                </div>

                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div>
              {/* Price Card Skeleton */}
              <Card className="border-primary/10 shadow-lg mb-6">
                <CardContent className="p-4">
                  <div className="mb-6">
                    <Skeleton className="h-8 w-32 mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-md" />
                    <Skeleton className="h-12 w-full rounded-md" />
                  </div>

                  <Separator className="my-4" />

                  <div className="text-center">
                    <Skeleton className="h-4 w-32 mx-auto mb-2" />
                    <Skeleton className="h-6 w-40 mx-auto" />
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form Skeleton */}
              <Card className="border-primary/10">
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-[240px] w-full rounded-md" />
                    <Skeleton className="h-24 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Constants
const BENEFITS = [
  "Tạo dáng mũi cao, thon gọn",
  "Cải thiện tỷ lệ khuôn mặt",
  "Tự nhiên, hài hòa với gương mặt",
  "Thời gian phục hồi nhanh",
  "Kết quả lâu dài",
  "An toàn, ít biến chứng",
];

const SUITABLE_FOR = [
  "Người có sống mũi thấp, bẹt",
  "Người có mũi tẹt, mũi hếch",
  "Người muốn cải thiện tỷ lệ khuôn mặt",
  "Người đã từng nâng mũi nhưng không đạt kết quả mong muốn",
];

const RECOVERY_TIMELINE = [
  "Sau 1-2 ngày: Có thể sinh hoạt nhẹ nhàng",
  "Sau 7-10 ngày: Tháo băng, rút chỉ (nếu có)",
  "Sau 2-3 tuần: Sưng giảm đáng kể, có thể quay lại công việc",
  "Sau 1-3 tháng: Mũi ổn định dần, đạt kết quả cuối cùng",
];

export default function ServiceDetail() {
  const t = useTranslations("serviceDetail");
  const { id } = useParams() as { id: string };
  const { data: serviceData, error, isLoading } = useGetServiceByIdQuery(id);

  // Define all state variables at the top level
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    date: new Date(),
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    phone: "",
    question: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  // Handler functions
  const handleBookNow = () => {
    setShowBookingFlow(true);
  };

  const handleCloseBookingFlow = () => {
    setShowBookingFlow(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContactSuccess(true);
      setContactFormData({
        name: "",
        phone: "",
        question: "",
      });

      // Close modal after success message
      setTimeout(() => {
        setShowContactModal(false);
        setContactSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setBookingSuccess(true);
      setBookingData({
        name: "",
        phone: "",
        email: "",
        date: new Date(),
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactRequest = () => {
    setShowContactModal(true);
  };

  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) return <ServiceDetailSkeleton />;

  if (error)
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("errorLoadingService")}</h2>
        <p className="text-muted-foreground mb-6">{t("errorMessage")}</p>
        <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
      </div>
    );

  if (!serviceData?.value)
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("serviceNotFound")}</h2>
        <p className="text-muted-foreground mb-6">
          {t("serviceNotFoundMessage")}
        </p>
        <Button asChild>
          <Link href="/services">{t("backToServices")}</Link>
        </Button>
      </div>
    );

  const service = serviceData.value;

  // Calculate discount information
  const hasDiscount = Number.parseFloat(service.discountPercent) > 0;
  const discountPercent = hasDiscount ? service.discountPercent : 0;

  // Combine images for gallery
  const allImages = [...(service.coverImage || [])];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      <AnimatedGradientBackground>
        {/* Banner Section */}
        <section className="relative h-[30vh] min-h-[250px] flex items-center">
          <div className="absolute inset-0">
            <Image
              src={
                service.coverImage?.[0]?.url ||
                "https://placehold.co/1600x800.png" ||
                "/placeholder.svg"
              }
              alt={service.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
          </div>

          <div className="relative z-10 container px-4 mx-auto">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-white/80 mb-2">
                <Link href="/" className="hover:text-primary transition-colors">
                  {t("home")}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  {t("services")}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">{service.name}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {service.category && (
                  <Badge variant="secondary">{service.category.name}</Badge>
                )}
                {hasDiscount && (
                  <Badge variant="destructive">
                    {discountPercent}% {t("discount")}
                  </Badge>
                )}
                <Badge variant="outline" className="bg-white/10">
                  {t("new")}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-2">
                {service.name}
              </h1>

              {/* Price Range */}
              <div className="flex items-center gap-4 text-white mb-2">
                <div className="font-semibold">
                  {hasDiscount ? (
                    <>
                      <span>
                        {service.discountMinPrice.toLocaleString("vi-VN")}đ
                      </span>
                      {" - "}
                      <span>
                        {service.discountMaxPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{service.minPrice.toLocaleString("vi-VN")}đ</span>
                      {" - "}
                      <span>{service.maxPrice.toLocaleString("vi-VN")}đ</span>
                    </>
                  )}
                </div>
                {hasDiscount && (
                  <span className="text-white/60 line-through">
                    {service.minPrice.toLocaleString("vi-VN")}đ -{" "}
                    {service.maxPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container px-4 mx-auto py-6">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-2 ">
              {/* Image Gallery */}
              <Carousel className="mb-6 w-full md:w-9/12 mx-auto">
                <CarouselContent>
                  {allImages && allImages.length > 0 ? (
                    allImages.map((image, index) => (
                      <CarouselItem key={image?.id || index}>
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={
                              image?.url || "https://placehold.co/600x400.png"
                            }
                            alt={`${service.name} - ${t("image")} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src="https://placehold.co/600x400.png"
                          alt={t("defaultImage")}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                {allImages && allImages.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>

              {/* Service Details Tabs */}
              <Tabs defaultValue="overview" className="mb-6 ">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                  <TabsTrigger value="overview" className="text-sm">
                    {t("overview")}
                  </TabsTrigger>
                  <TabsTrigger value="procedure" className="text-sm">
                    {t("procedure")}
                  </TabsTrigger>
                  <TabsTrigger value="doctors" className="text-sm">
                    {t("doctors")}
                  </TabsTrigger>
                  <TabsTrigger value="clinics" className="text-sm">
                    {t("clinics")}
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="text-sm">
                    {t("faq")}
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    {/* Render HTML content safely */}
                    <div
                      className="text-lg text-muted-foreground leading-relaxed mb-6"
                      dangerouslySetInnerHTML={{
                        __html: service.description || "",
                      }}
                    />

                    <h3 className="text-2xl font-serif font-semibold mb-4">
                      {t("benefits")}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {BENEFITS.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-2xl font-serif font-semibold mb-4">
                      {t("suitableFor")}
                    </h3>
                    <ul className="list-disc list-inside mb-8 space-y-2">
                      {SUITABLE_FOR.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Procedure Tab */}
                <TabsContent value="procedure" className="mt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-serif font-semibold mb-4">
                      {t("implementationProcess")}
                    </h3>

                    {service.procedures && service.procedures.length > 0 ? (
                      <div className="space-y-8">
                        {/* Sort procedures by stepIndex */}
                        {[...service.procedures]
                          .sort((a, b) => a.stepIndex - b.stepIndex)
                          .map((procedure, index) => (
                            <div
                              key={procedure?.id || index}
                              className="border-l-4 border-primary pl-4"
                            >
                              <h4 className="text-xl font-medium mb-2">
                                {index + 1}.{" "}
                                {procedure?.name || t("implementationStep")}
                              </h4>
                              <div
                                className="text-muted-foreground mb-4"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    procedure?.description ||
                                    t("noDetailedDescription"),
                                }}
                              />

                              {procedure?.procedurePriceTypes &&
                                procedure.procedurePriceTypes.length > 0 && (
                                  <div className="mt-4">
                                    <h5 className="font-medium mb-2">
                                      {t("serviceTypes")}:
                                    </h5>
                                    <div className="space-y-2">
                                      {procedure.procedurePriceTypes.map(
                                        (priceType) => (
                                          <div
                                            key={
                                              priceType?.id ||
                                              `price-${Math.random()}`
                                            }
                                            className="flex justify-between items-center p-2 bg-muted rounded-md"
                                          >
                                            <div>
                                              <span>
                                                {priceType?.name ||
                                                  t("service")}
                                              </span>
                                              {priceType?.duration && (
                                                <span className="text-sm text-muted-foreground ml-2">
                                                  ({priceType.duration}{" "}
                                                  {t("hours")})
                                                </span>
                                              )}
                                            </div>
                                            <span className="font-semibold text-primary">
                                              {(
                                                priceType?.price || 0
                                              ).toLocaleString("vi-VN")}
                                              đ
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {t("noDetailedProcedureInfo")}
                      </p>
                    )}

                    <h3 className="text-2xl font-serif font-semibold mb-4 mt-8">
                      {t("recoveryTime")}
                    </h3>
                    <ul className="list-disc list-inside mb-8 space-y-2">
                      {RECOVERY_TIMELINE.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Doctors Tab */}
                <TabsContent value="doctors" className="mt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-serif font-semibold mb-4">
                      {t("doctorTeam")}
                    </h3>

                    {service.doctorServices &&
                    service.doctorServices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {service.doctorServices.map((doctorService, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage
                                    src={
                                      doctorService.doctor.profilePictureUrl ||
                                      undefined
                                    }
                                    alt={doctorService.doctor.fullName}
                                  />
                                  <AvatarFallback>
                                    {getInitials(doctorService.doctor.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-lg">
                                    {doctorService.doctor.fullName}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{doctorService.doctor.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>
                                      {doctorService.doctor.phoneNumber ||
                                        t("notAvailable")}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {doctorService.doctor.doctorCertificates &&
                                doctorService.doctor.doctorCertificates.length >
                                  0 && (
                                  <div className="mt-4">
                                    <h5 className="text-sm font-medium mb-2">
                                      {t("certificates")}:
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {doctorService.doctor.doctorCertificates.map(
                                        (cert, i) => (
                                          <div key={i} className="mb-2">
                                            <Badge
                                              variant="outline"
                                              className="mb-1"
                                            >
                                              {cert.certificateName}
                                            </Badge>
                                            {cert.certificateUrl && (
                                              <div className="mt-1">
                                                <a
                                                  href={cert.certificateUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-xs text-primary hover:underline"
                                                >
                                                  {t("viewCertificate")}
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {t("noDoctorInfo")}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Clinics Tab */}
                <TabsContent value="clinics" className="mt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-serif font-semibold mb-4">
                      {t("implementationFacilities")}
                    </h3>

                    {service.clinics && service.clinics.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.clinics.map((clinic, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative h-40">
                                <Image
                                  src={
                                    clinic.profilePictureUrl ||
                                    "https://placehold.co/400x200.png" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={clinic.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h4 className="font-medium text-lg mb-2">
                                  {clinic.name}
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <span>{clinic.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{clinic.phoneNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{clinic.email}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full mt-4"
                                >
                                  {t("viewDetails")}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {t("noFacilityInfo")}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* FAQ Tab */}
                <TabsContent value="faq" className="mt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-serif font-semibold mb-4">
                      {t("frequentlyAskedQuestions")}
                    </h3>

                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-lg mb-2">
                            {t("faqQuestion1")}
                          </h4>
                          <p className="text-muted-foreground">
                            {t("faqAnswer1")}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-lg mb-2">
                            {t("faqQuestion2")}
                          </h4>
                          <p className="text-muted-foreground">
                            {t("faqAnswer2")}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-lg mb-2">
                            {t("faqQuestion3")}
                          </h4>
                          <p className="text-muted-foreground">
                            {t("faqAnswer3")}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Price Card */}
                <Card className="border-none shadow-xl overflow-hidden mb-6 opacity-85">
                  <CardContent className="p-4">
                    <div className="mb-6">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {service.discountMaxPrice > 0
                          ? service.discountMaxPrice.toLocaleString("vi-VN")
                          : service.maxPrice.toLocaleString("vi-VN")}
                        đ
                      </div>
                      {hasDiscount && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-muted-foreground line-through">
                            {service.maxPrice.toLocaleString("vi-VN")}đ
                          </span>
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <Percent className="h-3 w-3" />
                            {discountPercent}%
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span>{t("duration")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <span>{t("recoveryTime")}</span>
                      </div>
                      {service.clinics && service.clinics.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="line-clamp-1">
                            {service.clinics[0].name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <GradientButton
                        className="w-full"
                        size="lg"
                        onClick={() => handleBookNow()}
                      >
                        {t("bookNow")}
                      </GradientButton>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={handleContactRequest}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t("onlineConsultation")}
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        {t("needSupport")}
                      </div>
                      <div className="font-semibold text-lg flex items-center justify-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        {service.clinics && service.clinics.length > 0
                          ? service.clinics[0].phoneNumber
                          : "1800-BEAUTIFY"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Info */}
                {service.category && (
                  <Card className="border-primary/10 mt-6">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{t("category")}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{service.category.name}</Badge>
                      </div>
                      {service.category.description && (
                        <div
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: service.category.description,
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="py-12 bg-muted">
          <div className="container px-4 mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-serif font-bold mb-2">
                {t("readyForBeautyJourney")}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                {t("bookTodayMessage", { serviceName: service.name })}
              </p>
              <GradientButton
                size="lg"
                onClick={() => {
                  // Scroll to booking form
                  const bookingForm = document.querySelector("form");
                  if (bookingForm) {
                    bookingForm.scrollIntoView({ behavior: "smooth" });
                    // Focus on the first input
                    const firstInput = bookingForm.querySelector("input");
                    if (firstInput) {
                      setTimeout(() => firstInput.focus(), 500);
                    }
                  }
                }}
              >
                {t("bookNow")}
              </GradientButton>
            </div>
          </div>
        </section>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    {t("onlineConsultation")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowContactModal(false)}
                    className="h-8 w-8"
                  >
                    <span className="sr-only">{t("close")}</span>
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
                      className="lucide lucide-x"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>

                {contactSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-medium mb-2">
                      {t("requestSent")}
                    </h4>
                    <p className="text-muted-foreground">
                      {t("contactSuccessMessage")}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder={t("fullName")}
                        value={contactFormData.name}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder={t("phoneNumber")}
                        value={contactFormData.phone}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            phone: e.target.value,
                          })
                        }
                        required
                        type="tel"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder={t("yourQuestion")}
                        value={contactFormData.question}
                        onChange={(e) =>
                          setContactFormData({
                            ...contactFormData,
                            question: e.target.value,
                          })
                        }
                        className="h-24"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={contactSubmitting}
                    >
                      {contactSubmitting
                        ? t("sending")
                        : t("sendConsultationRequest")}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        {showBookingFlow && (
          <BookingFlow service={service} onClose={handleCloseBookingFlow} />
        )}
      </AnimatedGradientBackground>
    </div>
  );
}
