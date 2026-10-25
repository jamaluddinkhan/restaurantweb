
"use client";

import { useEffect, useMemo, useState } from "react";
import StaffNavigation from "../components/StaffNavigation";
import type { ServiceLocation } from "../../restaurant-config";

type OrderStatus = "New" | "Preparing" | "Ready";
type ViewMode = "grid" | "list";

type Order = {
  id: string;
  number: string;
  serviceLocation: ServiceLocation;
  time: string;
  items: { name: string; quantity: number; price: number; note?: string }[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerNote: string;
  isCustomerOrder?: boolean;
};

type StoredOrder = {
  id: string;
  number?: string;
  placedAt: string;
  items: { name: string; quantity: number; price: number; note?: string }[];
  total: number;
  status: "placed" | "preparing" | "ready";
  statusHistory?: { status: StoredOrder["status"]; timestamp: string }[];
  customerName?: string;
  customerNote?: string;
};

const initialOrders: Order[] = [
  {
    id: "ORD-MUM-20261018-001",
    number: "001",
    serviceLocation: { kind: "table", identifier: "05", label: "Table 05" },
    time: "Just now",
    items: [
      { name: "Paneer Tikka", quantity: 2, price: 280, note: "Less spicy" },
      { name: "Butter Naan", quantity: 4, price: 55, note: "Less buttery" },
    ],
    total: 780,
    status: "New",
    customerName: "Aarav",
    customerNote: "Less spicy, please.",
  },
  {
    id: "ORD-MUM-20261018-002",
    number: "002",
    serviceLocation: { kind: "table", identifier: "03", label: "Table 03" },
    time: "5 min ago",
    items: [
      { name: "Butter Chicken", quantity: 1, price: 420 },
      { name: "Fresh Lime Soda", quantity: 2, price: 100 },
    ],
    total: 620,
    status: "Preparing",
    customerName: "Priya",
    customerNote: "No extra ice in the drinks.",
  },
  {
    id: "ORD-MUM-20261018-003",
    number: "003",
    serviceLocation: { kind: "table", identifier: "08", label: "Table 08" },
    time: "8 min ago",
    items: [
      { name: "Veg Biryani", quantity: 1, price: 320 },
      { name: "Raita", quantity: 1, price: 60 },
    ],
    total: 380,
    status: "Ready",
    customerName: "Rahul",
    customerNote: "",
  },
  {
    id: "ORD-MUM-20261018-004",
    number: "004",
    serviceLocation: { kind: "table", identifier: "02", label: "Table 02" },
    time: "12 min ago",
    items: [
      { name: "Paneer Butter Masala", quantity: 1, price: 290 },
      { name: "Butter Naan", quantity: 2, price: 55 },
    ],
    total: 400,
    status: "New",
    customerName: "Neha",
    customerNote: "Pack chutney separately.",
  },
  {
    id: "ORD-MUM-20261018-005",
    number: "005",
    serviceLocation: { kind: "table", identifier: "07", label: "Table 07" },
    time: "15 min ago",
    items: [
      { name: "Masala Dosa", quantity: 2, price: 180 },
      { name: "Filter Coffee", quantity: 2, price: 70 },
    ],
    total: 500,
    status: "Preparing",
    customerName: "Aman",
    customerNote: "",
  },
  {
    id: "ORD-MUM-20261018-006",
    number: "006",
    serviceLocation: { kind: "table", identifier: "01", label: "Table 01" },
    time: "20 min ago",
    items: [
      { name: "Veg Fried Rice", quantity: 1, price: 240 },
      { name: "Manchurian", quantity: 1, price: 210 },
    ],
    total: 450,
    status: "Ready",
    customerName: "Sara",
    customerNote: "No onion.",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  New: "bg-amber-50 text-amber-800",
  Preparing: "bg-blue-50 text-blue-800",
  Ready: "bg-green-50 text-green-800",
};

const PAGE_SIZE = 4;

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    function loadSavedOrders() {
      try {
        const savedOrders: Order[] = [];

        for (const key of Object.keys(localStorage)) {
          if (!key.startsWith("restaurant-order-ORD-")) continue;

          try {
            const saved = JSON.parse(
              localStorage.getItem(key) || "null"
            ) as StoredOrder | null;

            if (
              !saved ||
              typeof saved.id !== "string" ||
              !Array.isArray(saved.items) ||
              !["placed", "preparing", "ready"].includes(saved.status)
            ) {
              throw new Error(`Invalid order data in ${key}`);
            }

            savedOrders.push({
              id: saved.id,
              number:
                saved.number ||
                saved.id.match(/(\d+)$/)?.[1] ||
                "???",
              serviceLocation: {
                kind: "table",
                identifier: "Online",
                label: "Online Order",
              },
              time: "Just now",
              items: saved.items,
              total: saved.total,
              status:
                saved.status === "placed"
                  ? "New"
                  : saved.status === "preparing"
                    ? "Preparing"
                    : "Ready",
              customerName: saved.customerName?.trim() || "Customer",
              customerNote: saved.customerNote?.trim() || "",
              isCustomerOrder: true,
            });
          } catch (error) {
            console.error(`Could not read saved order from ${key}.`, error);
          }
        }

        setOrders((currentOrders) => [
          ...savedOrders,
          ...currentOrders.filter((order) => !order.isCustomerOrder),
        ]);
        setOrderError("");
      } catch (error) {
        console.error("Could not load saved customer orders.", error);
        setOrderError("Customer orders could not be loaded from this browser.");
      }
    }

    loadSavedOrders();
    window.addEventListener("storage", loadSavedOrders);

    return () => window.removeEventListener("storage", loadSavedOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    const query = locationSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        activeFilter === "All" || order.status === activeFilter;

      const matchesLocation =
        !query ||
        [
          order.serviceLocation.label,
          order.serviceLocation.identifier,
          order.number,
          order.customerName,
          order.id,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesLocation;
    });
  }, [orders, activeFilter, locationSearch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleOrders = filteredOrders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function changeFilter(filter: string) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function changeLocationSearch(value: string) {
    setLocationSearch(value);
    setCurrentPage(1);
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    const order = orders.find((item) => item.id === id);

    if (order?.isCustomerOrder) {
      try {
        const storageKey = `restaurant-order-${id}`;
        const savedText = localStorage.getItem(storageKey);

        if (!savedText) {
          throw new Error(`Saved order ${id} was not found.`);
        }

        const saved = JSON.parse(savedText) as StoredOrder;
        const savedStatus =
          status === "New"
            ? "placed"
            : status === "Preparing"
              ? "preparing"
              : "ready";
        const timestamp = new Date().toISOString();

        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...saved,
            status: savedStatus,
            statusHistory: [
              ...(saved.statusHistory || []).filter(
                (entry) => entry.status !== savedStatus
              ),
              { status: savedStatus, timestamp },
            ],
          })
        );
        setOrderError("");
      } catch (error) {
        console.error(`Could not update saved order ${id}.`, error);
        setOrderError("The order status could not be saved. Please try again.");
        return;
      }
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  }

  return (
    <main className="min-h-screen pb-8">
      <section className="page-container pt-5">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Review kitchen orders, customer requests, and status.
          </p>
        </div>

        <StaffNavigation />

        {orderError && (
          <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          {orderError}
          </p>
        )}

        {/* Status summary cards */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            {
              label: "New",
              count: orders.filter((order) => order.status === "New").length,
              color: "text-amber-700",
            },
            {
              label: "Preparing",
              count: orders.filter((order) => order.status === "Preparing").length,
              color: "text-blue-700",
            },
            {
              label: "Ready",
              count: orders.filter((order) => order.status === "Ready").length,
              color: "text-green-700",
            },
          ].map((stat) => (
            <button
              key={stat.label}
              type="button"
              data-no-loader
              onClick={() =>
                changeFilter(
                  activeFilter === stat.label ? "All" : stat.label
                )
              }
              aria-pressed={activeFilter === stat.label}
              className={`min-w-0 border bg-[var(--surface)] p-3 text-left sm:p-4 ${
                activeFilter === stat.label
                  ? "border-[var(--primary)] ring-1 ring-[var(--primary)]"
                  : "border-[var(--border)]"
              }`}
            >
              <p className={`text-xs sm:text-sm ${stat.color}`}>
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{stat.count}</p>
              <p className="mt-1 hidden text-xs text-[var(--muted)] sm:block">
                Click to filter
              </p>
            </button>
          ))}
        </div>

        {/* Search by service location */}
        <div className="relative mt-5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center text-[var(--muted)]"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </span>

          <input
            type="search"
            value={locationSearch}
            onChange={(event) => changeLocationSearch(event.target.value)}
            placeholder="Search order number, name, table or room"
            aria-label="Search orders by number, name, table, or room"
            className="form-control form-control--with-icon"
          />
        </div>

        {/* Status filters and view toggle */}
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", "New", "Preparing", "Ready"].map((filter) => (
              <button
                key={filter}
                type="button"
                data-no-loader
                onClick={() => changeFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`min-h-10 shrink-0 border px-3 text-sm font-medium ${
                  activeFilter === filter
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid / List toggle */}
          <div className="flex shrink-0 self-end border border-[var(--border)] bg-[var(--surface)] p-1 sm:self-auto">
            <button
              type="button"
              data-no-loader
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              className={`flex min-h-10 min-w-11 items-center justify-center ${
                viewMode === "grid"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>

            <button
              type="button"
              data-no-loader
              onClick={() => setViewMode("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              className={`flex min-h-10 min-w-11 items-center justify-center ${
                viewMode === "list"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M9 5h12M9 12h12M9 19h12" />
                <circle cx="4" cy="5" r="1" />
                <circle cx="4" cy="12" r="1" />
                <circle cx="4" cy="19" r="1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "order" : "orders"} found
          </p>

          {activeFilter !== "All" && (
            <button
              type="button"
              data-no-loader
              onClick={() => changeFilter("All")}
              className="text-sm font-medium text-[var(--primary)]"
            >
              Clear status filter
            </button>
          )}
        </div>

        {/* Order cards */}
        <div
          className={`mt-4 ${
            viewMode === "grid"
              ? "grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-3"
          }`}
        >
          {visibleOrders.map((order) => {
            return (
              <article
                key={order.id}
                className="min-w-0 border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold">
                      {order.serviceLocation.label}
                    </h2>
                    <p className="mt-1 text-3xl font-bold tracking-tight">
                      #{order.number}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {order.time} · {order.customerName}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-1.5 text-xs font-semibold ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                {order.customerNote && (
                  <div className="mt-4 border-l-4 border-[var(--accent)] bg-[var(--background)] px-3 py-2">
                    <p className="text-xs font-semibold">Customer note</p>
                    <p className="mt-1 text-sm leading-6">
                      {order.customerNote}
                    </p>
                  </div>
                )}

                <div className="my-4 border-y border-[var(--border)] py-3">
                  {order.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between gap-3 py-1.5 text-sm"
                    >
                      <span className="min-w-0">
                        {item.name} × {item.quantity}
                        {item.note && (
                          <span className="mt-1 block text-xs font-medium text-[var(--primary)]">
                            Note: {item.note}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Order total</p>
                    <p className="mt-1 text-lg font-semibold">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  {order.status === "New" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateOrderStatus(order.id, "Preparing")
                      }
                      className="primary-button w-full"
                    >
                      Accept Order
                    </button>
                  )}

                  {order.status === "Preparing" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "Ready")}
                      className="primary-button w-full"
                    >
                      Mark Ready
                    </button>
                  )}

                  {order.status === "Ready" && (
                    <p className="py-2 text-center text-sm font-medium text-green-700">
                      Order is ready to serve
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* No results */}
        {filteredOrders.length === 0 && (
          <div className="mt-4 border border-[var(--border)] py-12 text-center">
            <p className="font-medium">No orders found for this search</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Check the table or room number, or clear the search.
            </p>
            <button
              type="button"
              data-no-loader
              onClick={() => changeLocationSearch("")}
              className="mt-4 text-sm font-medium text-[var(--primary)]"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--muted)]">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                type="button"
                data-no-loader
                disabled={safePage === 1}
                onClick={() => {
                  setCurrentPage((page) => Math.max(1, page - 1));
                }}
                className="outline-button min-h-10 px-4 text-sm"
              >
                ← Previous
              </button>

              <span className="whitespace-nowrap text-sm">
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                data-no-loader
                disabled={safePage === totalPages}
                onClick={() => {
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  );
                }}
                className="outline-button min-h-10 px-4 text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
