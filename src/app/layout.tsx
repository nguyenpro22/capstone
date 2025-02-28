import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/common/Provider";
import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-slab",
});
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
      <body className={`${robotoSlab.variable}`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
