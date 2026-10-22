// The site's single Stripe webhook endpoint and single Razorpay webhook
// endpoint. Mounted BEFORE express.json() in server.js — both need the raw
// body to verify their signatures.
//
// Stripe sends every event type (gala's checkout.session.*, charge.refunded,
// and donation/partnership's payment_intent.succeeded) to the same URL;
// this is where they get told apart and routed to the right module.
const express = require("express");
const stripe = require("./stripeClient");
const galaPaymentService = require("./gala/paymentService");
const { handlePaymentIntentSucceeded } = require("./donation/stripeWebhookHandler");
const { handleRazorpayWebhook } = require("./donation/razorpayWebhookHandler");

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const router = express.Router();

router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature check failed: ${err.message}` });
  }

  try {
    if (event.type.startsWith("checkout.session.") || event.type === "charge.refunded") {
      await galaPaymentService.processEvent(event);
    } else if (event.type === "payment_intent.succeeded") {
      await handlePaymentIntentSucceeded(event);
    }
    // Anything else: acknowledge so Stripe stops retrying, nothing to do.
    res.json({ received: true, type: event.type });
  } catch (err) {
    console.error("[Webhook/stripe]", err.message);
    res.status(500).json({ error: "Webhook handler failed." });
  }
});

router.post("/razorpay", express.raw({ type: "application/json" }), handleRazorpayWebhook);

module.exports = router;
