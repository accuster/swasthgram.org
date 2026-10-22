const crypto = require("crypto");
const { pool: db, withTransaction } = require("../db");
const mailer = require("../mailer");
const transactionService = require("../transactionService");

const APP_URL = process.env.APP_URL || "https://swasthgram.org";

// ─── One-Time Thank-You Token Store ──────────────────────────────────────────
// Map: token → { donationData, expiresAt }
const thankYouTokens = new Map();

function generateThankYouToken(donationData) {
  const token = crypto.randomUUID();
  thankYouTokens.set(token, {
    data:      donationData,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  setTimeout(() => thankYouTokens.delete(token), 10 * 60 * 1000);
  return token;
}

// One-time use: validates token, returns donation data, deletes token immediately
function consumeThankYouToken(token) {
  const entry = thankYouTokens.get(token);
  if (!entry) return { valid: false, error: "Invalid or expired token." };
  if (Date.now() > entry.expiresAt) {
    thankYouTokens.delete(token);
    return { valid: false, error: "Token expired." };
  }

  thankYouTokens.delete(token);
  console.log(`[Token] Validated for donor: ${entry.data.name}`);
  return { valid: true, donation: entry.data };
}

// ─── Save donation + its payment transaction to MySQL ────────────────────────
// A partnership contribution goes through this exact same flow (program ===
// "Partnership") — it still gets a `donations` row (amount/donor facts live
// there same as any gift), but its transaction is tagged source_type =
// 'partnership' instead of 'donation' so it's distinguishable in the ledger.
async function saveDonation({
  name, email, phone, state, amount, currency, program, frequency, gateway, paymentId, orderId,
  chargeId, paymentMethod, cardBrand, cardLast4, receiptUrl, gatewayResponse,
}) {
  try {
    let donationId;
    const sourceType = program === "Partnership" ? "partnership" : "donation";
    await withTransaction(async (conn) => {
      const [result] = await conn.execute(
        `INSERT INTO donations
          (donor_name, donor_email, donor_phone, donor_state, amount, currency, program, frequency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, state || null, Number(amount), currency, program || "General", frequency || "once"]
      );
      donationId = result.insertId;
      await transactionService.insertTransaction(conn, {
        source_type: sourceType,
        source_id: donationId,
        type: "payment",
        status: "succeeded",
        amount: Number(amount),
        currency,
        gateway,
        gateway_payment_id: paymentId,
        gateway_order_id: orderId || null,
        charge_id: chargeId || null,
        payment_method: paymentMethod || null,
        card_brand: cardBrand || null,
        card_last4: cardLast4 || null,
        receipt_url: receiptUrl || null,
        gateway_response: gatewayResponse ? JSON.stringify(gatewayResponse) : null,
        processed_at: new Date(),
      });
    });
    console.log(`[DB] Donation saved — id: ${donationId}, gateway: ${gateway}, amount: ${amount} ${currency}`);
    return donationId;
  } catch (err) {
    console.error("[DB] Failed to save donation:", err.message);
    return null;
  }
}

// ─── Send receipt email ───────────────────────────────────────────────────────
async function sendReceipt({ donationId, name, email, amount, currency, program, frequency, gateway, paymentId }) {
  const symbol       = currency === "INR" ? "₹" : "$";
  const gatewayLabel = gateway === "razorpay" ? "Razorpay" : "Stripe";
  const freqLabel    = frequency === "once" ? "One-time" : frequency.charAt(0).toUpperCase() + frequency.slice(1);
  const dateStr      = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const siteUrl      = APP_URL;
  const siteName     = APP_URL.replace(/https?:\/\//, "");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0E4422,#1B6B3A);padding:32px 40px;text-align:center;">
            <div style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Swasthgram</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:4px;">Healthcare for Every Indian</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:20px;font-weight:700;color:#1F2937;margin:0 0 6px;">Thank you, ${name}! 🙏</p>
            <p style="font-size:14px;color:#6B7280;margin:0 0 28px;line-height:1.6;">
              Your generous donation has been received and will directly fund healthcare access for underserved communities in India.
            </p>

            <!-- Receipt box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5EE;border-radius:10px;padding:24px;margin-bottom:24px;">
              <tr><td>
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6B7280;margin-bottom:16px;">Donation Receipt</div>
                ${[
                  ["Donation ID",    `#${String(donationId || "—").padStart(6, "0")}`],
                  ["Date",           dateStr],
                  ["Amount",         `<strong style="color:#1B6B3A;font-size:16px;">${symbol}${Number(amount).toLocaleString("en-IN")}</strong>`],
                  ["Program",        program || "General"],
                  ["Frequency",      freqLabel],
                  ["Payment via",    gatewayLabel],
                  ["Transaction ID", `<span style="font-family:monospace;font-size:12px;">${paymentId}</span>`],
                ].map(([label, value]) => `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                  <tr>
                    <td style="font-size:12px;color:#6B7280;width:140px;">${label}</td>
                    <td style="font-size:13px;color:#1F2937;font-weight:600;">${value}</td>
                  </tr>
                </table>`).join("")}
              </td></tr>
            </table>

            <!-- Tax note -->
            <div style="background:#f0fdf4;border-left:4px solid #1B6B3A;padding:14px 16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
              <p style="font-size:13px;color:#1B6B3A;font-weight:600;margin:0 0 4px;">Tax Deduction Certificate</p>
              <p style="font-size:12px;color:#4B5563;margin:0;line-height:1.5;">
                ${currency === "INR"
                  ? "Your donation is eligible for tax benefits under <strong>Section 80G & 12A</strong>. Your certificate will be issued within 7 working days."
                  : "Your donation may be tax-deductible under <strong>IRS 501(c)(3)</strong>. Please retain this receipt for your records."}
              </p>
            </div>

            <!-- Impact note -->
            <p style="font-size:13px;color:#4B5563;line-height:1.7;margin:0 0 24px;">
              Your contribution helps us run <strong>health camps</strong> in remote villages — bringing cancer screening, diabetes tests, and diagnostics to people who have never had access to healthcare before.
            </p>

            <p style="font-size:13px;color:#6B7280;margin:0;">With gratitude,<br>
              <strong style="color:#1F2937;">Swasthgram Global Foundation</strong><br>
              <a href="${siteUrl}" style="color:#1B6B3A;">${siteName}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F8F5EE;padding:20px 40px;text-align:center;border-top:1px solid #E8E4DC;">
            <p style="font-size:11px;color:#9CA3AF;margin:0;line-height:1.6;">
              Swasthgram Foundation · New Delhi, India<br>
              <a href="mailto:support@swasthgram.org" style="color:#1B6B3A;">support@swasthgram.org</a> · +91 87507-40000
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await mailer.sendMail({
      from:    `"${process.env.ZEPTOMAIL_FROM_NAME || "Swasthgram"}" <${process.env.ZEPTOMAIL_FROM_EMAIL}>`,
      to:      `"${name}" <${email}>`,
      subject: `Donation Receipt — ${symbol}${Number(amount).toLocaleString("en-IN")} to ${program || "Swasthgram"}`,
      html,
    });

    // Mark receipt as sent in DB
    if (donationId) {
      await db.execute("UPDATE donations SET receipt_sent = 1 WHERE id = ?", [donationId]);
    }
    console.log(`[Email] Receipt sent to ${email}`);
  } catch (err) {
    console.error("[Email] Failed to send receipt:", err.message);
  }
}

module.exports = {
  generateThankYouToken,
  consumeThankYouToken,
  saveDonation,
  sendReceipt,
};
