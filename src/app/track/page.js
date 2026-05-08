/**
 * 📚 LEARNING NOTE: Order Tracking Page
 * 
 * Buyers can check the status of their order by entering
 * their order number and phone number. The status is shown
 * as a visual timeline. Data comes from Supabase!
 */

"use client";

import { useState } from "react";
import styles from "./track.module.css";

const STATUS_STEPS = [
  { key: "new", label: "Order Placed", emoji: "📦", desc: "We received your order!" },
  { key: "confirmed", label: "Confirmed", emoji: "✅", desc: "Order confirmed by shop" },
  { key: "preparing", label: "Preparing", emoji: "🎨", desc: "We're crafting your surprise!" },
  { key: "ready", label: "Ready", emoji: "🎁", desc: "Your order is ready!" },
  { key: "delivered", label: "Delivered", emoji: "🎉", desc: "Enjoy your surprise!" },
];

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!orderNum.trim() || !phone.trim()) {
      setError("Please enter both order number and phone number");
      return;
    }

    setSearching(true);

    try {
      /**
       * 📚 LEARNING NOTE: Fetching from our API
       *
       * We call our /api/orders/track endpoint with the order
       * number and phone as query parameters. The API looks
       * up the order in Supabase and returns the details.
       */
      const params = new URLSearchParams({
        orderNumber: orderNum.trim().toUpperCase(),
        phone: phone.trim().replace(/\s/g, ""),
      });

      const response = await fetch(`/api/orders/track?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Order not found. Please check your details.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("[Track Error]", err);
      setError("Network error. Please check your connection and try again.");
      setOrder(null);
    }

    setSearching(false);
  };

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

  /**
   * Format a date string nicely
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1>Track Your Order 📦</h1>
          <p>Enter your order number and phone to check the status.</p>
        </div>

        {/* Search Form */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchFields}>
            <div className="input-group">
              <label htmlFor="track-order">Order Number</label>
              <input
                id="track-order"
                className="input"
                placeholder="e.g., PP-X1Y2Z3"
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                style={{ textTransform: "uppercase" }}
              />
            </div>
            <div className="input-group">
              <label htmlFor="track-phone">Phone Number</label>
              <input
                id="track-phone"
                className="input"
                type="tel"
                placeholder="Your 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`btn btn-primary ${styles.searchBtn}`}
            disabled={searching}
          >
            {searching ? "Searching... 🔍" : "Track Order 🔍"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>

        {/* Order Result */}
        {order && (
          <div className={styles.result}>
            {/* Status Timeline */}
            <div className={styles.timeline}>
              <h3 className={styles.timelineTitle}>Order Status</h3>
              <div className={styles.steps}>
                {STATUS_STEPS.map((step, i) => {
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;

                  return (
                    <div
                      key={step.key}
                      className={`${styles.step} ${
                        isCompleted ? styles.stepDone : ""
                      } ${isCurrent ? styles.stepCurrent : ""}`}
                    >
                      <div className={styles.stepDot}>
                        {isCompleted ? step.emoji : "○"}
                      </div>
                      <div className={styles.stepInfo}>
                        <span className={styles.stepLabel}>{step.label}</span>
                        {isCurrent && (
                          <span className={styles.stepDesc}>{step.desc}</span>
                        )}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`${styles.stepLine} ${
                            isCompleted && i < currentStepIndex
                              ? styles.stepLineDone
                              : ""
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className={styles.orderDetails}>
              <h3>Order Details</h3>
              <div className={styles.detailCard}>
                <div className={styles.detailRow}>
                  <span>Order #</span>
                  <span className={styles.detailValue}>
                    {order.order_number}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Name</span>
                  <span>{order.buyer_name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Placed on</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Delivery</span>
                  <span>
                    {order.delivery_preference === "pickup"
                      ? "🏠 Pickup"
                      : `🛵 ${order.buyer_address}`}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Payment</span>
                  <span>
                    {order.payment_received ? "✅ Received" : "⏳ Pending (Cash/UPI)"}
                  </span>
                </div>

                <div className={styles.detailDivider} />

                {order.order_items?.map((item, i) => (
                  <div key={i} className={styles.detailRow}>
                    <span>
                      {item.product_name} ({item.size}) × {item.quantity}
                    </span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}

                <div className={styles.detailDivider} />

                <div className={`${styles.detailRow} ${styles.detailTotal}`}>
                  <span>Total</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
