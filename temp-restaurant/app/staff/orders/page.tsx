
"use client";

import { useMemo, useState } from "react";
import StaffNavigation from "../components/StaffNavigation";
import type { ServiceLocation } from "../../restaurant-config";

type OrderStatus = "Incoming" | "Preparing" | "Ready";
type ViewMode = "grid" | "list";

type Order = {
  id: string;
  serviceLocation: ServiceLocation;
  time: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerNote: string;
};

const initialOrders: Order[] = [
  {
    id: "ORD-MUM-20261018-001",
    serviceLocation: { kind: "table", identifier: "05", label: "Table 05" },
    time: "Just now",
    items: [
      { name: "Paneer Tikka", quantity: 2, price: 280 },
      { name: "Butter Naan", quantity: 4, price: 55 },
    ],
    total: 780,
    status: "Incoming",
    customerName: "Aarav",
    customerNote: "Less spicy, please.",
  },
  {
    id: "ORD-MUM-20261018-002",
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
    serviceLocation: { kind: "table", identifier: "02", label: "Table 02" },
    time: "12 min ago",
    items: [
      { name: "Paneer Butter Masala", quantity: 1, price: 290 },
      { name: "Butter Naan", quantity: 2, price: 55 },
    ],
    total: 400,
    status: "Incoming",
    customerName: "Neha",
    customerNote: "Pack chutney separately.",
  },
  {
    id: "ORD-MUM-20261018-005",
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
  Incoming: "bg-amber-50 text-amber-800",
  Preparing: "bg-blue-50 text-blue-800",
  Ready: "bg-green-50 text-green-800",
};

const PAGE_SIZE = 4;

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const query = locationSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        activeFilter === "All" || order.status === activeFilter;

      const matchesLocation =
        !query ||
        order.serviceLocation.label.toLowerCase().includes(query) ||
        order.serviceLocation.identifier.toLowerCase().includes(query);

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
    setExpandedOrder(null);
  }

  function changeLocationSearch(value: string) {
    setLocationSearch(value);
    setCurrentPage(1);
    setExpandedOrder(null);
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
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
            Find orders by table or room number and manage their status.
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Sample orders only; customer checkout and POS are not connected.
          </p>
        </div>

        <StaffNavigation />

        {/* Status summary cards */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            {
              label: "Incoming",
              count: orders.filter((order) => order.status === "Incoming").length,
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
            placeholder="Search table or room, e.g. Table 05"
            aria-label="Search by table or room number"
            className="form-control form-control--with-icon"
          />
        </div>

        {/* Status filters and view toggle */}
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", "Incoming", "Preparing", "Ready"].map((filter) => (
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
            const isExpanded = expandedOrder === order.id;

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
                    <p className="mt-1 break-all text-xs text-[var(--muted)]">
                      {order.id}
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

                <div className="my-4 border-y border-[var(--border)] py-3">
                  {order.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between gap-3 py-1.5 text-sm"
                    >
                      <span className="min-w-0">
                        {item.name} × {item.quantity}
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

                  <button
                    type="button"
                    data-no-loader
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                    aria-expanded={isExpanded}
                    className="min-h-10 border border-[var(--border)] px-3 text-sm font-medium"
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
                    <div>
                      <p className="text-sm font-semibold">Customer Notes</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                        {order.customerNote.trim() ||
                          "No special instructions provided."}
                      </p>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted)]">Total items</span>
                      <span>
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  {order.status === "Incoming" && (
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
              <p className="font-medium">No orders found for this location</p>
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
                  setExpandedOrder(null);
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
                  setExpandedOrder(null);
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
