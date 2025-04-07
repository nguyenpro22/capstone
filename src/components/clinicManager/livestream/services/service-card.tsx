import type { Service } from "../livestream";
import {
  formatPrice,
  calculateDiscountedPrice,
  getCategoryIcon,
} from "@/utils/format";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <div
      key={`service-${index}-${service.id}`}
      className="service-card flex-shrink-0 bg-white rounded-xl shadow-lg overflow-hidden w-[28%]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Service Header with Icon and Name */}
      <div className="relative">
        {/* Discount Badge - Top Right */}
        {service.discountPercent && service.discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-bold">
            -{service.discountPercent}%
          </div>
        )}

        <div className="p-3 pb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-lg">
                {service.images && service.images.length > 0
                  ? "🖼️"
                  : getCategoryIcon(service.category?.name)}
              </span>
            </div>
            <h3 className="font-bold text-rose-800 text-sm truncate">
              {service.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Price Information */}
      <div className="px-3 pb-2">
        {service.discountPercent && service.discountPercent > 0 ? (
          <>
            <div className="flex items-center">
              Giá mới:{" "}
              <span className="ml-1 line-through text-rose-600 text-xs">
                {formatPrice(service.minPrice)}
              </span>
              <span className="ml-2 font-semibold line-through text-rose-600 text-sm">
                {formatPrice(
                  calculateDiscountedPrice(
                    service.maxPrice,
                    service.discountPercent
                  )
                )}
              </span>
            </div>
            {service.minPrice !== service.maxPrice && (
              <div className="text-xs text-gray-600 mt-1">
                Giá cũ:{" "}
                {formatPrice(
                  calculateDiscountedPrice(
                    service.minPrice,
                    service.discountPercent
                  )
                )}{" "}
                -{" "}
                {formatPrice(
                  calculateDiscountedPrice(
                    service.maxPrice,
                    service.discountPercent
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="font-semibold text-rose-600 text-sm">
              {formatPrice(service.maxPrice)}
            </div>
            {service.minPrice !== service.maxPrice && (
              <div className="text-xs text-gray-600 mt-1">
                Range: {formatPrice(service.minPrice)} -{" "}
                {formatPrice(service.maxPrice)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Limited Time Offer */}
      {service.discountPercent && service.discountPercent > 0 && (
        <div className="px-3 pb-2">
          <div className="flex items-center">
            <div className="bg-red-50 px-2 py-1 rounded-lg w-full">
              <div className="flex items-center">
                <span className="text-xs font-bold text-red-600 mr-1">
                  {service.discountPercent}% OFF
                </span>
                <span className="text-xs text-gray-600">
                  Limited time offer!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Now Button */}
      <div className="p-3 pt-1">
        <button className="w-full bg-rose-500 text-white font-medium py-2 text-sm rounded-lg hover:bg-rose-600 transition shadow-sm">
          Book Now
        </button>
      </div>
    </div>
  );
}
