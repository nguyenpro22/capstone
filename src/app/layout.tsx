import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/common/Provider";
import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
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
      <body className={`${playfair.className} ${poppins.variable}`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
