/**
 * 📚 LEARNING NOTE: Products Listing Page
 * 
 * This page shows ALL available blind bags in a grid.
 * Users can filter by theme and size.
 * 
 * "use client" because we need state (filters) and 
 * browser interactions (clicking filters, adding to cart).
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS, THEMES, SIZES } from "@/lib/mockData";
import styles from "./products.module.css";

export default function ProductsPage() {
  const [activeTheme, setActiveTheme] = useState("all");
  const [activeSize, setActiveSize] = useState(null);

  /* Scroll-reveal animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /**
   * 📚 LEARNING NOTE: useMemo
   * 
   * useMemo is like a "smart calculator" — it only recalculates
   * the filtered products when the filter values change, not on
   * every single re-render. This makes the page faster!
   */
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (!p.is_active) return false;
      if (activeTheme !== "all" && p.theme !== activeTheme) return false;
      if (activeSize) {
        const hasVariant = p.variants.some(
          (v) => v.size === activeSize && v.stock_count > 0
        );
        if (!hasVariant) return false;
      }
      return true;
    });
  }, [activeTheme, activeSize]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Our Blind Bags 🎁</h1>
          <p className={styles.subtitle}>
            Each bag is a surprise — pick your theme, pick your size, and let
            the magic unfold!
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className={`${styles.filters} reveal`}>
          {/* Theme Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Theme:</span>
            <div className={styles.filterTags}>
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  className={`${styles.filterTag} ${
                    activeTheme === theme.id ? styles.filterTagActive : ""
                  }`}
                  onClick={() => setActiveTheme(theme.id)}
                  id={`filter-theme-${theme.id}`}
                >
                  {theme.emoji} {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Size:</span>
            <div className={styles.filterTags}>
              <button
                className={`${styles.filterTag} ${
                  !activeSize ? styles.filterTagActive : ""
                }`}
                onClick={() => setActiveSize(null)}
              >
                All
              </button>
              {SIZES.map((size) => (
                <button
                  key={size.id}
                  className={`${styles.filterTag} ${
                    activeSize === size.id ? styles.filterTagActive : ""
                  }`}
                  onClick={() =>
                    setActiveSize(activeSize === size.id ? null : size.id)
                  }
                  id={`filter-size-${size.id}`}
                >
                  {size.short} — {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.resultCount}>
            Showing {filteredProducts.length} pack
            {filteredProducts.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map((product, i) => {
              const lowestPrice = Math.min(
                ...product.variants.map((v) => v.price)
              );
              const totalStock = product.variants.reduce(
                (sum, v) => sum + v.stock_count,
                0
              );

              return (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className={`${styles.card} reveal reveal-delay-${(i % 4) + 1}`}
                  id={`product-${product.id}`}
                >
                  {/* Image */}
                  <div className={styles.cardImage}>
                    <div className={styles.cardPlaceholder}>
                      {product.theme === "animals" && "🐠"}
                      {product.theme === "fantasy" && "🧚"}
                      {product.theme === "food" && "🧁"}
                      {product.theme === "space" && "🚀"}
                    </div>
                    {product.is_featured && (
                      <span className={styles.featuredBadge}>⭐ Featured</span>
                    )}
                    <span className={styles.themeBadge}>
                      {THEMES.find((t) => t.id === product.theme)?.emoji}{" "}
                      {product.theme}
                    </span>
                  </div>

                  {/* Info */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardName}>{product.name}</h3>
                    <p className={styles.cardDesc}>
                      {product.description.slice(0, 80)}...
                    </p>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardPrice}>
                        From ₹{lowestPrice}
                      </span>
                      <div className={styles.cardSizes}>
                        {product.variants.map((v) => (
                          <span
                            key={v.id}
                            className={`${styles.sizeCircle} ${
                              v.stock_count === 0 ? styles.sizeOOS : ""
                            }`}
                          >
                            {v.size[0].toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stock indicator */}
                    {totalStock <= 5 && totalStock > 0 && (
                      <div className={styles.lowStock}>
                        🔥 Only {totalStock} left!
                      </div>
                    )}
                    {totalStock === 0 && (
                      <div className={styles.outOfStock}>Out of stock 😢</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🔍</span>
            <h3>No packs found</h3>
            <p>Try a different filter!</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setActiveTheme("all");
                setActiveSize(null);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
