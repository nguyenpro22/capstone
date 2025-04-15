"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Clock,
  Check,
  X,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Zap,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { useGetPackagesQuery } from "@/features/package/api";
import { useCreatePaymentMutation } from "@/features/payment/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import type { Package } from "@/features/package/types";
import Pagination from "@/components/common/Pagination/Pagination";
import { useRouter } from "next/navigation";
import PaymentService from "@/hooks/usePaymentStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations } from "next-intl";
import {
  getAccessToken,
  GetDataByToken,
  getRefreshToken,
  type TokenData,
} from "@/utils";
import { useRefreshTokenMutation } from "@/features/auth/api";
import { setAccessToken, setRefreshToken } from "@/utils";
import { useGetPackagesByIdQuery } from "@/features/package/api";
import { useCreateSubscriptionOverPaymentMutation } from "@/features/payment/api";

export default function SubscriptionManagement() {
  const t = useTranslations("buyPackage");
  const { theme } = useTheme();
  // Get the token and extract clinicId
  const token = getAccessToken();
  // Add null check for token
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const subscriptionPackageId = tokenData?.subscriptionPackageId || "";

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay
  const [pageIndex, setPageIndex] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed" | "price-changed"
  >("pending");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const pageSize = 6;
  const [showPaymentResult, setShowPaymentResult] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number | null;
    timestamp: string | null;
    message: string | null;
  }>({
    amount: null,
    timestamp: null,
    message: null,
  });
  // Replace the single loading state with a map of loading states per package ID
  const [loadingPackages, setLoadingPackages] = useState<
    Record<string, boolean>
  >({});
  // Add new state variables inside the PackageList component
  const [activeTab, setActiveTab] = useState("packages"); // "packages" or "addons"
  const [additionBranch, setAdditionBranch] = useState(0);
  const [additionLiveStream, setAdditionLiveStream] = useState(0);
  const [currentPackage, setCurrentPackage] = useState<any>(null);
  const [addonQrUrl, setAddonQrUrl] = useState<string | null>(null);
  const [addonTransactionId, setAddonTransactionId] = useState<string | null>(
    null
  );
  const [loadingAddons, setLoadingAddons] = useState(false);

  const { data, isLoading, error } = useGetPackagesQuery({
    pageIndex,
    pageSize,
    searchTerm: debouncedSearchTerm,
  });

  const [createPayment] = useCreatePaymentMutation();
  // Inside the component, add the refreshToken mutation hook
  const [refreshToken] = useRefreshTokenMutation();
  // Add the mutation for subscription over payment
  const [createSubscriptionOverPayment] =
    useCreateSubscriptionOverPaymentMutation();
  const router = useRouter();

  // Add the query to get current package details
  const { data: packageData, isLoading: isLoadingPackage } =
    useGetPackagesByIdQuery(subscriptionPackageId, {
      skip: !subscriptionPackageId,
    });

  // Add useEffect to set current package when data is loaded
  useEffect(() => {
    if (packageData?.value) {
      setCurrentPackage(packageData.value);
    }
  }, [packageData]);

  // Add function to calculate total addon price
  const calculateAddonPrice = () => {
    if (!currentPackage) return 0;
    const branchPrice =
      additionBranch * (currentPackage.priceBranchAddition || 0);
    const livestreamPrice =
      additionLiveStream * (currentPackage.priceLiveStreamAddition || 0);
    return branchPrice + livestreamPrice;
  };

  // Add function to handle addon purchase
  const handleAddonPurchase = async () => {
    if (!currentPackage || (additionBranch === 0 && additionLiveStream === 0)) {
      toast.error(t("pleaseSelectAddons"));
      return;
    }

    try {
      setLoadingAddons(true);
      setPaymentStatus("pending");

      const result = await createSubscriptionOverPayment({
        subscriptionId: currentPackage.id,
        currentAmount: calculateAddonPrice(),
        additionBranch,
        additionLiveStream,
      }).unwrap();

      if (result.isSuccess && result.value.qrUrl) {
        setAddonQrUrl(result.value.qrUrl);
        if (result.value.transactionId) {
          setAddonTransactionId(result.value.transactionId);
        }
        setShowQR(true);
      } else {
        toast.error(t("failedToGenerateQr"));
      }
    } catch (error: any) {
      console.error("Addon payment error:", error);

      if (error.data) {
        const errorData = error.data;
        if (
          errorData.status === 400 &&
          errorData.detail === "Clinic is not activated"
        ) {
          toast.error(t("clinicNotActivated"));
        } else if (errorData.title) {
          toast.error(`${errorData.title}: ${errorData.detail || ""}`);
        } else {
          toast.error(errorData.detail || t("failedToInitiatePayment"));
        }
      } else {
        toast.error(t("failedToInitiatePayment"));
      }
    } finally {
      setLoadingAddons(false);
    }
  };

  useEffect(() => {
    if (!transactionId) return;

    const hasNotified = false; // Add this flag to prevent multiple notifications

    const setupConnection = async () => {
      try {
        await PaymentService.startConnection();
        await PaymentService.joinPaymentSession(transactionId);

        // Set up the payment status listener
        PaymentService.onPaymentStatusReceived(
          async (
            status: boolean,
            details?: {
              amount?: number;
              timestamp?: string;
              message?: string;
            }
          ) => {
            setPaymentStatus(status ? "success" : "failed");

            // Store payment details if available
            if (details) {
              setPaymentDetails({
                amount: details.amount || null,
                timestamp: details.timestamp || new Date().toISOString(),
                message: details.message || null,
              });
            }

            // If payment is successful, activate the package
            if (status) {
              toast.success(t("paymentSuccessful"));
              // Close the QR dialog and show payment result
              setShowQR(false);
              setShowPaymentResult(true);

              // Add refreshToken call here
              const accessToken = getAccessToken() as string;
              const refreshTokenValue = getRefreshToken() as string;

              if (accessToken && refreshTokenValue) {
                try {
                  const result = await refreshToken({
                    accessToken,
                    refreshToken: refreshTokenValue,
                  }).unwrap();

                  if (result.isSuccess) {
                    // Save the new tokens
                    setAccessToken(result.value.accessToken);
                    setRefreshToken(result.value.refreshToken);
                    console.log("Tokens refreshed successfully after payment");
                  }
                } catch (error) {
                  console.error(
                    "Failed to refresh tokens after payment:",
                    error
                  );
                }
              }

              // Refresh the page after a delay to show updated package status
              setTimeout(() => {
                router.push("/clinicManager/dashboard");
              }, 5000);
            } else {
              toast.error(
                details?.message || "Payment failed. Please try again."
              );
              // Show payment result with failure details
              setShowQR(false);
              setShowPaymentResult(true);
            }
          }
        );

        // Set up the subscription price changed listener
        PaymentService.onSubscriptionPriceChanged((isValid: boolean) => {
          if (!isValid) {
            toast.error(
              "The subscription price has changed. Please initiate a new payment."
            );
            setShowQR(false);
            setPaymentStatus("price-changed");
            setShowPaymentResult(true);

            // Optionally redirect after showing the message
            setTimeout(() => {
              router.push("/clinicManager/subscriptions");
            }, 5000);
          }
        });
      } catch (error) {
        console.error("Failed to set up SignalR connection:", error);
        toast.error("Failed to connect to payment service");
      }
    };

    setupConnection();

    // Clean up the connection when component unmounts
    return () => {
      if (transactionId) {
        PaymentService.leavePaymentSession(transactionId);
      }
    };
  }, [transactionId, router, selectedPackage, t, refreshToken]);

  useEffect(() => {
    if (!addonTransactionId) return;

    const hasNotified = false; // Add this flag to prevent multiple notifications

    const setupConnection = async () => {
      try {
        await PaymentService.startConnection();
        await PaymentService.joinPaymentSession(addonTransactionId);

        // Set up the payment status listener
        PaymentService.onPaymentStatusReceived(
          async (
            status: boolean,
            details?: {
              amount?: number;
              timestamp?: string;
              message?: string;
            }
          ) => {
            setPaymentStatus(status ? "success" : "failed");

            // Store payment details if available
            if (details) {
              setPaymentDetails({
                amount: details.amount || null,
                timestamp: details.timestamp || new Date().toISOString(),
                message: details.message || null,
              });
            }

            // If payment is successful, activate the package
            if (status) {
              toast.success(t("paymentSuccessful"));
              // Close the QR dialog and show payment result
              setShowQR(false);
              setShowPaymentResult(true);

              // Add refreshToken call here
              const accessToken = getAccessToken() as string;
              const refreshTokenValue = getRefreshToken() as string;

              if (accessToken && refreshTokenValue) {
                try {
                  const result = await refreshToken({
                    accessToken,
                    refreshToken: refreshTokenValue,
                  }).unwrap();

                  if (result.isSuccess) {
                    // Save the new tokens
                    setAccessToken(result.value.accessToken);
                    setRefreshToken(result.value.refreshToken);
                    console.log("Tokens refreshed successfully after payment");
                  }
                } catch (error) {
                  console.error(
                    "Failed to refresh tokens after payment:",
                    error
                  );
                }
              }

              // Refresh the page after a delay to show updated package status
              setTimeout(() => {
                router.push("/clinicManager/branch");
              }, 5000);
            } else {
              toast.error(
                details?.message || "Payment failed. Please try again."
              );
              // Show payment result with failure details
              setShowQR(false);
              setShowPaymentResult(true);
            }
          }
        );

        // Set up the subscription price changed listener
        PaymentService.onSubscriptionPriceChanged((isValid: boolean) => {
          if (!isValid) {
            toast.error(
              "The subscription price has changed. Please initiate a new payment."
            );
            setShowQR(false);
            setPaymentStatus("price-changed");
            setShowPaymentResult(true);

            // Optionally redirect after showing the message
            setTimeout(() => {
              router.push("/clinicManager/buy-package");
            }, 5000);
          }
        });
      } catch (error) {
        console.error("Failed to set up SignalR connection:", error);
        toast.error("Failed to connect to payment service");
      }
    };

    setupConnection();

    // Clean up the connection when component unmounts
    return () => {
      if (addonTransactionId) {
        PaymentService.leavePaymentSession(addonTransactionId);
      }
    };
  }, [addonTransactionId, router, selectedPackage, t, refreshToken]);

  // Filter out the Trial package with ID 4b7171f4-3219-4688-9f7c-625687a95867
  const packages = (data?.value?.items || []).filter(
    (pkg: Package) => pkg.id !== "4b7171f4-3219-4688-9f7c-625687a95867"
  );
  const totalCount = data?.value?.totalCount || 0;
  const hasNextPage = data?.value?.hasNextPage;
  const hasPreviousPage = data?.value?.hasPreviousPage;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Page index will be reset by the useEffect when debouncedSearchTerm changes
    const accessToken = getAccessToken() as string;
    const refreshToken = getRefreshToken() as string;
    console.log("access", accessToken);
    console.log("refresh", refreshToken);
  };

  // Update the handlePurchase function to use package-specific loading state
  const handlePurchase = async (pkg: Package) => {
    try {
      setSelectedPackage(pkg);
      setPaymentStatus("pending");

      // Set loading state for just this package
      setLoadingPackages((prev) => ({ ...prev, [pkg.id]: true }));

      const result = await createPayment({
        subscriptionId: pkg.id,
        currentAmount: pkg.price,
      }).unwrap();
      if (result.isSuccess && result.value.qrUrl) {
        setQrUrl(result.value.qrUrl);
        setAddonQrUrl(null); // Reset addon QR
        // Store the transaction ID for SignalR connection
        if (result.value.transactionId) {
          setTransactionId(result.value.transactionId);
          setAddonTransactionId(null); // Reset addon transaction ID
        }
        setShowQR(true);
      } else {
        toast.error(t("failedToGenerateQr"));
      }
    } catch (error: any) {
      console.error("Payment error:", error);

      // Handle structured error response
      if (error.data) {
        const errorData = error.data;

        // Check for specific error cases
        if (
          errorData.status === 400 &&
          errorData.detail === "Clinic is not activated"
        ) {
          toast.error(t("clinicNotActivated"));
        } else if (errorData.title) {
          toast.error(`${errorData.title}: ${errorData.detail || ""}`);
        } else {
          toast.error(errorData.detail || t("failedToInitiatePayment"));
        }
      } else {
        toast.error(t("failedToInitiatePayment"));
      }
    } finally {
      // Clear loading state for this package
      setLoadingPackages((prev) => ({ ...prev, [pkg.id]: false }));
    }
  };

  // Also update the handleRetryPayment function with similar error handling
  const handleRetryPayment = async () => {
    if (!selectedPackage) return;

    setShowPaymentResult(false);
    setPaymentStatus("pending");

    try {
      // Set loading state for the selected package
      setLoadingPackages((prev) => ({ ...prev, [selectedPackage.id]: true }));

      const result = await createPayment({
        subscriptionId: selectedPackage.id,
        currentAmount: selectedPackage.price,
      }).unwrap();
      if (result.isSuccess && result.value.qrUrl) {
        setQrUrl(result.value.qrUrl);
        if (result.value.transactionId) {
          setTransactionId(result.value.transactionId);
        }
        setShowQR(true);
      } else {
        toast.error(t("failedToGenerateQr"));
      }
    } catch (error: any) {
      console.error("Payment retry error:", error);

      // Handle structured error response
      if (error.data) {
        const errorData = error.data;

        // Check for specific error cases
        if (
          errorData.status === 400 &&
          errorData.detail === "Clinic is not activated"
        ) {
          toast.error(t("clinicNotActivated"));
        } else if (errorData.title) {
          toast.error(`${errorData.title}: ${errorData.detail || ""}`);
        } else {
          toast.error(errorData.detail || t("failedToInitiatePayment"));
        }
      } else {
        toast.error(t("failedToInitiatePayment"));
      }
    } finally {
      // Clear loading state for the selected package
      if (selectedPackage) {
        setLoadingPackages((prev) => ({
          ...prev,
          [selectedPackage.id]: false,
        }));
      }
    }
  };

  useEffect(() => {
    setPageIndex(1); // Reset to first page when search term changes
  }, [debouncedSearchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4 dark:bg-gray-800" />
            <Skeleton className="h-6 w-2/3 mx-auto dark:bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-lg"
              >
                <Skeleton className="h-8 w-32 mb-4 dark:bg-gray-700" />
                <Skeleton className="h-4 w-full mb-2 dark:bg-gray-700" />
                <Skeleton className="h-4 w-2/3 mb-4 dark:bg-gray-700" />
                <Skeleton className="h-6 w-24 mb-6 dark:bg-gray-700" />
                <Skeleton className="h-10 w-full dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950 p-8 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t("failedToLoadPackages")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("tryAgainLater")}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t("retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
          >
            <Sparkles className="h-5 w-5 text-pink-500 dark:text-pink-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("premiumBeautyPackages")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-semibold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            {activeTab === "packages"
              ? t("enhanceYourBeautyServices")
              : t("purchaseAdditionalSlots")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          >
            {activeTab === "packages"
              ? t("chooseFromExclusiveRange")
              : t("addMoreBranchesAndLivestreams")}
          </motion.p>

          {/* Search Bar - Only show for packages tab */}
          {activeTab === "packages" && (
            <div className="max-w-md mx-auto relative">
              <Input
                type="text"
                placeholder={t("searchPackages")}
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 dark:border-gray-700 focus:border-pink-300 dark:focus:border-pink-500 focus:ring focus:ring-pink-200 dark:focus:ring-pink-500 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: ShieldCheck,
              title: t("premiumQuality"),
              description: t("premiumQualityDesc"),
            },
            {
              icon: Zap,
              title: t("instantActivation"),
              description: t("instantActivationDesc"),
            },
            {
              icon: RefreshCw,
              title: t("flexibleDuration"),
              description: t("flexibleDurationDesc"),
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 mb-4">
                <feature.icon className="h-6 w-6 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setActiveTab("packages");
                  // Reset addon transaction data when switching tabs
                  if (addonTransactionId) {
                    try {
                      PaymentService.leavePaymentSession(
                        addonTransactionId
                      ).catch((error) =>
                        console.error("Error leaving addon session:", error)
                      );
                    } catch (error) {
                      console.error("Error in addon cleanup:", error);
                    }
                    setAddonTransactionId(null);
                  }
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "packages"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {t("packages")}
              </button>
              <button
                onClick={() => {
                  setActiveTab("addons");
                  // Reset main transaction data when switching tabs
                  if (transactionId) {
                    try {
                      PaymentService.leavePaymentSession(transactionId).catch(
                        (error) =>
                          console.error("Error leaving main session:", error)
                      );
                    } catch (error) {
                      console.error("Error in main cleanup:", error);
                    }
                    setTransactionId(null);
                  }
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "addons"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                disabled={!subscriptionPackageId}
              >
                {t("additionalSlots")}
              </button>
            </div>
          </div>
        </div>

        {activeTab === "addons" ? (
          <div className="max-w-3xl mx-auto mb-12">
            {isLoadingPackage ? (
              <Card className="p-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <div className="grid grid-cols-2 gap-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </Card>
            ) : !currentPackage ? (
              <Card className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("noActiveSubscription")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t("purchasePackageFirst")}
                </p>
                <Button
                  onClick={() => setActiveTab("packages")}
                  className="mx-auto"
                >
                  {t("viewPackages")}
                </Button>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                  <CardTitle>
                    {t("currentPackage")}: {currentPackage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-pink-500" />{" "}
                          {t("additionalBranches")}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {t("currentBranches")}: {currentPackage.limitBranch}
                        </p>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setAdditionBranch(Math.max(0, additionBranch - 1))
                            }
                            disabled={additionBranch === 0}
                            className="h-8 w-8"
                          >
                            -
                          </Button>
                          <div className="w-16 text-center font-medium">
                            {additionBranch}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setAdditionBranch(additionBranch + 1)
                            }
                            className="h-8 w-8"
                          >
                            +
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {formatPrice(currentPackage.priceBranchAddition)}{" "}
                          {t("perBranch")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-pink-500" />{" "}
                          {t("additionalLivestreams")}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {t("currentLivestreams")}:{" "}
                          {currentPackage.limitLiveStream}
                        </p>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setAdditionLiveStream(
                                Math.max(0, additionLiveStream - 1)
                              )
                            }
                            disabled={additionLiveStream === 0}
                            className="h-8 w-8"
                          >
                            -
                          </Button>
                          <div className="w-16 text-center font-medium">
                            {additionLiveStream}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setAdditionLiveStream(additionLiveStream + 1)
                            }
                            className="h-8 w-8"
                          >
                            +
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {formatPrice(currentPackage.priceLiveStreamAddition)}{" "}
                          {t("perLivestream")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-lg font-medium">
                        {t("totalPrice")}:
                      </div>
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {formatPrice(calculateAddonPrice())}
                      </div>
                    </div>

                    <Button
                      onClick={handleAddonPurchase}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-500 dark:hover:to-purple-500 transition-all duration-300"
                      disabled={
                        (additionBranch === 0 && additionLiveStream === 0) ||
                        loadingAddons
                      }
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {loadingAddons ? t("processing") : t("purchaseAddons")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <>
            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {packages.map((pkg: any, index: number) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:shadow-xl",
                    pkg.isActivated
                      ? "border-pink-200 dark:border-pink-800"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  {/* Package Status Badge */}
                  <div
                    className={cn(
                      "absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium",
                      pkg.isActivated
                        ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    )}
                  >
                    {pkg.isActivated ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" /> {t("active")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <X className="h-3 w-3" /> {t("inactive")}
                      </span>
                    )}
                  </div>

                  {/* Package Content */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {pkg.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {pkg.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>
                        {t("durationDays", { duration: pkg.duration })}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <Zap className="h-4 w-4" />
                        <span>
                          {t("liveStreams", { count: pkg.limitLiveStream })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <ShieldCheck className="h-4 w-4" />
                        <span>{t("branches", { count: pkg.limitBranch })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>
                          {t("enhancedViewers", { count: pkg.enhancedViewer })}
                        </span>
                      </div>

                      {/* Additional pricing information */}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <PlusCircle className="h-4 w-4" />
                        <span>
                          {t("additionalBranchPrice", {
                            price: formatPrice(pkg.priceBranchAddition),
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <PlusCircle className="h-4 w-4" />
                        <span>
                          {t("additionalLivestreamPrice", {
                            price: formatPrice(pkg.priceLiveStreamAddition),
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="mt-auto">
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {formatPrice(pkg.price)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("oneTimePayment")}
                      </p>
                    </div>
                    <Button
                      onClick={() => handlePurchase(pkg)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-500 dark:hover:to-purple-500 transition-all duration-300"
                      disabled={!pkg.isActivated || loadingPackages[pkg.id]}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {loadingPackages[pkg.id]
                        ? t("processing")
                        : t("purchaseNow")}
                    </Button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 opacity-50 blur-2xl" />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={totalCount}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={setPageIndex}
            />
          </>
        )}

        <Dialog
          open={showQR}
          onOpenChange={(open) => {
            if (!open) {
              // When closing the dialog, safely leave the payment session
              const currentTransactionId = transactionId || addonTransactionId;
              if (currentTransactionId) {
                try {
                  // Wrap in try-catch to prevent errors from bubbling up
                  PaymentService.leavePaymentSession(
                    currentTransactionId
                  ).catch((error) => {
                    console.error("Error leaving payment session:", error);
                    // Don't throw the error further
                  });
                } catch (error) {
                  console.error("Error in payment session cleanup:", error);
                }
              }
            }
            setShowQR(open);
          }}
        >
          <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-center font-serif dark:text-gray-100">
                {t("paymentQrCode")}
              </DialogTitle>
              <DialogDescription className="text-center dark:text-gray-300">
                {activeTab === "packages"
                  ? t("scanQrCode", { packageName: selectedPackage?.name })
                  : t("scanQrCodeAddons")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center p-6">
              {qrUrl || addonQrUrl ? (
                <div className="relative w-64 h-64 mb-4">
                  <Image
                    src={
                      (activeTab === "packages" ? qrUrl : addonQrUrl) ||
                      "/placeholder.svg"
                    }
                    alt="Payment QR Code"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-300 text-center px-4">
                    Loading QR Code...
                  </p>
                </div>
              )}
              <div className="text-center space-y-2">
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {activeTab === "packages"
                    ? selectedPackage && formatPrice(selectedPackage.price)
                    : formatPrice(calculateAddonPrice())}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("scanWithBankingApp")}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4">
                  <Clock className="h-4 w-4" />
                  <span>{t("qrCodeExpires")}</span>
                </div>
                {/* Payment Status Indicator */}
                <div className="mt-4">
                  {paymentStatus === "pending" && (
                    <div className="flex items-center justify-center gap-2 text-amber-500 dark:text-amber-400">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{t("waitingForPayment")}</span>
                    </div>
                  )}
                  {paymentStatus === "success" && (
                    <div className="flex items-center justify-center gap-2 text-green-500 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      <span>{t("paymentSuccessful")}</span>
                    </div>
                  )}
                  {paymentStatus === "failed" && (
                    <div className="flex items-center justify-center gap-2 text-red-500 dark:text-red-400">
                      <X className="h-4 w-4" />
                      <span>{t("paymentFailed")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showPaymentResult}
          onOpenChange={(open) => {
            if (!open) {
              setShowPaymentResult(false);
              // Reset payment status if dialog is closed
              setPaymentStatus("pending");
            }
          }}
        >
          <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-center font-serif dark:text-gray-100">
                {paymentStatus === "success"
                  ? t("paymentSuccessTitle")
                  : t("paymentFailedTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center p-6">
              {paymentStatus === "success" ? (
                <Card className="w-full bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mb-4" />
                      <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                        {t("paymentSuccessMessage")}
                      </h3>
                      <p className="text-green-600 dark:text-green-300 mb-4">
                        {t("paymentSuccessDesc", {
                          amount: paymentDetails.amount
                            ? formatPrice(paymentDetails.amount)
                            : selectedPackage
                            ? formatPrice(selectedPackage.price)
                            : "N/A",
                        })}
                      </p>
                      {paymentDetails.timestamp && (
                        <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                          {t("transactionTime", {
                            time: new Date(
                              paymentDetails.timestamp
                            ).toLocaleString(),
                          })}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                        <Button
                          onClick={() => setShowPaymentResult(false)}
                          variant="outline"
                          className="flex-1 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30"
                        >
                          {t("close")}
                        </Button>
                        <Button
                          asChild
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-500 dark:hover:to-emerald-500"
                        >
                          <Link href="/clinicManager/dashboard">
                            {t("goToDashboard")}{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="w-full bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 mb-4" />
                      <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                        {t("paymentFailedMessage")}
                      </h3>
                      <p className="text-red-600 dark:text-red-300 mb-4">
                        {paymentDetails.message || t("paymentFailedDesc")}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                        <Button
                          onClick={() => setShowPaymentResult(false)}
                          variant="outline"
                          className="flex-1 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                        >
                          {t("close")}
                        </Button>
                        <Button
                          onClick={handleRetryPayment}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 dark:from-pink-600 dark:to-purple-600 dark:hover:from-pink-500 dark:hover:to-purple-500"
                        >
                          {t("tryAgain")} <RefreshCw className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
