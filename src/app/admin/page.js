/**
 * 📚 LEARNING NOTE: Admin Dashboard
 * 
 * This is the first page admins see after logging in.
 * It shows key stats at a glance: total orders, revenue,
 * products, and pending orders. The data is mock for now.
 */

"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/mockData";
import styles from "./dashboard.module.css";

/* Mock stats (will come from Supabase later) */
const MOCK_STATS = {
  totalOrders: 12,
  pendingOrders: 3,
  revenue: 1850,
  totalProducts: PRODUCTS.length,
};

const RECENT_ORDERS = [
  { id: "PP-X1Y2Z3", buyer: "Aunt Priya", items: 2, total: 150, status: "preparing", time: "10 min ago" },
  { id: "PP-A1B2C3", buyer: "Mrs. Sharma", items: 3, total: 250, status: "new", time: "25 min ago" },
  { id: "PP-D4E5F6", buyer: "Uncle Raj", items: 1, total: 100, status: "ready", time: "1 hour ago" },
  { id: "PP-G7H8I9", buyer: "Riya (A-101)", items: 2, total: 200, status: "delivered", time: "3 hours ago" },
];

const STATUS_COLORS = {
  new: { bg: "#DBEAFE", color: "#1D4ED8", label: "New" },
  confirmed: { bg: "#E0E7FF", color: "#4338CA", label: "Confirmed" },
  preparing: { bg: "#FEF3C7", color: "#B45309", label: "Preparing" },
  ready: { bg: "#D1FAE5", color: "#047857", label: "Ready" },
  delivered: { bg: "#F0FDF4", color: "#15803D", label: "Delivered" },
};

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statPrimary}`}>
          <span className={styles.statEmoji}>📦</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{MOCK_STATS.totalOrders}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statWarning}`}>
          <span className={styles.statEmoji}>⏳</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{MOCK_STATS.pendingOrders}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statSuccess}`}>
          <span className={styles.statEmoji}>💰</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>₹{MOCK_STATS.revenue}</span>
            <span className={styles.statLabel}>Revenue</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.statTeal}`}>
          <span className={styles.statEmoji}>🎁</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{MOCK_STATS.totalProducts}</span>
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
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Order</span>
            <span>Buyer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          {RECENT_ORDERS.map((order) => {
            const status = STATUS_COLORS[order.status];
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
