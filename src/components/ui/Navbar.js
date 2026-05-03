/**
 * 📚 LEARNING NOTE: Navigation Bar Component
 * 
 * This is the top bar that appears on every page.
 * "use client" means this component runs in the browser (not server)
 * because it needs to react to user interactions (clicks, scrolls).
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Change navbar style when user scrolls down */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`} id="main-nav">
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="nav-logo">
          <Image
            src="/images/logo.png"
            alt="Peek-a-Pack Logo"
            width={40}
            height={40}
            className={styles.logoImg}
            priority
          />
          <span className={styles.logoText}>Peek-a-Pack</span>
        </Link>

        {/* Desktop links */}
        <div className={`${styles.links} ${mobileMenuOpen ? styles.linksOpen : ""}`}>
          <Link href="/" className={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/products" className={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Shop
          </Link>
          <Link href="/track" className={styles.link} onClick={() => setMobileMenuOpen(false)}>
            Track Order
          </Link>
        </div>

        {/* Right side: cart + mobile menu */}
        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartBtn} id="nav-cart">
            <span className={styles.cartIcon}>🛍️</span>
            {cartCount > 0 && (
              <span className={styles.cartBadge} key={cartCount}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger menu for mobile */}
          <button
            className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="nav-hamburger"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
