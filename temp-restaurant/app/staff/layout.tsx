
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import StaffHeader from "./components/StaffHeader";

export default function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {pathname !== "/staff/login" && <StaffHeader />}
      {children}
    </div>
  );
}
