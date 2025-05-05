"use client";

import { Suspense, useEffect, useState } from "react";
import type React from "react";
import { useTranslations } from "next-intl";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import {
  Clock,
  CalendarIcon,
  Phone,
  ChevronRight,
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
  CalendarPlus,
  X,
  Info,
  BadgeCheck,
  Sparkles,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Share2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  ThumbsUp,
  Eye,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

// Next.js
import Image from "next/image";
import { useGetServiceByIdQuery } from "@/features/services/api";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookingFlow } from "@/components/services/booking/booking/booking-flow";
import type {
  DoctorCertificate,
  ProcedurePriceType,
} from "@/features/services/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  type SendMessageBody,
  useSendMessageMutation,
} from "@/features/inbox/api";
import { useRouter } from "next/navigation";
import { handleProtectedAction } from "@/features/auth/utils";
import ModalConfirmLogin from "@/components/services/loginModal";
import { motion } from "framer-motion";
import {
  BOOKING_DATA_STORAGE_KEY,
  BOOKING_DATA_TIMESTAMP_KEY,
} from "@/constants/booking.constant";
import { BOOKING_RETRY_URL_KEY } from "@/constants/booking.constant";

// Loading Skeleton Component
function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:via-indigo-900/30 dark:to-black">
      {/* Banner Section Skeleton */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
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

      <div className="container px-4 mx-auto -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl p-6 mb-8 dark:bg-gray-800 dark:text-gray-100">
              {/* Image Gallery Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-[400px] w-full rounded-lg dark:bg-gray-700" />
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
                <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-800/50 dark:to-indigo-800/50 p-4">
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

// Helper functions
const formatPrice = (
  value: number,
  currency = "đ",
  locale = "vi-VN"
): string => {
  if (value === 0) return "Liên hệ";
  return `${value.toLocaleString(locale)}${currency}`;
};

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

// Calculate average rating from feedback
const calculateAverageRating = (feedbacks: any[] = []) => {
  if (!feedbacks || feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
  return (sum / feedbacks.length).toFixed(1);
};

// Get rating distribution
const getRatingDistribution = (feedbacks: any[] = []) => {
  if (!feedbacks || feedbacks.length === 0) {
    // Default distribution if no feedback
    return {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
  }

  const distribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  feedbacks.forEach((feedback) => {
    const rating = Math.min(Math.max(Math.round(feedback.rating), 1), 5);
    distribution[rating]++;
  });

  const total = feedbacks.length;
  return {
    5: Math.round((distribution[5] / total) * 100) || 0,
    4: Math.round((distribution[4] / total) * 100) || 0,
    3: Math.round((distribution[3] / total) * 100) || 0,
    2: Math.round((distribution[2] / total) * 100) || 0,
    1: Math.round((distribution[1] / total) * 100) || 0,
  };
};

// Format duration in minutes to readable format
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  } else if (minutes === 60) {
    return "1 giờ";
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
  } else {
    const days = Math.floor(minutes / 1440);
    return `${days} ngày`;
  }
};

export default function ServiceDetail() {
  const searchParams = useSearchParams();
  const livestreamId = searchParams.get("livestreamId");
  const booking = searchParams.get("booking");
  const t = useTranslations("serviceDetail");
  const { id } = useParams() as { id: string };
  const { data: serviceData, error, isLoading } = useGetServiceByIdQuery(id);
  const user = useSelector((state: RootState) => state?.auth?.user);
  const router = useRouter();

  // State
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState<() => void>(() => {});
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [activeTab, setActiveTab] = useState("procedure");

  // API hooks
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (livestreamId || booking) {
      setShowBookingFlow(true);
    }
    if (!booking) {
      localStorage.removeItem(BOOKING_DATA_STORAGE_KEY);
      localStorage.removeItem(BOOKING_DATA_TIMESTAMP_KEY);
      localStorage.removeItem(BOOKING_RETRY_URL_KEY);
    }
  }, [livestreamId, booking]);

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

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleChat = () => {
    if (!serviceData?.value?.branding?.id) return;

    const data: SendMessageBody = {
      entityId: serviceData.value.branding.id,
      content: `Tôi muốn hỏi về dịch vụ ${serviceData.value.name}`,
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: serviceData?.value?.name || "Dịch vụ thẩm mỹ",
          text: `Xem dịch vụ ${serviceData?.value?.name} tại ${serviceData?.value?.branding?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing", error);
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast or notification
    setShowShareOptions(false);
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

  // Calculate ratings
  const averageRating = calculateAverageRating(service.feedbacks);
  const ratingDistribution = getRatingDistribution(service.feedbacks);
  const reviewCount = service.feedbacks?.length || 0;

  return (
    <Suspense fallback={<ServiceDetailSkeleton />}>
      <div className="min-h-screen bg-gradient-to-b from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:via-indigo-900/30 dark:to-black">
        {/* Banner Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={
                allImages[0]?.url ||
                "https://placehold.co/1600x800.png" ||
                "/placeholder.svg"
              }
              alt={service.name}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/80" />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-blob" />
              <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>
          </div>

          <div className="relative z-10 container px-4 mx-auto">
            <motion.div
              className="max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-md text-white/80 mb-4">
                <Link
                  href="/"
                  className="hover:text-purple-600 dark:hover:text-indigo-300 transition-colors"
                >
                  {t("home")}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href="/services"
                  className="hover:text-purple-600 dark:hover:text-indigo-300 transition-colors"
                >
                  {t("services")}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-purple-600">{service.name}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {service.category && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-600/90 hover:bg-purple-700 text-white border-none"
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
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {service.name}
              </motion.h1>

              {/* Rating preview */}
              <motion.div
                className="flex items-center gap-2 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(Number(averageRating))
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-medium">{averageRating}</span>
                <span className="text-white/70">({reviewCount} đánh giá)</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="container px-4 mx-auto -mt-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Main Service Card */}
              <Card className="border-none shadow-xl overflow-hidden mb-8 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Image Gallery */}
                  <div className="mb-8">
                    <div
                      className="relative aspect-video rounded-lg overflow-hidden mb-4 group cursor-pointer"
                      onClick={() => setShowImageViewer(true)}
                    >
                      <Image
                        src={
                          allImages[selectedImage]?.url ||
                          "https://placehold.co/1200x800/rose/white?text=Beauty+Service" ||
                          "/placeholder.svg"
                        }
                        alt={`${service.name} - ${t("image")} ${
                          selectedImage + 1
                        }`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/40 border-none text-white hover:text-purple-600 dark:hover:text-indigo-300 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark();
                          }}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="h-5 w-5 fill-purple-600 text-purple-600" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/40 border-none text-white hover:text-purple-600 dark:hover:text-indigo-300 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                          }}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-black/50 text-white backdrop-blur-sm border-none">
                          <Eye className="h-3 w-3 mr-1" />
                          {t("clickToEnlarge")}
                        </Badge>
                      </div>
                    </div>
                    {allImages.length > 1 && (
                      <div className="flex gap-2 justify-center">
                        {allImages.map((image, index) => (
                          <button
                            key={image?.id || index}
                            className={`relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all ${
                              selectedImage === index
                                ? "border-purple-600 scale-105"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                            onClick={() => setSelectedImage(index)}
                          >
                            <Image
                              src={
                                image?.url ||
                                "https://placehold.co/600x400/rose/white?text=Beauty+Service" ||
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
                    <Card className="border border-purple-100 dark:border-indigo-800 bg-purple-50/50 dark:bg-indigo-900/20 hover:shadow-md transition-shadow dark:hover:bg-indigo-900/30">
                      <CardContent className="p-4 text-center">
                        <Clock className="h-6 w-6 text-purple-600 dark:text-purple-500 mx-auto mb-2" />
                        <h4 className="font-medium dark:text-white">
                          {t("duration")}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          1-2 {t("hours")}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-purple-100 dark:border-indigo-800 bg-purple-50/50 dark:bg-indigo-900/20 hover:shadow-md transition-shadow dark:hover:bg-indigo-900/30">
                      <CardContent className="p-4 text-center">
                        <CalendarPlus className="h-6 w-6 text-purple-600 dark:text-purple-500 mx-auto mb-2" />
                        <h4 className="font-medium dark:text-white">
                          {t("recovery")}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          1-2 {t("days")}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-purple-100 dark:border-indigo-800 bg-purple-50/50 dark:bg-indigo-900/20 hover:shadow-md transition-shadow dark:hover:bg-indigo-900/30">
                      <CardContent className="p-4 text-center">
                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-500 mx-auto mb-2" />
                        <h4 className="font-medium dark:text-white">
                          {t("experts")}
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          {uniqueDoctors.length} {t("specialists")}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-purple-100 dark:border-indigo-800 bg-purple-50/50 dark:bg-indigo-900/20 hover:shadow-md transition-shadow dark:hover:bg-indigo-900/30">
                      <CardContent className="p-4 text-center">
                        <Award className="h-6 w-6 text-purple-600 dark:text-purple-500 mx-auto mb-2" />
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
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white ">
                      {t("aboutService")}
                    </h2>
                    <div
                      className={`text-muted-foreground dark:text-gray-300 leading-relaxed relative ${
                        !expandedDescription && "max-h-[300px] overflow-hidden"
                      }`}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: service.description || "",
                        }}
                      />
                      {!expandedDescription && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-2 text-purple-700 dark:text-purple-500 hover:text-purple-700 dark:hover:text-indigo-300 hover:bg-purple-50 dark:hover:bg-indigo-900/20"
                      onClick={() =>
                        setExpandedDescription(!expandedDescription)
                      }
                    >
                      {expandedDescription ? (
                        <>
                          {t("showLess")}
                          <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          {t("readMore")}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 dark:border dark:border-gray-600">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-500">
                          {averageRating}
                        </div>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.floor(Number(averageRating))
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-gray-300 mt-1">
                          {reviewCount} {t("reviews")}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              5 {t("stars")}
                            </div>
                            <Progress
                              value={ratingDistribution[5]}
                              className="h-2"
                            />
                            <div className="text-sm w-8 dark:text-gray-200">
                              {ratingDistribution[5]}%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              4 {t("stars")}
                            </div>
                            <Progress
                              value={ratingDistribution[4]}
                              className="h-2"
                            />
                            <div className="text-sm w-8 dark:text-gray-200">
                              {ratingDistribution[4]}%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              3 {t("stars")}
                            </div>
                            <Progress
                              value={ratingDistribution[3]}
                              className="h-2"
                            />
                            <div className="text-sm w-8 dark:text-gray-200">
                              {ratingDistribution[3]}%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              2 {t("stars")}
                            </div>
                            <Progress
                              value={ratingDistribution[2]}
                              className="h-2"
                            />
                            <div className="text-sm w-8 dark:text-gray-200">
                              {ratingDistribution[2]}%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm w-12 dark:text-gray-200">
                              1 {t("star")}
                            </div>
                            <Progress
                              value={ratingDistribution[1]}
                              className="h-2"
                            />
                            <div className="text-sm w-8 dark:text-gray-200">
                              {ratingDistribution[1]}%
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
                <Tabs
                  defaultValue="procedure"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <CardHeader className="bg-gray-50 dark:bg-gray-700/70 p-0 border-b border-gray-200 dark:border-gray-600">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
                      <TabsTrigger
                        value="procedure"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                      >
                        {t("procedure")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="doctors"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                      >
                        {t("doctors")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="clinics"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                      >
                        {t("clinics")}
                      </TabsTrigger>
                      {/* <TabsTrigger
                        value="faq"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                      >
                        {t("faq")}
                      </TabsTrigger> */}
                      <TabsTrigger
                        value="reviews"
                        className="text-sm py-4 px-6 data-[state=active]:bg-white dark:text-gray-200 dark:data-[state=active]:text-white dark:data-[state=active]:bg-gray-800 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none"
                      >
                        {t("reviews")}
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>

                  {/* Procedure Tab */}
                  <TabsContent value="procedure" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl  font-semibold mb-4 text-gray-900 dark:text-white">
                          {t("implementationProcess")}
                        </h3>

                        {uniqueProcedures && uniqueProcedures.length > 0 ? (
                          <div className="space-y-8 relative">
                            <div className="absolute left-[22px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-purple-300 via-purple-600 to-purple-300 dark:from-indigo-700/70 dark:via-purple-600 dark:to-indigo-700/70"></div>
                            {uniqueProcedures.map((procedure, index) => (
                              <motion.div
                                key={procedure?.id || index}
                                className="relative pl-12"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                              >
                                <div className="absolute left-0 top-0 flex items-center justify-center w-11 h-11 rounded-full bg-purple-100 dark:bg-indigo-900/50 border-4 border-white dark:border-gray-800 text-purple-700 dark:text-purple-500 font-bold z-10">
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
                                          <Percent className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-500" />
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
                                                    ? "bg-purple-50 dark:bg-indigo-900/30 border border-purple-200 dark:border-indigo-800"
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
                                                      {formatDuration(
                                                        priceType.duration
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="text-right">
                                                  <span className="font-semibold text-purple-700 dark:text-purple-500">
                                                    {formatPrice(
                                                      priceType?.price || 0
                                                    )}
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
                              </motion.div>
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
                        <h3 className="text-2xl  font-semibold mb-6 text-gray-900 dark:text-white">
                          {t("expertTeam")}
                        </h3>

                        {uniqueDoctors && uniqueDoctors.length > 0 ? (
                          <div className="grid grid-cols-1 gap-8">
                            {uniqueDoctors.map((doctorService, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                              >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-none bg-white dark:bg-gray-700 dark:border dark:border-gray-600">
                                  <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                      <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                                        <Image
                                          src={
                                            doctorService.doctor
                                              .profilePictureUrl ||
                                            `https://placehold.co/400x500/rose/white?text=${
                                              getInitials(
                                                doctorService.doctor.fullName
                                              ) || "/placeholder.svg"
                                            }`
                                          }
                                          alt={doctorService.doctor.fullName}
                                          fill
                                          className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:hidden"></div>
                                        <div className="absolute top-3 left-3">
                                          <Badge className="bg-purple-600 text-white border-none">
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
                                                <BadgeCheck className="h-5 w-5 text-purple-600 dark:text-purple-500 ml-1" />
                                              </h4>
                                              <div className="text-muted-foreground dark:text-gray-300 mb-4 flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4 text-purple-600 dark:text-purple-500" />
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
                                              <Mail className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-500" />
                                              {t("contactInfo")}
                                            </h5>
                                            <div className="space-y-2">
                                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-600/50 p-2 rounded-md dark:border dark:border-gray-600">
                                                <Mail className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                                                <span className="truncate dark:text-white">
                                                  {doctorService.doctor.email}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-600/50 p-2 rounded-md dark:border dark:border-gray-600">
                                                <Phone className="h-4 w-4 text-purple-600 dark:text-purple-500" />
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
                                              <Briefcase className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-500" />
                                              {t("expertise")}
                                            </h5>
                                            <div className="flex flex-wrap gap-1">
                                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-indigo-900/40 dark:text-purple-500 dark:hover:bg-indigo-900/60 border-none">
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
                                          doctorService.doctor
                                            .doctorCertificates.length > 0 && (
                                            <div className="mb-4">
                                              <h5 className="font-medium text-sm uppercase tracking-wider text-muted-foreground dark:text-gray-300 mb-3 flex items-center">
                                                <GraduationCap className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-500" />
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
                                                                  "/placeholder.svg" ||
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
                              </motion.div>
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
                        <h3 className="text-2xl  font-semibold mb-6 text-gray-900 dark:text-white">
                          {t("ourLocations")}
                        </h3>

                        {service.clinics && service.clinics.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {service.clinics.map((clinic, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                              >
                                <Card
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
                                            clinic.name || "Clinic"
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
                                        <Badge className="bg-white text-purple-700 hover:bg-gray-100">
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
                                          <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                                          <span className="dark:text-gray-300">
                                            {clinic.address ||
                                              t("contactForAddress")}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                                          <span className="dark:text-gray-300">
                                            {clinic.phoneNumber}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                                          <span className="dark:text-gray-300">
                                            {clinic.email}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Globe className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                                          <span className="dark:text-gray-300">
                                            {t("openingHours")}: 8:00 - 20:00
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between mt-4">
                                        {/* <Button
                                          variant="ghost"
                                          className="p-0 h-auto text-purple-700 hover:text-purple-700 hover:bg-transparent dark:text-purple-500 dark:hover:text-indigo-300"
                                        >
                                          {t("getDirections")}{" "}
                                          <ArrowRight className="h-4 w-4 ml-1" />
                                        </Button> */}
                                        {clinic.isActivated !== false ? (
                                          <Button
                                            variant="secondary"
                                            onClick={handleBookNow}
                                          >
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
                              </motion.div>
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
                  {/* <TabsContent value="faq" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-2xl  font-semibold mb-6 text-gray-900 dark:text-white">
                          {t("frequentlyAskedQuestions")}
                        </h3>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem
                            value="item-1"
                            className="border-b border-gray-200 dark:border-gray-600"
                          >
                            <AccordionTrigger className="text-left hover:text-purple-600 dark:hover:text-indigo-300 dark:text-white">
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
                            <AccordionTrigger className="text-left hover:text-purple-600 dark:hover:text-indigo-300 dark:text-white">
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
                            <AccordionTrigger className="text-left hover:text-purple-600 dark:hover:text-indigo-300 dark:text-white">
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
                            <AccordionTrigger className="text-left hover:text-purple-600 dark:hover:text-indigo-300 dark:text-white">
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
                            <AccordionTrigger className="text-left hover:text-purple-600 dark:hover:text-indigo-300 dark:text-white">
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
                  </TabsContent> */}

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="m-0">
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl  font-semibold text-gray-900 dark:text-white">
                            {t("customerReviews")}
                          </h3>
                          {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            {t("writeReview")}
                          </Button> */}
                        </div>

                        <div className="space-y-6">
                          {service.feedbacks && service.feedbacks.length > 0 ? (
                            service.feedbacks.map((feedback, i) => (
                              <motion.div
                                key={feedback.feedbackId || i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                              >
                                <Card className="bg-gray-50/50 dark:bg-gray-700/50 border-none hover:shadow-md transition-shadow dark:border dark:border-gray-600">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                      <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-indigo-800">
                                        <AvatarImage
                                          src={
                                            feedback.user?.avatar ||
                                            `https://placehold.co/100/rose/white?text=${getInitials(
                                              feedback.user?.fullName || "User"
                                            )}`
                                          }
                                        />
                                        <AvatarFallback className="bg-purple-100 dark:bg-indigo-900/50 text-purple-700 dark:text-purple-500">
                                          {getInitials(
                                            feedback.user?.fullName || "User"
                                          )}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                              {feedback.user?.fullName ||
                                                t("anonymousUser")}
                                            </h4>
                                            <div className="flex text-amber-400 my-1">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                  key={star}
                                                  className={`h-4 w-4 ${
                                                    star <= feedback.rating
                                                      ? "fill-current"
                                                      : ""
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                          <div className="text-sm text-muted-foreground dark:text-gray-300">
                                            {new Date(
                                              feedback.createdAt || Date.now()
                                            ).toLocaleDateString()}
                                          </div>
                                        </div>
                                        <p className="text-muted-foreground dark:text-gray-300 mt-2">
                                          {feedback.content ||
                                            t("noContentProvided")}
                                        </p>

                                        {/* Feedback images */}
                                        {feedback.images &&
                                          feedback.images.length > 0 && (
                                            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                                              {feedback.images.map(
                                                (imgUrl, imgIndex) => (
                                                  <div
                                                    key={imgIndex}
                                                    className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
                                                    onClick={() => {
                                                      // Handle image preview
                                                    }}
                                                  >
                                                    <Image
                                                      src={
                                                        imgUrl ||
                                                        "/placeholder.svg"
                                                      }
                                                      alt={`Review image ${
                                                        imgIndex + 1
                                                      }`}
                                                      fill
                                                      className="object-cover"
                                                    />
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center p-8">
                              <div className="bg-gray-100 dark:bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                              </div>
                              <h4 className="text-xl font-medium mb-2 dark:text-white">
                                {t("noReviewsYet")}
                              </h4>
                              <p className="text-muted-foreground dark:text-gray-300 mb-6">
                                {t("beFirstToReview")}
                              </p>
                              {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                {t("writeReview")}
                              </Button> */}
                            </div>
                          )}
                        </div>

                        {service.feedbacks && service.feedbacks.length > 3 && (
                          <div className="text-center mt-6">
                            <Button
                              variant="outline"
                              className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                            >
                              {t("loadMoreReviews")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mb-8">
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Price Card */}
                <Card className="border-none overflow-hidden shadow-xl bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-800/50 dark:to-indigo-800/50 p-4 dark:border-b dark:border-gray-700">
                    <h3 className=" text-lg font-semibold flex items-center">
                      <Percent className="h-5 w-5 text-purple-600 dark:text-purple-500 mr-2" />
                      {t("pricingPlans")}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-500 mb-1 flex items-center">
                        {hasDiscount ? (
                          <>
                            {service.discountMinPrice.toLocaleString("vi-VN")}đ{" "}
                            - {service.discountMaxPrice.toLocaleString("vi-VN")}
                            đ
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
                      {service.isRefundable && (
                        <div className="flex items-start gap-2">
                          <ShieldCheck className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                          <span className="dark:text-gray-200">
                            {t("refundable")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        size="lg"
                        onClick={handleBookNow}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {t("bookNow")}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-purple-200 dark:border-indigo-800 text-purple-700 dark:text-purple-500 hover:bg-purple-50 dark:hover:bg-indigo-900/20"
                        onClick={handleChatNow}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t("chatWithUs")}
                      </Button>
                    </div>

                    <Separator className="my-6 dark:bg-gray-600" />

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground dark:text-gray-300 mb-2">
                        {t("instantSupport")}
                      </div>
                      <div className="font-semibold text-lg flex items-center justify-center gap-2">
                        <Phone className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                        {service.branding?.phoneNumber ||
                          (service.clinics && service.clinics.length > 0
                            ? service.clinics[0].phoneNumber
                            : "1800-BEAUTIFY")}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-gray-300 mt-1">
                        {t("businessHours")}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Beauty Center Card */}
                <Card className="border-none overflow-hidden shadow-xl mb-5 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800/50 dark:to-purple-800/50 p-4 dark:border-b dark:border-gray-700">
                    <h3 className=" text-lg font-semibold flex items-center">
                      <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      {t("beautyCenter")}
                    </h3>
                  </CardHeader>
                  <div className="relative h-40 w-full">
                    <Image
                      alt={service.branding.name}
                      src={
                        service.branding.profilePictureUrl ||
                        `https://placehold.co/500x300/blue/white?text=${getInitials(
                          service.branding.name
                        )}`
                      }
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-white/80 backdrop-blur-sm text-blue-600 border-none">
                        <BadgeCheck className="h-3 w-3 mr-1" />
                        {t("verified")}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      {service.branding.name}
                    </h4>
                    <div className="space-y-3 mb-4">
                      {service.branding.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground dark:text-gray-300">
                            {service.branding.address}
                          </span>
                        </div>
                      )}
                      {service.branding.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                          <span className="text-muted-foreground dark:text-gray-300">
                            {service.branding.phoneNumber}
                          </span>
                        </div>
                      )}
                      {service.branding.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                          <span className="text-muted-foreground dark:text-gray-300">
                            {service.branding.email}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                        onClick={() => {
                          router.push(`/clinic-view/${service.branding.id}`);
                        }}
                      >
                        {t("viewProfile")}
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-700 dark:text-purple-500 hover:text-purple-700 dark:hover:text-indigo-300 hover:bg-purple-50 dark:hover:bg-indigo-900/20"
                        onClick={handleChatNow}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {t("chat")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Info */}
                {service.category && (
                  <Card className="border-none overflow-hidden shadow-xl bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-800/50 dark:to-teal-800/50 p-4 dark:border-b dark:border-gray-700">
                      <h3 className=" text-lg font-semibold flex items-center">
                        <Zap className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
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
                      {/* <Button
                        variant="outline"
                        className="w-full dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                        asChild
                      >
                        <Link
                          href={`/services?category=${service.category.id}`}
                        >
                          {t("viewAllInCategory")}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button> */}
                    </CardContent>
                  </Card>
                )}

                {/* Related Services Card
                <Card className="border-none overflow-hidden shadow-xl mb-5 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-800/50 dark:to-yellow-800/50 p-4 dark:border-b dark:border-gray-700">
                    <h3 className=" text-lg font-semibold flex items-center">
                      <ThumbsUp className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                      {t("relatedServices")}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={`https://placehold.co/300x300/rose/white?text=${i}`}
                              alt={`Related service ${i}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-indigo-300 transition-colors">
                              {t(`relatedService${i}Title`)}
                            </h4>
                            <p className="text-xs text-muted-foreground dark:text-gray-300 line-clamp-2 mt-1">
                              {t(`relatedService${i}Description`)}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-medium text-purple-700 dark:text-purple-500">
                                {(800000 * i).toLocaleString("vi-VN")}đ
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-purple-700 dark:text-purple-500 hover:text-purple-700 dark:hover:text-indigo-300 hover:bg-purple-50 dark:hover:bg-indigo-900/20"
                              >
                                {t("view")}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </div>
        </div>

        {/* Image Viewer Modal */}
        <Dialog open={showImageViewer} onOpenChange={setShowImageViewer}>
          <DialogContent className="max-w-4xl p-0 bg-black/95 border-gray-800">
            <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-white">{service.name}</DialogTitle>
                <DialogClose className="text-white hover:text-purple-700 dark:hover:text-indigo-300">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="relative h-[80vh] w-full">
              <Image
                src={
                  allImages[selectedImage]?.url ||
                  "https://placehold.co/1200x800/rose/white?text=Beauty+Service" ||
                  "/placeholder.svg"
                }
                alt={`${service.name} - ${t("image")} ${selectedImage + 1}`}
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <ScrollArea className="w-full h-20">
                <div className="flex gap-2">
                  {allImages.map((image, index) => (
                    <button
                      key={image?.id || index}
                      className={`relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-purple-600 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={
                          image?.url ||
                          "https://placehold.co/600x400/rose/white?text=Beauty+Service" ||
                          "/placeholder.svg"
                        }
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Options Dialog */}
        <Dialog open={showShareOptions} onOpenChange={setShowShareOptions}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("shareService")}</DialogTitle>
              <DialogDescription>
                {t("shareServiceDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4 py-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 gap-2"
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  );
                  setShowShareOptions(false);
                }}
              >
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
                  className="text-blue-600"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 gap-2"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `${service.name} - ${window.location.href}`
                    )}`,
                    "_blank"
                  );
                  setShowShareOptions(false);
                }}
              >
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
                  className="text-blue-400"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 gap-2"
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      `${service.name} - ${window.location.href}`
                    )}`,
                    "_blank"
                  );
                  setShowShareOptions(false);
                }}
              >
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
                  className="text-green-500"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 gap-2"
                onClick={copyToClipboard}
              >
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
                  className="text-gray-600 dark:text-gray-300"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span className="text-xs">{t("copyLink")}</span>
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button variant="secondary">{t("close")}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Booking Flow Modal */}
        {showBookingFlow && user && (
          <BookingFlow
            service={service}
            onClose={handleCloseBookingFlow}
            userData={user}
            liveStreamRoomId={livestreamId || null}
          />
        )}

        {/* Login Modal */}
        <ModalConfirmLogin
          isOpen={showLoginModal}
          onCancel={() => setShowLoginModal(false)}
          onConfirm={handleConfirmLogin}
        />
      </div>
    </Suspense>
  );
}
