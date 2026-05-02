/**
 * 📚 LEARNING NOTE: Admin Orders Page
 * 
 * This is where the kids manage incoming orders.
 * They can change order status, mark payments, and send
 * WhatsApp notifications to buyers with pre-filled messages!
 */

"use client";

import { useState } from "react";
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

const INITIAL_ORDERS = [
  { id: "PP-X1Y2Z3", buyer: "Aunt Priya", phone: "9876543210", address: "A-301", delivery: "delivery", items: [{ name: "Ocean Friends", size: "M", qty: 2, price: 75 }], total: 150, status: "preparing", paymentReceived: true, createdAt: "2 May, 6:30 PM" },
  { id: "PP-A1B2C3", buyer: "Mrs. Sharma", phone: "9123456789", address: "B-204", delivery: "delivery", items: [{ name: "Enchanted Garden", size: "S", qty: 1, price: 50 }, { name: "Dino World", size: "L", qty: 1, price: 100 }], total: 150, status: "new", paymentReceived: false, createdAt: "2 May, 6:45 PM" },
  { id: "PP-D4E5F6", buyer: "Uncle Raj", phone: "9988776655", address: "", delivery: "pickup", items: [{ name: "Sweet Treats", size: "L", qty: 1, price: 100 }], total: 100, status: "ready", paymentReceived: true, createdAt: "2 May, 5:00 PM" },
  { id: "PP-G7H8I9", buyer: "Riya (A-101)", phone: "9876512345", address: "A-101", delivery: "delivery", items: [{ name: "Rainbow Unicorns", size: "M", qty: 2, price: 75 }], total: 150, status: "delivered", paymentReceived: true, createdAt: "2 May, 3:00 PM" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const updateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const togglePayment = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentReceived: !o.paymentReceived } : o));
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
      confirmed: `Hi ${order.buyer}! 🎉 Your Peek-a-Pack order ${order.id} has been confirmed! We'll start preparing your surprise soon. ✨`,
      preparing: `Hi ${order.buyer}! 🎨 Great news — we're crafting your Peek-a-Pack order ${order.id} right now! Your surprise will be ready soon! 🎁`,
      ready: `Hi ${order.buyer}! 🎁 Your Peek-a-Pack order ${order.id} is READY! ${order.delivery === "pickup" ? "Come pick it up anytime! 🏠" : "We'll deliver it to " + order.address + " soon! 🛵"}`,
      delivered: `Hi ${order.buyer}! 🎉 Your Peek-a-Pack order ${order.id} has been delivered! We hope you love your surprise! Please share your reaction with us! 💕`,
    };
    const text = messages[messageType] || `Hi ${order.buyer}! Update about your order ${order.id}.`;
    return `https://wa.me/91${order.phone}?text=${encodeURIComponent(text)}`;
  };

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

      {/* Orders List */}
      <div className={styles.ordersList}>
        {filteredOrders.map(order => {
          const sc = STATUS_COLORS[order.status];
          return (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={styles.orderTime}>{order.createdAt}</span>
                </div>
                <span className={styles.statusBadge} style={{ background: sc.bg, color: sc.color }}>
                  {STATUS_OPTIONS.find(s => s.key === order.status)?.emoji}{" "}
                  {STATUS_OPTIONS.find(s => s.key === order.status)?.label}
                </span>
              </div>

              <div className={styles.orderBody}>
                <div className={styles.buyerInfo}>
                  <span className={styles.buyerName}>👤 {order.buyer}</span>
                  <span className={styles.buyerPhone}>📱 {order.phone}</span>
                  <span className={styles.buyerDelivery}>
                    {order.delivery === "pickup" ? "🏠 Pickup" : `🛵 ${order.address}`}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <span key={i} className={styles.itemLine}>
                      {item.name} ({item.size}) × {item.qty} — ₹{item.price * item.qty}
                    </span>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.orderTotal}>Total: ₹{order.total}</span>
                  <button
                    className={`${styles.paymentBtn} ${order.paymentReceived ? styles.paid : styles.unpaid}`}
                    onClick={() => togglePayment(order.id)}
                  >
                    {order.paymentReceived ? "💰 Paid" : "⏳ Payment Pending"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.orderActions}>
                <div className={styles.statusSelect}>
                  <label>Status:</label>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="input"
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
