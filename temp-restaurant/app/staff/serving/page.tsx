
"use client";

import { useState } from "react";
import StaffNavigation from "../components/StaffNavigation";

type ServingOrder = {
  id: string;
  table: string;
  items: string[];
  status: "Ready to Serve" | "Served";
};

const initialOrders: ServingOrder[] = [
  {
    id: "ORD-MUM-20261018-001",
    table: "Table 05",
    items: ["Paneer Tikka × 2", "Butter Naan × 4"],
    status: "Ready to Serve",
  },
  {
    id: "ORD-MUM-20261018-004",
    table: "Table 02",
    items: ["Paneer Butter Masala × 1", "Butter Naan × 2"],
    status: "Ready to Serve",
  },
  {
    id: "ORD-MUM-20261018-005",
    table: "Table 07",
    items: ["Veg Biryani × 1", "Fresh Lime Soda × 2"],
    status: "Served",
  },
];

export default function ServingPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("All");

  function markAsServed(id: string) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status: "Served" } : order
      )
    );
  }

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const readyCount = orders.filter(
    (order) => order.status === "Ready to Serve"
  ).length;

  const servedCount = orders.filter(
    (order) => order.status === "Served"
  ).length;

  return (
    <main className="min-h-screen pb-8">
      <section className="page-container pt-5">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Serving</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage orders ready to be served to customers.
          </p>
        </div>

        <StaffNavigation />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm text-[var(--muted)]">Ready to Serve</p>
            <p className="mt-2 text-2xl font-semibold">{readyCount}</p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm text-[var(--muted)]">Served</p>
            <p className="mt-2 text-2xl font-semibold">{servedCount}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {["All", "Ready to Serve", "Served"].map((status) => (
            <button
              key={status}
              type="button"
              data-no-loader
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`min-h-11 shrink-0 border px-4 text-sm font-medium ${
                filter === status
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-all text-sm font-semibold">
                    {order.id}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {order.table}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold ${
                    order.status === "Served"
                      ? "text-green-700"
                      : "text-amber-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="my-4 border-y border-[var(--border)] py-3">
                <p className="mb-2 text-xs font-medium text-[var(--muted)]">
                  ORDER ITEMS
                </p>

                {order.items.map((item) => (
                  <p key={item} className="py-1.5 text-sm">
                    {item}
                  </p>
                ))}
              </div>

              {order.status === "Ready to Serve" ? (
                <button
                  type="button"
                  onClick={() => markAsServed(order.id)}
                  className="primary-button w-full sm:w-auto"
                >
                  Mark as Served
                </button>
              ) : (
                <p className="text-sm font-medium text-green-700">
                  Order served successfully.
                </p>
              )}
            </article>
          ))}

          {filteredOrders.length === 0 && (
            <div className="border border-[var(--border)] py-12 text-center">
              <p className="font-medium">No orders found</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Orders matching this status will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
