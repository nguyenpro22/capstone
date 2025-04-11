"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { User, LogOut, Menu, X, ShoppingBag, Inbox } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/common/ThemeToggle";
import LangToggle from "@/components/common/LangToggle";
import { customerRoutes } from "@/constants";
import { normalizeVietnameseText } from "@/utils/vietnamese-text";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { handleLogout } from "@/features/auth/utils";

// Add custom scrollbar styles
const scrollbarStyles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    border-radius: 6px;
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

interface SiteHeaderProps {
  children?: React.ReactNode;
}

export default function SiteHeader({ children }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<TokenData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const t = useTranslations("home");
  const router = useRouter();
  const token = getAccessToken() as string;
  const user = useSelector((state: RootState) => state.auth.user);
  const onLogout = async () => {
    await handleLogout({ router });
  };
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add the scrollbar styles to the document
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = scrollbarStyles;
    document.head.appendChild(styleElement);

    // Ensure proper character encoding for Vietnamese text
    if (!document.querySelector('meta[charset="UTF-8"]')) {
      const metaCharset = document.createElement("meta");
      metaCharset.setAttribute("charset", "UTF-8");
      document.head.appendChild(metaCharset);
    }

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

  const handleLogin = () => {
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleBookings = () => {
    router.push("/orders");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData || !userData.name) return "U";

    return normalizeVietnameseText(userData.name)
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navItems = [
    {
      label: t("footer.quickLinks.links.0.label"),
      href: "/",
    },
    {
      label: t("footer.services.title"),
      href: customerRoutes.SERVICES,
      name: "services",
    },
    {
      label: t("footer.quickLinks.links.1.label"),
      href: customerRoutes.LIVESTREAM_VIEW,
    },
    {
      label: t("footer.quickLinks.links.3.label"),
      href: "/registerClinic",
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all h-20 duration-300 ease-in-out",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800"
          : "bg-white dark:bg-gray-900"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center transition-all duration-300 hover:opacity-90"
            >
              <Image
                src={logo || "/placeholder.svg"}
                alt="Logo"
                width={120}
                height={40}
                className="h-24 mt-3 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative group px-2">
                  <button
                    onClick={() => router.push(item.href)}
                    className="text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white relative py-5 px-3 transition-all duration-200 bg-transparent border-none cursor-pointer"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </button>
                </div>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <LangToggle />

            {/* Notifications - only for logged in users */}
            {/* {token && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 text-gray-700 dark:text-gray-300 relative"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
                  2
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            )} */}

            {/* User menu or login button */}
            {!token ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleLogin}
                className="h-9 px-4 font-medium rounded-full bg-primary hover:bg-primary/90 text-white"
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
                        src={userData?.roleName || undefined}
                        alt={userData?.roleName || "User"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {normalizeVietnameseText(userData?.name) || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBookings}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Lịch hẹn</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/inbox")}>
                    <Inbox className="mr-2 h-4 w-4" />
                    <span>Hộp thoại</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <Link href="/" className="flex items-center">
                        <Image
                          src={logo || "/placeholder.svg"}
                          alt="Logo"
                          width={100}
                          height={30}
                          className="h-8 w-auto object-contain"
                        />
                      </Link>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto scrollbar-thin py-4">
                    <div className="px-4 py-2">
                      <nav className="flex flex-col space-y-1">
                        {navItems.map((item) => (
                          <div key={item.label} className="py-1">
                            <SheetClose asChild>
                              <Link
                                href={item.href}
                                className="flex items-center py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                              >
                                {item.label}
                              </Link>
                            </SheetClose>
                          </div>
                        ))}
                      </nav>
                    </div>

                    {/* Mobile user actions */}
                    <div className="mt-6 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      {!token ? (
                        <SheetClose asChild>
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={handleLogin}
                          >
                            Đăng nhập
                          </Button>
                        </SheetClose>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 px-3 py-2">
                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getUserInitials()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {normalizeVietnameseText(userData?.name) ||
                                  "User"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {userData?.email || ""}
                              </p>
                            </div>
                          </div>

                          <SheetClose asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={handleProfile}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Hồ sơ
                            </Button>
                          </SheetClose>

                          <SheetClose asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={handleBookings}
                            >
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Lịch hẹn
                            </Button>
                          </SheetClose>

                          <SheetClose asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={onLogout}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Đăng xuất
                            </Button>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
