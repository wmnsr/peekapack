/**
 * 📚 LEARNING NOTE: Email Templates
 *
 * These are HTML email templates styled to match the
 * Peek-a-Pack brand. They use inline CSS because most
 * email clients don't support <style> tags or external CSS.
 *
 * We use our brand colours:
 *  - Coral Pink: #FF6B8A
 *  - Turquoise Teal: #2DD4BF
 *  - Soft Lavender: #C4B5FD
 *  - Midnight Navy: #1E1B4B
 *  - Cream White: #FFF7ED
 */

const BRAND = {
  pink: "#FF6B8A",
  pinkLight: "#FFD6DF",
  teal: "#2DD4BF",
  lavender: "#C4B5FD",
  lavenderLight: "#EDE9FE",
  navy: "#1E1B4B",
  cream: "#FFF7ED",
  cardPink: "#FFF1F3",
  muted: "#64748B",
  white: "#FFFFFF",
};

function baseLayout(title, bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${BRAND.cream};">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:24px 0 16px;background:linear-gradient(135deg,${BRAND.pink},${BRAND.lavender},${BRAND.teal});border-radius:24px 24px 0 0;">
              <h1 style="margin:0;font-size:28px;color:${BRAND.white};font-weight:800;letter-spacing:-0.5px;">
                🎁 Peek-a-Pack
              </h1>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.85);font-weight:600;">
                Handcrafted Surprise Blind Bags
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:${BRAND.white};padding:32px 28px;border-radius:0 0 24px 24px;box-shadow:0 4px 24px rgba(30,27,75,0.08);">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 0 0;">
              <p style="margin:0;font-size:12px;color:${BRAND.muted};line-height:1.6;">
                Made with 💕 by Avika & Anishka Rawat<br/>
                The Shriram Universal School, Palava<br/>
                <a href="https://peekapack.vercel.app" style="color:${BRAND.pink};text-decoration:none;font-weight:600;">peekapack.vercel.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function itemsTable(items) {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:${BRAND.navy};">
        ${item.product_name || item.name} <span style="color:${BRAND.muted};">(${item.size})</span>
      </td>
      <td align="center" style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:${BRAND.muted};">
        ×${item.quantity || item.qty}
      </td>
      <td align="right" style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:700;color:${BRAND.navy};">
        ₹${item.subtotal || (item.price || item.unit_price) * (item.quantity || item.qty)}
      </td>
    </tr>`
    )
    .join("");

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;">
    <tr>
      <td style="padding:8px 0;border-bottom:2px solid ${BRAND.pinkLight};font-size:12px;font-weight:700;text-transform:uppercase;color:${BRAND.muted};letter-spacing:0.05em;">Item</td>
      <td align="center" style="padding:8px 0;border-bottom:2px solid ${BRAND.pinkLight};font-size:12px;font-weight:700;text-transform:uppercase;color:${BRAND.muted};letter-spacing:0.05em;">Qty</td>
      <td align="right" style="padding:8px 0;border-bottom:2px solid ${BRAND.pinkLight};font-size:12px;font-weight:700;text-transform:uppercase;color:${BRAND.muted};letter-spacing:0.05em;">Price</td>
    </tr>
    ${rows}
  </table>`;
}

/**
 * Email sent to the BUYER when their order is placed
 */
export function newOrderBuyerEmail(order) {
  const trackUrl = `https://peekapack.vercel.app/track`;

  const body = `
    <h2 style="margin:0 0 8px;font-size:24px;color:${BRAND.navy};">
      🎉 Order Confirmed!
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.muted};line-height:1.6;">
      Hi <strong style="color:${BRAND.navy};">${order.buyer_name}</strong>, your Peek-a-Pack order has been placed successfully! We're so excited to craft your surprise! ✨
    </p>

    <!-- Order Number Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:16px;background:${BRAND.cardPink};border-radius:16px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;color:${BRAND.muted};letter-spacing:0.05em;">Order Number</p>
          <p style="margin:0;font-size:24px;font-weight:800;color:${BRAND.pink};letter-spacing:1px;">${order.order_number}</p>
        </td>
      </tr>
    </table>

    <!-- Items -->
    ${itemsTable(order.items)}

    <!-- Total -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:12px 0;font-size:18px;font-weight:800;color:${BRAND.navy};">Total</td>
        <td align="right" style="padding:12px 0;font-size:18px;font-weight:800;color:${BRAND.pink};">₹${order.total_amount}</td>
      </tr>
    </table>

    <!-- Delivery Info -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:12px 0 20px;">
      <tr>
        <td style="padding:12px 16px;background:${BRAND.lavenderLight};border-radius:12px;">
          <p style="margin:0;font-size:13px;color:${BRAND.navy};">
            ${order.delivery_preference === "pickup" ? "🏠 <strong>Pickup</strong> — We'll let you know when it's ready!" : `🛵 <strong>Delivery</strong> to ${order.buyer_address}`}
          </p>
          <p style="margin:6px 0 0;font-size:13px;color:${BRAND.muted};">
            💰 Payment: Cash / UPI (in person)
          </p>
        </td>
      </tr>
    </table>

    <!-- Track CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <a href="${trackUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,${BRAND.pink},${BRAND.lavender});color:${BRAND.white};text-decoration:none;border-radius:50px;font-weight:700;font-size:15px;">
            📦 Track Your Order
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 0;font-size:13px;color:${BRAND.muted};text-align:center;line-height:1.6;">
      Use order number <strong>${order.order_number}</strong> and your phone number to track your order anytime!
    </p>
  `;

  return {
    subject: `🎁 Order Confirmed — ${order.order_number} | Peek-a-Pack`,
    html: baseLayout("Order Confirmed", body),
  };
}

/**
 * Email sent to the ADMIN when a new order is placed
 */
export function newOrderAdminEmail(order) {
  const adminUrl = `https://peekapack.vercel.app/admin/orders`;
  const waLink = `https://wa.me/91${order.buyer_phone.replace(/\s/g, "")}?text=${encodeURIComponent(`Hi ${order.buyer_name}! 🎉 Your Peek-a-Pack order ${order.order_number} has been confirmed! We'll start preparing your surprise soon. ✨`)}`;

  const body = `
    <h2 style="margin:0 0 8px;font-size:24px;color:${BRAND.navy};">
      📦 New Order Received!
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.muted};line-height:1.6;">
      A new order just came in! Time to start crafting! 🎨
    </p>

    <!-- Order & Buyer Info -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:16px;">
      <tr>
        <td style="padding:16px;background:${BRAND.cardPink};border-radius:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size:12px;font-weight:700;color:${BRAND.muted};text-transform:uppercase;padding-bottom:4px;">Order #</td>
              <td align="right" style="font-size:16px;font-weight:800;color:${BRAND.pink};padding-bottom:4px;">${order.order_number}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:${BRAND.navy};padding:4px 0;">👤 Buyer</td>
              <td align="right" style="font-size:13px;font-weight:600;color:${BRAND.navy};padding:4px 0;">${order.buyer_name}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:${BRAND.navy};padding:4px 0;">📱 Phone</td>
              <td align="right" style="font-size:13px;font-weight:600;color:${BRAND.navy};padding:4px 0;">${order.buyer_phone}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:${BRAND.navy};padding:4px 0;">🚚 Delivery</td>
              <td align="right" style="font-size:13px;font-weight:600;color:${BRAND.navy};padding:4px 0;">
                ${order.delivery_preference === "pickup" ? "🏠 Pickup" : `🛵 ${order.buyer_address}`}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Items -->
    ${itemsTable(order.items)}

    <!-- Total -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
      <tr>
        <td style="padding:12px 0;font-size:20px;font-weight:800;color:${BRAND.navy};">Total</td>
        <td align="right" style="padding:12px 0;font-size:20px;font-weight:800;color:${BRAND.pink};">₹${order.total_amount}</td>
      </tr>
    </table>

    ${order.notes ? `<p style="margin:0 0 20px;padding:12px 16px;background:#FEF3C7;border-radius:12px;font-size:13px;color:#92400E;"><strong>📝 Note:</strong> ${order.notes}</p>` : ""}

    <!-- Action Buttons -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:0 4px;">
          <a href="${adminUrl}" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,${BRAND.pink},${BRAND.lavender});color:${BRAND.white};text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;margin:4px;">
            📋 View in Admin
          </a>
          <a href="${waLink}" style="display:inline-block;padding:12px 24px;background:#25D366;color:${BRAND.white};text-decoration:none;border-radius:50px;font-weight:700;font-size:14px;margin:4px;">
            💬 WhatsApp Buyer
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: `📦 New Order ${order.order_number} — ₹${order.total_amount} from ${order.buyer_name}`,
    html: baseLayout("New Order", body),
  };
}

/**
 * Email sent to the BUYER when their order status changes
 */
export function statusChangeBuyerEmail(order, newStatus) {
  const statusInfo = {
    confirmed: { emoji: "✅", title: "Order Confirmed!", message: "Great news! We've confirmed your order and will start crafting your surprise soon.", color: "#4338CA" },
    preparing: { emoji: "🎨", title: "We're Crafting!", message: "Your surprise is being carefully handmade right now. So exciting!", color: "#B45309" },
    ready: { emoji: "🎁", title: "Your Order is Ready!", message: order.delivery_preference === "pickup" ? "Come pick it up from our place anytime!" : `We'll deliver it to ${order.buyer_address} soon!`, color: "#047857" },
    delivered: { emoji: "🎉", title: "Enjoy Your Surprise!", message: "Your Peek-a-Pack has been delivered! We hope you love what's inside! Share your reaction with us! 💕", color: "#15803D" },
    cancelled: { emoji: "😔", title: "Order Cancelled", message: "Your order has been cancelled. If you have any questions, please reach out to us.", color: "#991B1B" },
  };

  const info = statusInfo[newStatus] || { emoji: "📦", title: "Order Updated", message: "Your order status has been updated.", color: BRAND.navy };

  const body = `
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;">${info.emoji}</span>
      <h2 style="margin:12px 0 8px;font-size:24px;color:${BRAND.navy};">${info.title}</h2>
      <p style="margin:0;font-size:15px;color:${BRAND.muted};line-height:1.6;">
        Hi <strong>${order.buyer_name}</strong>, ${info.message}
      </p>
    </div>

    <!-- Status Badge -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:16px;background:${BRAND.cardPink};border-radius:16px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;color:${BRAND.muted};">Order ${order.order_number}</p>
          <p style="margin:0;font-size:16px;font-weight:800;color:${info.color};">${info.emoji} ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
        </td>
      </tr>
    </table>

    <!-- Track Button -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:24px;">
      <tr>
        <td align="center">
          <a href="https://peekapack.vercel.app/track" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,${BRAND.pink},${BRAND.lavender});color:${BRAND.white};text-decoration:none;border-radius:50px;font-weight:700;font-size:15px;">
            📦 Track Your Order
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject: `${info.emoji} ${info.title} — ${order.order_number} | Peek-a-Pack`,
    html: baseLayout(info.title, body),
  };
}
