import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/common/Provider";

export const metadata: Metadata = {
  title: "Beautify Clinic - Premium Beauty & Aesthetic Center",
  description:
    "Transform your beauty with our premium aesthetic treatments and services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
