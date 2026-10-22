// Safety net for the donation/partnership flow: confirmStripePayment is
// normally what records a donation, driven by the browser after Stripe
// confirms the card. If the browser or network dies between those two steps,
// Stripe still has the money but nothing gets saved anywhere. This handler
// lets the webhook catch that case — it's a no-op whenever the normal path
// already got there first.
const stripe = require("../stripeClient");
const { pool } = require("../db");
const donationService = require("./donationService");

async function alreadyRecorded(paymentIntentId) {
  const [[row]] = await pool.query(
    `SELECT id FROM transactions WHERE gateway_payment_id = ? AND gateway = 'stripe' AND type = 'payment' AND status = 'succeeded' LIMIT 1`,
    [paymentIntentId]
  );
  return Boolean(row);
}

async function handlePaymentIntentSucceeded(event) {
  const intentSummary = event.data.object;
  if (await alreadyRecorded(intentSummary.id)) return; // normal client-confirm path already handled it

  const meta = intentSummary.metadata || {};
  if (!meta.email) {
    // Not one of ours (createStripeIntent always sets donor metadata) — ignore.
    return;
  }

  // The webhook payload doesn't expand nested objects, so re-fetch for the
  // charge/card details (same enrichment confirmStripePayment does).
  let intent = intentSummary;
  try {
    intent = await stripe.paymentIntents.retrieve(intentSummary.id, { expand: ["latest_charge"] });
  } catch (err) {
    console.error("[Stripe webhook] Could not expand charge, saving without it:", err.message);
  }
  const charge = intent.latest_charge && typeof intent.latest_charge === "object" ? intent.latest_charge : null;
  const card = charge && charge.payment_method_details && charge.payment_method_details.card;
  const amount = intentSummary.amount / 100;

  const donationId = await donationService.saveDonation({
    name: meta.name, email: meta.email, phone: meta.phone, state: null,
    amount, currency: "USD",
    program: meta.program, frequency: meta.frequency,
    gateway: "stripe",
    paymentId: intentSummary.id,
    orderId: null,
    chargeId:       charge ? charge.id : null,
    paymentMethod:  charge && charge.payment_method_details ? charge.payment_method_details.type : null,
    cardBrand:      card ? card.brand : null,
    cardLast4:      card ? card.last4 : null,
    receiptUrl:     charge ? charge.receipt_url : null,
    gatewayResponse: charge || intent,
  });

  if (donationId) {
    await donationService.sendReceipt({
      donationId, name: meta.name, email: meta.email, amount,
      currency: "USD", program: meta.program, frequency: meta.frequency,
      gateway: "stripe", paymentId: intentSummary.id,
    });
    console.log(`[Stripe webhook] Recovered donation ${donationId} for PaymentIntent ${intentSummary.id} (client confirm never arrived)`);
  }
}

module.exports = { handlePaymentIntentSucceeded };
