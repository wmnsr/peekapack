/**
 * 📚 LEARNING NOTE: Orders API Route
 *
 * This is a "server-side" route — it runs on the server, not
 * in the browser. This keeps our secret keys safe!
 *
 * POST /api/orders — Create a new order
 * GET  /api/orders — List all orders (admin)
 */

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { notifyNewOrder } from "@/lib/notifications";
import { NextResponse } from "next/server";

/**
 * Generate a short, readable order number like "PP-X1Y2Z3"
 */
function generateOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No confusing O/0/I/1
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PP-${code}`;
}

/**
 * POST /api/orders — Create a new order
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, delivery, inviteCode, notes, items, total } = body;

    // --- Validation ---
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!phone?.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Valid 10-digit phone is required" }, { status: 400 });
    }
    if (!inviteCode?.trim()) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // --- Validate invite code against Supabase ---
    const { data: codeData, error: codeError } = await supabase
      .from("invite_codes")
      .select("id, code, is_active")
      .eq("code", inviteCode.trim().toUpperCase())
      .eq("is_active", true)
      .single();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: "Invalid invite code. Ask the shop owners for the code!" },
        { status: 400 }
      );
    }

    // --- Generate unique order number ---
    let orderNumber = generateOrderNumber();

    // Check for collision (very unlikely but let's be safe)
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", orderNumber)
      .single();

    if (existing) {
      orderNumber = generateOrderNumber(); // Try once more
    }

    // --- Insert order ---
    const db = supabaseAdmin || supabase;

    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        order_number: orderNumber,
        buyer_name: name.trim(),
        buyer_phone: phone.replace(/\s/g, ""),
        buyer_email: email?.trim() || "",
        buyer_address: address?.trim() || "",
        delivery_preference: delivery || "pickup",
        invite_code_id: codeData.id,
        total_amount: total,
        notes: notes?.trim() || "",
        status: "new",
        payment_received: false,
      })
      .select()
      .single();

    if (orderError) {
      console.error("[Order Insert Error]", orderError);
      return NextResponse.json(
        { error: "Failed to create order. Please try again." },
        { status: 500 }
      );
    }

    // --- Insert order items ---
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await db
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("[Order Items Insert Error]", itemsError);
      // Order was created but items failed — log but don't fail the order
    }

    // --- Increment invite code usage ---
    await db
      .from("invite_codes")
      .update({ times_used: (codeData.times_used || 0) + 1 })
      .eq("id", codeData.id);

    // --- Send notifications (async, don't block response) ---
    const orderWithItems = { ...order, items: orderItems };
    notifyNewOrder(orderWithItems).catch((err) => {
      console.error("[Notification Error]", err.message);
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
    });
  } catch (err) {
    console.error("[Orders API Error]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders — List all orders (admin use)
 * Query params: ?status=new (optional filter)
 */
export async function GET(request) {
  try {
    const db = supabaseAdmin || supabase;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = db
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error("[Orders Fetch Error]", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (err) {
    console.error("[Orders API Error]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
