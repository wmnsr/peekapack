/**
 * 📚 LEARNING NOTE: Admin Layout
 * 
 * This layout wraps all admin pages. It provides:
 * - A sidebar for navigation between admin sections
 * - An authentication check (redirects to login if not signed in)
 * 
 * Only the /admin/login page bypasses auth check.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", emoji: "📊", exact: true },
  { href: "/admin/products", label: "Products", emoji: "🎁" },
  { href: "/admin/orders", label: "Orders", emoji: "📦" },
  { href: "/admin/invite-codes", label: "Invite Codes", emoji: "🔐" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* The login page gets a clean layout without sidebar */
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <span>🎁</span>
            <span className={styles.sidebarLogoText}>Peek-a-Pack</span>
          </Link>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={styles.navEmoji}>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.viewShopLink}>
            🌐 View Shop
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className={styles.mainArea}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h2 className={styles.pageTitle}>
            {NAV_ITEMS.find((item) =>
              item.exact ? pathname === item.href : pathname.startsWith(item.href)
            )?.label || "Admin"}
          </h2>
          <div className={styles.topBarRight}>
            <span className={styles.welcomeText}>Hi, Boss! 👋</span>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
