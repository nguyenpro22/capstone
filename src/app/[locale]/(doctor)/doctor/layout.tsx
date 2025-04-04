import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/doctor/sidebar";
import Header from "@/components/doctor/header";

export const metadata: Metadata = {
  title: "Doctor Portal",
  description: "Doctor Portal of Beautify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-64 w-full">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
