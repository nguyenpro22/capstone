import type { ReactNode } from "react";
import Image from "next/image";
import SiteHeader from "@/components/home/Header";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <SiteHeader />
      {children}
    </div>
  );
}
