const express = require("express");
const ctrl = require("./controller");

// Mounted at "/api" in server.js — paths below match the pre-existing routes
// exactly so the frontend needs no changes.
const router = express.Router();

router.get("/config", ctrl.getConfig);
router.get("/validate-token", ctrl.validateToken);
router.post("/create-stripe-intent", ctrl.createStripeIntent);
router.post("/confirm-stripe-payment", ctrl.confirmStripePayment);
router.post("/create-razorpay-order", ctrl.createRazorpayOrder);
router.post("/verify-razorpay-payment", ctrl.verifyRazorpayPayment);

module.exports = router;
