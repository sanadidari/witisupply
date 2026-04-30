const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'WITI Supply <orders@witisupply.com>';

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping email');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [params.to], subject: params.subject, html: params.html }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[email] Resend error:', err);
  }
}

export function orderConfirmationHtml(params: {
  customerName: string;
  orderNumber: string;
  lineItems: { title: string; quantity: number; price: string }[];
  shippingAddress: string;
  totalPrice: string;
  currency: string;
}): string {
  const { customerName, orderNumber, lineItems, shippingAddress, totalPrice, currency } = params;

  const itemRows = lineItems
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.title}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">×${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${currency} ${item.price}</td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
    <div style="background:#18181b;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">WITI Supply</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;color:#18181b;">Order Confirmed!</h2>
      <p style="color:#555;margin:0 0 24px;">Hi ${customerName}, thank you for your purchase. We're preparing your order now.</p>

      <div style="background:#f4f4f5;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:.05em;">Order number</p>
        <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#18181b;">#${orderNumber}</p>
      </div>

      <h3 style="font-size:14px;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px;">Items</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top:12px;font-weight:700;">Total</td>
            <td style="padding-top:12px;text-align:right;font-weight:700;">${currency} ${totalPrice}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="font-size:14px;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;">Shipping to</h3>
      <p style="color:#555;white-space:pre-line;margin:0 0 24px;">${shippingAddress}</p>

      <p style="color:#888;font-size:13px;margin:0 0 4px;">Estimated delivery: <strong>7–15 business days</strong></p>
      <p style="color:#888;font-size:13px;margin:0;">You'll receive a tracking number once your order ships.</p>
    </div>
    <div style="background:#f4f4f5;padding:20px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#999;">Questions? <a href="https://witisupply.com/contact" style="color:#18181b;">Contact us</a> · <a href="https://witisupply.com/faq" style="color:#18181b;">FAQ</a></p>
    </div>
  </div>
</body>
</html>`;
}
