/**
 * 📚 LEARNING NOTE: Footer Component
 * 
 * The footer appears at the bottom of every page.
 * It has contact info, quick links, and a fun WhatsApp button.
 */

import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,50 1440,40 L1440,100 L0,100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand column */}
            <div className={styles.brand}>
              <div className={styles.logoRow}>
                <Image
                  src="/images/logo.png"
                  alt="Peek-a-Pack Logo"
                  width={36}
                  height={36}
                  className={styles.logoImg}
                />
                <span className={styles.logoText}>Peek-a-Pack</span>
              </div>
              <p className={styles.tagline}>
                Handcrafted surprises, made with love 💕
              </p>
              <p className={styles.tagline}>
                By two crafty sisters who love making tiny treasures!
              </p>
            </div>

            {/* Quick Links */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Quick Links</h4>
              <Link href="/products" className={styles.footerLink}>Shop All</Link>
              <Link href="/track" className={styles.footerLink}>Track Order</Link>
              <Link href="/#how-it-works" className={styles.footerLink}>How It Works</Link>
              <Link href="/#about" className={styles.footerLink}>About Us</Link>
            </div>

            {/* Contact */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Say Hello! 👋</h4>
              <p className={styles.contactText}>
                Have questions? Reach out to us!
              </p>
              <a
                href="https://wa.me/?text=Hi%20Peek-a-Pack!%20🎁"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-teal btn-sm ${styles.whatsappBtn}`}
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className={styles.bottom}>
            <p>© {currentYear} Peek-a-Pack. Made with 💖 and lots of glitter!</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
