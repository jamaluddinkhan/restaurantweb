
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { restaurantConfig } from "../restaurant-config";

type OrderStatus = "placed" | "preparing" | "ready";

type StatusEntry = {
  status: OrderStatus;
  timestamp: string;
};

type SavedOrder = {
  id: string;
  number?: string;
  placedAt: string;
  status: OrderStatus;
  statusHistory?: StatusEntry[];
};

const stages: {
  id: OrderStatus;
  title: string;
  description: string;
}[] = [
  {
    id: "placed",
    title: "Order Placed",
    description: "Your order has been received.",
  },
  {
    id: "preparing",
    title: "Preparing",
    description: "Our kitchen is preparing your food.",
  },
  {
    id: "ready",
    title: "Ready to Serve",
    description: "Your food is ready to be served.",
  },
];

function formatDateTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (orderId) {
        try {
          const saved = localStorage.getItem(`restaurant-order-${orderId}`);

          if (saved) {
            const parsed = JSON.parse(saved) as SavedOrder;

            if (parsed.id === orderId) {
              setOrder(parsed);
            }
          }
        } catch {
          setOrder(null);
        }
      }

      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [orderId]);

  const currentStage = order
    ? stages.findIndex((stage) => stage.id === order.status)
    : -1;

  const orderNumber =
    order?.number || orderId?.match(/(\d+)$/)?.[1] || "Order number unavailable";
  const statusHistory = order?.statusHistory ?? [];

  function getStageTime(status: OrderStatus) {
    const entry = statusHistory.find((item) => item.status === status);
    return entry ? formatDateTime(entry.timestamp) : null;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-lg px-5 pb-12 pt-8 sm:pt-12">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          ← Back to Menu
        </Link>

        <header className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {restaurantConfig.name}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Track Your Order
          </h1>
        </header>

        <section className="mt-8 border-y border-[var(--border)] py-6">
          <p className="text-xs text-[var(--muted)]">Order Number</p>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            {orderNumber}
          </p>

          {!loaded ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Loading order details...</p>
          ) : order ? (
            <>
              <p className="mt-5 text-xs text-[var(--muted)]">Order Placed</p>
              <p className="mt-2 text-sm font-medium">
                {formatDateTime(order.placedAt)}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Order progress is unavailable in this browser. Its saved details
              may no longer be available.
            </p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Order Status</h2>

          <div className="mt-7">
            {stages.map((stage, index) => {
              const completed = index < currentStage;
              const active = index === currentStage;
              const reached = Boolean(order) && index <= currentStage;
              const last = index === stages.length - 1;
              const stageTime = getStageTime(stage.id);

              return (
                <div key={stage.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                        reached
                          ? "border-[var(--success)] bg-[var(--success)] text-white"
                          : "border-[var(--border)] text-[var(--muted)]"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </div>

                    {!last && (
                      <div
                        className={`my-1 min-h-16 w-px ${
                          completed ? "bg-[var(--success)]" : "bg-[var(--border)]"
                        }`}
                      />
                    )}
                  </div>

                  <div className={last ? "pb-2" : "pb-7"}>
                    <h3
                      className={`text-sm font-semibold ${
                        reached ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {stage.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {stage.description}
                    </p>

                    {stageTime && (
                      <p className="mt-2 text-xs font-medium text-[var(--success)]">
                        {stageTime}
                      </p>
                    )}

                    {active && (
                      <span className="mt-2 inline-block text-xs font-semibold text-[var(--success)]">
                        Current Status
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 border-t border-[var(--border)] pt-6">
          <h2 className="text-base font-semibold">Need anything else?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Browse the menu while you wait.
          </p>
          <Link
            href="/"
            className="primary-button mt-5 w-full"
          >
            Explore Menu
          </Link>
        </section>
      </div>
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[var(--background)] px-5 py-12 text-[var(--foreground)]">
          <div className="mx-auto max-w-lg text-sm text-[var(--muted)]">
            Loading order details...
          </div>
        </main>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
