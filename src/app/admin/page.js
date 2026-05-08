/**
 * 📚 LEARNING NOTE: Admin Dashboard
 * 
 * This is the first page admins see after logging in.
 * It shows key stats at a glance: total orders, revenue,
 * products, and pending orders — all from real data!
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/mockData";
import styles from "./dashboard.module.css";

const STATUS_COLORS = {
  new: { bg: "#DBEAFE", color: "#1D4ED8", label: "New" },
  confirmed: { bg: "#E0E7FF", color: "#4338CA", label: "Confirmed" },
  preparing: { bg: "#FEF3C7", color: "#B45309", label: "Preparing" },
  ready: { bg: "#D1FAE5", color: "#047857", label: "Ready" },
  delivered: { bg: "#F0FDF4", color: "#15803D", label: "Delivered" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", label: "Cancelled" },
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("[Dashboard Fetch Error]", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Compute real stats from orders
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => ["new", "confirmed", "preparing"].includes(o.status)).length,
    revenue: orders
      .filter(o => o.payment_received)
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
    totalProducts: PRODUCTS.length,
  };

  // Get the 5 most recent orders
  const recentOrders = orders.slice(0, 5).map(o => ({
    id: o.order_number,
    buyer: o.buyer_name,
    items: o.order_items?.length || 0,
    total: Number(o.total_amount || 0),
    status: o.status,
    time: formatTimeAgo(o.created_at),
  }));

  function formatTimeAgo(dateStr) {
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
  }

  return (
    <div className={styles.dashboard}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statPrimary}`}>
          <span className={styles.statEmoji}>📦</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {loading ? "..." : stats.totalOrders}
            </span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statWarning}`}>
          <span className={styles.statEmoji}>⏳</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {loading ? "..." : stats.pendingOrders}
            </span>
            <span className={styles.statLabel}>Pending</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statSuccess}`}>
          <span className={styles.statEmoji}>💰</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {loading ? "..." : `₹${stats.revenue}`}
            </span>
            <span className={styles.statLabel}>Revenue (Paid)</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statTeal}`}>
          <span className={styles.statEmoji}>🎁</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalProducts}</span>
            <span className={styles.statLabel}>Products</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Recent Orders</h3>
          <Link href="/admin/orders" className={styles.viewAll}>View All →</Link>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#94A3B8", padding: "2rem" }}>Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94A3B8", padding: "2rem" }}>
            No orders yet! Share your shop link to get started. 🚀
          </p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Order</span>
              <span>Buyer</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {recentOrders.map((order) => {
              const status = STATUS_COLORS[order.status] || STATUS_COLORS.new;
              return (
                <div key={order.id} className={styles.tableRow}>
                  <span className={styles.orderId}>{order.id}</span>
                  <span>{order.buyer}</span>
                  <span>{order.items}</span>
                  <span className={styles.orderTotal}>₹{order.total}</span>
                  <span
                    className={styles.statusBadge}
                    style={{ background: status.bg, color: status.color }}
                  >
                    {status.label}
                  </span>
                  <span className={styles.orderTime}>{order.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h3>Quick Actions ⚡</h3>
        <div className={styles.quickActions}>
          <Link href="/admin/products" className={styles.quickAction}>
            <span>🎁</span> Manage Products
          </Link>
          <Link href="/admin/orders" className={styles.quickAction}>
            <span>📦</span> View Orders
          </Link>
          <Link href="/admin/invite-codes" className={styles.quickAction}>
            <span>🔐</span> Invite Codes
          </Link>
          <Link href="/" className={styles.quickAction} target="_blank">
            <span>🌐</span> View Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
