"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Users,
  Calendar,
  ChevronLeft,
  Share2,
  Bookmark,
  Check,
  ArrowRight,
  CalendarClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClinicByIdQuery } from "@/features/clinic/api";
import { useGetAllServicesQuery } from "@/features/services/api";

export default function ClinicDetailPage() {
  const t = useTranslations("clinicDetail");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");

  const { data: clinic, isLoading, error } = useGetClinicByIdQuery(id);

  // Fetch clinic services
  const { data: servicesData } = useGetAllServicesQuery({
    pageIndex: 1,
    pageSize: 4,
  });

  const services = servicesData?.value?.items || [];

  if (isLoading) {
    return <ClinicDetailSkeleton />;
  }

  if (error || !clinic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-3">
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
                className="text-red-600 dark:text-red-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
              {t("clinicNotFound") || "Clinic Not Found"}
            </h2>
            <p className="text-muted-foreground">
              {t("clinicNotFoundDesc") ||
                "The clinic you're looking for doesn't exist or has been removed."}
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => router.push("/clinics")}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("backToClinics") || "Back to Clinics"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero section with clinic header image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full bg-gray-200 dark:bg-gray-800">
        <Image
          src={
            clinic.profilePictureUrl || `/placeholder.svg?height=600&width=1200`
          }
          alt={clinic.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">
                {clinic.name}
              </h1>
              <div className="flex items-center gap-4 text-white/90 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{clinic.address}</span>
                </div>
                <div className="flex items-center text-yellow-400 text-sm">
                  <Star className="h-4 w-4 fill-current mr-1" />
                  <span>{clinic.rating || "4.8"}</span>
                  <span className="text-white/80 ml-1">
                    ({clinic.reviewCount || "42"} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t("share") || "Share"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {t("save") || "Save"}
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <CalendarClock className="h-4 w-4 mr-2" />
                {t("bookAppointment") || "Book Appointment"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => router.push("/clinics")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("backToClinics") || "Back to Clinics"}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">
                {t("contactInfo") || "Contact Information"}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("phone") || "Phone"}
                    </div>
                    <div className="font-medium">{clinic.phoneNumber}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("email") || "Email"}
                    </div>
                    <div className="font-medium">{clinic.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("address") || "Address"}
                    </div>
                    <div className="font-medium">{clinic.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("workingHours") || "Working Hours"}
                    </div>
                    <div className="font-medium">
                      {clinic.workingHours || "Mon-Fri: 9AM-7PM, Sat: 10AM-4PM"}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6">
                {t("contactClinic") || "Contact Clinic"}
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">
                {t("highlights") || "Highlights"}
              </h3>
              <ul className="space-y-2">
                {[
                  t("equipmentHighlight") || "Modern equipment",
                  t("staffHighlight") || "Professional staff",
                  t("cleanHighlight") || "Clean environment",
                  t("appointmentHighlight") || "Easy appointment booking",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start mb-6 bg-transparent space-x-4 border-b rounded-none h-auto p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                >
                  {t("overview") || "Overview"}
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                >
                  {t("services") || "Services"}
                </TabsTrigger>
                <TabsTrigger
                  value="doctors"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                >
                  {t("doctors") || "Doctors"}
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                >
                  {t("reviews") || "Reviews"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("aboutClinic") || "About the Clinic"}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {clinic.description ||
                      "This premier beauty clinic offers a wide range of services designed to enhance your natural beauty and boost your confidence. Our team of skilled professionals uses state-of-the-art equipment and proven techniques to deliver exceptional results. From facial treatments to body contouring, we provide personalized care tailored to your specific needs and goals. Our clinic maintains the highest standards of hygiene and safety to ensure a comfortable and secure environment for all our clients."}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">
                        {clinic.doctors || "8"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("specialists") || "Specialists"}
                      </div>
                    </div>

                    <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">
                        {clinic.services || "12"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("services") || "Services"}
                      </div>
                    </div>

                    <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">
                        {clinic.rating || "4.8"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("rating") || "Rating"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      {t("featuredServices") || "Featured Services"}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("services")}
                      className="text-primary hover:text-primary-foreground hover:bg-primary"
                    >
                      {t("viewAll") || "View All"}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.slice(0, 4).map((service) => (
                      <div
                        key={service.id}
                        className="border border-muted/30 rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => router.push(`/services/${service.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {service.description ||
                                service.category.description ||
                                "No description available."}
                            </p>
                          </div>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                            ${service.minPrice}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    {t("clinicServices") || "Clinic Services"}
                  </h2>

                  {/* Service list would go here */}
                  <p className="text-muted-foreground mb-4">
                    {t("servicesPlaceholder") ||
                      "A complete list of services offered by this clinic will be displayed here."}
                  </p>

                  <Button className="mt-4">
                    {t("bookAppointment") || "Book an Appointment"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="doctors">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    {t("clinicDoctors") || "Our Specialists"}
                  </h2>

                  {/* Doctors list would go here */}
                  <p className="text-muted-foreground mb-4">
                    {t("doctorsPlaceholder") ||
                      "Information about the medical staff at this clinic will be displayed here."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    {t("clientReviews") || "Client Reviews"}
                  </h2>

                  {/* Reviews would go here */}
                  <p className="text-muted-foreground mb-4">
                    {t("reviewsPlaceholder") ||
                      "Client reviews and ratings for this clinic will be displayed here."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative h-64 md:h-80 lg:h-96 w-full bg-gray-300 dark:bg-gray-800">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-60 w-full rounded-lg" />
          </div>

          <div className="lg:col-span-2">
            <Skeleton className="h-12 w-full mb-6" />
            <Skeleton className="h-96 w-full rounded-lg mb-6" />
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
