"use client";

import { Suspense, useEffect, useState } from "react";
import type React from "react";
import { useTranslations } from "next-intl";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { GradientButton } from "@/components/ui/gradient-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  Star,
  StarHalf,
  Users,
  Award,
  Globe,
  ArrowRight,
  Check,
  CalendarPlus2Icon as CalendarIcon2,
  X,
  Info,
  Heart,
  BadgeCheck,
  Sparkles,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Share2,
} from "lucide-react";

// Next.js
import Image from "next/image";
import { useGetServiceByIdQuery } from "@/features/services/api";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookingFlow } from "@/components/services/booking/booking/booking-flow";
import type {
  Doctor,
  DoctorCertificate,
  ProcedurePriceType,
} from "@/features/services/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SendMessageBody, useSendMessageMutation } from "@/features/inbox/api";
import { useRouter } from "next/navigation";
import { handleProtectedAction } from "@/features/auth/utils";
import ModalConfirmLogin from "@/components/services/loginModal";

// Loading Skeleton Component
function ServiceDetailSkeleton() {
  const t = useTranslations("serviceDetail");
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 via-rose-50/20 to-white dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Banner Section Skeleton */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center">
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full dark:bg-gray-800/60" />
        </div>
        <div className="relative z-10 container px-4 mx-auto">
          <div className="max-w-4xl">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-4 w-20 dark:bg-gray-700/70" />
              <ChevronRight className="h-4 w-4 text-white/40" />
              <Skeleton className="h-4 w-24 dark:bg-gray-700/70" />
              <ChevronRight className="h-4 w-4 text-white/40" />
              <Skeleton className="h-4 w-28 dark:bg-gray-700/70" />
            </div>

            {/* Badges Skeleton */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-6 w-20 rounded-full dark:bg-gray-700/70" />
              <Skeleton className="h-6 w-24 rounded-full dark:bg-gray-700/70" />
            </div>

            {/* Title Skeleton */}
            <Skeleton className="h-12 w-3/4 mb-4 dark:bg-gray-700/70" />

            {/* Rating Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-32 dark:bg-gray-700/70" />
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl p-6 mb-8 dark:bg-gray-800 dark:text-gray-100">
              {/* Image Gallery Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-[350px] w-full rounded-lg dark:bg-gray-700" />
                <div className="flex gap-2 mt-4 justify-center">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-16 w-16 rounded-md dark:bg-gray-700"
                    />
                  ))}
                </div>
              </div>

              {/* Quick Info Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-24 rounded-lg dark:bg-gray-700"
                  />
                ))}
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 mb-6">
                <Skeleton className="h-8 w-1/3 dark:bg-gray-700" />
                <Skeleton className="h-4 w-full dark:bg-gray-700" />
                <Skeleton className="h-4 w-full dark:bg-gray-700" />
                <Skeleton className="h-4 w-2/3 dark:bg-gray-700" />
              </div>
            </Card>

            {/* Tabs Skeleton */}
            <Card className="border-none shadow-xl overflow-hidden mb-8 dark:bg-gray-800 dark:text-gray-100">
              <CardHeader className="bg-gray-50 dark:bg-gray-700/50 p-4">
                <div className="flex gap-4 overflow-x-auto">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-10 w-32 rounded-md shrink-0 dark:bg-gray-600"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-7 w-1/3 mb-4 dark:bg-gray-700" />
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-l-4 border-gray-200 dark:border-gray-600 pl-4 py-2"
                    >
                      <Skeleton className="h-6 w-2/3 mb-2 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-full dark:bg-gray-700" />
                      <Skeleton className="h-4 w-full dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Price Card Skeleton */}
              <Card className="border-none overflow-hidden shadow-xl dark:bg-gray-800 dark:text-gray-100">
                <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-800/50 dark:to-pink-800/50 p-4">
                  <Skeleton className="h-8 w-40 dark:bg-gray-700" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <Skeleton className="h-10 w-32 mb-2 dark:bg-gray-700" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-24 dark:bg-gray-700" />
                      <Skeleton className="h-6 w-20 rounded-full dark:bg-gray-700" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full dark:bg-gray-700" />
                        <Skeleton className="h-5 w-full dark:bg-gray-700" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full rounded-md dark:bg-gray-700" />
                    <Skeleton className="h-12 w-full rounded-md dark:bg-gray-700" />
                  </div>
                </CardContent>
              </Card>

              {/* Doctor Card Skeleton */}
              <Card className="border-none overflow-hidden shadow-xl dark:bg-gray-800 dark:text-gray-100">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800/50 dark:to-purple-800/50 p-4">
                  <Skeleton className="h-8 w-40 dark:bg-gray-700" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-16 w-16 rounded-full dark:bg-gray-700" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full rounded-md dark:bg-gray-700" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetail() {
  const searchParams = useSearchParams();
  const livestreamId = searchParams.get("livestreamId");
  const t = useTranslations("serviceDetail");
  const { id } = useParams() as { id: string };
  const { data: serviceData, error, isLoading } = useGetServiceByIdQuery(id);
  const user = useSelector((state: RootState) => state?.auth?.user);
  const router = useRouter();

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const [doctor, setDoctor] = useState<Doctor>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState<() => void>(() => {});
  useEffect(() => {
    if (livestreamId) {
      setShowBookingFlow(true);
    }
  }, [livestreamId]);
  // Handler functions
  const handleBookNow = () => {
    handleProtectedAction(
      () => setShowBookingFlow(true),
      () => {
        setPostLoginAction(() => () => setShowBookingFlow(true));
        setShowLoginModal(true);
      }
    );
  };
  const handleConfirmLogin = () => {
    localStorage.setItem("redirect", `/services/${id}`);
    router.push("/login");
  };
  const handleCloseBookingFlow = () => {
    setShowBookingFlow(false);
  };
  const handleChatNow = () => {
    handleProtectedAction(handleChat, () => {
      setPostLoginAction(() => handleChat);
      setShowLoginModal(true);
    });
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

  // Get unique procedures (no duplicates)
  const getUniqueProcedures = (procedures: any[]) => {
    if (!procedures) return [];
    const uniqueIds = new Set();
    return procedures
      .filter((proc) => {
        if (!uniqueIds.has(proc.id)) {
          uniqueIds.add(proc.id);
          return true;
        }
        return false;
      })
      .sort((a, b) => a.stepIndex - b.stepIndex);
  };

  // Get unique doctors (no duplicates)
  const getUniqueDoctors = (doctorServices: any[]) => {
    if (!doctorServices) return [];
    const uniqueIds = new Set();
    return doctorServices.filter((ds) => {
      if (!uniqueIds.has(ds.doctor.id)) {
        uniqueIds.add(ds.doctor.id);
        return true;
      }
      return false;
    });
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) return <ServiceDetailSkeleton />;

  if (error)
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {t("errorLoadingService")}
        </h2>
        <p className="text-muted-foreground mb-6 dark:text-gray-300">
          {t("errorMessage")}
        </p>
        <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
      </div>
    );

  if (!serviceData?.value)
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {t("serviceNotFound")}
        </h2>
        <p className="text-muted-foreground mb-6 dark:text-gray-300">
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
  // If no images, use placeholder
  if (allImages.length === 0) {
    allImages.push({
      id: "placeholder",
      index: 0,
      url: "https://placehold.co/1200x800/rose/white?text=Beauty+Service",
    });
  }

  // Get unique procedures and doctors
  const uniqueProcedures = getUniqueProcedures(service.procedures);
  const uniqueDoctors = getUniqueDoctors(service.doctorServices);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleChat = () => {
    const data: SendMessageBody = {
      entityId: service.branding.id,
      content: `Tôi muốn hỏi về dịch vụ ${service.name}`,
      isClinic: false,
    };
    sendMessage(data)
      .then((response) => {
        console.log("Message sent successfully:", response);
        router.push(`/inbox`);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <Suspense fallback={<ServiceDetailSkeleton />}>
      <div className="min-h-screen bg-gradient-to-b from-pink-50/50 via-rose-50/20 to-white dark:from-gray-950 dark:via-gray-900 dark:to-black">
        {/* Banner Section */}
        <section className="relative h-[40vh] min-h-[350px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={
                allImages[0]?.url ||
                "https://placehold.co/1600x800.png" ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              alt={service.name}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 container px-4 mx-auto">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-md text-white/80 mb-4">
                <Link
                  href="/"
                  className="hover:text-rose-300 transition-colors"
                >
                  {t("home")}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href="/services"
                  className="hover:text-rose-300 transition-colors"
                >
                  {t("services")}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-rose-300">{service.name}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {service.category && (
                  <Badge
                    variant="secondary"
                    className="bg-rose-500/90 hover:bg-rose-600 text-white border-none"
                  >
                    {service.category.name}
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge
                    variant="destructive"
                    className="bg-amber-500 hover:bg-amber-600 text-white border-none"
                  >
                    <Percent className="w-3 h-3 mr-1" />
                    {discountPercent}% {t("discount")}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/20"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                  {t("new")}
                </Badge>
                {service.clinics && service.clinics.length > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {service.clinics.length} {t("locations")}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-serif">
                {service.name}
              </h1>

              {/* Price Range */}
              <div className="flex items-center gap-4 text-white mb-2">
                <div className="font-semibold">
                  {hasDiscount ? (
                    <>
                      <span className="text-xl">
                        {service.discountMinPrice.toLocaleString("vi-VN")}đ
                      </span>
                      {" - "}
                      <span className="text-xl">
                        {service.discountMaxPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">
                        {service.minPrice.toLocaleString("vi-VN")}đ
                      </span>
                      {" - "}
                      <span className="text-xl">
                        {service.maxPrice.toLocaleString("vi-VN")}đ
                      </span>
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

        <div className="container px-4 mx-auto -mt-16 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Main Service Card */}
              <Card className="border-none shadow-xl overflow-hidden mb-8 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Image Gallery */}
                  <div className="mb-6">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                      <Image
                        src={
                          allImages[selectedImage]?.url ||
                          "https://placehold.co/1200x800/rose/white?text=Beauty+Service" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={`${service.name} - ${t("image")} ${
                          selectedImage + 1
                        }`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/40 border-none text-white hover:text-rose-500 rounded-full"
                          onClick={toggleBookmark}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isBookmarked ? "fill-rose-500 text-rose-500" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/40 border-none text-white hover:text-rose-500 rounded-full"
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    {allImages.length > 1 && (
                      <div className="flex gap-2 justify-center">
                        {allImages.map((image, index) => (
                          <button
                            key={image?.id || index}
                            className={`relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all ${
                              selectedImage === index
                                ? "border-rose-500 scale-105"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                            onClick={() => setSelectedImage(index)}
                          >
                            <Image
                              src={
                                image?.url ||
                                "https://placehold.co/600x400/rose/white?text=Beauty+Service" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <Card className="border border-rose-100 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/20 hover:shadow-md transition-shadow dark:hover:bg-rose-900/30">
                      <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 text-rose-500 dark:text-rose-400 mx-auto mb-2" />
                        <h4 className="font-medium dark:text-white">
                          {t("duration")}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          1-2 {t("hours")}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-rose-100 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/20 hover:shadow-md transition-shadow dark:hover:bg-rose-900/30">
                      <CardContent className="p-4 text-center">
                        <CalendarIcon2 className="h-6 w-6 text-rose-500 dark:text-rose-400 mx-auto mb-2" />
                        <h4 className="font-medium dark:text-white">
                          {t("recovery")}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          1-2 {t("days")}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-rose-100 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/20 hover:shadow-md transition-shadow dark:hover:bg-rose-900/30">
                      <CardContent className="p-4 text-center">
                        <Users className="h-6 w-6 text-rose-500 dark:text-rose-400 mx-auto mb-2" />
                        <h4 className="font-medium dark:text-white">
                          {t("experts")}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          {uniqueDoctors.length} {t("specialists")}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-rose-100 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/20 hover:shadow-md transition-shadow dark:hover:bg-rose-900/30">
                      <CardContent className="p-4 text-center">
                        <Award className="h-6 w-6 text-rose-500 dark:text-rose-400 mx-auto mb-2" />
                        <h4 className="font-medium dark:text-white">
                          {t("results")}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          {t("highSatisfaction")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description Section */}
                  <div className="prose dark:prose-invert max-w-none mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {t("aboutService")}
                    </h2>
                    <div
                      className="text-muted-foreground dark:text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: service.description || "",
                      }}
                    />
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 dark:border dark:border-gray-600">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-rose-500 dark:text-rose-400">
                          4.8
                        </div>
                        <div className="flex text-amber-400">
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <StarHalf className="h-4 w-4 fill-current" />
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-gray-300 mt-1">
                          52 {t("reviews")}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              5 {t("stars")}
                            </div>
                            <Progress value={85} className="h-2" />
                            <div className="text-sm w-8 dark:text-gray-200">
                              85%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              4 {t("stars")}
                            </div>
                            <Progress value={10} className="h-2" />
                            <div className="text-sm w-8 dark:text-gray-200">
                              10%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              3 {t("stars")}
                            </div>
                            <Progress value={3} className="h-2" />
                            <div className="text-sm w-8 dark:text-gray-200">
                              3%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              2 {t("stars")}
                            </div>
                            <Progress value={1} className="h-2" />
                            <div className="text-sm w-8 dark:text-gray-200">
                              1%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              1 {t("star")}
                            </div>
                            <Progress value={1} className="h-2" />
                            <div className="text-sm w-8 dark:text-gray-200">
                              1%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Tabs */}
              <Card className="border-none shadow-xl overflow-hidden mb-8 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                <Tabs defaultValue="procedure">
                  <CardHeader className="bg-gray-50 dark:bg-gray-700/70 p-0 border-b border-gray-200 dark:border-gray-600">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
                      <TabsTrigger
                        value="procedure"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:shadow-none"
                      >
                        {t("procedure")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="doctors"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:shadow-none"
                      >
                        {t("doctors")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="clinics"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:shadow-none"
                      >
                        {t("clinics")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="faq"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:shadow-none"
                      >
                        {t("faq")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="reviews"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:shadow-none"
                      >
                        {t("reviews")}
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>

                  {/* Procedure Tab */}
                  <TabsContent value="procedure" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-serif font-semibold mb-4 text-gray-900 dark:text-white">
                          {t("implementationProcess")}
                        </h3>

                        {uniqueProcedures && uniqueProcedures.length > 0 ? (
                          <div className="space-y-8 relative">
                            <div className="absolute left-[22px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-rose-300 via-rose-500 to-rose-300 dark:from-rose-700/70 dark:via-rose-500 dark:to-rose-700/70"></div>
                            {uniqueProcedures.map((procedure, index) => (
                              <div
                                key={procedure?.id || index}
                                className="relative pl-12"
                              >
                                <div className="absolute left-0 top-0 flex items-center justify-center w-11 h-11 rounded-full bg-rose-100 dark:bg-rose-900/50 border-4 border-white dark:border-gray-800 text-rose-600 dark:text-rose-300 font-bold z-10">
                                  {index + 1}
                                </div>
                                <div className="bg-white dark:bg-gray-700/50 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow dark:hover:border-gray-500">
                                  <h4 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
                                    {procedure?.name || t("implementationStep")}
                                  </h4>
                                  <div
                                    className="text-muted-foreground dark:text-gray-300 mb-4"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        procedure?.description ||
                                        t("noDetailedDescription"),
                                    }}
                                  />

                                  {procedure?.procedurePriceTypes &&
                                    procedure.procedurePriceTypes.length >
                                      0 && (
                                      <div className="mt-6">
                                        <h5 className="font-medium mb-3 flex items-center text-gray-900 dark:text-white">
                                          <Percent className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400" />
                                          {t("serviceOptions")}
                                        </h5>
                                        <div className="space-y-3">
                                          {procedure.procedurePriceTypes.map(
                                            (
                                              priceType: ProcedurePriceType,
                                              pIndex: number
                                            ) => (
                                              <div
                                                key={
                                                  priceType?.id ||
                                                  `price-${Math.random()}`
                                                }
                                                className={`flex justify-between items-center p-3 rounded-md transition-colors ${
                                                  pIndex === 0
                                                    ? "bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700"
                                                    : "bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600"
                                                }`}
                                              >
                                                <div>
                                                  <span className="font-medium dark:text-white">
                                                    {priceType?.name ||
                                                      t("service")}
                                                  </span>
                                                  {priceType?.duration && (
                                                    <div className="text-sm text-muted-foreground dark:text-gray-300 flex items-center mt-1">
                                                      <Clock className="h-3 w-3 mr-1" />
                                                      {priceType.duration}{" "}
                                                      {t("minutes")}
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="text-right">
                                                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                    {(
                                                      priceType?.price || 0
                                                    ).toLocaleString("vi-VN")}
                                                    đ
                                                  </span>
                                                  {priceType?.isDefault && (
                                                    <div className="text-xs mt-1">
                                                      <Badge
                                                        variant="outline"
                                                        className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                                                      >
                                                        <Check className="h-3 w-3 mr-1" />
                                                        {t("recommended")}
                                                      </Badge>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-8">
                            <Info className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-500 mb-4" />
                            <p className="text-muted-foreground dark:text-gray-300">
                              {t("noDetailedProcedureInfo")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* Doctors Tab */}
                  <TabsContent value="doctors" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
                          {t("expertTeam")}
                        </h3>

                        {uniqueDoctors && uniqueDoctors.length > 0 ? (
                          <div className="grid grid-cols-1 gap-8">
                            {uniqueDoctors.map((doctorService, index) => (
                              <Card
                                key={index}
                                className="overflow-hidden hover:shadow-lg transition-shadow border-none bg-white dark:bg-gray-700 dark:border dark:border-gray-600"
                              >
                                <CardContent className="p-0">
                                  <div className="flex flex-col md:flex-row">
                                    <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                                      <Image
                                        src={
                                          doctorService.doctor
                                            .profilePictureUrl ||
                                          `https://placehold.co/400x500`
                                        }
                                        alt={doctorService.doctor.fullName}
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:hidden"></div>
                                      <div className="absolute top-3 left-3">
                                        <Badge className="bg-rose-500 text-white border-none">
                                          <BadgeCheck className="h-3 w-3 mr-1" />
                                          {t("verified")}
                                        </Badge>
                                      </div>
                                      <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
                                        <h4 className="font-medium text-xl text-white flex items-center">
                                          {doctorService.doctor.fullName}
                                        </h4>
                                        <div className="text-sm text-white/80 flex items-center gap-2">
                                          <Stethoscope className="h-3 w-3" />
                                          {t("specialist")}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-6 w-full md:w-2/3">
                                      <div className="hidden md:block">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h4 className="font-medium text-2xl mb-1 flex items-center text-gray-900 dark:text-white">
                                              {doctorService.doctor.fullName}
                                              <BadgeCheck className="h-5 w-5 text-rose-500 dark:text-rose-400 ml-1" />
                                            </h4>
                                            <div className="text-muted-foreground dark:text-gray-300 mb-4 flex items-center gap-2">
                                              <Stethoscope className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                                              {t("specialist")}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1 text-amber-400">
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <StarHalf className="h-4 w-4 fill-current" />
                                            <span className="text-sm text-muted-foreground dark:text-gray-300 ml-1">
                                              4.8
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                          <h5 className="font-medium text-sm uppercase tracking-wider text-muted-foreground dark:text-gray-300 mb-2 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400" />
                                            {t("contactInfo")}
                                          </h5>
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-600/50 p-2 rounded-md dark:border dark:border-gray-600">
                                              <Mail className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                                              <span className="truncate dark:text-white">
                                                {doctorService.doctor.email}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-600/50 p-2 rounded-md dark:border dark:border-gray-600">
                                              <Phone className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                                              <span className="dark:text-white">
                                                {doctorService.doctor
                                                  .phoneNumber ||
                                                  t("contactClinic")}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <h5 className="font-medium text-sm uppercase tracking-wider text-muted-foreground dark:text-gray-300 mb-2 flex items-center">
                                            <Briefcase className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400" />
                                            {t("expertise")}
                                          </h5>
                                          <div className="flex flex-wrap gap-1">
                                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/60 border-none">
                                              {service.category?.name ||
                                                t("beautyServices")}
                                            </Badge>
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 border-none">
                                              {t("advancedTechniques")}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>

                                      {doctorService.doctor
                                        .doctorCertificates &&
                                        doctorService.doctor.doctorCertificates
                                          .length > 0 && (
                                          <div className="mb-4">
                                            <h5 className="font-medium text-sm uppercase tracking-wider text-muted-foreground dark:text-gray-300 mb-3 flex items-center">
                                              <GraduationCap className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400" />
                                              {t("certifications")}
                                            </h5>
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                              {doctorService.doctor.doctorCertificates.map(
                                                (
                                                  cert: DoctorCertificate,
                                                  i: number
                                                ) => (
                                                  <div
                                                    key={i}
                                                    className="relative group flex-shrink-0"
                                                  >
                                                    <a
                                                      href={
                                                        cert.certificateUrl ||
                                                        "/placeholder.svg"
                                                      }
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="block"
                                                    >
                                                      <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow w-24 cursor-pointer dark:hover:border-gray-500">
                                                        {cert.certificateUrl ? (
                                                          <div className="relative h-24 w-full">
                                                            <Image
                                                              src={
                                                                cert.certificateUrl ||
                                                                "/placeholder.svg"
                                                              }
                                                              alt={
                                                                cert.certificateName
                                                              }
                                                              fill
                                                              className="object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                                              <ExternalLink className="h-5 w-5 text-white" />
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <div className="h-24 w-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                            <Award className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                                                          </div>
                                                        )}
                                                        <div className="p-2 bg-white dark:bg-gray-600 text-xs dark:text-gray-200">
                                                          <div className="font-medium truncate">
                                                            {
                                                              cert.certificateName
                                                            }
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </a>
                                                    <TooltipProvider>
                                                      <Tooltip>
                                                        <TooltipTrigger className="absolute inset-0 z-10 pointer-events-none" />
                                                        <TooltipContent>
                                                          <p className="font-medium">
                                                            {
                                                              cert.certificateName
                                                            }
                                                          </p>
                                                          {cert.note && (
                                                            <p className="text-xs text-muted-foreground">
                                                              {cert.note}
                                                            </p>
                                                          )}
                                                        </TooltipContent>
                                                      </Tooltip>
                                                    </TooltipProvider>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-8">
                            <Info className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-500 mb-4" />
                            <p className="text-muted-foreground dark:text-gray-300">
                              {t("noDoctorInfo")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* Clinics Tab */}
                  <TabsContent value="clinics" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
                          {t("ourLocations")}
                        </h3>

                        {service.clinics && service.clinics.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {service.clinics.map((clinic, index) => (
                              <Card
                                key={index}
                                className={`overflow-hidden hover:shadow-md transition-shadow border-none ${
                                  clinic.isActivated !== false
                                    ? "bg-white dark:bg-gray-700"
                                    : "bg-gray-100 dark:bg-gray-800/50 opacity-75"
                                } dark:border dark:border-gray-600`}
                              >
                                <CardContent className="p-0">
                                  <div className="relative h-40">
                                    <Image
                                      src={
                                        clinic.profilePictureUrl ||
                                        `https://placehold.co/800x400/rose/white?text=${
                                          clinic.name || "/placeholder.svg"
                                        }`
                                      }
                                      alt={clinic.name}
                                      fill
                                      className={`object-cover ${
                                        clinic.isActivated === false
                                          ? "grayscale"
                                          : ""
                                      }`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-4 flex gap-2">
                                      <Badge className="bg-white text-rose-600 hover:bg-gray-100">
                                        {clinic.isParent
                                          ? t("mainBranch")
                                          : t("branch")}
                                      </Badge>
                                      {clinic.isActivated !== false ? (
                                        <Badge className="bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                                          {t("active")}
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                                          {t("inactive")}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="p-4">
                                    <h4 className="font-medium text-lg mb-3 text-gray-900 dark:text-white">
                                      {clinic.name}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                                        <span className="dark:text-gray-300">
                                          {clinic.address ||
                                            t("contactForAddress")}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                                        <span className="dark:text-gray-300">
                                          {clinic.phoneNumber}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                                        <span className="dark:text-gray-300">
                                          {clinic.email}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                                        <span className="dark:text-gray-300">
                                          {t("openingHours")}: 8:00 - 20:00
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                      <Button
                                        variant="ghost"
                                        className="p-0 h-auto text-rose-600 hover:text-rose-700 hover:bg-transparent dark:text-rose-400 dark:hover:text-rose-300"
                                      >
                                        {t("getDirections")}{" "}
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                      </Button>
                                      {clinic.isActivated !== false ? (
                                        <Button variant="secondary">
                                          {t("bookHere")}
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="secondary"
                                          disabled
                                          className="opacity-50 cursor-not-allowed"
                                        >
                                          {t("serviceUnavailable")}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-8">
                            <Info className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-500 mb-4" />
                            <p className="text-muted-foreground dark:text-gray-300">
                              {t("noLocationInfo")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* FAQ Tab */}
                  <TabsContent value="faq" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-900 dark:text-white">
                          {t("frequentlyAskedQuestions")}
                        </h3>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem
                            value="item-1"
                            className="border-b border-gray-200 dark:border-gray-600"
                          >
                            <AccordionTrigger className="text-left hover:text-rose-600 dark:hover:text-rose-400 dark:text-white">
                              {t("faqQuestion1")}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground dark:text-gray-300">
                                {t("faqAnswer1")}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem
                            value="item-2"
                            className="border-b border-gray-200 dark:border-gray-600"
                          >
                            <AccordionTrigger className="text-left hover:text-rose-600 dark:hover:text-rose-400 dark:text-white">
                              {t("faqQuestion2")}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground dark:text-gray-300">
                                {t("faqAnswer2")}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem
                            value="item-3"
                            className="border-b border-gray-200 dark:border-gray-600"
                          >
                            <AccordionTrigger className="text-left hover:text-rose-600 dark:hover:text-rose-400 dark:text-white">
                              {t("faqQuestion3")}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground dark:text-gray-300">
                                {t("faqAnswer3")}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem
                            value="item-4"
                            className="border-b border-gray-200 dark:border-gray-600"
                          >
                            <AccordionTrigger className="text-left hover:text-rose-600 dark:hover:text-rose-400 dark:text-white">
                              {t("faqQuestion4")}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground dark:text-gray-300">
                                {t("faqAnswer4")}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem
                            value="item-5"
                            className="border-b border-gray-200 dark:border-gray-600"
                          >
                            <AccordionTrigger className="text-left hover:text-rose-600 dark:hover:text-rose-400 dark:text-white">
                              {t("faqQuestion5")}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground dark:text-gray-300">
                                {t("faqAnswer5")}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </CardContent>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
                            {t("customerReviews")}
                          </h3>
                          <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                            {t("writeReview")}
                          </Button>
                        </div>

                        <div className="space-y-6">
                          {Array(3)
                            .fill(0)
                            .map((_, i) => (
                              <Card
                                key={i}
                                className="bg-gray-50/50 dark:bg-gray-700/50 border-none hover:shadow-md transition-shadow dark:border dark:border-gray-600"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    <Avatar className="h-10 w-10 border-2 border-rose-200 dark:border-rose-800">
                                      <AvatarImage
                                        src={`https://placehold.co/100/rose/white?text=${String.fromCharCode(
                                          65 + i
                                        )}`}
                                      />
                                      <AvatarFallback className="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                                        {String.fromCharCode(65 + i)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="font-medium text-gray-900 dark:text-white">
                                            {t(`reviewerName${i + 1}`)}
                                          </h4>
                                          <div className="flex text-amber-400 my-1">
                                            {Array(5)
                                              .fill(0)
                                              .map((_, s) => (
                                                <Star
                                                  key={s}
                                                  className={`h-4 w-4 ${
                                                    s < 5 - i
                                                      ? "fill-current"
                                                      : ""
                                                  }`}
                                                />
                                              ))}
                                          </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground dark:text-gray-300">
                                          {t(`reviewDate${i + 1}`)}
                                        </div>
                                      </div>
                                      <p className="text-muted-foreground dark:text-gray-300 mt-2">
                                        {t(`reviewText${i + 1}`)}
                                      </p>
                                      {i === 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                          <div className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8 border-2 border-rose-200 dark:border-rose-800">
                                              <AvatarImage src="/placeholder-user.jpg" />
                                              <AvatarFallback className="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                                                SP
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <div className="font-medium text-sm text-gray-900 dark:text-white">
                                                {t("staffResponse")}
                                              </div>
                                              <p className="text-sm text-muted-foreground dark:text-gray-300 mt-1">
                                                {t("staffResponseText")}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>

                        <div className="text-center mt-6">
                          <Button
                            variant="outline"
                            className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                          >
                            {t("loadMoreReviews")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Price Card */}
                <Card className="border-none overflow-hidden shadow-xl bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-800/50 dark:to-pink-800/50 p-4 dark:border-b dark:border-gray-700">
                    <h3 className="font-serif text-lg font-semibold flex items-center">
                      <Percent className="h-5 w-5 text-rose-600 dark:text-rose-400 mr-2" />
                      {t("pricingPlans")}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center">
                        {hasDiscount ? (
                          <>
                            {service.discountMinPrice.toLocaleString("vi-VN")}đ{" "}
                            - {service.discountMaxPrice.toLocaleString("vi-VN")}
                            đ `
                            <Badge
                              variant="destructive"
                              className="ml-2 bg-amber-500 hover:bg-amber-600 text-white border-none"
                            >
                              -{discountPercent}%
                            </Badge>
                          </>
                        ) : (
                          <>
                            {service.minPrice.toLocaleString("vi-VN")}đ -{" "}
                            {service.maxPrice.toLocaleString("vi-VN")}đ
                          </>
                        )}
                      </div>
                      {hasDiscount && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-muted-foreground dark:text-gray-300 line-through">
                            {service.maxPrice.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-sm text-green-600 dark:text-green-400">
                            {t("limitedTimeOffer")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                        <span className="dark:text-gray-200">
                          {t("includedConsultation")}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                        <span className="dark:text-gray-200">
                          {t("includedAftercare")}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                        <span className="dark:text-gray-200">
                          {t("includedFollowup")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <GradientButton
                        className="w-full"
                        size="lg"
                        onClick={handleBookNow}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {t("bookNow")}
                      </GradientButton>
                      <Button
                        variant="outline"
                        className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                        size="lg"
                        onClick={handleContactRequest}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t("askQuestion")}
                      </Button>
                    </div>

                    <Separator className="my-6 dark:bg-gray-600" />

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground dark:text-gray-300 mb-2">
                        {t("instantSupport")}
                      </div>
                      <div className="font-semibold text-lg flex items-center justify-center gap-2">
                        <Phone className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                        {service.clinics && service.clinics.length > 0
                          ? service.clinics[0].phoneNumber
                          : "1800-BEAUTIFY"}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-gray-300 mt-1">
                        {t("businessHours")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none overflow-hidden shadow-xl mb-5 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-200 to-blue-100 dark:from-green-800/50 dark:to-teal-800/50 p-4 dark:border-b dark:border-gray-700">
                    <h3 className="font-serif text-lg font-semibold flex items-center">
                      <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      Thông tin thẩm mỹ viện
                    </h3>
                  </CardHeader>
                  <Image
                    alt={service.branding.name}
                    src={
                      service.branding.profilePictureUrl ?? "/placeholder.svg"
                    }
                    width={500}
                    height={300}
                    className="w-full h-40 object-cover rounded-t-md"
                  />
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      {service.branding.name}
                    </h4>
                    {service.branding.address && (
                      <div className="text-sm text-muted-foreground dark:text-gray-300 mb-4">
                        {service.branding.address}
                      </div>
                    )}
                    {service.branding.phoneNumber && (
                      <div className="text-sm text-muted-foreground dark:text-gray-300 mb-4">
                        {service.branding.phoneNumber}
                      </div>
                    )}
                    <div className="">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                          onClick={handleChatNow}
                        >
                          Tư vấn ngay
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Category Info */}
                {service.category && (
                  <Card className="border-none overflow-hidden shadow-xl mb-5 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-800/50 dark:to-teal-800/50 p-4 dark:border-b dark:border-gray-700">
                      <h3 className="font-serif text-lg font-semibold flex items-center">
                        <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                        {t("categoryInfo")}
                      </h3>
                    </CardHeader>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                        {service.category.name}
                      </h4>
                      {service.category.description && (
                        <div
                          className="text-sm text-muted-foreground dark:text-gray-300 mb-4"
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

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-none shadow-2xl bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white p-6 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowContactModal(false)}
                    className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-white/20 hover:text-white rounded-full"
                  >
                    <span className="sr-only">{t("close")}</span>
                    <X className="h-5 w-5" />
                  </Button>
                  <h3 className="text-xl font-bold mb-2">
                    {t("getPersonalConsultation")}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {t("consultationDescription")}
                  </p>
                </div>

                <div className="p-6">
                  {contactSuccess ? (
                    <div className="text-center py-8">
                      <div className="bg-green-100 dark:bg-green-900/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-xl font-medium mb-2 dark:text-white">
                        {t("requestSent")}
                      </h4>
                      <p className="text-muted-foreground dark:text-gray-300">
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
                          className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                          className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                          className="h-24 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                        disabled={contactSubmitting}
                      >
                        {contactSubmitting
                          ? t("sending")
                          : t("sendConsultationRequest")}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Booking Flow Modal */}
        {showBookingFlow && user && (
          <BookingFlow
            service={service}
            onClose={handleCloseBookingFlow}
            userData={user}
            liveStreamRoomId={livestreamId || null}
          />
        )}
        <ModalConfirmLogin
          isOpen={showLoginModal}
          onCancel={() => setShowLoginModal(false)}
          onConfirm={handleConfirmLogin}
        />
      </div>
    </Suspense>
  );
}
