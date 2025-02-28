"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Search, Grid, List, Star, Clock, X, MapPin } from "lucide-react";
import Image from "next/image";
import { useGetAllServicesQuery } from "@/features/services/api";
import { useState } from "react";

// Define TypeScript interfaces for the API response
interface ServiceImage {
  id: string;
  index: number;
  url: string;
}

interface Clinic {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  profilePictureUrl: string;
  isParent: boolean;
  parentId: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  maxPrice: number;
  minPrice: number;
  discountPercent: number;
  discountMaxPrice: number;
  discountMinPrice: number;
  coverImage: ServiceImage[];
  clinics: Clinic[];
  category: Category;
  description?: string;
  descriptionImage?: ServiceImage[];
}

interface ServicesResponseValue {
  items: Service[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ServicesResponse {
  value: ServicesResponseValue;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

interface ErrorDisplayProps {
  onRetry: () => void;
}

// Add these interfaces at the top of the file with other interfaces
interface FilterState {
  category: string;
  priceRange: [number, number];
  showPromotionsOnly: boolean;
}

// Add this type for the price formatting
type PriceFormatOptions = {
  value: number;
  currency?: string;
  locale?: string;
};

// Add these utility functions before the main component
const formatPrice = ({
  value,
  currency = "đ",
  locale = "vi-VN",
}: PriceFormatOptions): string => {
  return `${value.toLocaleString(locale)}${currency}`;
};

const filterServices = (
  services: Service[],
  filters: FilterState
): Service[] => {
  return services.filter((service) => {
    // Category filter
    if (
      filters.category !== "all" &&
      service.category?.name.toLowerCase() !== filters.category
    ) {
      return false;
    }

    // Price filter - check if the service price falls within the range
    const servicePrice = service.discountMaxPrice || service.maxPrice;
    if (
      servicePrice < filters.priceRange[0] ||
      servicePrice > filters.priceRange[1]
    ) {
      return false;
    }

    // Promotions filter
    if (filters.showPromotionsOnly) {
      const hasDiscount =
        service.discountPercent && service.discountPercent > 0;
      if (!hasDiscount) {
        return false;
      }
    }

    return true;
  });
};

// Loading Skeleton Component
function ServicesPageSkeleton(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner Skeleton */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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
                  <Card key={i} className="overflow-hidden border-primary/10">
                    <CardContent className="p-0">
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
                    </CardContent>
                  </Card>
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

      {/* CTA Section Skeleton */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mx-auto mb-8" />
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-8 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Error Component
function ErrorDisplay({ onRetry }: ErrorDisplayProps): JSX.Element {
  return (
    <div className="container mx-auto py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Không thể tải danh sách dịch vụ
      </h2>
      <p className="text-muted-foreground mb-6">
        Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại sau.
      </p>
      <Button onClick={onRetry}>Thử lại</Button>
    </div>
  );
}

interface PaginationParams {
  pageIndex: number;
  pageSize: number;
}

// Update the filter section in the main component
export default function ServicesPage(): JSX.Element {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize: number = 10;

  const {
    data: servicesData,
    error,
    isLoading,
    refetch,
  } = useGetAllServicesQuery({
    pageIndex,
    pageSize,
  } as PaginationParams);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 1500000],
    showPromotionsOnly: false,
  });

  // Show loading skeleton while data is being fetched
  if (isLoading) return <ServicesPageSkeleton />;

  // Handle error state
  if (error) return <ErrorDisplay onRetry={() => refetch()} />;

  // Handle case where data is undefined
  if (!servicesData?.value)
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Không có dữ liệu</h2>
        <p className="text-muted-foreground mb-6">
          Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.
        </p>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    );

  const services = servicesData.value.items || [];
  const categories: string[] = Array.from(
    new Set(
      services
        .map((service) => service.category?.name)
        .filter(Boolean) as string[]
    )
  );

  // ... existing state ...

  // Get max price from services for the slider
  const maxPrice = Math.max(...services.map((service) => service.maxPrice));

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, maxPrice],
      showPromotionsOnly: false,
    });
  };

  // Filter services based on current filters
  const filteredServices = filterServices(services, filters);

  // Handle pagination
  const handlePreviousPage = (): void => {
    if (servicesData.value.hasPreviousPage) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const handleNextPage = (): void => {
    if (servicesData.value.hasNextPage) {
      setPageIndex((prev) => prev + 1);
    }
  };

  // Update the JSX for the filters section
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
            Dịch vụ của chúng tôi
          </Badge>
          <AnimatedText
            text="Hành trình làm đẹp của bạn"
            className="mb-4 text-white"
          />
          <div className="flex items-center justify-center gap-2 text-sm">
            <a href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </a>
            <span>/</span>
            <span className="text-primary">Dịch vụ</span>
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
                placeholder="Tìm kiếm dịch vụ..."
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến nhất</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                  <SelectItem value="name">Tên A-Z</SelectItem>
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
                Bộ lọc
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={handleResetFilters}
                >
                  <X className="h-4 w-4 mr-1" /> Xóa
                </Button>
              </h3>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Danh mục
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category.toLowerCase()}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-4 block">
                    Khoảng giá
                  </label>
                  <Slider
                    value={filters.priceRange}
                    max={maxPrice}
                    step={100000}
                    className="mb-2"
                    onValueChange={(value: [number, number]) =>
                      setFilters((prev) => ({ ...prev, priceRange: value }))
                    }
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice({ value: filters.priceRange[0] })}</span>
                    <span>{formatPrice({ value: filters.priceRange[1] })}</span>
                  </div>
                </div>

                {/* Promotions */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Khuyến mãi
                  </label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promo"
                      checked={filters.showPromotionsOnly}
                      onCheckedChange={(checked: boolean) =>
                        setFilters((prev) => ({
                          ...prev,
                          showPromotionsOnly: checked,
                        }))
                      }
                    />
                    <label htmlFor="promo" className="text-sm">
                      Chỉ hiển thị dịch vụ khuyến mãi
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Services */}
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h3 className="font-semibold mb-4">Dịch vụ phổ biến</h3>
              <div className="space-y-4">
                {services.length > 0 ? (
                  [...services]
                    .sort((a, b) => {
                      return b.maxPrice - a.maxPrice;
                    })
                    .slice(0, 3)
                    .map((service) => (
                      <div key={service.id} className="flex gap-3">
                        <Image
                          src={
                            service.coverImage?.[0]?.url ||
                            "/placeholder.svg?height=60&width=60" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={service.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-medium">
                            {service.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-xs text-muted-foreground">
                              4.9 (120)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Không có dịch vụ phổ biến
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {filteredServices.length > 0 ? (
              <Tabs defaultValue="all" className="mb-8">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category.toLowerCase()}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="all">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredServices.map((service) => (
                      <Card
                        key={service.id}
                        className="group overflow-hidden border-primary/10"
                      >
                        <CardContent className="p-0">
                          <div className="relative h-48">
                            <Image
                              src={
                                service.coverImage?.[0]?.url ||
                                "/placeholder.svg?height=200&width=300" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={service.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {service.discountPercent &&
                              service.discountPercent > 0 && (
                                <Badge className="absolute top-4 right-4 bg-primary">
                                  {service.discountPercent}% GIẢM
                                </Badge>
                              )}
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-serif font-semibold mb-2">
                              {service.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="text-sm ml-1">4.9</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                (120 đánh giá)
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">
                                {service.clinics?.[0]?.name ||
                                  "Chưa có thông tin"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  60 phút
                                </span>
                              </div>
                              <div className="text-right">
                                {service.discountPercent &&
                                  service.discountPercent > 0 &&
                                  service.maxPrice > 0 && (
                                    <span className="text-sm text-muted-foreground line-through mr-2">
                                      {service.maxPrice.toLocaleString("vi-VN")}
                                      đ
                                    </span>
                                  )}
                                <span className="text-lg font-semibold text-primary">
                                  {service.maxPrice > 0
                                    ? service.discountMaxPrice > 0
                                      ? service.discountMaxPrice.toLocaleString(
                                          "vi-VN"
                                        )
                                      : service.maxPrice.toLocaleString("vi-VN")
                                    : "Liên hệ"}
                                  {service.maxPrice > 0 ? "đ" : ""}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                variant="outline"
                                asChild
                              >
                                <a href={`/services/${service.id}`}>Chi tiết</a>
                              </Button>
                              <GradientButton className="flex-1">
                                Đặt lịch
                              </GradientButton>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                {categories.map((category) => (
                  <TabsContent key={category} value={category.toLowerCase()}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {filteredServices
                        .filter(
                          (service) => service.category?.name === category
                        )
                        .map((service) => (
                          <Card
                            key={service.id}
                            className="group overflow-hidden border-primary/10"
                          >
                            <CardContent className="p-0">
                              <div className="relative h-48">
                                <Image
                                  src={
                                    service.coverImage?.[0]?.url ||
                                    "/placeholder.svg?height=200&width=300" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={service.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                {service.discountPercent &&
                                  service.discountPercent > 0 && (
                                    <Badge className="absolute top-4 right-4 bg-primary">
                                      {service.discountPercent}% GIẢM
                                    </Badge>
                                  )}
                              </div>
                              <div className="p-6">
                                <h3 className="text-lg font-serif font-semibold mb-2">
                                  {service.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <span className="text-sm ml-1">4.9</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    (120 đánh giá)
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span className="line-clamp-1">
                                    {service.clinics?.[0]?.name ||
                                      "Chưa có thông tin"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      60 phút
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    {service.discountPercent &&
                                      service.discountPercent > 0 &&
                                      service.maxPrice > 0 && (
                                        <span className="text-sm text-muted-foreground line-through mr-2">
                                          {service.maxPrice.toLocaleString(
                                            "vi-VN"
                                          )}
                                          đ
                                        </span>
                                      )}
                                    <span className="text-lg font-semibold text-primary">
                                      {service.maxPrice > 0
                                        ? service.discountMaxPrice > 0
                                          ? service.discountMaxPrice.toLocaleString(
                                              "vi-VN"
                                            )
                                          : service.maxPrice.toLocaleString(
                                              "vi-VN"
                                            )
                                        : "Liên hệ"}
                                      {service.maxPrice > 0 ? "đ" : ""}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    className="flex-1"
                                    variant="outline"
                                    asChild
                                  >
                                    <a href={`/services/${service.id}`}>
                                      Chi tiết
                                    </a>
                                  </Button>
                                  <GradientButton className="flex-1">
                                    Đặt lịch
                                  </GradientButton>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">
                  Không tìm thấy dịch vụ nào
                </h3>
                <p className="text-muted-foreground mb-4">
                  Vui lòng thử lại sau hoặc điều chỉnh bộ lọc của bạn.
                </p>
                <Button onClick={() => refetch()}>Tải lại</Button>
              </div>
            )}

            {/* Pagination */}
            {services.length > 0 && (
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  disabled={!servicesData.value.hasPreviousPage}
                  onClick={handlePreviousPage}
                >
                  Trước
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
                        className="w-10 h-10 p-0"
                        onClick={() => setPageIndex(i + 1)}
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
                >
                  Tiếp
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Sẵn sàng cho hành trình làm đẹp của bạn?
            </h2>
            <p className="text-muted-foreground mb-8">
              Đặt lịch tư vấn miễn phí với các chuyên gia của chúng tôi ngay hôm
              nay.
            </p>
            <GradientButton size="lg">Đặt lịch tư vấn miễn phí</GradientButton>
          </div>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10k+</div>
              <div className="text-sm text-muted-foreground">
                Khách hàng hài lòng
              </div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.9</div>
              <div className="text-sm text-muted-foreground">
                Đánh giá trung bình
              </div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">
                Năm kinh nghiệm
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
