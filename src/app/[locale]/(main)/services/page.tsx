"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Grid,
  List,
  Star,
  X,
  MapPin,
  Home,
  ChevronRight,
  Filter,
  Tag,
  Phone,
  Mail,
  ChevronLeft,
  Calendar,
  Info,
} from "lucide-react";
import {
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
} from "@/features/services/api";
import {
  Card as UICard,
  CardContent as UICardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@/components/services/booking/types/booking";
import toast from "react-hot-toast";
import { useGetAllcategoriesQuery } from "@/features/home/api";
import ServiceCard from "@/components/services/service-card";
import { useRouter } from "next/navigation";
import type { ServiceDetail, ServiceItem } from "@/features/services/types";
import { BookingFlow } from "@/components/services/booking/booking/booking-flow";

// Utility functions
const formatPrice = (
  value: number,
  currency = "đ",
  locale = "vi-VN"
): string => {
  if (value === 0) return "Liên hệ";
  return `${value.toLocaleString(locale)}${currency}`;
};

interface ErrorDisplayProps {
  onRetry: () => void;
}

// Loading Skeleton Component
function ServicesPageSkeleton(): JSX.Element {
  const t = useTranslations("Services");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner Skeleton */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="relative z-10 container px-4 mx-auto text-center">
          <Skeleton className="h-6 w-40 mx-auto mb-4" />
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-4 w-20" />
            <span className="text-white/40">/</span>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </section>

      {/* Search & Filters Skeleton */}
      <section className="py-8 border-b">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Skeleton className="h-10 w-full md:w-2/3" />
            <div className="flex gap-2 w-full md:w-auto">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>

              <div className="space-y-6">
                {/* Categories Skeleton */}
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Price Range Skeleton */}
                <div>
                  <Skeleton className="h-5 w-28 mb-4" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>

                {/* Promotions Skeleton */}
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Services Skeleton */}
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-[60px] w-[60px] rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-full mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex gap-2 overflow-x-auto mb-6">
                <Skeleton className="h-10 w-20 shrink-0" />
                <Skeleton className="h-10 w-24 shrink-0" />
                <Skeleton className="h-10 w-28 shrink-0" />
                <Skeleton className="h-10 w-24 shrink-0" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <UICard
                    key={i}
                    className="overflow-hidden border-purple-100 dark:border-gray-700"
                  >
                    <UICardContent className="p-0">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex items-center justify-between mb-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                    </UICardContent>
                  </UICard>
                ))}
              </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between mt-8">
              <Skeleton className="h-10 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Component
function ErrorDisplay({ onRetry }: ErrorDisplayProps): JSX.Element {
  const t = useTranslations("Services");

  return (
    <div className="container mx-auto py-12 text-center">
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-purple-500 dark:text-purple-400 mb-4">
          <X className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{t("errorLoading")}</h2>
        <p className="text-muted-foreground mb-6">{t("errorMessage")}</p>
        <Button
          onClick={onRetry}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}

// Add a component to render rich text descriptions
function RichTextDescription({ content }: { content: string }) {
  const t = useTranslations("Services");

  // Simple implementation to render HTML content safely
  return (
    <div
      className="text-muted-foreground mb-4 line-clamp-2"
      dangerouslySetInnerHTML={{
        __html: content || t("noDetailedDescription"),
      }}
    />
  );
}

// Componente para compartir servicio
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

function ShareModal({ isOpen, onClose, service }: ShareModalProps) {
  const t = useTranslations("Services");
  const [copied, setCopied] = useState(false);

  if (!service) return null;

  const shareUrl = `${window.location.origin}/services/${service.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t("linkCopied"));
  };

  const handleShare = (platform: string) => {
    let shareLink = "";
    const text = t("viewServiceText", { serviceName: service.name });

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "whatsapp":
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          text + " " + shareUrl
        )}`;
        break;
      default:
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank");
      toast.success(t("sharedVia", { platform }));
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t("shareService")}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  {t("shareServiceWith", { serviceName: service.name })}
                </p>

                <div className="flex gap-4 justify-center mb-6">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => handleShare("facebook")}
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
                      className="text-blue-600 mb-2"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span className="text-xs">Facebook</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => handleShare("twitter")}
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
                      className="text-sky-500 mb-2"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <span className="text-xs">Twitter</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => handleShare("whatsapp")}
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
                      className="text-green-500 mb-2"
                    >
                      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.467-2.416-1.483-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.462.13-.61.136-.137.301-.354.451-.531.151-.177.2-.301.3-.502.099-.2.05-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.007-.371-.01-.571-.01-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className={copied ? "bg-green-100 text-green-600" : ""}
                  >
                    {copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  showPromotionsOnly: boolean;
  searchTerm: string;
  sortBy: string;
  parentCategory: string | null;
}
export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  categoryId?: string;
  parentCategoryId?: string | null;
  minPrice?: number;
  maxPrice?: number;
  hasPromotion?: boolean;
  searchTerm?: string;
  sortBy?: string;
}

export interface DoctorCertificate {
  id: string;
  title: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  imageUrl: string;
  isVerified: boolean;
}
export interface Category {
  id: string;
  name: string;
  description: string;
  isParent?: boolean;
  parentId?: string | null;
  isDeleted?: boolean;
}

// Add a component to display category information in the filter sidebar
function CategoryInfo({ category }: { category: Category | undefined }) {
  if (!category) return null;

  return (
    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
      <h4 className="font-medium text-sm mb-2 text-purple-800 dark:text-purple-300">
        {category.name}
      </h4>
      {category.description && (
        <div
          className="text-xs text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: category.description }}
        />
      )}
    </div>
  );
}

// Main component
export default function ServicesPage(): JSX.Element {
  const t = useTranslations("Services");
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize: number = 10;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [recentlyViewed, setRecentlyViewed] = useState<ServiceItem[]>([]);
  const [showBookingFlow, setShowBookingFlow] = useState<boolean>(false);
  const { data: detailData, isLoading } = useGetServiceByIdQuery(
    selectedService?.id as string,
    {
      skip: !showBookingFlow,
    }
  );
  // Default max price for initial filter
  const maxPriceDefault = 1500000;

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, maxPriceDefault],
    showPromotionsOnly: false,
    searchTerm: "",
    sortBy: "popular",
    parentCategory: null,
  });

  // Fetch services
  const {
    data: servicesData,
    error: servicesError,
    isLoading: isServicesLoading,
    refetch: refetchServices,
  } = useGetAllServicesQuery({
    pageIndex,
    pageSize,
    categoryId: filters.category !== "all" ? filters.category : undefined,
    parentCategoryId: filters.parentCategory,
    minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
    maxPrice:
      filters.priceRange[1] < maxPriceDefault
        ? filters.priceRange[1]
        : undefined,
    hasPromotion: filters.showPromotionsOnly || undefined,
    searchTerm: filters.searchTerm || undefined,
    sortBy: filters.sortBy,
  } as PaginationParams);

  // Fetch categories
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: isCategoriesLoading,
  } = useGetAllcategoriesQuery({
    pageIndex: 1,
    pageSize: 100, // Fetch more categories to ensure we get the complete hierarchy
  });

  // Memoized refetch function
  const memoizedRefetchServices = useCallback(() => {
    refetchServices();
  }, [refetchServices]);

  // Trigger API refetch when filters change
  useEffect(() => {
    if (!isServicesLoading) {
      memoizedRefetchServices();
    }
  }, [filters, memoizedRefetchServices, isServicesLoading]);

  // Memoize the categories and filtered services to prevent unnecessary re-renders
  const categories = useMemo(() => {
    return categoriesData?.value?.items || [];
  }, [categoriesData?.value?.items]);

  const services = useMemo(() => {
    return servicesData?.value?.items || [];
  }, [servicesData?.value?.items]);

  // Extract all categories and organize them by parent-child relationship
  const categoriesMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((category) => {
      if (!category.isDeleted) {
        map.set(category.id, category);
      }
    });
    return map;
  }, [categories]);

  const parentCategories = useMemo(() => {
    return categories.filter(
      (category) => category.isParent && !category.isDeleted
    );
  }, [categories]);

  const childCategoriesByParent = useMemo(() => {
    const map = new Map<string, Category[]>();

    categories.forEach((category) => {
      if (!category.isDeleted) {
        if (category.isParent) {
          if (!map.has(category.id)) {
            map.set(category.id, []);
          }
        } else if (category.parentId) {
          if (!map.has(category.parentId)) {
            map.set(category.parentId, []);
          }
          map.get(category.parentId)?.push(category);
        }
      }
    });

    return map;
  }, [categories]);

  // Get max price from services for the slider
  const actualMaxPrice = useMemo(() => {
    return services.length > 0
      ? Math.max(...services.map((service) => service.maxPrice || 0))
      : maxPriceDefault;
  }, [services, maxPriceDefault]);

  // Filter services based on current filters
  const filteredServices = useMemo(() => {
    if (!services || services.length === 0) return [];

    return services
      .filter((service) => {
        // Search term filter (bao gồm cả tên category)
        if (filters.searchTerm) {
          const searchTermLower = filters.searchTerm.toLowerCase();
          const nameMatches = service.name
            .toLowerCase()
            .includes(searchTermLower);
          const categoryMatches = service.category?.name
            .toLowerCase()
            .includes(searchTermLower);

          if (!nameMatches && !categoryMatches) {
            return false;
          }
        }

        // Category filter
        if (filters.category !== "all") {
          // Nếu category không phải "all", kiểm tra trực tiếp ID category
          if (service.category?.id !== filters.category) {
            return false;
          }
        } else if (filters.parentCategory) {
          // Nếu chỉ có parentCategory được chọn, kiểm tra xem service có thuộc parent đó không
          // Kiểm tra bằng ID category hoặc tên category
          const categoryMatches =
            service.category?.id === filters.parentCategory;
          const belongsToParent =
            categoriesMap.has(service.category?.id) &&
            categoriesMap.get(service.category?.id)?.parentId ===
              filters.parentCategory;

          if (!categoryMatches && !belongsToParent) {
            return false;
          }
        }

        // Price filter - check if the service price falls within the range
        const servicePrice = service.discountMaxPrice || service.maxPrice;
        if (
          servicePrice > 0 &&
          (servicePrice < filters.priceRange[0] ||
            servicePrice > filters.priceRange[1])
        ) {
          return false;
        }

        // Promotions filter
        if (filters.showPromotionsOnly) {
          const hasDiscount =
            service.discountPercent && Number(service.discountPercent) > 0;
          if (!hasDiscount) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return (
              (a.discountMaxPrice || a.maxPrice) -
              (b.discountMaxPrice || b.maxPrice)
            );
          case "price-desc":
            return (
              (b.discountMaxPrice || b.maxPrice) -
              (a.maxPrice || a.discountMaxPrice)
            );
          case "name":
            return a.name.localeCompare(b.name);
          case "popular":
          default:
            // For popular, we could use a rating or views field if available
            return 0;
        }
      });
  }, [services, filters, categoriesMap]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const currentMaxPrice =
      services.length > 0
        ? Math.max(...services.map((service) => service.maxPrice || 0))
        : maxPriceDefault;

    setFilters({
      category: "all",
      priceRange: [0, currentMaxPrice],
      showPromotionsOnly: false,
      searchTerm: "",
      sortBy: "popular",
      parentCategory: null,
    });

    toast.success(t("filtersReset"));
  }, [services, maxPriceDefault, t]);

  // Handle pagination
  const handlePreviousPage = useCallback((): void => {
    if (servicesData?.value?.hasPreviousPage) {
      setPageIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [servicesData?.value?.hasPreviousPage]);

  const handleNextPage = useCallback((): void => {
    if (servicesData?.value?.hasNextPage) {
      setPageIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [servicesData?.value?.hasNextPage]);

  // Handle favorites
  const toggleFavorite = useCallback(
    (serviceId: string) => {
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(serviceId)) {
          newFavorites.delete(serviceId);
          toast.success(t("removedFromFavorites"));
        } else {
          newFavorites.add(serviceId);
          toast.success(t("addedToFavorites"));
        }
        return newFavorites;
      });
    },
    [t]
  );

  // Handle booking
  const handleBookService = useCallback((service: ServiceItem) => {
    setSelectedService(service);
    setShowBookingFlow(true);

    // Add to recently viewed if not already in the list
    setRecentlyViewed((prev) => {
      if (!prev.some((item) => item.id === service.id)) {
        // Keep only the last 5 viewed services
        const newRecentlyViewed = [service, ...prev].slice(0, 5);
        return newRecentlyViewed;
      }
      return prev;
    });
  }, []);

  // Handle close booking flow
  const handleCloseBookingFlow = useCallback(() => {
    setShowBookingFlow(false);
  }, []);

  // Handle share
  const handleShareService = useCallback((service: ServiceItem) => {
    setSelectedService(service);
    setIsShareModalOpen(true);
  }, []);

  // Handle view details
  const handleViewDetails = useCallback(
    (service: ServiceItem) => {
      // Add to recently viewed
      setRecentlyViewed((prev) => {
        if (!prev.some((item) => item.id === service.id)) {
          // Keep only the last 5 viewed services
          const newRecentlyViewed = [service, ...prev].slice(0, 5);
          return newRecentlyViewed;
        }
        return prev;
      });

      // Navigate to service detail page
      router.push(`/services/${service.id}`);
    },
    [router]
  );

  // Prepare UI elements based on loading and error states
  if (isServicesLoading || isCategoriesLoading) {
    return <ServicesPageSkeleton />;
  }

  if (servicesError || categoriesError) {
    return <ErrorDisplay onRetry={memoizedRefetchServices} />;
  }

  if (!servicesData?.value || !categoriesData?.value) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">{t("noData")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("unableToLoadServices")}
          </p>
          <Button
            onClick={memoizedRefetchServices}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t("retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Full section background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://placehold.co/1600x800.png"
            alt={t("beautyServices")}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/50 to-purple-700/30 dark:from-purple-900/90 dark:via-purple-800/70 dark:to-purple-700/50" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full w-full">
          <div className="container mx-auto h-full flex flex-col justify-center px-6 lg:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 mb-6">
                <Link
                  href="/"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium flex items-center"
                >
                  <Home className="h-3.5 w-3.5 mr-1" />
                  {t("home")}
                </Link>
                <ChevronRight className="h-4 w-4 text-white/50" />
                <span className="text-purple-300 font-medium text-sm">
                  {t("services")}
                </span>
              </div>

              {/* Badge */}
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 text-sm font-medium tracking-wider uppercase bg-white/10 backdrop-blur-sm border-white/20 text-white"
              >
                {t("ourServices")}
              </Badge>

              {/* Main heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                {t("discoverServices")}{" "}
                <span className="text-purple-300">{t("amazing")}</span>
              </h1>

              {/* Description */}
              <p className="text-white/90 dark:text-white/80 text-xl mb-10 max-w-2xl leading-relaxed">
                {t("serviceDescription")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40"
                  onClick={() => {
                    const servicesSection =
                      document.getElementById("services-section");
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: "smooth" });
                      toast.success(t("scrolledToServices"));
                    }
                  }}
                >
                  {t("exploreServices")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20"
                  onClick={() => {
                    if (services.length > 0) {
                      handleBookService(services[0]);
                      toast.success(t("openingBookingForm"));
                    } else {
                      toast.error(t("noServicesAvailable"));
                    }
                  }}
                >
                  {t("bookNow")}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-0 z-20 py-4 border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
              <Input
                placeholder={t("searchServices")}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-500"
                value={filters.searchTerm}
                onChange={(e) => {
                  setFilters({ ...filters, searchTerm: e.target.value });
                  if (e.target.value.length > 2) {
                    toast.success(t("searching", { term: e.target.value }));
                  }
                }}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => {
                  setFilters({ ...filters, sortBy: value });
                  let sortOption = "";
                  switch (value) {
                    case "popular":
                      sortOption = t("mostPopular");
                      break;
                    case "price-asc":
                      sortOption = t("priceLowToHigh");
                      break;
                    case "price-desc":
                      sortOption = t("priceHighToLow");
                      break;
                    case "name":
                      sortOption = t("nameAZ");
                      break;
                  }
                  toast.success(t("sortedBy", { sortOption }));
                }}
              >
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t("mostPopular")}</SelectItem>
                  <SelectItem value="price-asc">
                    {t("priceLowToHigh")}
                  </SelectItem>
                  <SelectItem value="price-desc">
                    {t("priceHighToLow")}
                  </SelectItem>
                  <SelectItem value="name">{t("nameAZ")}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className={
                  viewMode === "grid"
                    ? "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                    : ""
                }
                onClick={() => {
                  setViewMode("grid");
                  toast.success(t("switchedToGridView"));
                }}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={
                  viewMode === "list"
                    ? "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                    : ""
                }
                onClick={() => {
                  setViewMode("list");
                  toast.success(t("switchedToListView"));
                }}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  toast.success(
                    isFilterOpen ? t("filtersHidden") : t("filtersShown")
                  );
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-8" id="services-section">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`space-y-6 ${
              isFilterOpen ? "block" : "hidden"
            } lg:block`}
          >
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-purple-500" />
                  {t("filters")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-purple-600"
                  onClick={handleResetFilters}
                >
                  <X className="h-4 w-4 mr-1" /> {t("clear")}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Parent Categories */}
                <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
                  <label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">
                    {t("mainCategories")}
                  </label>
                  <Select
                    value={filters.parentCategory || ""}
                    onValueChange={(value) => {
                      setFilters({
                        ...filters,
                        parentCategory: value === "" ? null : value,
                        category: "all", // Reset sub-category when parent changes
                      });
                      if (value !== "") {
                        const categoryName =
                          categoriesMap.get(value)?.name || value;
                        toast.success(
                          t("selectedCategory", { category: categoryName })
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder={t("allCategories")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_parents">
                        {t("allCategories")}
                      </SelectItem>
                      {parentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Child Categories - only show if parent is selected */}
                {filters.parentCategory &&
                  childCategoriesByParent.has(filters.parentCategory) && (
                    <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
                      <label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">
                        {t("subCategories")}
                      </label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) => {
                          setFilters({ ...filters, category: value });
                          if (value !== "all") {
                            const categoryName =
                              categoriesMap.get(value)?.name || value;
                            toast.success(
                              t("selectedSubCategory", {
                                category: categoryName,
                              })
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <SelectValue placeholder={t("selectSubCategory")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_children">
                            {t("allSubCategories")}
                          </SelectItem>
                          {childCategoriesByParent
                            .get(filters.parentCategory)
                            ?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                {/* Price Range */}
                <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
                  <label className="text-sm font-medium mb-4 block flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{t("priceRange")}</span>
                    <span className="text-purple-600 font-normal">
                      {formatPrice(filters.priceRange[0])} -{" "}
                      {formatPrice(filters.priceRange[1])}
                    </span>
                  </label>
                  <Slider
                    value={filters.priceRange}
                    max={actualMaxPrice}
                    step={100000}
                    className="mb-2"
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: value as [number, number],
                      }));
                      toast.success(
                        t("selectedPriceRange", {
                          min: formatPrice(value[0]),
                          max: formatPrice(value[1]),
                        })
                      );
                    }}
                  />
                </div>

                {/* Promotions */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">
                    {t("promotions")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promo"
                      checked={filters.showPromotionsOnly}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          showPromotionsOnly: checked === true,
                        }));
                        toast.success(
                          checked
                            ? t("promotionsFilterOn")
                            : t("promotionsFilterOff")
                        );
                      }}
                    />
                    <label htmlFor="promo" className="text-sm cursor-pointer">
                      {t("showPromotionsOnly")}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Add this component to the filter sidebar when a parent category is selected */}
            {filters.parentCategory &&
              categoriesMap.has(filters.parentCategory) && (
                <CategoryInfo
                  category={categoriesMap.get(filters.parentCategory)}
                />
              )}

            {/* Popular Services */}
            <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4">
                {t("popularServices")}
              </h3>
              <div className="space-y-4">
                {services.length > 0 ? (
                  [...services]
                    .sort((a, b) => {
                      return b.maxPrice - a.maxPrice;
                    })
                    .slice(0, 3)
                    .map((service) => (
                      <div
                        key={service.id}
                        className="flex gap-3 group cursor-pointer"
                        onClick={() => handleViewDetails(service)}
                      >
                        <div className="relative h-[60px] w-[60px] rounded-lg overflow-hidden">
                          <Image
                            src={
                              service.coverImage?.[0]?.url ||
                              "https://placehold.co/60x60" ||
                              "/placeholder.svg"
                            }
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium group-hover:text-purple-600 transition-colors">
                            {service.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">
                              4.9 (120)
                            </span>
                          </div>
                          <div className="text-xs font-medium text-purple-600 mt-1">
                            {service.maxPrice > 0
                              ? service.discountMaxPrice > 0
                                ? formatPrice(service.discountMaxPrice)
                                : formatPrice(service.maxPrice)
                              : t("contactForPrice")}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("noPopularServices")}
                  </p>
                )}
              </div>
            </div>

            {/* Recently Viewed Services */}
            {recentlyViewed.length > 0 && (
              <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-purple-500" />
                  {t("recentlyViewed")}
                </h3>
                <div className="space-y-4">
                  {recentlyViewed.map((service) => (
                    <div
                      key={service.id}
                      className="flex gap-3 group cursor-pointer"
                      onClick={() => handleViewDetails(service)}
                    >
                      <div className="relative h-[60px] w-[60px] rounded-lg overflow-hidden">
                        <Image
                          src={
                            service.coverImage?.[0]?.url ||
                            "https://placehold.co/60x60" ||
                            "/placeholder.svg"
                          }
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium group-hover:text-purple-600 transition-colors">
                          {service.name}
                        </h4>
                        <div className="text-xs font-medium text-purple-600 mt-1">
                          {service.maxPrice > 0
                            ? service.discountMaxPrice > 0
                              ? formatPrice(service.discountMaxPrice)
                              : formatPrice(service.maxPrice)
                            : t("contactForPrice")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {filteredServices.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <span>{t("services")}</span>
                    {filters.parentCategory &&
                      categoriesMap.has(filters.parentCategory) && (
                        <span className="flex items-center">
                          <ChevronRight className="h-5 w-5 mx-1 text-gray-400" />
                          <span className="text-purple-600">
                            {categoriesMap.get(filters.parentCategory)?.name}
                          </span>
                        </span>
                      )}
                  </h2>
                  <span className="text-muted-foreground bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                    {t("resultsCount", { count: filteredServices.length })}
                  </span>
                </div>

                <Tabs defaultValue="all" className="mb-8">
                  <TabsList className="w-full justify-start overflow-x-auto bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-lg">
                    <TabsTrigger
                      value="all"
                      className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
                      onClick={() => {
                        setFilters({
                          ...filters,
                          category: "all",
                        });
                        toast.success(
                          t("selectedCategory", { category: t("all") })
                        );
                      }}
                    >
                      {t("all")}
                    </TabsTrigger>
                    {filters.parentCategory
                      ? childCategoriesByParent
                          .get(filters.parentCategory)
                          ?.map((category) => (
                            <TabsTrigger
                              key={category.id}
                              value={category.id}
                              onClick={() => {
                                setFilters({
                                  ...filters,
                                  category: category.id,
                                });
                                toast.success(
                                  t("selectedCategory", {
                                    category: category.name,
                                  })
                                );
                              }}
                              title={
                                category.description
                                  ? category.description.replace(/<[^>]*>/g, "")
                                  : ""
                              }
                              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
                            >
                              {category.name}
                            </TabsTrigger>
                          ))
                      : parentCategories.map((category) => (
                          <TabsTrigger
                            key={category.id}
                            value={category.id}
                            onClick={() => {
                              setFilters({
                                ...filters,
                                parentCategory: category.id,
                              });
                              toast.success(
                                t("selectedCategory", {
                                  category: category.name,
                                })
                              );
                            }}
                            title={
                              category.description
                                ? category.description.replace(/<[^>]*>/g, "")
                                : ""
                            }
                            className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
                          >
                            {category.name}
                          </TabsTrigger>
                        ))}
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    {viewMode === "grid" ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ServiceCard
                              service={service}
                              onBookService={() => handleBookService(service)}
                              onFavoriteToggle={() =>
                                toggleFavorite(service.id)
                              }
                              isFavorite={favorites.has(service.id)}
                              viewMode="grid"
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredServices.map((service) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ServiceCard
                              service={service}
                              onBookService={() => handleBookService(service)}
                              onFavoriteToggle={() =>
                                toggleFavorite(service.id)
                              }
                              isFavorite={favorites.has(service.id)}
                              viewMode="list"
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Tab content for each category */}
                  {(filters.parentCategory
                    ? childCategoriesByParent.get(filters.parentCategory) || []
                    : parentCategories
                  ).map((category) => (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="mt-6"
                    >
                      {viewMode === "grid" ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredServices
                            .filter(
                              (service) => service.category?.id === category.id
                            )
                            .map((service) => (
                              <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ServiceCard
                                  service={service}
                                  onBookService={() =>
                                    handleBookService(service)
                                  }
                                  onFavoriteToggle={() =>
                                    toggleFavorite(service.id)
                                  }
                                  isFavorite={favorites.has(service.id)}
                                  viewMode="grid"
                                />
                              </motion.div>
                            ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredServices
                            .filter(
                              (service) => service.category?.id === category.id
                            )
                            .map((service) => (
                              <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ServiceCard
                                  service={service}
                                  onBookService={() =>
                                    handleBookService(service)
                                  }
                                  onFavoriteToggle={() =>
                                    toggleFavorite(service.id)
                                  }
                                  isFavorite={favorites.has(service.id)}
                                  viewMode="list"
                                />
                              </motion.div>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="mb-4 text-purple-500 dark:text-purple-400">
                  <Tag className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {t("noServicesFound")}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {t("tryDifferentFilters")}
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {t("clearFilters")}
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredServices.length > 0 && (
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  disabled={!servicesData.value.hasPreviousPage}
                  onClick={handlePreviousPage}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("previous")}
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from(
                    {
                      length:
                        Math.ceil(
                          servicesData.value.totalCount /
                            servicesData.value.pageSize
                        ) || 1,
                    },
                    (_, i) => (
                      <Button
                        key={i}
                        variant={pageIndex === i + 1 ? "default" : "outline"}
                        className={`w-10 h-10 p-0 ${
                          pageIndex === i + 1
                            ? "bg-purple-600 hover:bg-purple-700"
                            : ""
                        }`}
                        onClick={() => {
                          setPageIndex(i + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          toast.success(t("pageChanged", { page: i + 1 }));
                        }}
                      >
                        {i + 1}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  disabled={!servicesData.value.hasNextPage}
                  onClick={handleNextPage}
                  className="flex items-center gap-1"
                >
                  {t("next")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-gray-900">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {t("readyForBeautyJourney")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t("bookFreeConsultation")}
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                if (services.length > 0) {
                  handleBookService(services[0]);
                  toast.success(t("openingConsultationForm"));
                } else {
                  toast.error(t("noServicesAvailable"));
                }
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {t("bookFreeConsultationButton")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                10k+
              </div>
              <div className="text-sm text-muted-foreground">
                {t("satisfiedCustomers")}
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="h-12 hidden md:block"
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">4.9</div>
              <div className="text-sm text-muted-foreground">
                {t("averageRating")}
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="h-12 hidden md:block"
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">15+</div>
              <div className="text-sm text-muted-foreground">
                {t("yearsExperience")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("aboutUs")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("aboutUsDescription")}
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  onClick={() => toast.success(t("clickedFacebook"))}
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
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  onClick={() => toast.success(t("clickedInstagram"))}
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
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  onClick={() => toast.success(t("clickedTwitter"))}
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
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("services")}</h3>
              <ul className="space-y-2">
                {parentCategories.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-purple-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilters({
                          ...filters,
                          parentCategory: category.id,
                          category: "all",
                        });
                        toast.success(
                          t("selectedCategory", { category: category.name })
                        );
                        const servicesSection =
                          document.getElementById("services-section");
                        if (servicesSection) {
                          servicesSection.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("links")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-purple-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(t("clickedHome"));
                      router.push("/");
                    }}
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-purple-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(t("clickedServices"));
                    }}
                  >
                    {t("services")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-purple-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(t("clickedAboutUs"));
                      router.push("/about");
                    }}
                  >
                    {t("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-purple-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(t("clickedContact"));
                      router.push("/contact");
                    }}
                  >
                    {t("contact")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-purple-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success(t("clickedBlog"));
                      router.push("/blog");
                    }}
                  >
                    {t("blog")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                  <span className="text-muted-foreground">{t("address")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <a
                    href="tel:+84123456789"
                    className="text-muted-foreground hover:text-purple-600 transition-colors"
                    onClick={() => toast.success(t("calling"))}
                  >
                    +84 123 456 789
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <a
                    href="mailto:info@example.com"
                    className="text-muted-foreground hover:text-purple-600 transition-colors"
                    onClick={() => toast.success(t("openingEmail"))}
                  >
                    info@example.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-muted-foreground">
            <p>{t("copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Booking Flow */}
      {showBookingFlow && selectedService && (
        <BookingFlow
          service={detailData?.value as ServiceDetail}
          onClose={handleCloseBookingFlow}
        />
      )}
    </div>
  );
}
