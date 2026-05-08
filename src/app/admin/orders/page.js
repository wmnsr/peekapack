/**
 * 📚 LEARNING NOTE: Admin Orders Page
 * 
 * This is where the kids manage incoming orders.
 * They can change order status, mark payments, and send
 * WhatsApp notifications to buyers with pre-filled messages!
 * 
 * Orders are fetched from Supabase in real-time, and status
 * changes are saved back to the database automatically.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./orders-admin.module.css";

const STATUS_OPTIONS = [
  { key: "new", label: "New", emoji: "📦" },
  { key: "confirmed", label: "Confirmed", emoji: "✅" },
  { key: "preparing", label: "Preparing", emoji: "🎨" },
  { key: "ready", label: "Ready", emoji: "🎁" },
  { key: "delivered", label: "Delivered", emoji: "🎉" },
  { key: "cancelled", label: "Cancelled", emoji: "❌" },
];

const STATUS_COLORS = {
  new: { bg: "#DBEAFE", color: "#1D4ED8" },
  confirmed: { bg: "#E0E7FF", color: "#4338CA" },
  preparing: { bg: "#FEF3C7", color: "#B45309" },
  ready: { bg: "#D1FAE5", color: "#047857" },
  delivered: { bg: "#F0FDF4", color: "#15803D" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  /**
   * 📚 LEARNING NOTE: Fetching orders from our API
   * 
   * We use useCallback to memoize this function so it doesn't
   * get re-created on every render. This is important because
   * it's used inside useEffect!
   */
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to load orders");
        return;
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("[Fetch Orders Error]", err);
      setError("Failed to load orders. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(o => o.status === filterStatus);

  /**
   * Update order status via API
   */
  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
      } else {
        const data = await response.json();
        alert(`Failed to update: ${data.error}`);
      }
    } catch (err) {
      console.error("[Status Update Error]", err);
      alert("Failed to update status. Please try again.");
    }
    setUpdatingId(null);
  };

  /**
   * Toggle payment received via API
   */
  const togglePayment = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentReceived: !order.payment_received }),
      });

      if (response.ok) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, payment_received: !o.payment_received } : o
        ));
      }
    } catch (err) {
      console.error("[Payment Toggle Error]", err);
    }
    setUpdatingId(null);
  };

  /**
   * 📚 LEARNING NOTE: WhatsApp Click-to-Send
   * 
   * We create a special URL: https://wa.me/91PHONE?text=MESSAGE
   * When the admin clicks this link, it opens WhatsApp with
   * a pre-written message. The admin just has to press Send!
   * This is 100% free — no API keys needed.
   */
  const getWhatsAppLink = (order, messageType) => {
    const messages = {
      confirmed: `Hi ${order.buyer_name}! 🎉 Your Peek-a-Pack order ${order.order_number} has been confirmed! We'll start preparing your surprise soon. ✨`,
      preparing: `Hi ${order.buyer_name}! 🎨 Great news — we're crafting your Peek-a-Pack order ${order.order_number} right now! Your surprise will be ready soon! 🎁`,
      ready: `Hi ${order.buyer_name}! 🎁 Your Peek-a-Pack order ${order.order_number} is READY! ${order.delivery_preference === "pickup" ? "Come pick it up anytime! 🏠" : "We'll deliver it to " + order.buyer_address + " soon! 🛵"}`,
      delivered: `Hi ${order.buyer_name}! 🎉 Your Peek-a-Pack order ${order.order_number} has been delivered! We hope you love your surprise! Please share your reaction with us! 💕`,
    };
    const text = messages[messageType] || `Hi ${order.buyer_name}! Update about your order ${order.order_number}.`;
    return `https://wa.me/91${order.buyer_phone}?text=${encodeURIComponent(text)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <span className={styles.loadingEmoji}>📦</span>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <span className={styles.loadingEmoji}>⚠️</span>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => { setError(""); setLoading(true); fetchOrders(); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filterStatus === "all" ? styles.filterActive : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.filter(s => s.key !== "cancelled").map(s => {
          const count = orders.filter(o => o.status === s.key).length;
          return (
            <button
              key={s.key}
              className={`${styles.filterBtn} ${filterStatus === s.key ? styles.filterActive : ""}`}
              onClick={() => setFilterStatus(s.key)}
            >
              {s.emoji} {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredOrders.length === 0 && (
        <div className={styles.loading}>
          <span className={styles.loadingEmoji}>📭</span>
          <p>{filterStatus === "all" ? "No orders yet! Share your shop link to get started." : `No ${filterStatus} orders right now.`}</p>
        </div>
      )}

      {/* Orders List */}
      <div className={styles.ordersList}>
        {filteredOrders.map(order => {
          const sc = STATUS_COLORS[order.status];
          const isUpdating = updatingId === order.id;
          return (
            <div key={order.id} className={`${styles.orderCard} ${isUpdating ? styles.orderUpdating : ""}`}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>{order.order_number}</span>
                  <span className={styles.orderTime}>{formatDate(order.created_at)}</span>
                </div>
                <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color }}>
                  {STATUS_OPTIONS.find(s => s.key === order.status)?.emoji}{" "}
                  {STATUS_OPTIONS.find(s => s.key === order.status)?.label}
                </span>
              </div>

              <div className={styles.orderBody}>
                <div className={styles.buyerInfo}>
                  <span className={styles.buyerName}>👤 {order.buyer_name}</span>
                  <span className={styles.buyerPhone}>📱 {order.buyer_phone}</span>
                  <span className={styles.buyerDelivery}>
                    {order.delivery_preference === "pickup" ? "🏠 Pickup" : `🛵 ${order.buyer_address}`}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {order.order_items?.map((item, i) => (
                    <span key={i} className={styles.itemLine}>
                      {item.product_name} ({item.size}) × {item.quantity} — ₹{item.subtotal}
                    </span>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.orderTotal}>Total: ₹{order.total_amount}</span>
                  <button
                    className={`${styles.paymentBtn} ${order.payment_received ? styles.paid : styles.unpaid}`}
                    onClick={() => togglePayment(order.id)}
                    disabled={isUpdating}
                  >
                    {order.payment_received ? "💰 Paid" : "⏳ Payment Pending"}
                  </button>
                </div>
                {order.notes && (
                  <div className={styles.orderNotes}>
                    📝 {order.notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={styles.orderActions}>
                <div className={styles.statusSelect}>
                  <label>Status:</label>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="input"
                    disabled={isUpdating}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.waButtons}>
                  {["confirmed", "preparing", "ready", "delivered"].map(msgType => (
                    <a
                      key={msgType}
                      href={getWhatsAppLink(order, msgType)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.waBtn}
                      title={`Send "${msgType}" message via WhatsApp`}
                    >
                      💬 {msgType.charAt(0).toUpperCase() + msgType.slice(1)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
