const bookingService = require("./bookingService");
const paymentService = require("./paymentService");

// Wraps async handlers so errors reach the error middleware.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/gala/seats  (public)
exports.getSeats = wrap(async (_req, res) => {
  res.json(await bookingService.getSeatMap());
});

// POST /api/gala/bookings
// body: { fullName, email, phoneCode: "1", phoneNumber, seats: ["A3", "A4"] }
exports.createBooking = wrap(async (req, res) => {
  const booking = await bookingService.createBooking(req.body || {});
  res.status(201).json(booking);
});

// GET /api/gala/bookings/:ref
exports.getBooking = wrap(async (req, res) => {
  res.json(await bookingService.getBooking(req.params.ref.toUpperCase()));
});

// POST /api/gala/bookings/:ref/checkout  -> { url } to redirect to Stripe
exports.createCheckout = wrap(async (req, res) => {
  res.json(await paymentService.createCheckoutSession(req.params.ref.toUpperCase()));
});

// GET /api/gala/bookings/:ref/payment-status
exports.getPaymentStatus = wrap(async (req, res) => {
  res.json(await paymentService.getPaymentStatus(req.params.ref.toUpperCase()));
});

// POST /api/gala/webhook/stripe  (raw body, called by Stripe only)
exports.stripeWebhook = wrap(async (req, res) => {
  const result = await paymentService.handleWebhook(req.body, req.headers["stripe-signature"]);
  res.json(result);
});
