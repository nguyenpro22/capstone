import { Service } from "@/app/[locale]/(main)/services/page";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={service.imageUrl}
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            {service.price.toLocaleString()} VNĐ
          </span>
          <Link
            href={`/services/${service.id}`}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
