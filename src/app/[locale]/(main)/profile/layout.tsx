import type React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/30 h-[calc(100vh-80px)]">
      <main className="">{children}</main>
    </div>
  );
}
