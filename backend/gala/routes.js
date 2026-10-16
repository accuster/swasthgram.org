const express = require("express");
const ctrl = require("./controller");

// Guest checkout — no login required, matching the site's current demo flow.
const router = express.Router();

router.get("/seats", ctrl.getSeats);
router.post("/bookings", ctrl.createBooking);
router.get("/bookings/:ref", ctrl.getBooking);
router.post("/bookings/:ref/checkout", ctrl.createCheckout);
router.get("/bookings/:ref/payment-status", ctrl.getPaymentStatus);

// Stripe webhook needs the raw body to verify the signature, so it has its
// own router that is mounted BEFORE express.json() in server.js.
const webhookRouter = express.Router();
webhookRouter.post("/stripe", express.raw({ type: "application/json" }), ctrl.stripeWebhook);

module.exports = { router, webhookRouter };
