"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronRight, Loader2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils";
import { useGetAllServicesQuery } from "@/features/services/api";
import { AnimatedText } from "@/components/ui/animated-text";

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
        <div className="text-center max-w-5xl mx-auto mb-12 md:mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 bg-white dark:bg-gray-800 border-primary/20 text-primary"
          >
            {t("services.badge")}
          </Badge>
          <AnimatedText
            text={t("services.title")}
            className="font-bold mb-4"
            variant="h2"
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
                className="group overflow-hidden border-primary/10 dark:bg-gray-800/50 hover:shadow-xl transition-all duration-300 hover:border-primary/30 cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={
                        // service.coverImage?.[0]?.url ||
                        `https://placehold.co/600x400.png`
                      }
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {Number(service.discountPercent) > 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-white px-3 py-1.5 text-sm font-medium rounded-full shadow-lg">
                          -{service.discountPercent}%
                        </Badge>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md group-hover:text-primary-foreground transition-colors">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-white/20 backdrop-blur-sm text-white border-white/20"
                        >
                          {service.category.name}
                        </Badge>
                        <div className="flex items-center text-yellow-400 text-xs">
                          <Star className="h-3.5 w-3.5 fill-current mr-1" />
                          <span>4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                          {t("services.priceFrom")}
                        </div>
                        <div className="flex items-center gap-2">
                          {Number(service.discountPercent) > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(service.minPrice)}
                            </span>
                          )}
                          <span className="text-primary font-semibold text-lg">
                            {formatCurrency(
                              service.discountMinPrice || service.minPrice
                            )}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:translate-x-1"
                      >
                        {t("services.learnMore")}
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
