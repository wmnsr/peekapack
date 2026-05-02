/**
 * 📚 LEARNING NOTE: Layout Shell
 * 
 * This component decides whether to show the Navbar and Footer.
 * On admin pages (/admin/*), we hide them because admin has
 * its own sidebar layout. On shop pages, we show them.
 * 
 * "use client" because we need usePathname() from the browser.
 */

"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { CartProvider } from "@/context/CartContext";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <CartProvider>
      {!isAdmin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </CartProvider>
  );
}
