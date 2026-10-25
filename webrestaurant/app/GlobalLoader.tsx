
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const control = target.closest(
        "a, [data-loader-trigger]"
      );

      if (!control || control.hasAttribute("disabled")) return;
      if (control.getAttribute("aria-disabled") === "true") return;
      if (control.hasAttribute("data-no-loader")) return;

      if (
        control instanceof HTMLAnchorElement &&
        (control.target === "_blank" ||
          control.href.startsWith("mailto:") ||
          control.href.startsWith("tel:"))
      ) {
        return;
      }

      setLoading(true);
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!loading) return;

    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 900);

    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/40 backdrop-blur-[2px]"
      role="status"
      aria-label="Loading"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--primary)]/20 border-t-[var(--primary)]" />
    </div>
  );
}
