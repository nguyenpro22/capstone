"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedText } from "@/components/ui/animated-text";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils";
import { useGetAllServicesQuery } from "@/features/services/api";

export function ServicesSection() {
  const t = useTranslations("home");
  const router = useRouter();

  // Sử dụng hook để fetch dữ liệu
  const { data, isLoading, error, refetch } = useGetAllServicesQuery({
    pageIndex: 1,
    pageSize: 3,
  });

  // Lấy danh sách dịch vụ từ response
  const serviceList = data?.value?.items || [];

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 bg-white dark:bg-gray-800 border-primary/20 text-primary"
          >
            {t("services.badge")}
          </Badge>
          <AnimatedText
            text={t("services.title")}
            className="text-3xl md:text-4xl font-bold mb-4"
          />
          <p className="text-muted-foreground font-light leading-relaxed">
            {t("services.description")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg">Đang tải dịch vụ...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Có lỗi xảy ra khi tải dịch vụ. Vui lòng thử lại sau.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => refetch()}
            >
              Thử lại
            </Button>
          </div>
        ) : serviceList.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">
              Không có dịch vụ nào được tìm thấy.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceList.map((service) => (
              <Card
                key={service.id}
                className="group overflow-hidden border-primary/10 dark:bg-gray-800/50 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              >
                <CardContent className="p-0">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={
                        service.coverImage?.[0]?.url ||
                        `/placeholder.svg?height=300&width=400&text=${
                          encodeURIComponent(service.name) || "/placeholder.svg"
                        }`
                      }
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {service.promotions && service.promotions.length > 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-white px-2 py-1">
                          -{service.promotions[0].discountPercent}%
                        </Badge>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white mb-1 drop-shadow-md">
                        {service.name}
                      </h3>
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="bg-white/20 backdrop-blur-sm text-white border-white/20"
                        >
                          {service.category.name}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Giá từ
                        </div>
                        <div className="flex items-center gap-2">
                          {service.discountPercent !== "0" && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(service.minPrice)}
                            </span>
                          )}
                          <span className="text-primary font-medium">
                            {formatCurrency(service.discountMinPrice)}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full group-hover:translate-x-2 transition-transform"
                        onClick={() => handleServiceClick(service.id)}
                      >
                        {t("services.learnMore")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            onClick={() => router.push("/services")}
          >
            {t("services.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
