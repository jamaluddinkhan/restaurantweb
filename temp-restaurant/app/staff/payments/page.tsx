
"use client";

import { useState } from "react";
import StaffNavigation from "../components/StaffNavigation";

type Payment = {
  id: string;
  table: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending";
};

const initialPayments: Payment[] = [
  {
    id: "ORD-MUM-20261018-001",
    table: "Table 05",
    amount: 780,
    method: "UPI",
    status: "Paid",
  },
  {
    id: "ORD-MUM-20261018-002",
    table: "Table 03",
    amount: 620,
    method: "Pay at Counter",
    status: "Pending",
  },
];

export default function PaymentsPage() {
  const [filter, setFilter] = useState("All");

  const payments =
    filter === "All"
      ? initialPayments
      : initialPayments.filter((payment) => payment.status === filter);

  const paidTotal = initialPayments
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingTotal = initialPayments
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  return (
    <main className="min-h-screen pb-8">
      <section className="page-container pt-5">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            View customer payment details.
          </p>
        </div>

        <StaffNavigation />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm text-[var(--muted)]">Paid Amount</p>
            <p className="mt-2 text-2xl font-semibold">₹{paidTotal}</p>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm text-[var(--muted)]">Pending Amount</p>
            <p className="mt-2 text-2xl font-semibold">₹{pendingTotal}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {["All", "Paid", "Pending"].map((status) => (
            <button
              key={status}
              type="button"
              data-no-loader
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`min-h-11 border px-4 text-sm font-medium ${
                filter === status
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {payments.map((payment) => (
            <article
              key={payment.id}
              className="border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-all text-sm font-semibold">
                    {payment.id}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {payment.table} · {payment.method}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${
                    payment.status === "Paid"
                      ? "text-green-700"
                      : "text-amber-700"
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              <p className="mt-4 text-lg font-semibold">
                ₹{payment.amount}
              </p>
            </article>
          ))}

          {payments.length === 0 && (
            <div className="border border-[var(--border)] py-12 text-center">
              <p className="font-medium">No payments found</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Payments matching this status will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
