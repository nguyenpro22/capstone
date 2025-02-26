import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AnimatedText } from "@/components/ui/animated-text"
import { GradientButton } from "@/components/ui/gradient-button"
import { Search, Grid, List, Star, Clock, X, MapPin } from "lucide-react"
import Image from "next/image"

// Define types based on the API response
interface ServiceImage {
  id: string
  index: number
  url: string
}

interface Clinic {
  id: string
  name: string
  email: string
  address: string
  phoneNumber: string
  profilePictureUrl: string
  isParent: boolean
  parentId: string | null
}

interface Category {
  id: string
  name: string
  description: string
}

interface Service {
  id: string
  name: string
  maxPrice: number
  minPrice: number
  discountPercent: string
  discountMaxPrice: number
  discountMinPrice: number
  coverImage: ServiceImage[]
  clinics: Clinic[]
  category: Category
}

interface ServicesResponse {
  value: {
    items: Service[]
    pageIndex: number
    pageSize: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  isSuccess: boolean
  isFailure: boolean
  error: {
    code: string
    message: string
  }
}

export default function ServicesPage() {
  // Mock data from the API response
  const servicesData: ServicesResponse = {
    value: {
      items: [
        {
          id: "458176ae-5289-4567-b392-d9e83afb2911",
          name: "Nâng mũi cấu trúc",
          maxPrice: 15000000,
          minPrice: 10000000,
          discountPercent: "15",
          discountMaxPrice: 12750000,
          discountMinPrice: 8500000,
          coverImage: [
            {
              id: "2312d98c-8b73-4438-88a0-bbaeaad4000f",
              index: 0,
              url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576255/gynaxhkdy9u3c8id159o.png",
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
        },
        {
          id: "9d7f324c-9c21-499a-816c-c795569369a1",
          name: "Nâng mũi S-line",
          maxPrice: 18000000,
          minPrice: 12000000,
          discountPercent: "10",
          discountMaxPrice: 16200000,
          discountMinPrice: 10800000,
          coverImage: [
            {
              id: "262dfe86-829b-424e-b71e-4fb22aef007d",
              index: 0,
              url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576292/bvjdoprqtgcdrcdw6nal.png",
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
        },
        {
          id: "4abdda5b-b159-476d-92a3-b1a8f8e90a40",
          name: "Nâng mũi sụn tự thân",
          maxPrice: 20000000,
          minPrice: 15000000,
          discountPercent: "20",
          discountMaxPrice: 16000000,
          discountMinPrice: 12000000,
          coverImage: [
            {
              id: "725e6059-e049-4079-8877-54d4cd865c51",
              index: 0,
              url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576307/tsuifsuvoat7glsh2mnl.png",
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
        },
        {
          id: "97abbee3-70f7-4a91-a56c-a6fbf1adf7ce",
          name: "Nâng mũi không phẫu thuật",
          maxPrice: 8000000,
          minPrice: 5000000,
          discountPercent: "5",
          discountMaxPrice: 7600000,
          discountMinPrice: 4750000,
          coverImage: [
            {
              id: "2d6de37b-6d87-4d50-9464-c75948e924b6",
              index: 0,
              url: "https://res.cloudinary.com/dvadlh7ah/image/upload/v1740576329/wvdip6emeyzj9zlfijy5.png",
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
        },
      ],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 4,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isSuccess: true,
    isFailure: false,
    error: {
      code: "",
      message: "",
    },
  }

  const services = servicesData.value.items
  const categories = Array.from(new Set(services.map((service) => service.category.name)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Banner */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/placeholder.svg?height=600&width=1200" alt="Services Banner" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 container px-4 mx-auto text-center text-white">
          <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-4">
            Dịch vụ của chúng tôi
          </Badge>
          <AnimatedText text="Hành trình làm đẹp của bạn" className="mb-4 text-white" />
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
              <Input placeholder="Tìm kiếm dịch vụ..." className="pl-10 bg-white dark:bg-gray-800" />
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
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <X className="h-4 w-4 mr-1" /> Xóa
                </Button>
              </h3>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Danh mục</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả dịch vụ</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-4 block">Khoảng giá</label>
                  <Slider defaultValue={[0, 20000000]} max={20000000} step={1000000} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0đ</span>
                    <span>20.000.000đ</span>
                  </div>
                </div>

                {/* Promotions */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Khuyến mãi</label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="promo" />
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
                {services.slice(0, 3).map((service) => (
                  <div key={service.id} className="flex gap-3">
                    <Image
                      src={service.coverImage[0]?.url || "/placeholder.svg?height=60&width=60"}
                      alt={service.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-medium">{service.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs text-muted-foreground">4.9 (120)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
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
                  {services.map((service) => (
                    <Card key={service.id} className="group overflow-hidden border-primary/10">
                      <CardContent className="p-0">
                        <div className="relative h-48">
                          <Image
                            src={service.coverImage[0]?.url || "/placeholder.svg?height=200&width=300"}
                            alt={service.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          {Number.parseInt(service.discountPercent) > 0 && (
                            <Badge className="absolute top-4 right-4 bg-primary">{service.discountPercent}% GIẢM</Badge>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-serif font-semibold mb-2">{service.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="text-sm ml-1">4.9</span>
                            </div>
                            <span className="text-sm text-muted-foreground">(120 đánh giá)</span>
                          </div>
                          <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{service.clinics[0]?.name}</span>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">60 phút</span>
                            </div>
                            <div className="text-right">
                              {Number.parseInt(service.discountPercent) > 0 && (
                                <span className="text-sm text-muted-foreground line-through mr-2">
                                  {service.maxPrice.toLocaleString("vi-VN")}đ
                                </span>
                              )}
                              <span className="text-lg font-semibold text-primary">
                                {service.discountMaxPrice > 0
                                  ? service.discountMaxPrice.toLocaleString("vi-VN")
                                  : service.maxPrice.toLocaleString("vi-VN")}
                                đ
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1" variant="outline">
                              Chi tiết
                            </Button>
                            <GradientButton className="flex-1">Đặt lịch</GradientButton>
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
                    {services
                      .filter((service) => service.category.name === category)
                      .map((service) => (
                        <Card key={service.id} className="group overflow-hidden border-primary/10">
                          <CardContent className="p-0">
                            <div className="relative h-48">
                              <Image
                                src={service.coverImage[0]?.url || "/placeholder.svg?height=200&width=300"}
                                alt={service.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              {Number.parseInt(service.discountPercent) > 0 && (
                                <Badge className="absolute top-4 right-4 bg-primary">
                                  {service.discountPercent}% GIẢM
                                </Badge>
                              )}
                            </div>
                            <div className="p-6">
                              <h3 className="text-lg font-serif font-semibold mb-2">{service.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                  <span className="text-sm ml-1">4.9</span>
                                </div>
                                <span className="text-sm text-muted-foreground">(120 đánh giá)</span>
                              </div>
                              <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="line-clamp-1">{service.clinics[0]?.name}</span>
                              </div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">60 phút</span>
                                </div>
                                <div className="text-right">
                                  {Number.parseInt(service.discountPercent) > 0 && (
                                    <span className="text-sm text-muted-foreground line-through mr-2">
                                      {service.maxPrice.toLocaleString("vi-VN")}đ
                                    </span>
                                  )}
                                  <span className="text-lg font-semibold text-primary">
                                    {service.discountMaxPrice > 0
                                      ? service.discountMaxPrice.toLocaleString("vi-VN")
                                      : service.maxPrice.toLocaleString("vi-VN")}
                                    đ
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button className="flex-1" variant="outline">
                                  Chi tiết
                                </Button>
                                <GradientButton className="flex-1">Đặt lịch</GradientButton>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="outline" disabled={!servicesData.value.hasPreviousPage}>
                Trước
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-10 h-10 p-0">
                  1
                </Button>
                {servicesData.value.totalCount > servicesData.value.pageSize && (
                  <>
                    <Button variant="outline" className="w-10 h-10 p-0">
                      2
                    </Button>
                  </>
                )}
              </div>
              <Button variant="outline" disabled={!servicesData.value.hasNextPage}>
                Tiếp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Sẵn sàng cho hành trình làm đẹp của bạn?</h2>
            <p className="text-muted-foreground mb-8">
              Đặt lịch tư vấn miễn phí với các chuyên gia của chúng tôi ngay hôm nay.
            </p>
            <GradientButton size="lg">Đặt lịch tư vấn miễn phí</GradientButton>
          </div>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10k+</div>
              <div className="text-sm text-muted-foreground">Khách hàng hài lòng</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.9</div>
              <div className="text-sm text-muted-foreground">Đánh giá trung bình</div>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

