import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/common/Provider";
import logo from "@/../public/images/logo.png";

export const metadata: Metadata = {
  title: "Beautify Clinic - Premium Beauty & Aesthetic Center",
  description:
    "Transform your beauty with our premium aesthetic treatments and services",
  icons: "/images/logo.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <head>
        {/* Load Quill CSS from CDN */}
        <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.7/quill.snow.css" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
