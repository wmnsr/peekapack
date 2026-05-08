/**
 * 📚 LEARNING NOTE: Checkout Page
 * 
 * This is where buyers enter their details and place an order.
 * They need an invite code to prove they're from the community.
 * No online payment — payment is done in person (cash/UPI).
 * 
 * Orders are saved to Supabase, and email notifications are
 * sent to both the buyer and the admin automatically!
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, isLoaded } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    delivery: "pickup",
    inviteCode: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please enter your name";
    if (!form.phone.trim()) errs.phone = "Please enter your phone number";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Please enter a valid 10-digit phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (form.delivery === "delivery" && !form.address.trim())
      errs.address = "Please enter your flat/house number for delivery";
    if (!form.inviteCode.trim())
      errs.inviteCode = "Please enter your invite code";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      /**
       * 📚 LEARNING NOTE: Sending the order to our API
       *
       * We POST the order data to /api/orders, which validates
       * the invite code, saves to Supabase, and sends
       * notifications — all on the server side!
       */
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\s/g, ""),
          email: form.email.trim(),
          address: form.address.trim(),
          delivery: form.delivery,
          inviteCode: form.inviteCode.trim().toUpperCase(),
          notes: form.notes.trim(),
          items: cart.map((item) => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
          total: cartTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Server returned an error (e.g., invalid invite code)
        if (data.error?.toLowerCase().includes("invite")) {
          setErrors({ inviteCode: data.error });
        } else {
          setSubmitError(data.error || "Something went wrong. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      // Store order info for confirmation page
      sessionStorage.setItem(
        "peekapack-last-order",
        JSON.stringify({
          orderNumber: data.orderNumber,
          name: form.name,
          phone: form.phone,
          total: cartTotal,
          itemCount: cart.length,
          delivery: form.delivery,
        })
      );

      clearCart();
      router.push(`/order-confirmed?order=${data.orderNumber}`);
    } catch (err) {
      console.error("[Checkout Error]", err);
      setSubmitError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  if (!isLoaded) return null;

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.empty}>
            <span>🛍️</span>
            <h2>Your bag is empty!</h2>
            <p>Add some surprise packs before checking out.</p>
            <Link href="/products" className="btn btn-primary">
              Browse Packs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Almost There! 🎊</h1>
        <p className={styles.subtitle}>
          Fill in your details to place your order. Payment will be done in
          person — cash or UPI!
        </p>

        {submitError && (
          <div className={styles.submitError}>
            ⚠️ {submitError}
          </div>
        )}

        <form className={styles.layout} onSubmit={handleSubmit}>
          {/* Form */}
          <div className={styles.formSection}>
            {/* Contact Info */}
            <div className={styles.formGroup}>
              <h3 className={styles.groupTitle}>📱 Contact Details</h3>

              <div className="input-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  id="name"
                  name="name"
                  className={`input ${errors.name ? styles.inputError : ""}`}
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`input ${errors.phone ? styles.inputError : ""}`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <span className={styles.error}>{errors.phone}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email (optional — for order updates)</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`input ${errors.email ? styles.inputError : ""}`}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
              </div>
            </div>

            {/* Delivery */}
            <div className={styles.formGroup}>
              <h3 className={styles.groupTitle}>🚚 Delivery Preference</h3>
              <div className={styles.deliveryOptions}>
                <label
                  className={`${styles.deliveryOption} ${
                    form.delivery === "pickup" ? styles.deliveryActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={form.delivery === "pickup"}
                    onChange={handleChange}
                    className={styles.radioHidden}
                  />
                  <span className={styles.deliveryEmoji}>🏠</span>
                  <span className={styles.deliveryLabel}>Pickup</span>
                  <span className={styles.deliveryDesc}>
                    Come pick it up from our place!
                  </span>
                </label>
                <label
                  className={`${styles.deliveryOption} ${
                    form.delivery === "delivery" ? styles.deliveryActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={form.delivery === "delivery"}
                    onChange={handleChange}
                    className={styles.radioHidden}
                  />
                  <span className={styles.deliveryEmoji}>🛵</span>
                  <span className={styles.deliveryLabel}>Delivery</span>
                  <span className={styles.deliveryDesc}>
                    We&apos;ll bring it to you! (Free)
                  </span>
                </label>
              </div>

              {form.delivery === "delivery" && (
                <div className="input-group">
                  <label htmlFor="address">Flat / House Number *</label>
                  <input
                    id="address"
                    name="address"
                    className={`input ${
                      errors.address ? styles.inputError : ""
                    }`}
                    placeholder="e.g., B-204, Sunshine Society"
                    value={form.address}
                    onChange={handleChange}
                  />
                  {errors.address && (
                    <span className={styles.error}>{errors.address}</span>
                  )}
                </div>
              )}
            </div>

            {/* Invite Code */}
            <div className={styles.formGroup}>
              <h3 className={styles.groupTitle}>🔐 Invite Code</h3>
              <p className={styles.groupDesc}>
                Enter the special code shared in our community group.
              </p>
              <div className="input-group">
                <input
                  id="inviteCode"
                  name="inviteCode"
                  className={`input ${
                    errors.inviteCode ? styles.inputError : ""
                  }`}
                  placeholder="Enter your invite code"
                  value={form.inviteCode}
                  onChange={handleChange}
                  style={{ textTransform: "uppercase" }}
                />
                {errors.inviteCode && (
                  <span className={styles.error}>{errors.inviteCode}</span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className={styles.formGroup}>
              <h3 className={styles.groupTitle}>📝 Notes (optional)</h3>
              <textarea
                name="notes"
                className={`input ${styles.textarea}`}
                placeholder="Any special requests? e.g., 'It's a birthday gift!'"
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryItems}>
                {cart.map((item) => (
                  <div key={item.variantId} className={styles.summaryItem}>
                    <div className={styles.summaryItemInfo}>
                      <span className={styles.summaryItemName}>
                        {item.name}
                      </span>
                      <span className={styles.summaryItemMeta}>
                        {item.size.charAt(0).toUpperCase() + item.size.slice(1)}{" "}
                        × {item.quantity}
                      </span>
                    </div>
                    <span className={styles.summaryItemPrice}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryDivider} />

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span className={styles.free}>FREE 🎉</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className={styles.paymentNote}>
                💡 Payment will be collected in person (Cash / UPI)
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-lg ${styles.submitBtn}`}
                disabled={submitting}
              >
                {submitting ? "Placing Order... ✨" : "Place Order 🎁"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
