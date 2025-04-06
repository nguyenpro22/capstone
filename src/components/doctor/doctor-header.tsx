"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function DoctorHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Calendar",
      href: "/doctor/calendar",
      icon: Calendar,
    },
    {
      label: "Profile",
      href: "/doctor/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/doctor/settings",
      icon: Settings,
    },
  ];

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center space-x-2">
          <span className="font-bold text-xl">Doctor Portal</span>
        </div>
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
