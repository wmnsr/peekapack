/**
 * 📚 LEARNING NOTE: Shopping Cart Page
 * 
 * This page shows everything the buyer has added to their cart.
 * The cart data comes from our CartContext (shared storage).
 * The cart is saved in localStorage, so items survive page refresh!
 */

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { cart, isLoaded, updateQuantity, removeFromCart, cartTotal } =
    useCart();

  if (!isLoaded) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Loading your surprise bag... 🎁</div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🛍️</span>
            <h2>Your Surprise Bag is Empty!</h2>
            <p>No surprises yet — let&apos;s fix that!</p>
            <Link href="/products" className="btn btn-primary btn-lg">
              🔍 Browse Packs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Your Surprise Bag 🛍️</h1>
        <p className={styles.subtitle}>
          {cart.length} item{cart.length !== 1 ? "s" : ""} ready for checkout
        </p>

        <div className={styles.layout}>
          {/* Cart Items */}
          <div className={styles.items}>
            {cart.map((item) => (
              <div key={item.variantId} className={styles.item}>
                {/* Item Image */}
                <div className={styles.itemImage}>
                  <span className={styles.itemEmoji}>🎁</span>
                </div>

                {/* Item Details */}
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <span className={styles.itemSize}>
                    Size:{" "}
                    {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                  </span>
                  <span className={styles.itemPrice}>₹{item.price} each</span>
                </div>

                {/* Quantity Controls */}
                <div className={styles.itemQty}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity + 1)
                    }
                    disabled={item.quantity >= 10}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className={styles.itemSubtotal}>
                  <span>₹{item.price * item.quantity}</span>
                </div>

                {/* Remove */}
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.variantId)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span className={styles.free}>FREE 🎉</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>

              <Link
                href="/checkout"
                className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}
              >
                Proceed to Checkout 🎊
              </Link>

              <Link href="/products" className={styles.continueLink}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
