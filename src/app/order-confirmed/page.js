/**
 * 📚 LEARNING NOTE: Order Confirmation Page
 * 
 * This page shows after a successful order placement.
 * It shows a fun, celebratory animation with the order details.
 * The order info is stored temporarily in sessionStorage.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./confirmed.module.css";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "PP-XXXXXX";
  const [orderInfo, setOrderInfo] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("peekapack-last-order");
      if (stored) setOrderInfo(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* Confetti */}
      {showConfetti && (
        <div className={styles.confetti}>
          {[...Array(30)].map((_, i) => (
            <span
              key={i}
              className={styles.confettiPiece}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                backgroundColor: [
                  "#FF6B8A",
                  "#2DD4BF",
                  "#FBBF24",
                  "#C4B5FD",
                  "#FF4D73",
                ][i % 5],
              }}
            />
          ))}
        </div>
      )}

      <div className={`container ${styles.content}`}>
        <div className={styles.card}>
          <div className={styles.emoji}>🎉</div>
          <h1 className={styles.title}>Order Placed!</h1>
          <p className={styles.subtitle}>
            Your surprise is on its way to being prepared! ✨
          </p>

          <div className={styles.orderBox}>
            <span className={styles.orderLabel}>Your Order Number</span>
            <span className={styles.orderNumber}>{orderNumber}</span>
            <span className={styles.orderHint}>
              Save this number to track your order!
            </span>
          </div>

          {orderInfo && (
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span>Name</span>
                <span>{orderInfo.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Phone</span>
                <span>{orderInfo.phone}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Delivery</span>
                <span>
                  {orderInfo.delivery === "pickup"
                    ? "🏠 Pickup"
                    : "🛵 Delivery"}
                </span>
              </div>
              <div className={`${styles.detailRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{orderInfo.total}</span>
              </div>
            </div>
          )}

          <div className={styles.paymentReminder}>
            💡 Remember: Payment will be collected in person (Cash / UPI)
          </div>

          <div className={styles.actions}>
            <Link href="/track" className="btn btn-primary">
              📦 Track My Order
            </Link>
            <Link href="/products" className="btn btn-secondary">
              🔍 Keep Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '120px', textAlign: 'center' }}>Loading... ✨</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
