// Same safety net as stripeWebhookHandler.js, for Razorpay. verify-razorpay-
// payment is the normal path (browser tells us after Razorpay confirms); if
// that request never arrives, this webhook is the only record we'd ever get.
const Razorpay = require("razorpay");
const { pool } = require("../db");
const donationService = require("./donationService");

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

async function alreadyRecorded(paymentId) {
  const [[row]] = await pool.query(
    `SELECT id FROM transactions WHERE gateway_payment_id = ? AND gateway = 'razorpay' AND type = 'payment' AND status = 'succeeded' LIMIT 1`,
    [paymentId]
  );
  return Boolean(row);
}

// req.body here is the raw Buffer (mounted with express.raw() in webhookRouter.js).
async function handleRazorpayWebhook(req, res) {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body;

  if (!WEBHOOK_SECRET) {
    console.error("[Razorpay webhook] RAZORPAY_WEBHOOK_SECRET not configured.");
    return res.status(500).json({ error: "Webhook not configured." });
  }

  let valid = false;
  try {
    valid = Razorpay.validateWebhookSignature(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Invalid signature: ${err.message}` });
  }
  if (!valid) return res.status(400).json({ error: "Invalid signature." });

  const event = JSON.parse(rawBody.toString());

  try {
    if (event.event === "payment.captured") {
      await handlePaymentCaptured(event.payload.payment.entity);
    }
    // payment.failed: nothing to record — a failed payment never created a
    // donation via the normal path either, so there's nothing to reconcile.
  } catch (err) {
    console.error("[Razorpay webhook] Failed to process event:", err.message);
    return res.status(500).json({ error: "Webhook handler failed." });
  }

  res.json({ received: true });
}

async function handlePaymentCaptured(payment) {
  if (await alreadyRecorded(payment.id)) return; // normal verify path already handled it

  const notes = payment.notes || {};
  if (!notes.email) return; // not one of ours (create-razorpay-order always sets donor notes)

  const amount = payment.amount / 100; // paise -> rupees

  const donationId = await donationService.saveDonation({
    name: notes.name, email: notes.email, phone: notes.phone, state: notes.state || null,
    amount, currency: "INR",
    program: notes.program, frequency: notes.frequency,
    gateway: "razorpay",
    paymentId: payment.id,
    orderId: payment.order_id,
    paymentMethod:  payment.method || null,
    cardBrand:      payment.card ? payment.card.network : null,
    cardLast4:      payment.card ? payment.card.last4 : null,
    gatewayResponse: payment,
  });

  if (donationId) {
    await donationService.sendReceipt({
      donationId, name: notes.name, email: notes.email, amount,
      currency: "INR", program: notes.program, frequency: notes.frequency,
      gateway: "razorpay", paymentId: payment.id,
    });
    console.log(`[Razorpay webhook] Recovered donation ${donationId} for payment ${payment.id} (client confirm never arrived)`);
  }
}

module.exports = { handleRazorpayWebhook };
