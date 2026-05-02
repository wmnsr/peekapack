/**
 * 📚 LEARNING NOTE: Order Tracking Page
 * 
 * Buyers can check the status of their order by entering
 * their order number and phone number. The status is shown
 * as a visual timeline.
 */

"use client";

import { useState } from "react";
import styles from "./track.module.css";

/* Mock order for demo purposes (will come from Supabase later) */
const MOCK_ORDER = {
  orderNumber: "PP-ABC123",
  phone: "9876543210",
  buyerName: "Demo User",
  items: [
    { name: "Ocean Friends", size: "Medium", qty: 2, price: 75 },
    { name: "Enchanted Garden", size: "Small", qty: 1, price: 50 },
  ],
  total: 200,
  delivery: "delivery",
  address: "B-204, Sunshine Society",
  status: "preparing",
  paymentReceived: true,
  createdAt: "2 May 2026, 6:30 PM",
};

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

    /* Simulate API call */
    await new Promise((r) => setTimeout(r, 1000));

    /* For demo, match the mock order */
    if (
      orderNum.trim().toUpperCase() === MOCK_ORDER.orderNumber &&
      phone.trim() === MOCK_ORDER.phone
    ) {
      setOrder(MOCK_ORDER);
    } else {
      setError(
        "Order not found. Please check your order number and phone number."
      );
      setOrder(null);
    }

    setSearching(false);
  };

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1;

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
                placeholder="e.g., PP-ABC123"
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
          <p className={styles.demoHint}>
            💡 Demo: Use order <strong>PP-ABC123</strong> with phone{" "}
            <strong>9876543210</strong>
          </p>
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
                    {order.orderNumber}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Name</span>
                  <span>{order.buyerName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Placed on</span>
                  <span>{order.createdAt}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Delivery</span>
                  <span>
                    {order.delivery === "pickup"
                      ? "🏠 Pickup"
                      : `🛵 ${order.address}`}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Payment</span>
                  <span>
                    {order.paymentReceived ? "✅ Received" : "⏳ Pending"}
                  </span>
                </div>

                <div className={styles.detailDivider} />

                {order.items.map((item, i) => (
                  <div key={i} className={styles.detailRow}>
                    <span>
                      {item.name} ({item.size}) × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}

                <div className={styles.detailDivider} />

                <div className={`${styles.detailRow} ${styles.detailTotal}`}>
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
