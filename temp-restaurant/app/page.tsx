
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { categories, menuItems } from "./menu-data";
import { restaurantConfig } from "./restaurant-config";

type FoodFilter = "all" | "veg" | "nonveg";

export default function Home() {
  const { cart, updateQuantity } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [foodFilter, setFoodFilter] = useState<FoodFilter>("all");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesFoodType =
        foodFilter === "all" ||
        (foodFilter === "veg" && item.isVeg) ||
        (foodFilter === "nonveg" && !item.isVeg);

      return matchesCategory && matchesSearch && matchesFoodType;
    });
  }, [activeCategory, search, foodFilter]);

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  const cartTotal = menuItems.reduce(
    (total, item) => total + item.price * (cart[item.id] || 0),
    0
  );

  return (
    <main className="min-h-screen overflow-x-clip pb-28">
      {/* Restaurant header */}
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-5 min-[400px]:px-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
          <div className="w-full min-w-0 sm:flex-1">
            <p className="text-xs font-medium tracking-[0.12em] text-[var(--muted)]">
              {restaurantConfig.tagline}
            </p>

            <Link href="/" className="mt-1 block w-fit max-w-full">
              <h1 className="break-words text-2xl font-semibold leading-tight sm:text-3xl">
                {restaurantConfig.name}
              </h1>
            </Link>

            <p className="mt-2 break-words text-sm text-[var(--muted)]">
              {restaurantConfig.branchName} · {restaurantConfig.city}
            </p>
          </div>

          <Link
            href="/cart"
            className="secondary-button max-w-full shrink-0 sm:self-center"
          >
            Your order ({cartCount})
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="mx-auto max-w-6xl px-4 pt-8 min-[400px]:px-5 sm:px-8 sm:pt-12">
        <div className="grid gap-7 md:grid-cols-2 md:items-center md:gap-12">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
              {restaurantConfig.openingStatus}
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
              {restaurantConfig.heroTitleLine1}
              <br />
              {restaurantConfig.heroTitleLine2}
            </h2>

            <p className="mt-4 max-w-md text-base leading-7 text-[var(--muted)]">
              {restaurantConfig.heroDescription}
            </p>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {restaurantConfig.address}
            </p>

            <a
              href="#menu"
              className="mt-6 inline-flex min-h-11 items-center border-b border-[var(--primary)] pb-1 text-base font-medium text-[var(--primary)]"
            >
              Explore the menu ↓
            </a>
          </div>

          <img
            src={restaurantConfig.heroImage}
            alt={`${restaurantConfig.name} restaurant food`}
            fetchPriority="high"
            className="h-56 w-full bg-white object-cover sm:h-72 md:h-80"
          />
        </div>
      </section>

      {/* Menu */}
      <section
        id="menu"
        className="mx-auto max-w-6xl scroll-mt-4 px-4 pt-12 min-[400px]:px-5 sm:px-8 sm:pt-16"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
              From our kitchen
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              The menu
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Choose your favourites.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search dishes..."
            aria-label="Search dishes"
            className="min-h-12 w-full min-w-0 border-b border-[var(--border)] bg-transparent px-1 py-3 text-base outline-none focus:border-[var(--primary)] sm:max-w-xs"
          />
        </div>

        {/* Food filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["all", "All food"],
              ["veg", "Veg"],
              ["nonveg", "Non-Veg"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFoodFilter(value)}
              aria-pressed={foodFilter === value}
              className={`min-h-11 border px-4 py-2.5 text-sm transition-colors ${
                foodFilter === value
                  ? "border-[var(--primary)] bg-[var(--primary)] font-medium text-white"
                  : "border-[var(--border)] text-[var(--muted)] hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-6 flex gap-6 overflow-x-auto border-b border-[var(--border)]">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`min-h-11 shrink-0 border-b-2 pb-3 text-sm ${
                activeCategory === category
                  ? "border-[var(--primary)] font-semibold"
                  : "border-transparent text-[var(--muted)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dish list */}
        <div className="mt-2 divide-y divide-[var(--border)]">
          {filteredItems.map((item) => {
            const quantity = cart[item.id] || 0;

            return (
              <article
                key={item.id}
                className={`flex gap-3 py-5 min-[400px]:gap-4 sm:gap-6 sm:py-6 ${
                  !item.available ? "opacity-60" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-24 w-24 shrink-0 bg-white object-cover min-[400px]:h-28 min-[400px]:w-28 sm:h-36 sm:w-40"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span
                      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                        item.isVeg
                          ? "border-green-700"
                          : "border-red-700"
                      }`}
                      aria-label={
                        item.isVeg ? "Vegetarian" : "Non-vegetarian"
                      }
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.isVeg ? "bg-green-700" : "bg-red-700"
                        }`}
                      />
                    </span>

                    <span className="text-xs text-[var(--muted)]">
                      {item.category}
                    </span>

                    {!item.available && (
                      <span className="text-xs font-medium text-[var(--danger)]">
                        Currently unavailable
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 break-words text-base font-semibold leading-snug sm:text-lg">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                    {item.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <span className="font-semibold">₹{item.price}</span>

                    {!item.available ? (
                      <button
                        type="button"
                        disabled
                        className="min-h-11 border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)]"
                      >
                        Unavailable
                      </button>
                    ) : quantity === 0 ? (
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="secondary-button min-w-20 px-4 text-sm"
                      >
                        Add +
                      </button>
                    ) : (
                      <div className="flex min-h-11 items-center gap-3 border border-[var(--border)] px-2.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Remove one ${item.name}`}
                          className="quantity-button"
                        >
                          −
                        </button>

                        <span className="min-w-4 text-center text-sm font-medium">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Add one ${item.name}`}
                          className="quantity-button"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-base font-medium">No dishes found</p>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Try another dish name or filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setFoodFilter("all");
              }}
              className="mt-4 min-h-11 px-3 text-sm font-semibold text-[var(--primary)]"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Fixed cart bar */}
      {cartCount > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--background)] px-4 pt-3 sm:px-6"
          style={{
            paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-[var(--muted)]">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>

              <p className="text-lg font-semibold">₹{cartTotal}</p>
            </div>

            <Link
              href="/cart"
              className="primary-button shrink-0 sm:px-6"
            >
              Review order →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
