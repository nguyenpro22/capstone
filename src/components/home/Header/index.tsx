"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Loader2, User, LogOut, Settings } from "lucide-react";
import { useGetAllcategoriesQuery } from "@/features/home/api";
import logo from "@/../public/images/logo.png";
import { useRouter } from "next/navigation";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  isParent: boolean;
  parentId: string | null;
  isDeleted: boolean;
}

interface ApiResponse {
  value: {
    items: ServiceItem[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    message: string;
  };
}

interface SiteHeaderProps {
  children?: React.ReactNode;
}

export default function SiteHeader({ children }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userData, setUserData] = useState<TokenData | null>(null);
  const t = useTranslations("home");
  const router = useRouter();

  const token = getAccessToken() as string;

  // Fetch first page
  const {
    data: initialData,
    error,
    isLoading: isLoadingInitial,
  } = useGetAllcategoriesQuery({
    pageIndex: 1,
    pageSize: 10,
  });

  // Fetch subsequent pages
  const fetchNextPage = async () => {
    if (!initialData?.value.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `/api/categories?pageIndex=${nextPage}&pageSize=10`
      );
      const data: ApiResponse = await response.json();

      if (data.isSuccess) {
        setAllServices((prev) => [...prev, ...data.value.items]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error fetching more services:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Initialize allServices with first page data
  useEffect(() => {
    if (initialData?.value.items) {
      setAllServices(initialData?.value.items);
    }
  }, [initialData]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add the scrollbar styles to the document
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = scrollbarStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Get user data from token
  useEffect(() => {
    if (token) {
      try {
        const data = GetDataByToken(token) as TokenData;
        setUserData(data);
      } catch (error) {
        console.error("Error parsing token:", error);
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, [token]);

  // Organize services into a hierarchical structure
  const organizedServices = useMemo(() => {
    const mainCategories = allServices.filter(
      (item) => item.parentId === null && !item.isDeleted
    );

    return mainCategories.map((category) => {
      const subCategories = allServices.filter(
        (item) =>
          item.parentId === category.id && item.isParent && !item.isDeleted
      );

      const subCategoriesWithServices = subCategories.map((subCategory) => {
        const services = allServices.filter(
          (item) =>
            item.parentId === subCategory.id &&
            !item.isParent &&
            !item.isDeleted
        );

        return {
          ...subCategory,
          services,
        };
      });

      const directServices = allServices.filter(
        (item) =>
          item.parentId === category.id && !item.isParent && !item.isDeleted
      );

      return {
        ...category,
        subCategories: subCategoriesWithServices,
        directServices,
      };
    });
  }, [allServices]);

  // Handle menu scroll to load more items
  const handleMenuScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      fetchNextPage();
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    // Implement logout logic here
    // For example: removeAccessToken();
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/user/profile");
  };

  const handleBookings = () => {
    router.push("/user/bookings");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData || !userData.role) return "U";

    return userData.role
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all h-[60px] duration-500 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800"
          : "bg-white dark:bg-gray-900"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center transition-all mt-3 duration-300 hover:scale-105 transform"
            >
              <Image
                src={logo || "/placeholder.svg"}
                alt="Logo"
                width={120}
                height={120}
                className=""
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <div className="relative group">
                <Link
                  href="#"
                  className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white relative py-6 transition-all duration-300 hover:translate-y-[-2px] transform"
                >
                  {t("footer.services.title")}
                  <span className="absolute inset-x-0 bottom-5 h-0.5 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>

                <div
                  className="absolute left-0 mt-0 w-[800px] max-h-[80vh] bg-white dark:bg-gray-800 opacity-0 invisible transform -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out shadow-lg border-t dark:border-gray-700 overflow-y-auto scrollbar-thin scrollbar-always-visible"
                  onScroll={handleMenuScroll}
                >
                  {isLoadingInitial ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2">Loading services...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-6 p-8">
                      {organizedServices.map((category) => (
                        <div key={category.id} className="space-y-4">
                          <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </h3>
                            {category.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {category.description}
                              </p>
                            )}
                          </div>

                          {/* Direct services under main category */}
                          {category.directServices.length > 0 && (
                            <div className="pl-4">
                              <ul className="space-y-2">
                                {category.directServices.map((service) => (
                                  <li key={service.id}>
                                    <Link
                                      href={`/services/${service.id}`}
                                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                      {service.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Subcategories */}
                          {category.subCategories.map((subCategory) => (
                            <div key={subCategory.id} className="pl-4">
                              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                {subCategory.name}
                              </h4>
                              {subCategory.services.length > 0 && (
                                <ul className="space-y-2 pl-4">
                                  {subCategory.services.map((service) => (
                                    <li key={service.id}>
                                      <Link
                                        href={`/services/${service.id}`}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                      >
                                        {service.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {isLoadingMore && (
                    <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    </div>
                  )}
                </div>
              </div>

              {[
                { label: t("footer.quickLinks.links.0.label"), href: "/" },
                {
                  label: t("footer.quickLinks.links.4.label"),
                  href: "#contact",
                },
                { label: t("footer.quickLinks.links.1.label"), href: "#about" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white relative group py-6 transition-all duration-300 hover:translate-y-[-2px] transform"
                >
                  {link.label}
                  <span className="absolute inset-x-0 bottom-5 h-0.5 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {children}

            {!token ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="h-9 px-4 font-medium"
              >
                Đăng nhập
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/10">
                      <AvatarImage
                        src={userData?.role || undefined}
                        alt={userData?.role || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.role || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.role || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBookings}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Lịch hẹn</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
