
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../CartProvider";
import { menuItems } from "../menu-data";
import { restaurantConfig } from "../restaurant-config";

type PaymentMethod = "counter" | "upi" | "card";

type OrderSummary = {
  id: string;
  number: string;
  placedAt: string;
  customerName: string;
  customerNote: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    note: string;
  }[];
  total: number;
  payment: PaymentMethod;
};

function generateOrderIdentity() {
  const date = new Date();
  const dateCode = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const storageKey = "restaurant-order-sequence";
  const previousCount = Number(localStorage.getItem(storageKey) || "6");

  if (!Number.isSafeInteger(previousCount) || previousCount < 0) {
    throw new Error("Could not generate an order number. Please try again.");
  }

  const nextCount = Math.max(6, previousCount) + 1;
  const number = String(nextCount).padStart(3, "0");
  localStorage.setItem(storageKey, String(nextCount));

  return { id: `ORD-MUM-${dateCode}-${number}`, number };
}

const paymentOptions: {
  id: PaymentMethod;
  title: string;
  description: string;
}[] = [
  {
    id: "counter",
    title: "Pay at Counter",
    description: "Pay at the restaurant counter.",
  },
  {
    id: "upi",
    title: "UPI",
    description: "Pay using your UPI app.",
  },
  {
    id: "card",
    title: "Credit or Debit Card",
    description: "Pay using your bank card.",
  },
];

export default function CheckoutPage() {
  const { cart, updateQuantity, clearCart } = useCart();

  const [payment, setPayment] = useState<PaymentMethod>("counter");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const cartItems = menuItems.filter((item) => (cart[item.id] || 0) > 0);

  const totalItems = cartItems.reduce(
    (total, item) => total + cart[item.id],
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * cart[item.id],
    0
  );

  function handlePlaceOrder() {
    if (placingOrder || cartItems.length === 0 || order) return;

    if (!customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    const unavailableItem = cartItems.find((item) => !item.available);

    if (unavailableItem) {
      alert(
        `${unavailableItem.name} is currently unavailable. Please remove it from your cart.`
      );
      return;
    }

    setPlacingOrder(true);
    setErrorMessage("");

    const placedAt = new Date().toISOString();

    try {
      const identity = generateOrderIdentity();
      const summary: OrderSummary = {
        ...identity,
        placedAt,
        customerName: customerName.trim(),
        customerNote: customerNote.trim(),
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: cart[item.id],
          note: itemNotes[item.id]?.trim() || "",
        })),
        total: subtotal,
        payment,
      };

      localStorage.setItem(
        `restaurant-order-${summary.id}`,
        JSON.stringify({
          ...summary,
          status: "placed",
          statusHistory: [
            {
              status: "placed",
              timestamp: placedAt,
            },
          ],
        })
      );

      window.setTimeout(() => {
        setOrder(summary);
        clearCart();
        setPlacingOrder(false);
      }, 300);
    } catch (error) {
      console.error("Unable to save the order in browser storage.", error);
      setErrorMessage(
        "We couldn't save your order. Please check your browser storage and try again."
      );
      setPlacingOrder(false);
    }
  }

  if (order) {
    const placedDate = new Date(order.placedAt);

    return (
      <main className="min-h-screen bg-[var(--background)] px-5 py-10 text-[var(--foreground)]">
        <div className="mx-auto max-w-lg pt-6">
          <div className="success-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]">
            <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9">
              <path
                d="m5 12 4.5 4.5L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="success-check"
              />
            </svg>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Thank you for your order!
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Keep your order number for reference.
            </p>
          </div>

          <section className="mt-8 border-y border-[var(--border)] py-6">
            <p className="text-xs text-[var(--muted)]">Order Number</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">
              {order.number}
            </p>

            <p className="mt-4 text-xs text-[var(--muted)]">Name</p>
            <p className="mt-1 text-sm font-medium">{order.customerName}</p>
            {order.customerNote && (
              <>
                <p className="mt-4 text-xs text-[var(--muted)]">
                  Order note
                </p>
                <p className="mt-1 text-sm">{order.customerNote}</p>
              </>
            )}

            <p className="mt-4 text-xs text-[var(--muted)]">Order Placed</p>
            <p className="mt-1 text-sm font-medium">
              {placedDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              at{" "}
              {placedDate.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[var(--muted)]">Payment Method</p>
                <p className="mt-2 text-sm font-medium">
                  {paymentOptions.find((option) => option.id === order.payment)?.title}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted)]">Order Total</p>
                <p className="mt-2 text-lg font-semibold">₹{order.total}</p>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-base font-semibold">Order Summary</h2>
            <div className="mt-4 divide-y divide-[var(--border)]">
              {order.items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <span className="text-[var(--muted)]">
                    {item.name} × {item.quantity}
                    {item.note && (
                      <span className="mt-1 block text-xs text-[var(--foreground)]">
                        Note: {item.note}
                      </span>
                    )}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <Link
            href={`/order-tracking?orderId=${encodeURIComponent(order.id)}`}
            className="primary-button mt-7 w-full"
          >
            Track Your Order
          </Link>

          <Link
            href="/"
            className="mt-4 flex min-h-11 items-center justify-center text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-5 py-12 text-[var(--foreground)]">
        <div className="mx-auto max-w-lg">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--primary)] hover:underline"
          >
            ← Back to Menu
          </Link>

          <section className="mt-12 border-y border-[var(--border)] py-12 text-center">
            <h1 className="text-2xl font-semibold">Your cart is empty</h1>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Add items to your cart before checking out.
            </p>
            <Link
              href="/"
              className="primary-button mt-6"
            >
              Explore Menu
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/cart"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          ← Back to Cart
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {restaurantConfig.name}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Confirm your order and choose how you would like to pay.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <section>
            <h2 className="text-lg font-semibold">Your details</h2>
            <label
              htmlFor="customer-name"
              className="mt-4 block text-sm font-medium"
            >
              Name <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              autoComplete="name"
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="form-control mt-2"
              placeholder="Your name"
            />

            <label
              htmlFor="customer-note"
              className="mt-5 block text-sm font-medium"
            >
              Order notes <span className="font-normal text-[var(--muted)]">(optional)</span>
            </label>
            <textarea
              id="customer-note"
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
              className="form-control mt-2 min-h-24"
              placeholder="Any general requests for the kitchen?"
              rows={3}
            />

            <h2 className="mt-8 text-lg font-semibold">Payment Method</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Select your preferred payment option.
            </p>

            <div className="mt-5 space-y-3">
              {paymentOptions.map((option) => {
                const selected = payment === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPayment(option.id)}
                    aria-pressed={selected}
                    className={`flex min-h-20 w-full items-center justify-between gap-4 border p-4 text-left ${
                      selected
                        ? "border-[var(--primary)] bg-[var(--surface)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--background)]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{option.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {option.description}
                      </p>
                    </div>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? "border-[var(--primary)]" : "border-[var(--border)]"
                      }`}
                    >
                      {selected && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {payment !== "counter" && (
              <p className="mt-4 border-l-2 border-[var(--accent)] pl-3 text-sm leading-6 text-[var(--muted)]">
                Online payment will be available once secure payment processing
                is connected.
              </p>
            )}
          </section>

          <aside className="h-fit border-y border-[var(--border)] py-5 lg:border lg:px-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-5 divide-y divide-[var(--border)]">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      ₹{item.price} each
                    </p>
                    <label
                      htmlFor={`item-note-${item.id}`}
                      className="mt-3 block text-xs font-medium"
                    >
                      Item note <span className="font-normal text-[var(--muted)]">(optional)</span>
                    </label>
                    <textarea
                      id={`item-note-${item.id}`}
                      value={itemNotes[item.id] || ""}
                      onChange={(event) =>
                        setItemNotes((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                      className="form-control mt-1 min-h-16 py-2 text-sm"
                      placeholder={`Note for ${item.name}`}
                      rows={2}
                    />
                    <div className="mt-3 quantity-control">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="quantity-button"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span className="min-w-7 text-center text-xs">
                        {cart[item.id]}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="quantity-button"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">
                    ₹{item.price * cart[item.id]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
              <span className="text-[var(--muted)]">Items ({totalItems})</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-xl font-semibold">₹{subtotal}</span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder || cartItems.length === 0}
              className="primary-button mt-6 w-full"
            >
              {placingOrder ? "Please wait..." : "Place Order"}
            </button>
            {errorMessage && (
              <p role="alert" className="mt-3 text-sm text-[var(--danger)]">
                {errorMessage}
              </p>
            )}

            <Link
              href="/cart"
              className="mt-4 flex min-h-11 items-center justify-center text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Edit Cart
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
