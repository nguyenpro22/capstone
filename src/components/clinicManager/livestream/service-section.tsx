"use client";

import Image from "next/image";
import React from "react";
import "react-quill/dist/quill.snow.css";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface Service {
  id: string;
  name: string;
  description?: string;
  category?: {
    name: string;
  };
  minPrice: number;
  maxPrice: number;
  discountLivePercent: number;
  visible: boolean;
  images?: string[];
}

interface ServiceSectionProps {
  services: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service) => void;
  setPromotionService: (
    serviceId: string,
    percent: number | string
  ) => Promise<void>;
  displayService: (serviceId: string, isDisplay?: boolean) => Promise<void>;
  setServices?: React.Dispatch<React.SetStateAction<Service[]>>;
}

export default function ServiceSection({
  services,
  selectedService,
  setSelectedService,
  setPromotionService,
  displayService,
  setServices,
}: ServiceSectionProps) {
  const [promotionValue, setPromotionValue] = React.useState<number>(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterVisible, setFilterVisible] = React.useState<boolean | null>(
    null
  );

  React.useEffect(() => {
    if (selectedService) {
      setPromotionValue(selectedService.discountLivePercent || 0);
    }
  }, [selectedService]);

  const formatVND = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);

  const handleToggleVisible = (serviceId: string) => {
    const serviceIndex = services.findIndex((s) => s.id === serviceId);
    if (serviceIndex === -1) return;

    const service = services[serviceIndex];
    const newVisibility = !service.visible;

    // Update local state if setServices is provided
    if (setServices) {
      const updatedServices = [...services];
      updatedServices[serviceIndex] = {
        ...service,
        visible: newVisibility,
      };
      setServices(updatedServices);
    }

    // Update selected service if it's the one being toggled
    if (selectedService && selectedService.id === serviceId) {
      setSelectedService({ ...selectedService, visible: newVisibility });
    }

    // Call API to update visibility
    displayService(serviceId, newVisibility).catch(() => {
      // Revert on error
      if (setServices) {
        const revertedServices = [...services];
        revertedServices[serviceIndex] = {
          ...service,
          visible: service.visible,
        };
        setServices(revertedServices);
      }

      if (selectedService && selectedService.id === serviceId) {
        setSelectedService({ ...selectedService, visible: service.visible });
      }

      alert(`Failed to update service visibility. Please try again.`);
    });
  };

  const handleSavePromotion = async () => {
    if (selectedService) {
      try {
        await setPromotionService(selectedService.id, promotionValue);

        // Update selected service locally
        setSelectedService({
          ...selectedService,
          discountLivePercent: promotionValue,
        });
      } catch (error) {
        console.error("Failed to save promotion:", error);
        alert("Failed to save promotion. Please try again.");
      }
    }
  };

  // Filter services based on search term and visibility filter
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.category?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filterVisible === null) return matchesSearch;
    return matchesSearch && service.visible === filterVisible;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Search and filter bar */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilterVisible(null)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filterVisible === null
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterVisible(true)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filterVisible === true
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Đang hiển thị
          </button>
          <button
            onClick={() => setFilterVisible(false)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filterVisible === false
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Đang ẩn
          </button>
        </div>
      </div>

      {/* Service list */}
      <div className="flex-1 overflow-y-auto">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <svg
              className="w-12 h-12 mb-2 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Không tìm thấy dịch vụ nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`relative overflow-hidden group rounded-xl border transition-all duration-200 hover:shadow-md ${
                  selectedService?.id === service.id
                    ? "border-rose-300 bg-rose-50 shadow"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setSelectedService(service)}
              >
                <div className="flex p-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {service.images?.[0] ? (
                      <Image
                        src={service.images[0] || "/placeholder.svg"}
                        alt={service.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-rose-100 text-rose-500">
                        {service.category?.name?.charAt(0) || "S"}
                      </div>
                    )}
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate pr-8">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {formatVND(service.minPrice)} -{" "}
                          {formatVND(service.maxPrice)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Switch
                          checked={service.visible}
                          onCheckedChange={() =>
                            handleToggleVisible(service.id)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-rose-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center mt-2">
                      {service.category?.name && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                        >
                          {service.category.name}
                        </Badge>
                      )}

                      {service.discountLivePercent > 0 && (
                        <Badge className="ml-2 text-xs bg-rose-100 text-rose-700 hover:bg-rose-100">
                          Giảm {service.discountLivePercent}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover effect indicator */}
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 ${
                    selectedService?.id === service.id
                      ? "bg-rose-500"
                      : "bg-transparent group-hover:bg-rose-300"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected service detail */}
      {selectedService && (
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {selectedService.images?.[0] ? (
                <Image
                  src={selectedService.images[0] || "/placeholder.svg"}
                  alt={selectedService.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl bg-rose-100 text-rose-500">
                  {selectedService.category?.name?.charAt(0) || "S"}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {selectedService.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatVND(selectedService.minPrice)} -{" "}
                    {formatVND(selectedService.maxPrice)}
                  </p>
                  {selectedService.category?.name && (
                    <Badge
                      variant="outline"
                      className="mt-1 text-xs bg-gray-50 text-gray-600 border-gray-200"
                    >
                      {selectedService.category.name}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="text-sm mr-2 text-gray-600">Hiển thị</span>
                  <Switch
                    checked={selectedService.visible}
                    onCheckedChange={() =>
                      handleToggleVisible(selectedService.id)
                    }
                    className="data-[state=checked]:bg-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                Giảm giá trực tiếp:{" "}
                <span className="text-rose-500 font-semibold">
                  {promotionValue}%
                </span>
              </label>
              <span className="text-xs text-gray-500">
                {promotionValue > 0
                  ? `Giá sau giảm: ${formatVND(
                      selectedService.minPrice * (1 - promotionValue / 100)
                    )}`
                  : "Chưa áp dụng giảm giá"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Slider
                value={[promotionValue]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setPromotionValue(value[0])}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={promotionValue}
                onChange={(e) => {
                  setPromotionValue(Number(e.target.value));
                }}
                className="w-16 border border-gray-200 rounded-md px-2 py-1 text-sm text-center"
              />
              <span className="text-sm">%</span>
            </div>

            <button
              onClick={handleSavePromotion}
              className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Áp dụng giảm giá
            </button>
          </div>
        </div>
      )}

      {/* Empty state when no service is selected */}
      {!selectedService && (
        <div className="border-t border-gray-200 bg-white p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Chọn một dịch vụ
          </h3>
          <p className="text-gray-500 max-w-xs">
            Chọn một dịch vụ từ danh sách để xem chi tiết và thiết lập khuyến
            mãi trực tiếp
          </p>
        </div>
      )}
    </div>
  );
}
