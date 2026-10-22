// Same safety net as stripeWebhookHandler.js, for Razorpay. verify-razorpay-
// payment is the normal path (browser tells us after Razorpay confirms); if
// that request never arrives, this webhook is the only record we'd ever get.
const Razorpay = require("razorpay");
const { pool } = require("../db");
const donationService = require("./donationService");
const transactionService = require("../transactionService");

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
    } else if (event.event === "refund.processed") {
      await handleRefundProcessed(event.payload.refund.entity);
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

// A Razorpay refund — automatic or manual (dashboard/API). Razorpay doesn't
// have a per-event unique id the way Stripe does, so idempotency is keyed on
// the refund's own id instead.
async function handleRefundProcessed(refund) {
  const [[dup]] = await pool.query(`SELECT id FROM transactions WHERE refund_id = ? AND type = 'refund' LIMIT 1`, [refund.id]);
  if (dup) return;

  const [[existing]] = await pool.query(
    `SELECT source_type, source_id FROM transactions
      WHERE gateway_payment_id = ? AND gateway = 'razorpay' AND type = 'payment' AND status = 'succeeded'
      ORDER BY id DESC LIMIT 1`,
    [refund.payment_id]
  );
  if (!existing) return; // not ours

  const refunded = await transactionService.sumRefunded(existing.source_type, existing.source_id, pool);
  const newRefund = Math.max(0, refund.amount / 100 - refunded);
  if (newRefund <= 0) return;

  await transactionService.insertTransaction(pool, {
    source_type: existing.source_type,
    source_id: existing.source_id,
    type: "refund",
    status: "succeeded",
    amount: newRefund,
    currency: (refund.currency || "INR").toUpperCase(),
    gateway: "razorpay",
    gateway_payment_id: refund.payment_id,
    refund_id: refund.id,
    processed_at: new Date(),
    gateway_response: JSON.stringify(refund),
  });
  console.log(`[Razorpay webhook] Recorded refund of ${newRefund} for ${existing.source_type} #${existing.source_id}`);
}

module.exports = { handleRazorpayWebhook };
