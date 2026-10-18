
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LoginStep = "email" | "password";

export default function StaffLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedSession = sessionStorage.getItem(
          "restaurant-staff-session"
        );

        if (savedSession) {
          const parsed = JSON.parse(savedSession);

          if (parsed.name && parsed.email) {
            router.replace("/staff/orders");
            return;
          }
        }
      } catch {
        sessionStorage.removeItem("restaurant-staff-session");
      }

      setCheckingSession(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (email.trim().toLowerCase() !== "jk@staff.com") {
      setError("No staff account found with this email.");
      return;
    }

    setPassword("");
    setShowPassword(false);
    setStep("password");
  }

  function handleChangeEmail() {
    setStep("email");
    setPassword("");
    setShowPassword(false);
    setError("");
  }

  function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() !== "jk@staff.com" ||
      password !== "Staff@123"
    ) {
      setError("Incorrect email or password.");
      return;
    }

    setSubmitting(true);

    sessionStorage.setItem(
      "restaurant-staff-session",
      JSON.stringify({
        name: "Jamaluddin Khan",
        email: "jk@staff.com",
        initials: "JK",
      })
    );

    router.replace("/staff/orders");
  }

  if (checkingSession) {
    return (
      <main
        className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]"
        role="status"
      >
        Checking staff session...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wider text-[var(--primary)]">
            STAFF PORTAL
          </p>

          <h1 className="mt-4 text-2xl font-semibold">
            {step === "email" ? "Welcome back" : "Enter your password"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {step === "email"
              ? "Enter your staff email to continue."
              : "Enter your password to sign in to your account."}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleContinue} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="jk@staff.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                className="form-control"
                required
                autoFocus
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-[var(--danger)]">
                {error}
              </p>
            )}

            <button type="submit" className="primary-button w-full">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <p className="break-all text-sm font-medium">{email}</p>

              <button
                type="button"
                data-no-loader
                onClick={handleChangeEmail}
                className="shrink-0 text-sm font-semibold text-[var(--primary)]"
              >
                Change
              </button>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  className="form-control pr-12"
                  required
                  autoFocus
                />

                <button
                  type="button"
                  data-no-loader
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 flex h-10 w-8 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-[var(--muted)]"
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 5.2A11 11 0 0112 5c5 0 8.5 4.5 9.5 7a11.7 11.7 0 01-3.1 4.2" />
                      <path d="M6.2 6.2A13.4 13.4 0 002.5 12c1 2.5 4.5 7 9.5 7 1.5 0 2.9-.4 4.1-1.1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-[var(--danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="primary-button w-full"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
          Restaurant staff access only.
        </p>
      </section>
    </main>
  );
}
