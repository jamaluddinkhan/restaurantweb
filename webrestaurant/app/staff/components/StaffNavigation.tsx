
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Orders", href: "/staff/orders" },
  { label: "Payments", href: "/staff/payments" },
  { label: "Serving", href: "/staff/serving" },
];

export default function StaffNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Staff navigation"
      className="flex gap-2 overflow-x-auto border-b border-[var(--border)] pb-3"
    >
      {navigation.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${
              active ? "primary-button" : "secondary-button"
            } shrink-0 px-4 text-sm`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
