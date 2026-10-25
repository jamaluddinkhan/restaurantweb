
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type StaffProfile = {
  name: string;
  email: string;
  initials: string;
};

export default function StaffHeader() {
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const [staff, setStaff] = useState<StaffProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedSession = sessionStorage.getItem(
        "restaurant-staff-session"
      );

      if (!savedSession) {
        router.replace("/staff/login");
        return;
      }

      try {
        const parsed = JSON.parse(savedSession);

        if (!parsed.name || !parsed.email) {
          throw new Error("Invalid staff session");
        }

        setStaff({
          name: parsed.name,
          email: parsed.email,
          initials: parsed.initials || "JK",
        });
      } catch {
        sessionStorage.removeItem("restaurant-staff-session");
        router.replace("/staff/login");
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("restaurant-staff-session");
    router.replace("/staff/login");
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="page-container flex items-center justify-between gap-3 py-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)]">
            STAFF PORTAL
          </p>
          {staff && (
            <p className="mt-1 text-sm font-medium">
              Welcome, {staff.name}
            </p>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            data-no-loader
            onClick={() => setProfileOpen((current) => !current)}
            aria-label="Open staff profile"
            aria-expanded={profileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white"
          >
            {staff?.initials || "JK"}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 border border-[var(--border)] bg-white p-4 shadow-lg">
              <p className="break-words text-sm font-semibold">
                {staff?.name}
              </p>

              <p className="mt-1 break-all text-xs text-[var(--muted)]">
                {staff?.email}
              </p>

              <div className="my-3 border-t border-[var(--border)]" />

              <button
                type="button"
                data-no-loader
                onClick={handleLogout}
                className="min-h-10 w-full text-left text-sm font-medium text-[var(--danger)]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
