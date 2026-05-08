/**
 * 📚 LEARNING NOTE: Order Status Update API
 *
 * PATCH /api/orders/[id]/status
 *
 * Allows the admin to update an order's status or payment
 * state. When the status changes, we send a notification
 * to the buyer!
 *
 * The [id] in the folder name is a "dynamic route parameter" —
 * Next.js extracts it from the URL for us.
 */

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { notifyStatusChange } from "@/lib/notifications";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentReceived } = body;

    const db = supabaseAdmin || supabase;

    // Build update object
    const updates = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (paymentReceived !== undefined) updates.payment_received = paymentReceived;

    // Fetch current order first (for notifications)
    const { data: currentOrder } = await db
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order
    const { data: updatedOrder, error } = await db
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Status Update Error]", error);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    // Send notification if STATUS changed (not just payment toggle)
    if (status && status !== currentOrder.status) {
      const orderForNotif = { ...currentOrder, ...updatedOrder };
      notifyStatusChange(orderForNotif, status).catch((err) => {
        console.error("[Status Notification Error]", err.message);
      });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("[Status API Error]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
