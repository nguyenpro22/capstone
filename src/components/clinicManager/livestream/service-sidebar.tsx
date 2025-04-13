"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Service } from ".";

interface ServiceSidebarProps {
  services: Service[];
  displayService: (serviceId: string, isDisplay: boolean) => Promise<void>;
  setPromotionService: (
    serviceId: string,
    percent: string | number
  ) => Promise<void>;
  fetchServices: () => Promise<void>;
}

export default function ServiceSidebar({
  services,
  displayService,
  setPromotionService,
  fetchServices,
}: ServiceSidebarProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);

    // Find the service and set the current discount value
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setDiscountValue(service.discountLivePercent.toString());
    }
  };

  const handleDisplayToggle = async (
    serviceId: string,
    currentVisibility: boolean
  ) => {
    try {
      setIsLoading(true);
      await displayService(serviceId, !currentVisibility);
    } catch (error) {
      console.error("Error toggling service visibility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers between 0-100
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d+$/.test(value) && Number.parseInt(value) <= 100)
    ) {
      setDiscountValue(value);
    }
  };

  const handleDiscountSubmit = async (serviceId: string) => {
    if (!discountValue) return;

    try {
      setIsLoading(true);
      await setPromotionService(serviceId, discountValue);
    } catch (error) {
      console.error("Error setting promotion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white h-full w-64 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Dịch Vụ</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Không có dịch vụ nào
          </div>
        ) : (
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedService === service.id
                    ? "bg-blue-900 border-l-4 border-blue-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{service.name}</h3>
                  <div className="flex items-center">
                    {service.visible && (
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisplayToggle(service.id, service.visible);
                      }}
                      disabled={isLoading}
                      className={`text-xs px-2 py-1 rounded ${
                        service.visible
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {service.visible ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                </div>

                {service.discountLivePercent > 0 && (
                  <div className="mt-1 text-xs text-green-400">
                    Giảm giá: {service.discountLivePercent}%
                  </div>
                )}

                {selectedService === service.id && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={discountValue}
                        onChange={handleDiscountChange}
                        className="w-16 px-2 py-1 bg-gray-700 rounded text-white text-center"
                        placeholder="0"
                      />
                      <span className="ml-1">%</span>
                      <button
                        onClick={() => handleDiscountSubmit(service.id)}
                        disabled={isLoading}
                        className="ml-2 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
