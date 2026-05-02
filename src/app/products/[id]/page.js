/**
 * 📚 LEARNING NOTE: Dynamic Route
 * 
 * The [id] in the folder name means this page is "dynamic".
 * When someone visits /products/prod-1, Next.js passes
 * { id: "prod-1" } as the params. We use this to find the
 * right product from our data!
 */

"use client";

import { useState, use } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import styles from "./detail.module.css";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(
    product?.variants?.[0]?.size || "small"
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <span className={styles.notFoundEmoji}>😢</span>
        <h2>Pack Not Found</h2>
        <p>This blind bag doesn&apos;t exist or has been removed.</p>
        <Link href="/products" className="btn btn-primary">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize
  );
  const inStock = selectedVariant && selectedVariant.stock_count > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  // Related products (same theme, different product)
  const related = PRODUCTS.filter(
    (p) => p.theme === product.theme && p.id !== product.id && p.is_active
  ).slice(0, 3);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Shop</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        <div className={styles.main}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageLarge}>
              <div className={styles.imagePlaceholder}>
                {product.theme === "animals" && "🐠"}
                {product.theme === "fantasy" && "🧚"}
                {product.theme === "food" && "🧁"}
                {product.theme === "space" && "🚀"}
              </div>
              {product.is_featured && (
                <span className={styles.featuredTag}>⭐ Featured</span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <div className={styles.themeBadge}>
              ✨ {product.theme}
            </div>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.desc}>{product.description}</p>

            {/* Price */}
            <div className={styles.priceRow}>
              <span className={styles.price}>₹{selectedVariant?.price}</span>
              <span className={styles.priceLabel}>
                {selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} bag
              </span>
            </div>

            {/* Size Selector */}
            <div className={styles.sizeSection}>
              <label className={styles.sizeLabel}>Choose Size:</label>
              <div className={styles.sizeOptions}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className={`${styles.sizeBtn} ${
                      selectedSize === v.size ? styles.sizeBtnActive : ""
                    } ${v.stock_count === 0 ? styles.sizeBtnOOS : ""}`}
                    onClick={() => {
                      setSelectedSize(v.size);
                      setQuantity(1);
                    }}
                    disabled={v.stock_count === 0}
                    id={`size-${v.size}`}
                  >
                    <span className={styles.sizeName}>
                      {v.size.charAt(0).toUpperCase() + v.size.slice(1)}
                    </span>
                    <span className={styles.sizePrice}>₹{v.price}</span>
                    {v.stock_count === 0 && (
                      <span className={styles.sizeOOS}>Sold out</span>
                    )}
                    {v.stock_count > 0 && v.stock_count <= 3 && (
                      <span className={styles.sizeLow}>
                        Only {v.stock_count}!
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            {inStock && (
              <div className={styles.qtySection}>
                <label className={styles.sizeLabel}>Quantity:</label>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          10,
                          Math.min(selectedVariant.stock_count, quantity + 1)
                        )
                      )
                    }
                    disabled={
                      quantity >= 10 || quantity >= selectedVariant.stock_count
                    }
                  >
                    +
                  </button>
                </div>
                <span className={styles.qtyHint}>Max 10 per order</span>
              </div>
            )}

            {/* Add to Cart */}
            <button
              className={`btn btn-primary btn-lg ${styles.addBtn} ${
                addedAnimation ? styles.addBtnSuccess : ""
              }`}
              onClick={handleAddToCart}
              disabled={!inStock}
              id="add-to-cart"
            >
              {addedAnimation
                ? "✅ Added to Surprise Bag!"
                : inStock
                ? "🛍️ Add to Surprise Bag"
                : "😢 Sold Out"}
            </button>

            {/* Hints */}
            <div className={styles.hints}>
              <h4 className={styles.hintsTitle}>🤫 What might be inside...</h4>
              <p className={styles.hintsText}>{product.hints}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className={styles.related}>
            <h3 className={styles.relatedTitle}>You Might Also Like 💕</h3>
            <div className={styles.relatedGrid}>
              {related.map((rp) => (
                <Link
                  href={`/products/${rp.id}`}
                  key={rp.id}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImage}>
                    {rp.theme === "animals" && "🐠"}
                    {rp.theme === "fantasy" && "🧚"}
                    {rp.theme === "food" && "🧁"}
                    {rp.theme === "space" && "🚀"}
                  </div>
                  <div className={styles.relatedInfo}>
                    <h4>{rp.name}</h4>
                    <span className={styles.relatedPrice}>
                      From ₹{Math.min(...rp.variants.map((v) => v.price))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
