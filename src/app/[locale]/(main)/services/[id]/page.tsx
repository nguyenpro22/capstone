import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
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
import { GradientButton } from "@/components/ui/gradient-button";

// Define types based on the API response
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

type Procedure = {};

interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  discountMaxPrice: number;
  discountMinPrice: number;
  coverImage: ServiceImage[];
  descriptionImage: ServiceImage[];
  clinics: Clinic[];
  category: Category;
  procedures: Procedure[];
}

interface ServiceDetailResponse {
  value: ServiceDetail;
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

export default function ServiceDetail() {
  // Mock data from the API response
  const serviceData: ServiceDetailResponse = {
    value: {
      id: "458176ae-5289-4567-b392-d9e83afb2911",
      name: "Nâng mũi cấu trúc",
      description:
        "Dịch vụ nâng mũi cấu trúc sử dụng công nghệ tiên tiến, giúp tạo dáng mũi cao, thon gọn và tự nhiên. Phương pháp này phù hợp với nhiều đối tượng khách hàng, đảm bảo tính thẩm mỹ và an toàn.",
      maxPrice: 15000000,
      minPrice: 10000000,
      discountMaxPrice: 12750000,
      discountMinPrice: 8500000,
      coverImage: [
        {
          id: "2312d98c-8b73-4438-88a0-bbaeaad4000f",
          index: 0,
          url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576255/gynaxhkdy9u3c8id159o.png",
        },
      ],
      descriptionImage: [
        {
          id: "e2233885-c286-48fe-9641-96c1600a3f88",
          index: 0,
          url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576257/zb2kg2egoc9v26suet1e.png",
        },
      ],
      clinics: [
        {
          id: "8bce32aa-88e8-49f9-b761-a5b076f95e52",
          name: "Beauty Clinic Saigon",
          email: "tan182205@gmail.com",
          address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
          phoneNumber: "+84979901551",
          profilePictureUrl:
            "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740575109/c2fpxfjhi1bpcfqys7ax.png",
          isParent: true,
          parentId: null,
        },
      ],
      category: {
        id: "11111111-1111-1111-1111-111111111112",
        name: "Nâng mũi",
        description: "Nhóm dịch vụ thẩm mỹ nâng mũi",
      },
      procedures: [],
    },
    isSuccess: true,
    isFailure: false,
    error: {
      code: "",
      message: "",
    },
  };

  const service = serviceData.value;
  const hasDiscount =
    service.discountMaxPrice > 0 && service.discountMaxPrice < service.maxPrice;
  const discountPercent = hasDiscount
    ? Math.round(100 - (service.discountMaxPrice / service.maxPrice) * 100)
    : 0;

  // Combine cover and description images for the gallery
  const allImages = [...service.coverImage, ...service.descriptionImage];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={
              service.coverImage[0]?.url ||
              "/placeholder.svg?height=800&width=1600"
            }
            alt={service.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 container px-4 mx-auto">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
              <a href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </a>
              <ChevronRight className="h-4 w-4" />
              <a
                href="/services"
                className="hover:text-primary transition-colors"
              >
                Dịch vụ
              </a>
              <ChevronRight className="h-4 w-4" />
              <a href="#" className="hover:text-primary transition-colors">
                {service.category.name}
              </a>
              <ChevronRight className="h-4 w-4" />
              <span className="text-primary">{service.name}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Phổ biến</Badge>
              {hasDiscount && (
                <Badge variant="destructive">{discountPercent}% GIẢM</Badge>
              )}
              <Badge variant="outline" className="bg-white/10">
                Mới
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
              {service.name}
            </h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
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
            {/* Gallery */}
            <Carousel className="mb-12">
              <CarouselContent>
                {allImages.map((image, index) => (
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
                ))}
                {allImages.length === 0 && (
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

            {/* Service Details */}
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

              <TabsContent value="overview" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Lợi ích
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[
                      "Tạo dáng mũi cao, thon gọn",
                      "Cải thiện tỷ lệ khuôn mặt",
                      "Tự nhiên, hài hòa với gương mặt",
                      "Thời gian phục hồi nhanh",
                      "Kết quả lâu dài",
                      "An toàn, ít biến chứng",
                    ].map((benefit, index) => (
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
                    <li>Người có sống mũi thấp, bẹt</li>
                    <li>Người có mũi tẹt, mũi hếch</li>
                    <li>Người muốn cải thiện tỷ lệ khuôn mặt</li>
                    <li>
                      Người đã từng nâng mũi nhưng không đạt kết quả mong muốn
                    </li>
                  </ul>

                  {service.descriptionImage.length > 0 && (
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

              <TabsContent value="procedure" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Quy trình thực hiện
                  </h3>
                  <ol className="list-decimal list-inside space-y-4 mb-8">
                    <li className="pl-2">
                      <span className="font-medium">Tư vấn và thăm khám:</span>{" "}
                      Bác sĩ thăm khám, đánh giá tình trạng mũi và khuôn mặt, tư
                      vấn phương pháp phù hợp.
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Thiết kế dáng mũi:</span> Sử
                      dụng công nghệ mô phỏng 3D để thiết kế dáng mũi phù hợp
                      với khuôn mặt.
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">
                        Chuẩn bị trước phẫu thuật:
                      </span>{" "}
                      Kiểm tra sức khỏe tổng quát, chụp phim, xét nghiệm cần
                      thiết để đảm bảo an toàn.
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Gây mê:</span> Tùy theo
                      phương pháp, có thể sử dụng gây mê cục bộ hoặc gây mê toàn
                      thân.
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Thực hiện phẫu thuật:</span>{" "}
                      Bác sĩ tạo đường mổ, đặt sụn và định hình dáng mũi theo
                      thiết kế.
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Khâu đóng vết mổ:</span> Sử
                      dụng chỉ tự tiêu, đảm bảo thẩm mỹ và giảm thiểu sẹo.
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Theo dõi hậu phẫu:</span>{" "}
                      Theo dõi tình trạng sau phẫu thuật, hướng dẫn chăm sóc tại
                      nhà.
                    </li>
                  </ol>

                  <h3 className="text-2xl font-serif font-semibold mb-4">
                    Thời gian phục hồi
                  </h3>
                  <ul className="list-disc list-inside mb-8 space-y-2">
                    <li>Sau 1-2 ngày: Có thể sinh hoạt nhẹ nhàng</li>
                    <li>Sau 7-10 ngày: Tháo băng, rút chỉ (nếu có)</li>
                    <li>
                      Sau 2-3 tuần: Sưng giảm đáng kể, có thể quay lại công việc
                    </li>
                    <li>
                      Sau 1-3 tháng: Mũi ổn định dần, đạt kết quả cuối cùng
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  {/* Rating Overview */}
                  <div className="grid md:grid-cols-2 gap-8 p-6 bg-muted rounded-lg">
                    <div>
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold mb-2">4.9</div>
                        <div className="flex justify-center mb-2">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <Star className="h-5 w-5 fill-primary text-primary" />
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
                              <div className="flex">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <Star className="h-4 w-4 fill-primary text-primary" />
                              </div>
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
                        {service.clinics[0]?.name}
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
                      {service.clinics[0]?.phoneNumber || "1800-BEAUTIFY"}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="group overflow-hidden border-primary/10"
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt={`Dịch vụ liên quan ${item}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-semibold mb-2">
                      {item === 1
                        ? "Nâng mũi S-line"
                        : item === 2
                        ? "Nâng mũi sụn tự thân"
                        : "Nâng mũi không phẫu thuật"}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <Star className="h-4 w-4 fill-primary text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        (48)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">
                        {(item === 1
                          ? 12000000
                          : item === 2
                          ? 15000000
                          : 8000000
                        ).toLocaleString("vi-VN")}
                        đ
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
