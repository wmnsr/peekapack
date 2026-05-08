/**
 * 📚 LEARNING NOTE: Order Tracking API
 *
 * GET /api/orders/track?orderNumber=PP-XXX&phone=9876543210
 *
 * Looks up an order by its order number and the buyer's phone.
 * Both must match — this prevents strangers from looking up
 * other people's orders!
 */

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();
    const phone = searchParams.get("phone")?.trim().replace(/\s/g, "");

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "Order number and phone number are required" },
        { status: 400 }
      );
    }

    const db = supabaseAdmin || supabase;

    const { data: order, error } = await db
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .eq("buyer_phone", phone)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Order not found. Please check your order number and phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("[Track API Error]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
