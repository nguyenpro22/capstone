"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

// Add custom scrollbar styles
const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    border-radius: 3px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  .dark .scrollbar-thin::-webkit-scrollbar-track {
    background: #2d2d2d;
  }
  .dark .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #505050;
  }
  .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #707070;
  }
  .scrollbar-always-visible::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    visibility: visible;
  }
`;

// Define types for the service data
interface ServiceItem {
  id: string;
  name: string;
  description: string;
  isParent: boolean;
  parentId: string | null;
  isDeleted: boolean;
}

function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch service data (in a real app, this would be an API call)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be a fetch call
        // const response = await fetch('/api/services');
        // const data = await response.json();

        // For demo, we're using the data directly
        const data = {
          value: [
            {
              id: "11111111-1111-1111-1111-111111111111",
              name: "Phẫu Thuật Thẩm Mỹ",
              description: "Dịch vụ phẫu thuật can thiệp ngoại khoa",
              isParent: true,
              parentId: null,
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111112",
              name: "Nâng mũi",
              description: "Nhóm dịch vụ thẩm mỹ nâng mũi",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111113",
              name: "Thẩm mỹ mắt",
              description: "Nhóm dịch vụ làm đẹp cho mắt",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111114",
              name: "Treo Chân Mày",
              description: "Nhóm dịch vụ nâng cung chân mày",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111115",
              name: "Căng da mặt",
              description: "Nhóm dịch vụ căng/trẻ hóa da mặt",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111116",
              name: "Thẩm mỹ gò má",
              description: "Dịch vụ chỉnh hình gò má",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111117",
              name: "Thẩm mỹ môi",
              description: "Nhóm dịch vụ tạo hình môi",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111118",
              name: "Nâng ngực",
              description: "",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111119",
              name: "Hút mỡ tay/chân",
              description: "",
              isParent: true,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111120",
              name: "Nâng mũi Hàn Quốc S Line",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111112",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111121",
              name: "Thu gọn cánh mũi",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111112",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111122",
              name: "Nâng mũi sụn Surgiform",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111112",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111123",
              name: "Cắt mắt 2 mí Hàn Quốc",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111113",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111124",
              name: "Bấm mí Hàn Quốc (Nhấn mí mắt)",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111113",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111125",
              name: "Cắt mí dưới",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111113",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111126",
              name: "Treo chân mày",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111114",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111127",
              name: "Trẻ hóa vùng mắt bằng phương pháp nâng cung chân mày",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111114",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111128",
              name: "Căng da mặt bằng chỉ",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111115",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111129",
              name: "Căng da mặt toàn phần",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111115",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111130",
              name: "Căng da mặt nội soi",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111115",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111131",
              name: "Căng da trán mổ hở",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111115",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111132",
              name: "Căng da trán nội soi",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111115",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111133",
              name: "Độn cằm V Line – nâng cằm",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111134",
              name: "Hút mỡ bụng",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111111",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111135",
              name: "Nâng cao gò má",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111116",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111136",
              name: "Hạ thấp gò má",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111116",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111137",
              name: "Tạo hình môi dày thành môi mỏng",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111117",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111138",
              name: "Tạo hình môi trái tim, môi cười, môi hạt lựu",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111117",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111139",
              name: "Đặt túi ngực (silicone)",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111118",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111140",
              name: "Treo ngực sa trễ",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111118",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111141",
              name: "Thu gọn quầng vú",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111118",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111142",
              name: "Chỉnh hình cánh tay (cắt da thừa)",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111119",
              isDeleted: false,
            },
            {
              id: "11111111-1111-1111-1111-111111111143",
              name: "Chỉnh hình đùi (cắt da thừa)",
              description: "",
              isParent: false,
              parentId: "11111111-1111-1111-1111-111111111119",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222221",
              name: "Thẩm mỹ không phẫu thuật",
              description: "Dịch vụ thẩm mỹ ít xâm lấn",
              isParent: true,
              parentId: null,
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222222",
              name: "Tiêm filler",
              description: "",
              isParent: true,
              parentId: "22222222-2222-2222-2222-222222222221",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222223",
              name: "Tiêm botox",
              description: "",
              isParent: true,
              parentId: "22222222-2222-2222-2222-222222222221",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222224",
              name: "Tiêm tan mỡ",
              description: "",
              isParent: false,
              parentId: "22222222-2222-2222-2222-222222222221",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222225",
              name: "Bấm má lúm đồng tiền",
              description: "",
              isParent: false,
              parentId: "22222222-2222-2222-2222-222222222221",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222226",
              name: "Tiêm filler môi",
              description: "",
              isParent: false,
              parentId: "22222222-2222-2222-2222-222222222222",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222227",
              name: "Tiêm filler cằm",
              description: "",
              isParent: false,
              parentId: "22222222-2222-2222-2222-222222222222",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222228",
              name: "Tiêm filler mũi",
              description: "",
              isParent: false,
              parentId: "22222222-2222-2222-2222-222222222222",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222229",
              name: "Xóa nếp nhăn trán",
              description: "",
              isParent: false,
              parentId: "22222222-2222-2222-2222-222222222223",
              isDeleted: false,
            },
            {
              id: "22222222-2222-2222-2222-222222222230",
              name: "Thon gọn góc hàm",
              description: "",
              isParent: false,
              parentId: "22222222-2222-2222-2222-222222222223",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333331",
              name: "Dịch vụ Spa",
              description: "Nhóm dịch vụ chăm sóc thư giãn, spa",
              isParent: true,
              parentId: null,
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333332",
              name: "Chăm sóc da mặt",
              description: "",
              isParent: true,
              parentId: "33333333-3333-3333-3333-333333333331",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333333",
              name: "Chăm sóc cơ thể",
              description: "",
              isParent: true,
              parentId: "33333333-3333-3333-3333-333333333331",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333334",
              name: "Triệt lông",
              description: "",
              isParent: true,
              parentId: "33333333-3333-3333-3333-333333333331",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333335",
              name: "Lấy nhân mụn",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333332",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333336",
              name: "Massage mặt",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333332",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333337",
              name: "Điện di tinh chất",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333332",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333338",
              name: "Tẩy tế bào chết toàn thân",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333333",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333339",
              name: "Massage body",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333333",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333340",
              name: "Xông hơi thư giãn",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333333",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333341",
              name: "Triệt lông nách",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333334",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333342",
              name: "Triệt lông bikini",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333334",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333343",
              name: "Triệt lông chân",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333334",
              isDeleted: false,
            },
            {
              id: "33333333-3333-3333-3333-333333333344",
              name: "Tắm trắng",
              description: "",
              isParent: false,
              parentId: "33333333-3333-3333-3333-333333333331",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444441",
              name: "Chăm sóc da chuyên sâu",
              description: "Nhóm dịch vụ điều trị & cải thiện da",
              isParent: true,
              parentId: null,
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444442",
              name: "Trị mụn",
              description: "",
              isParent: true,
              parentId: "44444444-4444-4444-4444-444444444441",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444443",
              name: "Trị nám, tàn nhang",
              description: "",
              isParent: true,
              parentId: "44444444-4444-4444-4444-444444444441",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444444",
              name: "Trị sẹo rỗ",
              description: "",
              isParent: true,
              parentId: "44444444-4444-4444-4444-444444444441",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444445",
              name: "Tái tạo da",
              description: "",
              isParent: true,
              parentId: "44444444-4444-4444-4444-444444444441",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444446",
              name: "Trị mụn bọc, mụn viêm",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444442",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444447",
              name: "Trị mụn đầu đen, sợi bã nhờn",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444442",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444448",
              name: "Laser trị nám",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444443",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444449",
              name: "Laser trị tàn nhang",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444443",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444450",
              name: "Lăn kim (Microneedling)",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444444",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444451",
              name: "Laser CO2 fractional",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444444",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444452",
              name: "PRP (Huyết tương giàu tiểu cầu)",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444445",
              isDeleted: false,
            },
            {
              id: "44444444-4444-4444-4444-444444444453",
              name: "Mesotherapy (Mesotherapy da mặt)",
              description: "",
              isParent: false,
              parentId: "44444444-4444-4444-4444-444444444445",
              isDeleted: false,
            },
            {
              id: "9ec3014a-3585-4582-ac49-48b362ec6be1",
              name: "tes1t",
              description: "tesst1",
              isParent: true,
              parentId: null,
              isDeleted: false,
            },
            {
              id: "b1ed1fa6-de07-4c8b-bf8e-a24743bc3d10",
              name: "Làm da mặt",
              description: "Làm trắng da mặt, tẩy tế bào chết",
              isParent: true,
              parentId: null,
              isDeleted: false,
            },
            {
              id: "7f3a5221-1d03-47ba-ba8e-ac8d38928a3d",
              name: "fffdd",
              description: "1dsds",
              isParent: true,
              parentId: null,
              isDeleted: false,
            },
          ],
        };

        setServiceData(data.value);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching service data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Modify the megaMenuCategories function to create a more comprehensive hierarchical structure
  const megaMenuCategories = useMemo(() => {
    if (!serviceData.length) return [];

    // Get main categories (parentId is null)
    const mainCategories = serviceData.filter(
      (item) => item.parentId === null && !item.isDeleted
    );

    return mainCategories.map((category) => {
      // Get subcategories (direct children of this category that are parents)
      const subcategories = serviceData.filter(
        (item) =>
          item.parentId === category.id && item.isParent && !item.isDeleted
      );

      // Get direct services under this main category
      const directServices = serviceData.filter(
        (item) =>
          item.parentId === category.id && !item.isParent && !item.isDeleted
      );

      // Create a structure that includes both subcategories and their services
      const subItems = subcategories.map((subcat) => {
        // Get services under this subcategory
        const services = serviceData.filter(
          (item) =>
            item.parentId === subcat.id && !item.isParent && !item.isDeleted
        );

        return {
          id: subcat.id,
          name: subcat.name,
          services: services.map((service) => service.name),
        };
      });

      return {
        id: category.id,
        title: category.name,
        description: category.description,
        subcategories: subItems,
        directServices: directServices.map((service) => service.name),
      };
    });
  }, [serviceData]);

  // Add the scrollbar styles to the document
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = scrollbarStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center transition-all duration-300 hover:scale-105 transform"
            >
              <Image
                src=""
                alt="Eucerin Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <div className="relative group">
                <Link
                  href="#"
                  className="text-base font-medium text-gray-700 hover:text-gray-900 relative py-6 transition-all duration-300 hover:translate-y-[-2px] transform"
                >
                  Dịch vụ
                  <span className="absolute inset-x-0 bottom-5 h-0.5 bg-rose-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>

                <div className="absolute left-0 mt-0 w-[800px] max-h-[80vh] bg-white opacity-0 invisible transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out shadow-lg border-t overflow-y-auto scrollbar-thin scrollbar-always-visible">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-6 p-8">
                      {megaMenuCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex flex-col animate-[fadeIn_0.3s_ease-out_forwards]"
                        >
                          <h3 className="font-medium text-lg text-gray-900 border-b pb-2 mb-4">
                            {category.title}
                          </h3>
                          <div className="flex flex-col space-y-4">
                            {/* Direct services under main category */}
                            {category.directServices.length > 0 && (
                              <ul className="flex flex-col gap-2">
                                {category.directServices.map((service) => (
                                  <li key={service} className="w-full">
                                    <Link
                                      href="#"
                                      className="text-gray-600 hover:text-rose-700 transition-all duration-200 hover:translate-x-1 transform inline-block"
                                    >
                                      {service}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Subcategories and their services */}
                            {category.subcategories.map((subcat) => (
                              <div
                                key={subcat.id}
                                className="flex flex-col w-full"
                              >
                                <h4 className="font-medium text-gray-800 border-b border-gray-100 pb-1 mb-2 w-full">
                                  {subcat.name}
                                </h4>
                                {subcat.services.length > 0 && (
                                  <ul className="flex flex-col gap-2 pl-3">
                                    {subcat.services.map((service) => (
                                      <li key={service} className="w-full">
                                        <Link
                                          href="#"
                                          className="text-gray-600 hover:text-rose-700 transition-all duration-200 hover:translate-x-1 transform inline-block text-sm"
                                        >
                                          {service}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {["Trang chủ", "Liên hệ", "Về chúng tôi"].map((text) => (
                <Link
                  key={text}
                  href="#"
                  className="text-base font-medium text-gray-700 hover:text-gray-900 relative group py-6 transition-all duration-300 hover:translate-y-[-2px] transform"
                >
                  {text}
                  <span className="absolute inset-x-0 bottom-5 h-0.5 bg-rose-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-12 transform">
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </button>
            <Link
              href="#"
              className="text-rose-600 font-medium hover:text-rose-700 transition-all duration-300 hover:scale-110 transform"
            >
              VN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
