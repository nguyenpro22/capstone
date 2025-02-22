"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Image.jpg"
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
                  Sản phẩm
                  <span className="absolute inset-x-0 bottom-5 h-0.5 bg-rose-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>

                <div className="absolute left-0 mt-0 w-[800px] bg-white opacity-0 invisible transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out shadow-lg border-t">
                  <div className="grid grid-cols-3 gap-8 p-8">
                    {[
                      {
                        title: "Chăm sóc chuyên sâu",
                        links: [
                          "Chăm sóc da mặt",
                          "Chăm sóc da cơ thể",
                          "Chống nắng",
                          "Chăm sóc da mặt & môi",
                          "Chăm sóc da tay & chân",
                          "Chăm sóc da bé",
                          "Chăm sóc tóc & da đầu",
                        ],
                      },
                      {
                        title: "Hiểu về làn da",
                        links: [
                          "Da mụn",
                          "Chăm sóc sau nắng",
                          "Da lão hoá",
                          "Viêm da cơ địa",
                          "Da mỏi nứt nẻ",
                          "Da khô nứt",
                          "Da khô",
                          "Da thâm nám",
                          "Da nhạy cảm",
                          "Da kích ứng",
                          "Da dễ bị ửng đỏ",
                        ],
                      },
                      {
                        title: "Dòng sản phẩm",
                        links: [
                          "Anti-Pigment",
                          "AquaPorin Active",
                          "Ato Control",
                          "DermatoClean",
                          "DermoCapillaire",
                          "ProAcne",
                          "Hyaluron-Filler",
                          "UltraSensitive",
                          "UreaRepair",
                          "Xịt khoáng Hyaluron",
                          "Chống nắng",
                          "pH5",
                        ],
                      },
                    ].map((column) => (
                      <div
                        key={column.title}
                        className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]"
                      >
                        <h3 className="font-medium text-lg text-gray-900 border-b pb-2">
                          {column.title}
                        </h3>
                        <ul className="space-y-3">
                          {column.links.map((link) => (
                            <li key={link}>
                              <Link
                                href="#"
                                className="text-gray-600 hover:text-rose-700 transition-all duration-200 hover:translate-x-1 transform inline-block"
                              >
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {["Tư vấn về da", "Về Eucerin", "Phát triển bền vững"].map(
                (text) => (
                  <Link
                    key={text}
                    href="#"
                    className="text-base font-medium text-gray-700 hover:text-gray-900 relative group py-6 transition-all duration-300 hover:translate-y-[-2px] transform"
                  >
                    {text}
                    <span className="absolute inset-x-0 bottom-5 h-0.5 bg-rose-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </Link>
                )
              )}
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
