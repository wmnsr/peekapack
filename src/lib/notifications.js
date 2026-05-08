/**
 * 📚 LEARNING NOTE: Notification Service
 *
 * This file handles sending notifications when something
 * important happens (like a new order or status change).
 *
 * We use two channels:
 * 1. Email — via Resend (a simple email API)
 * 2. WhatsApp — via wa.me links (manual click-to-send)
 *
 * The admin phone number and email are configured here.
 * We also log every notification in the Supabase
 * `notification_log` table for record-keeping.
 */

import { Resend } from "resend";
import { supabaseAdmin } from "./supabase";
import {
  newOrderBuyerEmail,
  newOrderAdminEmail,
  statusChangeBuyerEmail,
} from "./email-templates";

const ADMIN_PHONE = "9920853367";
const ADMIN_EMAIL = "nsr.narender@gmail.com";

/**
 * Create the Resend client (only if API key is configured)
 * If not configured, emails will be skipped gracefully.
 */
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * The "from" address for emails.
 * When using Resend's free tier without a verified domain,
 * you must use "onboarding@resend.dev".
 * Once you verify your domain, change this to something like:
 * "Peek-a-Pack <hello@peekapack.in>"
 */
const EMAIL_FROM = "Peek-a-Pack <onboarding@resend.dev>";

/**
 * Send an email using Resend.
 * Fails silently if Resend is not configured.
 */
async function sendEmail(to, subject, html) {
  if (!resend) {
    console.log(`[Email SKIPPED — no RESEND_API_KEY] To: ${to}, Subject: ${subject}`);
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`[Email SENT] To: ${to}, Subject: ${subject}`);
    return result;
  } catch (err) {
    console.error(`[Email FAILED] To: ${to}, Error:`, err.message);
    return null;
  }
}

/**
 * Log a notification in the database
 */
async function logNotification(orderId, channel, eventType, recipient, sent) {
  if (!supabaseAdmin) return;

  try {
    await supabaseAdmin.from("notification_log").insert({
      order_id: orderId,
      channel,
      event_type: eventType,
      recipient,
      sent,
    });
  } catch (err) {
    console.error("[Notification Log Error]", err.message);
  }
}

/**
 * Generate a WhatsApp click-to-send link
 */
export function getWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/\s/g, "");
  const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * 🔔 Notify when a NEW ORDER is placed
 *
 * Sends:
 * - Email to buyer (if they provided an email)
 * - Email to admin
 * - Logs both notifications
 */
export async function notifyNewOrder(order) {
  const orderId = order.id;

  // 1. Email to buyer (if email was provided)
  if (order.buyer_email) {
    const template = newOrderBuyerEmail(order);
    const result = await sendEmail(order.buyer_email, template.subject, template.html);
    await logNotification(orderId, "email", "order_placed", order.buyer_email, !!result);
  }

  // 2. Email to admin
  const adminTemplate = newOrderAdminEmail(order);
  const adminResult = await sendEmail(ADMIN_EMAIL, adminTemplate.subject, adminTemplate.html);
  await logNotification(orderId, "email", "new_order_admin", ADMIN_EMAIL, !!adminResult);

  // 3. Log WhatsApp link for admin (auto-sending WhatsApp requires paid API)
  const waMessage = `📦 New order ${order.order_number}!\n👤 ${order.buyer_name}\n📱 ${order.buyer_phone}\n💰 ₹${order.total_amount}\n${order.delivery_preference === "pickup" ? "🏠 Pickup" : `🛵 Deliver to ${order.buyer_address}`}`;
  const waLink = getWhatsAppLink(ADMIN_PHONE, waMessage);
  console.log(`[WhatsApp Admin Link] ${waLink}`);

  return { waLink };
}

/**
 * 🔔 Notify when ORDER STATUS changes
 *
 * Sends:
 * - Email to buyer (if they provided an email)
 */
export async function notifyStatusChange(order, newStatus) {
  if (order.buyer_email) {
    const template = statusChangeBuyerEmail(order, newStatus);
    const result = await sendEmail(order.buyer_email, template.subject, template.html);
    await logNotification(order.id, "email", `status_${newStatus}`, order.buyer_email, !!result);
  }

  // Generate WhatsApp link for admin to manually message buyer
  const statusMessages = {
    confirmed: `Hi ${order.buyer_name}! ✅ Your Peek-a-Pack order ${order.order_number} has been confirmed! We'll start crafting soon. ✨`,
    preparing: `Hi ${order.buyer_name}! 🎨 We're crafting your Peek-a-Pack order ${order.order_number} right now! Your surprise will be ready soon! 🎁`,
    ready: `Hi ${order.buyer_name}! 🎁 Your Peek-a-Pack order ${order.order_number} is READY! ${order.delivery_preference === "pickup" ? "Come pick it up anytime! 🏠" : `We'll deliver it to ${order.buyer_address} soon! 🛵`}`,
    delivered: `Hi ${order.buyer_name}! 🎉 Your Peek-a-Pack order ${order.order_number} has been delivered! Hope you love your surprise! 💕`,
    cancelled: `Hi ${order.buyer_name}, your Peek-a-Pack order ${order.order_number} has been cancelled. Please reach out if you have questions.`,
  };

  const message = statusMessages[newStatus] || `Hi ${order.buyer_name}, your order ${order.order_number} status has been updated to: ${newStatus}`;
  return { waLink: getWhatsAppLink(order.buyer_phone, message) };
}
