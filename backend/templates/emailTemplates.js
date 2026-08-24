const baseTemplate = require('./baseTemplate');

const money = (n) => `$${Number(n).toFixed(2)}`;

exports.welcomeVerifyEmail = ({ name, verifyUrl }) =>
  baseTemplate({
    title: 'Verify your email — UrbanThread (Demo)',
    ctaText: 'Verify Email',
    ctaUrl: verifyUrl,
    bodyHtml: `
      <h2 style="margin:0 0 16px;">Welcome to UrbanThread, ${name} 👋</h2>
      <p style="font-size:14px;line-height:1.7;color:#444;">
        Thanks for creating a (fake) account on our demo clothing store. Please verify your email
        address to activate your account. This link expires in 24 hours.
      </p>
      <p style="font-size:12px;color:#999;">If you didn't create this account, you can safely ignore this email.</p>
    `,
  });

exports.forgotPasswordEmail = ({ name, resetUrl }) =>
  baseTemplate({
    title: 'Reset your password — UrbanThread (Demo)',
    ctaText: 'Reset Password',
    ctaUrl: resetUrl,
    bodyHtml: `
      <h2 style="margin:0 0 16px;">Password reset requested</h2>
      <p style="font-size:14px;line-height:1.7;color:#444;">
        Hi ${name}, we received a request to reset your demo account password. Click the button
        below to choose a new one. This link is valid for 1 hour.
      </p>
      <p style="font-size:12px;color:#999;">If you didn't request this, you can ignore this email — your password will stay the same.</p>
    `,
  });

exports.passwordResetSuccessEmail = ({ name }) =>
  baseTemplate({
    title: 'Password changed — UrbanThread (Demo)',
    bodyHtml: `
      <h2 style="margin:0 0 16px;">Your password was changed</h2>
      <p style="font-size:14px;line-height:1.7;color:#444;">
        Hi ${name}, this confirms your demo account password was just changed successfully.
        If this wasn't you, this is a demo environment so no real risk exists — but feel free to
        re-register on the live version of this project.
      </p>
    `,
  });

exports.orderConfirmationEmail = ({ name, order }) =>
  baseTemplate({
    title: `Order Confirmed — #${order.orderNumber} (Demo)`,
    bodyHtml: `
      <h2 style="margin:0 0 8px;">Thanks for your (fake) order, ${name}!</h2>
      <p style="font-size:14px;color:#444;margin-bottom:24px;">Order #${order.orderNumber} has been received and is now processing.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
        ${order.items
          .map(
            (item) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name} (${item.size}/${item.color}) x${item.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${money(item.price * item.quantity)}</td>
          </tr>`
          )
          .join('')}
        <tr><td style="padding:8px 0;">Subtotal</td><td style="text-align:right;">${money(order.itemsPrice)}</td></tr>
        <tr><td style="padding:8px 0;">Shipping</td><td style="text-align:right;">${money(order.shippingPrice)}</td></tr>
        <tr><td style="padding:8px 0;">Tax</td><td style="text-align:right;">${money(order.taxPrice)}</td></tr>
        <tr><td style="padding:12px 0;font-weight:700;border-top:2px solid #111;">Total</td><td style="padding:12px 0;font-weight:700;border-top:2px solid #111;text-align:right;">${money(order.totalPrice)}</td></tr>
      </table>
      <p style="font-size:13px;color:#444;margin-top:20px;">
        Shipping to: ${order.shippingAddress.fullName}, ${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}
      </p>
      <p style="font-size:12px;color:#c0392b;margin-top:16px;font-weight:600;">
        Reminder: this is a mock order on a demo store. No payment was actually processed and no items will be shipped.
      </p>
    `,
  });

exports.orderCompletionEmail = ({ name, order }) =>
  baseTemplate({
    title: `Order Delivered — #${order.orderNumber} (Demo)`,
    bodyHtml: `
      <h2 style="margin:0 0 16px;">Your (fake) order has arrived! 📦</h2>
      <p style="font-size:14px;line-height:1.7;color:#444;">
        Hi ${name}, order #${order.orderNumber} has been marked as delivered in our demo system.
        We hope you enjoyed this simulated shopping experience!
      </p>
      <p style="font-size:12px;color:#c0392b;font-weight:600;">This is a simulated delivery notice — no real package was ever shipped.</p>
    `,
  });

exports.orderStatusUpdateEmail = ({ name, order }) =>
  baseTemplate({
    title: `Order Update — #${order.orderNumber} (Demo)`,
    bodyHtml: `
      <h2 style="margin:0 0 16px;">Order status updated</h2>
      <p style="font-size:14px;line-height:1.7;color:#444;">
        Hi ${name}, your demo order #${order.orderNumber} status is now: <strong>${order.status.toUpperCase()}</strong>.
      </p>
    `,
  });

exports.contactInquiryEmail = ({ name, email, inquiry, message }) =>
  baseTemplate({
    title: `Client Inquiry Received — UrbanThread`,
    bodyHtml: `
      <h2 style="margin:0 0 16px;">Inquiry Confirmation</h2>
      <p style="font-size:14px;line-height:1.7;color:#444;">
        Hi ${name}, thank you for contacting UrbanThread Client Services. We have received your inquiry regarding <strong>${inquiry || 'General Question'}</strong>.
      </p>
      <div style="background:#f7f6f3;padding:16px;margin:16px 0;border-left:3px solid #111;font-size:13px;color:#333;">
        "${message}"
      </div>
      <p style="font-size:13px;color:#666;">Our team will respond to your email (${email}) shortly.</p>
    `,
  });

exports.backInStockAlertEmail = ({ email, productName, variantDetails }) =>
  baseTemplate({
    title: `Stock Alert Confirmed — UrbanThread`,
    bodyHtml: `
      <h2 style="margin:0 0 16px;">Stock Alert Subscription</h2>
      <p style="font-size:14px;line-height:1.7;color:#444;">
        Hello, you have been subscribed to stock notifications for:
      </p>
      <div style="background:#f7f6f3;padding:16px;margin:16px 0;border-left:3px solid #111;font-size:14px;font-weight:600;color:#111;">
        ${productName} ${variantDetails ? `(${variantDetails})` : ''}
      </div>
      <p style="font-size:13px;color:#666;">We will email ${email} as soon as this item returns to our atelier inventory.</p>
    `,
  });

