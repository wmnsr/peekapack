/**
 * 📚 LEARNING NOTE: Root Layout
 * 
 * This file wraps EVERY page on our website.
 * Think of it like a picture frame — the content inside changes,
 * but the frame (navbar, footer, fonts) stays the same!
 * 
 * The "metadata" object helps search engines (like Google)
 * understand what our website is about. This is called SEO
 * (Search Engine Optimization).
 */

import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Peek-a-Pack | Handcrafted Surprise Blind Bags 🎁",
  description:
    "Discover handmade blind bags filled with miniature surprises! Crafted with love by two creative sisters. Browse, order, and get surprised! 💕",
  keywords: [
    "blind bags",
    "handmade",
    "miniatures",
    "surprise bags",
    "kids crafts",
    "peek-a-pack",
  ],
  openGraph: {
    title: "Peek-a-Pack | Handcrafted Surprise Blind Bags 🎁",
    description:
      "Discover handmade blind bags filled with miniature surprises!",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 
          📚 LEARNING NOTE: Context Provider
          CartProvider wraps the entire app so every page 
          can access the shopping cart data. It's like a 
          shared notebook that all pages can read and write to!
        */}
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
