"use client";
// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { GradientButton } from "@/components/ui/gradient-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Icons
import {
  Star,
  Clock,
  CalendarIcon,
  MessageCircle,
  Phone,
  ChevronRight,
  CheckCircle,
  MapPin,
} from "lucide-react";

// Next.js
import Image from "next/image";
import { useGetServiceByIdQuery } from "@/features/services/api";
import { useParams } from "next/navigation";
import Link from "next/link";

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

const DEFAULT_PROCEDURE_STEPS = [
  {
    title: "Tư vấn và thăm khám",
    description:
      "Bác sĩ thăm khám, đánh giá tình trạng mũi và khuôn mặt, tư vấn phương pháp phù hợp.",
  },
  {
    title: "Thiết kế dáng mũi",
    description:
      "Sử dụng công nghệ mô phỏng 3D để thiết kế dáng mũi phù hợp với khuôn mặt.",
  },
  {
    title: "Chuẩn bị trước phẫu thuật",
    description:
      "Kiểm tra sức khỏe tổng quát, chụp phim, xét nghiệm cần thiết để đảm bảo an toàn.",
  },
  {
    title: "Gây mê",
    description:
      "Tùy theo phương pháp, có thể sử dụng gây mê cục bộ hoặc gây mê toàn thân.",
  },
  {
    title: "Thực hiện phẫu thuật",
    description:
      "Bác sĩ tạo đường mổ, đặt sụn và định hình dáng mũi theo thiết kế.",
  },
  {
    title: "Khâu đóng vết mổ",
    description: "Sử dụng chỉ tự tiêu, đảm bảo thẩm mỹ và giảm thiểu sẹo.",
  },
  {
    title: "Theo dõi hậu phẫu",
    description:
      "Theo dõi tình trạng sau phẫu thuật, hướng dẫn chăm sóc tại nhà.",
  },
];

const RELATED_SERVICES = [
  {
    id: 1,
    name: "Nâng mũi S-line",
    price: 1200,
    rating: 4.8,
    reviews: 48,
  },
  {
    id: 2,
    name: "Nâng mũi sụn tự thân",
    price: 1500,
    rating: 4.9,
    reviews: 52,
  },
  {
    id: 3,
    name: "Nâng mũi không phẫu thuật",
    price: 1000,
    rating: 4.7,
    reviews: 36,
  },
];

// Loading Skeleton Component
function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner Section Skeleton */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
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

      <div className="container px-4 mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            {/* Image Gallery Skeleton */}
            <div className="mb-12">
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>

            {/* Tabs Skeleton */}
            <div className="mb-12">
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
                <CardContent className="p-6">
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

                  <Separator className="my-6" />

                  <div className="text-center">
                    <Skeleton className="h-4 w-32 mx-auto mb-2" />
                    <Skeleton className="h-6 w-40 mx-auto" />
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form Skeleton */}
              <Card className="border-primary/10">
                <CardContent className="p-6">
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

        {/* Related Services Skeleton */}
        <section className="mt-16">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-primary/10">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-10 w-28 rounded-md" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section Skeleton */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mx-auto mb-8" />
            <Skeleton className="h-12 w-40 mx-auto rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ServiceDetail() {
  const { id } = useParams() as { id: string };

  const { data: serviceData, error, isLoading } = useGetServiceByIdQuery(id);

  // Show loading skeleton while data is being fetched
  if (isLoading) return <ServiceDetailSkeleton />;

  if (error)
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Không thể tải thông tin dịch vụ
        </h2>
        <p className="text-muted-foreground mb-6">
          Đã xảy ra lỗi khi tải thông tin chi tiết. Vui lòng thử lại sau.
        </p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );

  if (!serviceData?.value)
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy dịch vụ</h2>
        <p className="text-muted-foreground mb-6">
          Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link href="/services">Quay lại danh sách dịch vụ</Link>
        </Button>
      </div>
    );

  const service = serviceData.value;

  // Calculate discount information
  const hasDiscount =
    service.discountMaxPrice > 0 &&
    service.maxPrice > 0 &&
    service.discountMaxPrice < service.maxPrice;

  const discountPercent = hasDiscount
    ? Math.round(100 - (service.discountMaxPrice / service.maxPrice) * 100)
    : 0;

  // Combine images for gallery
  const allImages = [
    ...(service.coverImage || []),
    ...(service.descriptionImage || []),
  ];

  // Helper function to render star ratings
  const renderStars = (count = 5, size = 5) => (
    <div className="flex">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={`h-${size} w-${size} fill-primary text-primary`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={
              service.coverImage?.[0]?.url ||
              "/placeholder.svg?height=800&width=1600" ||
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
            <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href="/services"
                className="hover:text-primary transition-colors"
              >
                Dịch vụ
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="#" className="hover:text-primary transition-colors">
                {service.category?.name || "Uncategorized"}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary">{service.name}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Phổ biến</Badge>
              {hasDiscount && (
                <Badge variant="destructive">{discountPercent}% GIẢM</Badge>
              )}
              <Badge variant="outline" className="bg-white/10">
                Mới
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
              {service.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center">
                {renderStars()}
                <span className="ml-2">5.0</span>
              </div>
              <span className="text-white/60">(128 đánh giá)</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Carousel className="mb-12">
              <CarouselContent>
                {allImages.length > 0 ? (
                  allImages.map((image, index) => (
                    <CarouselItem key={image.id}>
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`${service.name} - Hình ảnh ${index + 1}`}
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
                        src="/placeholder.svg?height=400&width=600"
                        alt="Hình ảnh mặc định"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            {/* Service Details Tabs */}
            <Tabs defaultValue="overview" className="mb-12">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="procedure">Quy trình</TabsTrigger>
                <TabsTrigger value="technology">Công nghệ</TabsTrigger>
                <TabsTrigger value="results">Kết quả</TabsTrigger>
                <TabsTrigger value="experts">Chuyên gia</TabsTrigger>
                <TabsTrigger value="faq">Hỏi đáp</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Lợi ích
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {BENEFITS.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Phù hợp với
                  </h3>
                  <ul className="list-disc list-inside mb-8 space-y-2">
                    {SUITABLE_FOR.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  {service.descriptionImage?.length > 0 && (
                    <div className="relative rounded-lg overflow-hidden mb-8">
                      <Image
                        src={
                          service.descriptionImage[0].url || "/placeholder.svg"
                        }
                        alt="Quy trình điều trị"
                        width={800}
                        height={400}
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Procedure Tab */}
              <TabsContent value="procedure" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Quy trình thực hiện
                  </h3>

                  {service.procedures?.length > 0 ? (
                    <div className="space-y-8">
                      {service.procedures.map((procedure, index) => (
                        <div
                          key={procedure.id}
                          className="border-l-4 border-primary pl-4"
                        >
                          <h4 className="text-xl font-medium mb-2">
                            {index + 1}. {procedure.name}
                          </h4>
                          <p className="text-muted-foreground mb-4">
                            {procedure.description}
                          </p>

                          {procedure.coverImage.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              {procedure.coverImage.map((imgUrl, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="relative rounded-lg overflow-hidden aspect-video"
                                >
                                  <Image
                                    src={imgUrl || "/placeholder.svg"}
                                    alt={`${procedure.name} - Hình ảnh ${
                                      imgIndex + 1
                                    }`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {procedure.procedurePriceTypes.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">
                                Các loại dịch vụ:
                              </h5>
                              <div className="space-y-2">
                                {procedure.procedurePriceTypes.map(
                                  (priceType) => (
                                    <div
                                      key={priceType.id}
                                      className="flex justify-between items-center p-2 bg-muted rounded-md"
                                    >
                                      <span>{priceType.name}</span>
                                      <span className="font-semibold text-primary">
                                        {priceType.price.toLocaleString(
                                          "vi-VN"
                                        )}
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
                    <ol className="list-decimal list-inside space-y-4 mb-8">
                      {DEFAULT_PROCEDURE_STEPS.map((step, index) => (
                        <li key={index} className="pl-2">
                          <span className="font-medium">{step.title}:</span>{" "}
                          {step.description}
                        </li>
                      ))}
                    </ol>
                  )}

                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Thời gian phục hồi
                  </h3>
                  <ul className="list-disc list-inside mb-8 space-y-2">
                    {RECOVERY_TIMELINE.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  {/* Rating Overview */}
                  <div className="grid md:grid-cols-2 gap-8 p-6 bg-muted rounded-lg">
                    <div>
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold mb-2">4.9</div>
                        <div className="flex justify-center mb-2">
                          {renderStars()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Dựa trên 128 đánh giá
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-4">
                          <div className="w-12 text-sm text-muted-foreground">
                            {rating} sao
                          </div>
                          <Progress
                            value={rating === 5 ? 85 : rating === 4 ? 10 : 5}
                            className="flex-1"
                          />
                          <div className="w-12 text-sm text-muted-foreground text-right">
                            {rating === 5 ? "85%" : rating === 4 ? "10%" : "5%"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="p-6 bg-card rounded-lg border border-border"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <Image
                            src="/placeholder.svg?height=40&width=40"
                            alt="Người đánh giá"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">Nguyễn Thị Hương</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(5, 4)}
                              <span className="text-sm text-muted-foreground">
                                1 tháng trước
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Kết quả tuyệt vời! Quá trình phẫu thuật rất nhẹ nhàng
                          và mũi của tôi trông rất tự nhiên. Đội ngũ y bác sĩ
                          chuyên nghiệp và tận tâm. Rất hài lòng với dịch vụ!
                        </p>
                        <div className="flex gap-2">
                          <Image
                            src="/placeholder.svg?height=80&width=80"
                            alt="Hình ảnh đánh giá"
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                          <Image
                            src="/placeholder.svg?height=80&width=80"
                            alt="Hình ảnh đánh giá"
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Price Card */}
              <Card className="border-primary/10 shadow-lg mb-6">
                <CardContent className="p-6">
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
                        <Badge variant="destructive">
                          Tiết kiệm {discountPercent}%
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>60-90 phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <span>Thời gian hồi phục: 7-10 ngày</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="line-clamp-1">
                        {service.clinics?.[0]?.name || "Location unavailable"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <GradientButton className="w-full" size="lg">
                      Đặt lịch ngay
                    </GradientButton>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Tư vấn trực tuyến
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">
                      Cần hỗ trợ?
                    </div>
                    <div className="font-semibold text-lg flex items-center justify-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      {service.clinics?.[0]?.phoneNumber || "1800-BEAUTIFY"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Form Card */}
              <Card className="border-primary/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Đặt lịch nhanh</h3>
                  <form className="space-y-4">
                    <div>
                      <Input placeholder="Họ và tên" />
                    </div>
                    <div>
                      <Input placeholder="Số điện thoại" />
                    </div>
                    <div>
                      <Input placeholder="Email (Không bắt buộc)" />
                    </div>
                    <div>
                      <Calendar className="rounded-md border" />
                    </div>
                    <div>
                      <Textarea placeholder="Ghi chú thêm (Không bắt buộc)" />
                    </div>
                    <Button className="w-full">Gửi yêu cầu đặt lịch</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-8">
            Dịch vụ liên quan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {RELATED_SERVICES.map((relatedService) => (
              <Card
                key={relatedService.id}
                className="group overflow-hidden border-primary/10"
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt={`Dịch vụ liên quan: ${relatedService.name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-semibold mb-2">
                      {relatedService.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(5, 4)}
                      <span className="text-sm text-muted-foreground">
                        ({relatedService.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">
                        {relatedService.price.toLocaleString("vi-VN")}đ
                      </div>
                      <Button variant="outline">Xem chi tiết</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Sẵn sàng cho hành trình làm đẹp của bạn?
            </h2>
            <p className="text-muted-foreground mb-8">
              Đặt lịch {service.name} ngay hôm nay và nhận ưu đãi đặc biệt dành
              cho khách hàng mới.
            </p>
            <GradientButton size="lg">Đặt lịch ngay</GradientButton>
          </div>
        </div>
      </section>
    </div>
  );
}
