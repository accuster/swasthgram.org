const crypto = require("crypto");
const stripe = require("../stripeClient");
const razorpay = require("./razorpayClient");
const donationService = require("./donationService");

// GET /api/config
exports.getConfig = (_req, res) => {
  res.json({ stripeKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

// GET /api/validate-token
exports.validateToken = (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ valid: false, error: "No token provided." });

  res.json(donationService.consumeThankYouToken(token));
};

// POST /api/create-stripe-intent
exports.createStripeIntent = async (req, res) => {
  try {
    const { amount, name, email, phone, program, frequency } = req.body;
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return res.status(400).json({ error: "Invalid amount." });

    const intent = await stripe.paymentIntents.create({
      amount:        Math.round(Number(amount) * 100),
      currency:      "usd",
      receipt_email: email || undefined,
      description:   `Swasthgram — ${program} (${frequency})`,
      metadata:      { name, email, phone, program, frequency },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("[Stripe]", err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/confirm-stripe-payment
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, name, email, phone, state, amount, program, frequency } = req.body;
    if (!paymentIntentId) return res.status(400).json({ error: "Missing paymentIntentId." });

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded")
      return res.status(400).json({ error: `Payment not succeeded. Status: ${intent.status}` });

    const donationId = await donationService.saveDonation({
      name, email, phone, state,
      amount:    Number(amount),
      currency:  "USD",
      program,   frequency,
      gateway:   "stripe",
      paymentId: paymentIntentId,
      orderId:   null,
    });

    await donationService.sendReceipt({ donationId, name, email, amount, currency: "USD", program, frequency, gateway: "stripe", paymentId: paymentIntentId });

    const token = donationService.generateThankYouToken({
      donationId: String(donationId || "0").padStart(6, "0"),
      name, email, phone, state,
      amount:    Number(amount),
      currency:  "USD",
      symbol:    "$",
      program:   program || "General",
      frequency: frequency || "once",
      gateway:   "stripe",
      paymentId: paymentIntentId,
      date:      new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    });

    res.json({ success: true, donationId, token });
  } catch (err) {
    console.error("[Stripe Confirm]", err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/create-razorpay-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, name, email, phone, state, program, frequency } = req.body;
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return res.status(400).json({ error: "Invalid amount." });

    const order = await razorpay.orders.create({
      amount:   Math.round(Number(amount) * 100),
      currency: "INR",
      receipt:  `rcpt_${Date.now()}`,
      notes:    { name, email, phone, state: state || "", program, frequency },
      payment: {
        capture: "automatic",
        capture_options: {
          automatic_expiry_period: 12,    // auto-capture after 12 min
          manual_expiry_period:    7200,  // max manual window (5 days)
          refund_speed:            "optimum",
        },
      },
    });

    res.json({
      orderId:  order.id,
      keyId:    process.env.RAZORPAY_KEY_ID,
      amount:   Math.round(Number(amount) * 100),
      currency: "INR",
      name, email, phone, state, program,
    });
  } catch (err) {
    console.error("[Razorpay]", err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/verify-razorpay-payment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,
            name, email, phone, state, amount, program, frequency } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res.status(400).json({ error: "Missing fields." });

    // Verify signature
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature)
      return res.status(400).json({ error: "Signature mismatch. Payment not verified." });

    const donationId = await donationService.saveDonation({
      name, email, phone, state,
      amount:    Number(amount),
      currency:  "INR",
      program,   frequency,
      gateway:   "razorpay",
      paymentId: razorpay_payment_id,
      orderId:   razorpay_order_id,
    });

    await donationService.sendReceipt({ donationId, name, email, amount, currency: "INR", program, frequency, gateway: "razorpay", paymentId: razorpay_payment_id });

    const token = donationService.generateThankYouToken({
      donationId: String(donationId || "0").padStart(6, "0"),
      name, email, phone, state,
      amount:    Number(amount),
      currency:  "INR",
      symbol:    "₹",
      program:   program || "General",
      frequency: frequency || "once",
      gateway:   "razorpay",
      paymentId: razorpay_payment_id,
      date:      new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    });

    res.json({ success: true, donationId, token });
  } catch (err) {
    console.error("[Verify]", err.message);
    res.status(500).json({ error: err.message });
  }
};
