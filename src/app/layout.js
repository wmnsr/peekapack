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
import LayoutShell from "@/components/LayoutShell";

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
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
