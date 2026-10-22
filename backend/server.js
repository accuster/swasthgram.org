/**
 * Swasthgram Donation API
 * ─────────────────────────────────────────────
 * Server : 147.93.106.176
 * Port   : 3002
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors    = require("cors");

const REQUIRED_ENV = ["DB_USER", "DB_PASSWORD", "DB_NAME", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"];
const missingEnv = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missingEnv.length) {
  console.error(`[Startup] Missing required environment variable(s): ${missingEnv.join(", ")}. Check .env (see .env.example).`);
  process.exit(1);
}

const { pool: db } = require("./db");
const { router: galaRouter } = require("./gala/routes");
const { startReleaseHoldsJob } = require("./gala/releaseHoldsJob");
const donationRouter = require("./donation/routes");
const webhookRouter = require("./webhookRouter");
const mailer = require("./mailer");

const app      = express();
const PORT     = process.env.PORT    || 3002;
const APP_URL  = process.env.APP_URL || "https://swasthgram.org";

// ─── Middleware ───────────────────────────────────────────────────────────────
// Stripe/Razorpay webhooks need the raw, unparsed body, so this is mounted
// before express.json(). One shared endpoint per gateway for the whole site
// (gala + donation + partnership) — see webhookRouter.js.
app.use("/api/webhook", webhookRouter);

app.use(express.json());
app.use(cors({
  origin: [
    APP_URL,
    `https://www.${APP_URL.replace(/https?:\/\//, "")}`,
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods:        ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials:    true,
}));

app.use("/api/gala", galaRouter);
app.use("/api", donationRouter);

// ─── Helper: Partner notification recipients ─────────────────────────────────
// Comma-separated list in .env — e.g. PARTNER_NOTIFY_EMAILS="digital@swasthgram.org,partnerships@swasthgram.org"
function getPartnerNotifyEmails() {
  return (process.env.PARTNER_NOTIFY_EMAILS || "supportWswasthgram.org")
    .split(",")
    .map(e => e.trim())
    .filter(Boolean);
}

// ─── Helper: Send partner thank-you email (to submitter) ─────────────────────
async function sendPartnerThankYou({ name, email, partnerType, organization }) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:28px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:linear-gradient(135deg,#0E4422,#1B6B3A);padding:30px 40px;text-align:center;">
            <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Swasthgram</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.65);margin-top:4px;">Community Wellness for All</div>
          </td>
        </tr>

        <tr>
          <td style="padding:36px 40px 8px;">
            <p style="font-size:19px;font-weight:700;color:#1F2937;margin:0 0 14px;">Thank you, ${name}! 🙏</p>
            <p style="font-size:14px;color:#4B5563;margin:0 0 20px;line-height:1.7;">
              We've received your enquiry to partner with Swasthgram as a <strong>${partnerType}</strong>.
              Our partnerships team reviews every request personally — expect to hear from us within
              <strong>2–3 business days</strong> at this address.
            </p>

            <table cellpadding="0" cellspacing="0" style="width:100%;background:#F8F5EE;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;font-size:13px;color:#4B5563;">
                <span style="color:#6B7280;">Organization</span> &nbsp;
                <strong style="color:#1F2937;">${organization}</strong>
              </td></tr>
            </table>

            <p style="font-size:13px;color:#6B7280;margin:0 0 26px;line-height:1.7;">
              While you wait, you're welcome to read more about the health camps
              your partnership would help fund, at
              <a href="${APP_URL}/about" style="color:#1B6B3A;">${APP_URL.replace(/https?:\/\//, "")}/about</a>.
            </p>

            <p style="font-size:13px;color:#6B7280;margin:0;">With gratitude,<br>
              <strong style="color:#1F2937;">Swasthgram Global Foundation</strong>
            </p>
          </td>
        </tr>

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
      subject: "We've received your partnership enquiry — Swasthgram",
      html,
    });
    console.log(`[Email] Partner thank-you sent to ${email}`);
  } catch (err) {
    console.error("[Email] Failed to send partner thank-you:", err.message);
  }
}

// ─── Helper: Send partner enquiry notification (to internal team) ───────────
async function sendPartnerNotification({ partnerType, name, organization, email, phone, country, website, notes }) {
  const dateStr = new Date().toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
  });

  const rows = [
    ["Partner type", partnerType],
    ["Name", name],
    ["Organization", organization],
    ["Email", `<a href="mailto:${email}" style="color:#1B6B3A;">${email}</a>`],
    ["Phone", phone],
    ["Country", country],
    ...(website ? [["Website / profile", `<a href="${website}" style="color:#1B6B3A;">${website}</a>`]] : []),
  ];

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:28px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#0E4422;padding:22px 40px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C8963E;">New Partnership Enquiry</div>
            <div style="font-size:18px;font-weight:700;color:#ffffff;margin-top:4px;">${name} — ${partnerType}</div>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 40px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rows.map(([label, value]) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #E8E4DC;font-size:12.5px;color:#6B7280;width:150px;vertical-align:top;">${label}</td>
                  <td style="padding:10px 0;border-bottom:1px solid #E8E4DC;font-size:13.5px;color:#1F2937;font-weight:600;vertical-align:top;">${value}</td>
                </tr>`).join("")}
            </table>

            <div style="margin-top:20px;margin-bottom:24px;">
              <div style="font-size:12.5px;color:#6B7280;margin-bottom:6px;">How they heard about us / notes</div>
              <div style="font-size:13.5px;color:#1F2937;background:#F8F5EE;border-radius:8px;padding:14px 16px;line-height:1.6;white-space:pre-wrap;">${notes}</div>
            </div>
          </td>
        </tr>

        <tr>
          <td style="background:#F8F5EE;padding:16px 40px;text-align:center;border-top:1px solid #E8E4DC;">
            <p style="font-size:11px;color:#9CA3AF;margin:0;">
              Submitted ${dateStr} IST · via ${APP_URL.replace(/https?:\/\//, "")}/partner-with-us
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
      to:      getPartnerNotifyEmails().join(", "),
      subject: `New Partnership Enquiry — ${name} (${partnerType})`,
      html,
    });
    console.log(`[Email] Partner notification sent to ${getPartnerNotifyEmails().join(", ")}`);
  } catch (err) {
    console.error("[Email] Failed to send partner notification:", err.message);
  }
}

// ─── Helper: Save a partnership enquiry (best-effort, never blocks the emails) ─
async function savePartnerInquiry({ partnerType, name, email, phone, country, organization, website, notes, donationId }) {
  try {
    await db.execute(
      `INSERT INTO partner_inquiries (partner_type, name, email, phone, country, organization, website, notes, donation_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [partnerType, name, email, phone, country, organization, website || null, notes, donationId || null]
    );
    console.log(`[DB] Partner inquiry saved for ${email}`);
  } catch (err) {
    console.error("[DB] Failed to save partner inquiry:", err.message);
  }
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", async (_req, res) => {
  try {
    await db.execute("SELECT 1");
    res.json({ status: "ok", db: "connected", ts: new Date().toISOString() });
  } catch {
    res.json({ status: "ok", db: "disconnected", ts: new Date().toISOString() });
  }
});

// ─── Partnership Enquiry — saves to DB, then Thank-you + Notification emails ──
app.post("/api/partner-inquiry", async (req, res) => {
  try {
    const { partnerType, name, phone, country, email, organization, website, notes, donationId } = req.body;

    if (!partnerType || !name || !phone || !country || !email || !organization || !notes) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    await Promise.all([
      savePartnerInquiry({ partnerType, name, email, phone, country, organization, website, notes, donationId }),
      sendPartnerThankYou({ name, email, partnerType, organization }),
      sendPartnerNotification({ partnerType, name, organization, email, phone, country, website, notes }),
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("[Partner Inquiry]", err.message);
    res.status(500).json({ error: "Could not send enquiry. Please try again." });
  }
});

// ─── Frontend (static build) ─────────────────────────────────────────────────
// Only relevant on deployments where this Node process also serves the frontend
// (e.g. CloudPanel "Node.js Site" staging). On production, Nginx serves the
// static build directly and only proxies /api/* here, so this is unused there.
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ─── Error handler (must be registered last) ─────────────────────────────────
app.use(require("./gala/errorHandler"));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, "127.0.0.1", () => {
  console.log(`✅  Swasthgram API  →  http://127.0.0.1:${PORT}`);
  console.log(`🌐  APP_URL         →  ${APP_URL}`);
  startReleaseHoldsJob();
});