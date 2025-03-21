import { UserNav } from "@/components/services/user/user-nav";
import type React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Beauty Clinic</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a
                href="/user/bookings"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Lịch hẹn
              </a>
              <a
                href="/user/profile"
                className="transition-colors hover:text-foreground/80 text-muted-foreground"
              >
                Hồ sơ
              </a>
              <a
                href="/services"
                className="transition-colors hover:text-foreground/80 text-muted-foreground"
              >
                Dịch vụ
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="hidden md:block">
                <UserNav />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
