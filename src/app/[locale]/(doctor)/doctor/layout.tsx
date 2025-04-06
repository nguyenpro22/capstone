import type { ReactNode } from "react";
import { Sidebar } from "@/components/doctor/sidebar";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-[300px] md:w-[calc(100%-300px)]">
        {children}
      </main>
    </div>
  );
}
