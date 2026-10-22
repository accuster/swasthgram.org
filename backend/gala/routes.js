const express = require("express");
const ctrl = require("./controller");

// Guest checkout — no login required, matching the site's current demo flow.
const router = express.Router();

router.get("/seats", ctrl.getSeats);
router.post("/bookings", ctrl.createBooking);
router.get("/bookings/:ref", ctrl.getBooking);
router.post("/bookings/:ref/checkout", ctrl.createCheckout);
router.get("/bookings/:ref/payment-status", ctrl.getPaymentStatus);

// Stripe webhook events for gala bookings arrive through the site's single
// shared webhook endpoint — see ../webhookRouter.js — not through here.

module.exports = { router };
