
"use client";

import Link from "next/link";
import { useCart } from "../CartProvider";
import { menuItems } from "../menu-data";

export default function CartPage() {
  const { cart, updateQuantity } = useCart();

  const cartItems = menuItems.filter((item) => (cart[item.id] || 0) > 0);

  const totalItems = cartItems.reduce(
    (total, item) => total + (cart[item.id] || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (cart[item.id] || 0),
    0
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-[var(--background)] pb-8 text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Back to Menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-lg text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--background)]"
            >
              <span aria-hidden="true">←</span>
            </Link>
            <Link
              href="/"
              className="flex min-h-11 items-center text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Back to Menu
            </Link>
          </div>

          <span className="shrink-0 text-sm text-[var(--muted)]">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-8 pt-6 sm:px-6 sm:pt-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
            Your Order
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your Cart
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Review your items before checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <section className="mt-8 border-y border-[var(--border)] py-12 text-center sm:py-16">
            <h2 className="text-xl font-semibold">Your cart is empty</h2>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[var(--muted)]">
              Explore our menu and add something you love.
            </p>

            <Link
              href="/"
              className="primary-button mt-6 w-full sm:w-auto"
            >
              Explore Menu
            </Link>
          </section>
        ) : (
          <div className="mt-7 grid gap-8 md:grid-cols-[1fr_280px] md:items-start">
            <section aria-label="Cart items">
              <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {cartItems.map((item) => {
                  const quantity = cart[item.id] || 0;

                  return (
                    <article
                      key={item.id}
                      className="flex gap-3 py-5 min-[400px]:gap-4 sm:py-6"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-24 w-24 shrink-0 bg-white object-cover min-[400px]:h-28 min-[400px]:w-28"
                      />

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                                  item.isVeg
                                    ? "border-green-700"
                                    : "border-red-700"
                                }`}
                                aria-label={
                                  item.isVeg
                                    ? "Vegetarian"
                                    : "Non-vegetarian"
                                }
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    item.isVeg
                                      ? "bg-green-700"
                                      : "bg-red-700"
                                  }`}
                                />
                              </span>

                              <span className="text-xs text-[var(--muted)]">
                                {item.category}
                              </span>
                            </div>

                            <h2 className="mt-2 break-words text-sm font-semibold leading-snug min-[400px]:text-base">
                              {item.name}
                            </h2>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                              ₹{item.price} each
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-semibold">
                            ₹{item.price * quantity}
                          </p>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="quantity-button"
                            >
                              −
                            </button>

                            <span className="min-w-6 text-center text-sm font-medium">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label={`Increase ${item.name} quantity`}
                              className="quantity-button"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -quantity)}
                            className="min-h-11 px-2 text-sm font-medium text-[var(--danger)] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Link
                href="/"
                className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-[var(--primary)] hover:underline"
              >
                + Add more items
              </Link>
            </section>

            <aside className="h-fit border-y border-[var(--border)] py-5 md:border md:p-5">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--muted)]">
                  Items ({totalItems})
                </span>
                <span>₹{subtotal}</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                <span className="text-base font-semibold">Subtotal</span>
                <span className="text-xl font-semibold">₹{subtotal}</span>
              </div>

              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                Applicable taxes or additional charges may be shown at checkout.
              </p>

              <Link
                href="/checkout"
                className="primary-button mt-6 w-full"
              >
                Proceed to Checkout →
              </Link>

              <p className="mt-3 text-center text-xs leading-5 text-[var(--muted)]">
                You can review your order before placing it.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
