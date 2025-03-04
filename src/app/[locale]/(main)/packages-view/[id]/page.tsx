"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Share,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PackageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - would be fetched from API in real implementation
  const packageData = {
    id: params.id,
    name: "Premium Facial Treatment Package",
    clinic: "Beauty Clinic Saigon",
    rating: 4.8,
    reviewCount: 124,
    price: 2500000,
    discountPrice: 1800000,
    location: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    description:
      "Gói điều trị da mặt cao cấp với các sản phẩm nhập khẩu từ Hàn Quốc. Phù hợp với mọi loại da, đặc biệt hiệu quả với da dầu và da mụn.",
    duration: "60 phút / lần",
    sessions: 5,
    benefits: [
      "Làm sạch sâu lỗ chân lông",
      "Giảm mụn và thâm",
      "Dưỡng ẩm chuyên sâu",
      "Tái tạo tế bào da",
      "Massage thư giãn",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm pt-4 pb-2 border-b border-primary/10">
        <div className="container flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Chi tiết gói làm đẹp</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-primary text-primary" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container pb-20">
        <div className="relative h-72 w-full overflow-hidden rounded-2xl mt-4 shadow-lg">
          <Image
            src={packageData.images[0] || "/placeholder.svg"}
            alt={packageData.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="bg-primary/90 text-white border-none mb-2">
              Giảm 28%
            </Badge>
            <h2 className="text-2xl font-bold text-white">
              {packageData.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center bg-black/30 rounded-full px-2 py-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium text-white">
                  {packageData.rating}
                </span>
              </div>
              <span className="text-sm text-white/80">
                ({packageData.reviewCount} đánh giá)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm border border-primary/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage
                src="/placeholder.svg?height=48&width=48"
                alt={packageData.clinic}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                BC
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{packageData.clinic}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{packageData.location}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(packageData.discountPrice)}
                </span>
                <span className="text-sm line-through text-muted-foreground">
                  {formatPrice(packageData.price)}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Tiết kiệm{" "}
                  {formatPrice(packageData.price - packageData.discountPrice)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {packageData.duration}
                </p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {packageData.sessions} buổi
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-lg">
              Chi tiết
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg">
              Đánh giá
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <Card className="border-primary/10 dark:bg-gray-800/50 overflow-hidden">
                <CardContent className="p-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {packageData.description}
                  </p>
                </CardContent>
              </Card>

              <div>
                <h3 className="font-medium mb-3 ml-1">Lợi ích</h3>
                <Card className="border-primary/10 dark:bg-gray-800/50 overflow-hidden">
                  <CardContent className="p-4">
                    <ul className="space-y-3">
                      {packageData.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 group"
                        >
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="group-hover:text-primary transition-colors">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-medium mb-3 ml-1">Hình ảnh</h3>
                <div className="grid grid-cols-3 gap-2">
                  {packageData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${packageData.name} - Hình ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <div className="space-y-6">
              <Card className="border-primary/10 dark:bg-gray-800/50 overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Quy trình điều trị</h3>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3 group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs text-white shrink-0 group-hover:shadow-md transition-shadow">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Làm sạch da
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sử dụng sữa rửa mặt chuyên dụng để loại bỏ bụi bẩn và
                          dầu thừa
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs text-white shrink-0 group-hover:shadow-md transition-shadow">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Tẩy tế bào chết
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Loại bỏ tế bào chết và làm thông thoáng lỗ chân lông
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs text-white shrink-0 group-hover:shadow-md transition-shadow">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Điều trị chuyên sâu
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sử dụng máy công nghệ cao để điều trị các vấn đề da
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs text-white shrink-0 group-hover:shadow-md transition-shadow">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Đắp mặt nạ
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sử dụng mặt nạ dưỡng chất phù hợp với từng loại da
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-xs text-white shrink-0 group-hover:shadow-md transition-shadow">
                        5
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Dưỡng ẩm và chống nắng
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Kết thúc với kem dưỡng ẩm và kem chống nắng
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-primary/10 dark:bg-gray-800/50 overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Lưu ý</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3 group">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors">
                        Không sử dụng các sản phẩm có chứa acid trong 24h trước
                        khi điều trị
                      </span>
                    </li>
                    <li className="flex items-start gap-3 group">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors">
                        Tránh tiếp xúc với ánh nắng mặt trời sau khi điều trị
                      </span>
                    </li>
                    <li className="flex items-start gap-3 group">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors">
                        Uống nhiều nước và giữ da luôn sạch
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="ml-1 text-lg font-medium">
                      {packageData.rating}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      ({packageData.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  Lọc
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <Card
                    key={index}
                    className="border-primary/10 dark:bg-gray-800/50 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40&text=TH${index}`}
                              alt="User Avatar"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              TH
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Trần Hương</p>
                            <p className="text-xs text-muted-foreground">
                              2 tháng trước
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 5 - index
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground">
                        Dịch vụ rất tốt, nhân viên nhiệt tình và chuyên nghiệp.
                        Sau 3 lần điều trị, da mặt mình đã cải thiện rõ rệt. Sẽ
                        tiếp tục sử dụng dịch vụ.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-0 left-0 right-0 border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4">
          <GradientButton className="w-full" size="lg">
            <Link href={`/checkout/${params.id}`}>Đặt mua ngay</Link>
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
