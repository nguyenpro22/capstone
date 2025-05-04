"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { format } from "date-fns";
import {
  MapPin,
  Phone,
  Mail,
  Building,
  ArrowLeft,
  Share2,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetClinicByIdV2Query } from "@/features/clinic/api";
import {
  useGetFollowStatusQuery,
  useFollowClinicMutation,
} from "@/features/follows/api";
import { toast } from "react-toastify";

export default function ClinicDetailPage() {
  const t = useTranslations("clinicViewDetail");
  const params = useParams();
  const router = useRouter();
  const clinicId = params.id as string;

  const {
    data: clinicData,
    isLoading,
    error,
  } = useGetClinicByIdV2Query(clinicId);
  const { data: followData, refetch: refetchFollowStatus } =
    useGetFollowStatusQuery(clinicId);
  const [followClinic] = useFollowClinicMutation();

  const clinic = clinicData?.value;
  const isFollowed = followData?.value?.isFollowed ?? false;
  const totalFollowers = followData?.value?.totalFollowers ?? 0;

  const [activeTab, setActiveTab] = useState("overview");

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: clinic?.name,
        text: `Check out ${clinic?.name} on our platform!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You would typically show a toast notification here
      alert("Link copied to clipboard!");
    }
  };

  const handleFollow = async () => {
    try {
      await followClinic({ clinicId, isFollow: !isFollowed }).unwrap();
      // Refetch follow status after successful toggle
      await refetchFollowStatus();
      toast.success(
        isFollowed
          ? t("unfollowSuccess") || "Unfollowed successfully"
          : t("followSuccess") || "Followed successfully",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      console.error("Failed to follow clinic:", error);
      toast.error(
        isFollowed
          ? t("unfollowError") || "Failed to unfollow clinic"
          : t("followError") || "Failed to follow clinic",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  if (isLoading) {
    return <ClinicDetailSkeleton />;
  }

  if (error || !clinic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={handleBack} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToList") || "Back to clinics"}
        </Button>

        <div className="text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
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
            <h3 className="text-xl font-medium text-red-600 dark:text-red-400">
              {t("clinicNotFound") || "Clinic not found"}
            </h3>
            <p className="text-red-600/70 dark:text-red-400/70">
              {t("clinicNotFoundDesc") ||
                "The clinic you're looking for doesn't exist or has been removed."}
            </p>
            <Button variant="outline" className="mt-2" onClick={handleBack}>
              {t("backToList") || "Back to clinics"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={handleBack} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToList") || "Back to clinics"}
        </Button>

        {/* Hero Section */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={
              clinic.profilePictureUrl || `https://placehold.co/1600x800.png`
            }
            alt={clinic.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {clinic.name}
                  </h1>
                  {clinic.isActivated ? (
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                      {t("active") || "Active"}
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                      {t("pendingActivation") || "Pending Activation"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm md:text-base">{clinic.fullAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t("share") || "Share"}
                </Button>

                <Button
                  variant={isFollowed ? "default" : "outline"}
                  size="sm"
                  className={`
        relative group transition-all duration-300 
        ${
          isFollowed
            ? "bg-rose-600 hover:bg-rose-700 text-white border-transparent"
            : "bg-black/10 hover:bg-black/20 backdrop-blur-sm text-white border border-white/30"
        }
        rounded-full px-4 py-1 h-auto
      `}
                  onClick={handleFollow}
                >
                  <Heart
                    className={`
          h-4 w-4 mr-2 transition-all duration-300
          ${
            isFollowed
              ? "fill-white stroke-white"
              : "fill-transparent stroke-white group-hover:scale-110"
          }
        `}
                  />
                  <span className="font-medium">
                    {isFollowed ? t("unfollow") : t("follow")}
                  </span>
                  <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full">
                    {totalFollowers.toLocaleString()}
                  </span>
                </Button>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() =>
                    (window.location.href = `tel:${clinic.phoneNumber}`)
                  }
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t("call") || "Call"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
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
                  value="branches"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                >
                  {t("branches") || "Branches"} ({clinic.totalBranches})
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2"
                >
                  {t("documents") || "Documents"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("basicInfo") || "Basic Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {t("email") || "Email"}
                          </p>
                          <a
                            href={`mailto:${clinic.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {clinic.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {t("phone") || "Phone"}
                          </p>
                          <a
                            href={`tel:${clinic.phoneNumber}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {clinic.phoneNumber}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {t("branches") || "Branches"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.totalBranches}{" "}
                            {clinic.totalBranches === 1
                              ? t("branch") || "branch"
                              : t("branches") || "branches"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {t("taxCode") || "Tax Code"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.taxCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {t("bankInfo") || "Bank Information"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.bankName} - {clinic.bankAccountNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        {clinic.isActivated ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {t("status") || "Status"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.isActivated
                              ? t("activeStatus") || "Active and operational"
                              : t("pendingStatus") || "Pending activation"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("addressInfo") || "Address Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {t("fullAddress") || "Full Address"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {clinic.fullAddress}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div>
                        <p className="text-sm font-medium">
                          {t("city") || "City"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {clinic.city}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {t("district") || "District"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {clinic.district || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {t("ward") || "Ward"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {clinic.ward || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (clinic.fullAddress) {
                            window.open(
                              `https://maps.google.com/?q=${encodeURIComponent(
                                clinic.fullAddress
                              )}`,
                              "_blank"
                            );
                          } else {
                            alert("Address not available");
                          }
                        }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {t("viewOnMap") || "View on Map"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branches">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("branchesList") || "Branches List"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(clinic.branches && clinic?.branches?.items?.length) ??
                    0 > 0 ? (
                      <div className="space-y-4">
                        {clinic?.branches?.items?.map((branch) => (
                          <Card key={branch.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="relative h-40 md:h-auto md:w-48 bg-muted">
                                {branch.profilePictureUrl ? (
                                  <Image
                                    src={
                                      branch.profilePictureUrl ||
                                      "/placeholder.svg"
                                    }
                                    alt={branch.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <Building className="h-12 w-12 text-muted-foreground/50" />
                                  </div>
                                )}
                              </div>

                              <div className="p-4 flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">
                                      {branch.name}
                                    </h3>
                                    {branch.isActivated ? (
                                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                        {t("active") || "Active"}
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                        {t("pending") || "Pending"}
                                      </Badge>
                                    )}
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/clinic-view/${branch.id}`)
                                    }
                                  >
                                    {t("viewDetails") || "View Details"}
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground truncate">
                                      {branch.fullAddress}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {branch.phoneNumber}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {branch.email}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {clinic?.branches?.hasNextPage && (
                          <div className="text-center mt-4">
                            <Button variant="outline">
                              {t("loadMore") || "Load More Branches"}
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="rounded-full bg-muted/50 p-3">
                            <Building className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-medium">
                            {t("noBranches") || "No branches available"}
                          </h3>
                          <p className="text-muted-foreground">
                            {t("noBranchesDesc") ||
                              "This clinic hasn't added any branches yet."}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("legalDocuments") || "Legal Documents"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-muted/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">
                              {t("businessLicense") || "Business License"}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(clinic.businessLicenseUrl, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {t("view") || "View"}
                            </Button>
                          </div>

                          <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                            <Image
                              src={
                                clinic.businessLicenseUrl || "/placeholder.svg"
                              }
                              alt="Business License"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">
                              {t("operatingLicense") || "Operating License"}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  clinic.operatingLicenseUrl,
                                  "_blank"
                                )
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {t("view") || "View"}
                            </Button>
                          </div>

                          <div className="relative h-40 bg-muted rounded-md overflow-hidden">
                            <Image
                              src={
                                clinic.operatingLicenseUrl || "/placeholder.svg"
                              }
                              alt="Operating License"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {clinic.operatingLicenseExpiryDate && (
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                        <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            {t("licenseExpiry") ||
                              "Operating License Expiry Date"}
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            {format(
                              new Date(clinic.operatingLicenseExpiryDate),
                              "MMMM d, yyyy"
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  {t("contactInfo") || "Contact Information"}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("phone") || "Phone"}
                      </p>
                      <a
                        href={`tel:${clinic.phoneNumber}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {clinic.phoneNumber}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("email") || "Email"}
                      </p>
                      <a
                        href={`mailto:${clinic.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {clinic.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("address") || "Address"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {clinic.fullAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-muted/30">
                  <Button
                    className="w-full"
                    onClick={() =>
                      (window.location.href = `tel:${clinic.phoneNumber}`)
                    }
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {t("callClinic") || "Call Clinic"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() =>
                      (window.location.href = `mailto:${clinic.email}`)
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {t("emailClinic") || "Email Clinic"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => {
                      if (clinic.fullAddress) {
                        window.open(
                          `https://maps.google.com/?q=${encodeURIComponent(
                            clinic.fullAddress
                          )}`,
                          "_blank"
                        );
                      } else {
                        alert("Address not available");
                      }
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {t("viewOnMap") || "View on Map"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  {t("clinicStatus") || "Clinic Status"}
                </h3>

                <div
                  className={`p-4 rounded-lg ${
                    clinic.isActivated
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30"
                      : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {clinic.isActivated ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          clinic.isActivated
                            ? "text-green-800 dark:text-green-300"
                            : "text-yellow-800 dark:text-yellow-300"
                        }`}
                      >
                        {clinic.isActivated
                          ? t("activeClinic") || "Active Clinic"
                          : t("pendingClinic") || "Pending Activation"}
                      </p>
                      <p
                        className={`text-sm ${
                          clinic.isActivated
                            ? "text-green-700 dark:text-green-400"
                            : "text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {clinic.isActivated
                          ? t("activeDesc") ||
                            "This clinic is verified and operational."
                          : t("pendingDesc") ||
                            "This clinic is awaiting verification and activation."}
                      </p>
                    </div>
                  </div>
                </div>

                {!clinic.isActivated && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    {t("pendingNote") ||
                      "Once verified by our team, this clinic will be fully operational on our platform."}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function ClinicDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-32 mb-8" />

      {/* Hero Section Skeleton */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2">
          <div className="border-b border-muted/30 mb-6">
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <Skeleton className="h-64 w-full mb-6 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Sidebar Skeleton */}
        <div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-muted/30">
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-24 w-full mb-4 rounded-lg" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
