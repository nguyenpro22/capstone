"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  Tag,
  SlidersHorizontal,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  FolderTree,
  Star,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { useGetAllServicesQuery } from "@/features/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "@/components/services/service-card";
import type { ServiceItem } from "@/features/services/types";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllcategoriesQuery } from "@/features/home/api";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";

interface ErrorDisplayProps {
  onRetry: () => void;
}

// Category type definition
interface Category {
  id: string;
  name: string;
  description: string;
  isParent: boolean;
  parentId: string | null;
  isDeleted: boolean;
}

// Loading Overlay Component
function LoadingIndicator(): JSX.Element {
  const t = useTranslations("serviceMessages");

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative h-14 w-14">
        <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent animate-spin"></div>
        <div className="absolute top-1 left-1 h-12 w-12 rounded-full border-4 border-t-transparent border-r-purple-300 border-b-transparent border-l-purple-500 animate-spin animation-delay-200"></div>
        <div className="absolute top-2 left-2 h-10 w-10 rounded-full border-4 border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-400"></div>
      </div>
      <p className="mt-4 text-purple-700 dark:text-purple-300 font-medium">
        {t("searchingServices")}
      </p>
    </div>
  );
}
// Loading Skeleton Component
function ServicesPageSkeleton(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner Skeleton */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full dark:bg-gray-800" />
        </div>
        <div className="relative z-10 container px-4 mx-auto text-center">
          <Skeleton className="h-6 w-40 mx-auto mb-4 dark:bg-gray-700" />
          <Skeleton className="h-12 w-3/4 mx-auto mb-4 dark:bg-gray-700" />
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-4 w-20 dark:bg-gray-700" />
            <span className="text-white/40">/</span>
            <Skeleton className="h-4 w-20 dark:bg-gray-700" />
          </div>
        </div>
      </section>

      {/* Search Bar Skeleton */}
      <div className="container px-4 mx-auto -mt-8 relative z-20">
        <Skeleton className="h-16 w-full rounded-xl dark:bg-gray-700" />
      </div>

      <div className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-xl dark:bg-gray-700" />
          </div>

          {/* Services Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton
                  key={i}
                  className="h-[350px] w-full rounded-xl dark:bg-gray-700"
                />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-center mt-12">
              <Skeleton className="h-10 w-64 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateServiceKey(serviceId: string, index: number): string {
  const timestamp = new Date().toISOString();
  return `${serviceId}_${timestamp}_${index}`;
}

// Error Component
function ErrorDisplay({ onRetry }: ErrorDisplayProps): JSX.Element {
  const t = useTranslations("serviceMessages");

  return (
    <div className="container mx-auto py-12 text-center">
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {t("errorLoading")}
        </h2>
        <p className="text-muted-foreground dark:text-gray-300 mb-6">
          {t("errorMessage")}
        </p>
        <Button
          onClick={onRetry}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all"
        >
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}): JSX.Element {
  const t = useTranslations("serviceMessages");
  const parentCategories = categories.filter((cat) => cat.isParent);
  const getSubcategories = (parentId: string) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  return (
    <Select value={selectedCategory} onValueChange={onSelectCategory}>
      <SelectTrigger className="w-full bg-white dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-700 h-12 rounded-lg">
        <SelectValue placeholder={t("categories.allServices")} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] dark:bg-gray-800 dark:border-gray-700">
        <SelectItem value="all" className="dark:text-white">
          {t("categories.allServices")}
        </SelectItem>
        {parentCategories.map((parent, index) => (
          <React.Fragment key={parent.id}>
            {index > 0 && <SelectSeparator className="dark:bg-gray-700" />}
            <SelectItem
              value={parent.name}
              className="font-medium text-purple-700 dark:text-purple-300"
            >
              {parent.name}
            </SelectItem>
            {getSubcategories(parent.id).map((subcat) => (
              <SelectItem
                key={subcat.id}
                value={subcat.name}
                className="pl-6 text-sm dark:text-gray-300"
              >
                ↳ {subcat.name}
              </SelectItem>
            ))}
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}

// Featured Service Card Component
function FeaturedServiceCard({
  service,
}: {
  service: ServiceItem;
}): JSX.Element {
  const router = useRouter();
  const t = useTranslations("serviceMessages");
  const hasDiscount =
    service.discountPercent && Number(service.discountPercent) > 0;
  const displayPrice = hasDiscount
    ? service.discountMinPrice
    : service.minPrice;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onClick={() => router.push(`/services/${service.id}`)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${
              service.coverImage?.[0]?.url ||
              "/placeholder.svg?height=400&width=600"
            })`,
            opacity: 0.7,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[400px]">
        <div className="space-y-2 mb-4">
          {service.category && (
            <Badge className="bg-purple-500/80 hover:bg-purple-600/80 text-white backdrop-blur-sm">
              {service.category.name}
            </Badge>
          )}
          <h3 className="text-2xl font-bold text-white">{service.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-md">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-medium text-yellow-300">4.9</span>
            </div>
            <span className="text-sm text-white/80">(120 reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-white/60 line-through">
                {formatCurrency(service.maxPrice)}
              </span>
            )}
            <span className="text-xl font-bold text-white">
              {formatCurrency(displayPrice)}
            </span>
          </div>
          <Button
            className="bg-white text-purple-700 hover:bg-white/90 rounded-full px-5 shadow-lg group-hover:shadow-xl transition-all"
            size="sm"
          >
            {t("featured.viewDetails")}
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>

        {/* Featured Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {t("featured.featured")}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
// View Toggle Component
function ViewToggle({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}): JSX.Element {
  const t = useTranslations("serviceMessages");

  return (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
      <button
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
          viewMode === "grid"
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
        )}
        onClick={() => setViewMode("grid")}
      >
        <div className="flex items-center gap-1.5">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
          </div>
          <span className="hidden sm:inline">{t("viewMode.grid")}</span>
        </div>
      </button>
      <button
        className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
          viewMode === "list"
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
        )}
        onClick={() => setViewMode("list")}
      >
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-1 bg-current rounded-sm"></div>
            <div className="w-4 h-1 bg-current rounded-sm"></div>
            <div className="w-4 h-1 bg-current rounded-sm"></div>
          </div>
          <span className="hidden sm:inline">{t("viewMode.list")}</span>
        </div>
      </button>
    </div>
  );
}

// Footer Component with i18n
function Footer(): JSX.Element {
  const t = useTranslations("serviceMessages");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-white/70 mb-6">
              {t("footer.newsletter.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t("footer.newsletter.emailPlaceholder")}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white"
              />
              <Button className="bg-white text-purple-900 hover:bg-white/90">
                {t("footer.newsletter.subscribe")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Beauty & Spa</h3>
              <p className="text-white/70 mb-6">
                {t("footer.companyInfo.description")}
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("footer.quickLinks.title")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.services")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.pricing")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.quickLinks.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("footer.ourServices.title")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/services"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.ourServices.allServices")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services?category=11111111-1111-1111-1111-111111111111"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.ourServices.faceSurgery")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services?category=10101010-1010-1010-1010-101010101010"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.ourServices.earSurgery")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services?category=22222222-2222-2222-2222-222222222222"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {t("footer.ourServices.breastSurgery")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("footer.contactUs.title")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-purple-300 mt-0.5" />
                  <span className="text-white/70">
                    {t("footer.contactUs.address")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-purple-300" />
                  <span className="text-white/70">
                    {t("footer.contactUs.phone")}
                  </span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-purple-300" />
                  <span className="text-white/70">
                    {t("footer.contactUs.email")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          <p>{t("footer.copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
// Main component
export default function ServicesPage(): JSX.Element {
  const t = useTranslations("serviceMessages");
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize: number = 6;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [currentSortOption, setCurrentSortOption] = useState<string>("name");
  const [isSearchFromCategory, setIsSearchFromCategory] =
    useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetAllcategoriesQuery({
    pageSize: 100, // Fetch all categories
    pageIndex: 1,
  });

  // Debounce search term to avoid too many API calls
  const debouncedSetSearchTerm = useCallback((term: string) => {
    setDebouncedSearchTerm(term);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSetSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSetSearchTerm]);

  // Reset page index when filters change
  useEffect(() => {
    setPageIndex(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Handle category selection
  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsSearching(true);

    if (categoryName !== "all") {
      setIsSearchFromCategory(true);
      setDebouncedSearchTerm(categoryName);
    } else {
      // Only clear search if it was set by a category
      if (isSearchFromCategory) {
        setDebouncedSearchTerm("");
        setSearchTerm("");
        setIsSearchFromCategory(false);
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);

    // If user is typing in search box, it's not from category selection
    if (value !== debouncedSearchTerm) {
      setIsSearchFromCategory(false);
    }

    // Reset category selection if user is typing a search term
    if (value && selectedCategory !== "all") {
      setSelectedCategory("all");
    }
  };

  // Fetch services with filters
  const {
    data: servicesData,
    error: servicesError,
    isLoading: isServicesLoading,
    isFetching: isServicesFetching,
    refetch: refetchServices,
  } = useGetAllServicesQuery(
    {
      pageIndex,
      pageSize,
      searchTerm: debouncedSearchTerm,
      sortColumn,
      sortOrder,
    },
    { refetchOnMountOrArgChange: true }
  );

  // Handle pagination
  const handlePreviousPage = (): void => {
    if (servicesData?.value.hasPreviousPage) {
      setPageIndex((prev) => prev - 1);
      setIsSearching(true);
      window.scrollTo({
        top: 450,
        behavior: "smooth",
      });
    }
  };

  const handleNextPage = (): void => {
    if (servicesData?.value.hasNextPage) {
      setPageIndex((prev) => prev + 1);
      setIsSearching(true);
      window.scrollTo({
        top: 450,
        behavior: "smooth",
      });
    }
  };

  // Handle view details
  const handleViewDetails = (service: ServiceItem) => {
    router.push(`/services/${service.id}`);
  };

  // Toggle favorite
  const handleToggleFavorite = (serviceId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(serviceId)) {
        newFavorites.delete(serviceId);
      } else {
        newFavorites.add(serviceId);
      }
      return newFavorites;
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedCategory("all");
    setCurrentSortOption("name");
    setSortColumn("name");
    setSortOrder("asc");
    setIsSearchFromCategory(false);
  };

  useEffect(() => {
    setIsSearching(isServicesFetching);
  }, [isServicesFetching]);

  // Get categories
  const categories = categoriesData?.value?.items || [];

  // Find selected category name
  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "Tất cả dịch vụ";
    return selectedCategory;
  };

  // Show loading skeleton while data is being fetched
  if (isServicesLoading || isCategoriesLoading) return <ServicesPageSkeleton />;

  // Handle error state
  if (servicesError) return <ErrorDisplay onRetry={() => refetchServices()} />;

  // Handle case where data is undefined
  if (!servicesData?.value)
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            {t("noData")}
          </h2>
          <p className="text-muted-foreground dark:text-gray-300 mb-6">
            {t("unableToLoadServices")}
          </p>
          <Button
            onClick={() => refetchServices()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t("retry")}
          </Button>
        </div>
      </div>
    );

  // Get services from API response
  const services = servicesData.value.items || [];

  // Calculate total pages for pagination
  const totalPages = Math.ceil(
    servicesData.value.totalCount / servicesData.value.pageSize
  );

  const handleSortChange = (value: string) => {
    setCurrentSortOption(value);
    setIsSearching(true);
    const sortMap: Record<string, { column: string; order: "asc" | "desc" }> = {
      name: { column: "name", order: "asc" },
      "price-asc": { column: "price", order: "asc" },
      "price-desc": { column: "price", order: "desc" },
    };

    const { column, order } = sortMap[value] || sortMap["name"];
    setSortColumn(column);
    setSortOrder(order);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Banner - Modern and Immersive */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/80 mix-blend-multiply" />

          {/* Abstract shapes for modern look */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Content with modern typography and animations */}
        <div className="relative z-10 h-full w-full">
          <div className="container mx-auto h-full flex flex-col justify-center px-6 lg:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Modern badge with glow effect */}
              <div className="inline-flex items-center mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <Sparkles className="h-3.5 w-3.5 mr-2 text-purple-300 animate-pulse" />
                <span className="text-sm font-medium tracking-wider uppercase">
                  {t("ourServices")}
                </span>
              </div>

              {/* Dynamic heading with gradient text */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="text-white">{t("discoverServices")}</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                  {t("amazing")}
                </span>
              </h1>

              {/* Description with improved readability */}
              <p className="text-white/90 text-xl mb-10 max-w-2xl leading-relaxed font-light">
                {t("serviceDescription")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container px-4 mx-auto -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 backdrop-blur-lg"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500 dark:text-purple-400" />
              <Input
                placeholder={t("searchServices")}
                className="pl-10 bg-white/80 dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-700 focus:border-purple-500 h-12 rounded-lg"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
              <Button
                variant="outline"
                size="icon"
                className="md:hidden h-12 w-12 rounded-lg border-gray-200 dark:border-gray-700 dark:text-white"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container px-4 mx-auto py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Modern Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`space-y-6 ${
              isFilterOpen ? "block" : "hidden"
            } lg:block`}
          >
            <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-white flex items-center">
                    <FolderTree className="h-4 w-4 mr-2" />
                    Danh mục dịch vụ
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white/80 hover:bg-white/10"
                    onClick={handleResetFilters}
                  >
                    <X className="h-4 w-4 mr-1" /> {t("clear")}
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="space-y-6">
                  {/* Hierarchical Categories */}
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-5">
                    <label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-200 flex items-center">
                      <FolderTree className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                      Danh mục
                    </label>
                    <CategoryFilter
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleCategoryChange}
                    />
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-200 flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                      {t("sortBy")}
                    </label>
                    <Select
                      value={currentSortOption}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder={t("mostPopular")} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem
                          value="price-asc"
                          className="dark:text-white"
                        >
                          {t("priceLowToHigh")}
                        </SelectItem>
                        <SelectItem
                          value="price-desc"
                          className="dark:text-white"
                        >
                          {t("priceHighToLow")}
                        </SelectItem>
                        <SelectItem value="name" className="dark:text-white">
                          {t("nameAZ")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Service
            {services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="hidden lg:block"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                  Dịch vụ nổi bật
                </h3>
                <FeaturedServiceCard service={services[0]} />
              </motion.div>
            )} */}
          </motion.div>

          {/* Services Grid - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            {services.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <span>{t("services")}</span>
                    </h2>
                    {selectedCategory !== "all" && (
                      <Badge className="ml-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1">
                        {getSelectedCategoryName()}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                      {t("resultsCount", {
                        count: servicesData.value.totalCount,
                      })}
                    </Badge>
                    <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                  </div>
                </div>

                {/* Services Grid with Animation */}
                {isSearching ? (
                  <LoadingIndicator />
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "flex flex-col gap-4"
                    }
                  >
                    {services.map((service, index) => (
                      <motion.div
                        key={generateServiceKey(service.id, index)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ServiceCard
                          service={service}
                          onBookService={() => handleViewDetails(service)}
                          viewMode={viewMode}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (servicesData.value.hasPreviousPage) {
                            handlePreviousPage();
                          }
                        }}
                        className={`${
                          !servicesData.value.hasPreviousPage
                            ? "pointer-events-none opacity-50"
                            : ""
                        } dark:text-gray-300 dark:hover:text-white`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </PaginationPrevious>
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (pageIndex <= 3) {
                          // Near the start
                          pageNum = i + 1;
                        } else if (pageIndex >= totalPages - 2) {
                          // Near the end
                          pageNum = totalPages - 4 + i;
                        } else {
                          // In the middle
                          pageNum = pageIndex - 2 + i;
                        }
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPageIndex(pageNum);
                              window.scrollTo({
                                top: 450,
                                behavior: "smooth",
                              });
                            }}
                            isActive={pageIndex === pageNum}
                            className="dark:text-gray-300 dark:hover:text-white"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 5 && pageIndex < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis className="dark:text-gray-300" />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (servicesData.value.hasNextPage) {
                            handleNextPage();
                          }
                        }}
                        className={`${
                          !servicesData.value.hasNextPage
                            ? "pointer-events-none opacity-50"
                            : ""
                        } dark:text-gray-300 dark:hover:text-white`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="mb-6 text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Tag className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-medium mb-3 dark:text-white">
                  {t("noServicesFound")}
                </h3>
                <p className="text-muted-foreground dark:text-gray-300 mb-8 max-w-md mx-auto">
                  {t("tryDifferentFilters")}
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
                >
                  {t("clearFilters")}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
