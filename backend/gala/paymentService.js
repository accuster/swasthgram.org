const stripe = require("../stripeClient");
const { pool, withTransaction } = require("../db");
const transactionService = require("../transactionService");
const AppError = require("./AppError");
const { releaseSeats } = require("./bookingService");

const SOURCE_TYPE = "gala_booking";

const APP_URL = (process.env.APP_URL || "https://swasthgram.org").replace(/\/$/, "");
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const toCents = (usd) => Math.round(Number(usd) * 100);
const fromCents = (cents) => Number(cents || 0) / 100;

// ---------------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------------

// Creates a Stripe Checkout session for a pending booking and logs an
// "initiated" transaction. Returns the Stripe URL to send the user to.
async function createCheckoutSession(ref) {
  const [[booking]] = await pool.query("SELECT * FROM gala_bookings WHERE booking_ref = ?", [ref]);
  if (!booking) throw new AppError(404, `No booking found with reference ${ref}.`);
  if (booking.payment_status === "paid") throw new AppError(409, "This booking is already paid.");
  if (booking.payment_status !== "pending") {
    throw new AppError(409, "This booking has expired or was cancelled. Pick your seats again to make a new booking.");
  }

  const [seatRows] = await pool.query(
    `SELECT CONCAT(table_label, seat_number) AS seat FROM gala_booking_seats
      WHERE booking_id = ? ORDER BY table_label, seat_number`,
    [booking.id]
  );
  const seatList = seatRows.map((r) => r.seat).join(", ");

  // Reuse an open session if the user clicks Pay twice.
  if (booking.stripe_session_id) {
    try {
      const existing = await stripe.checkout.sessions.retrieve(booking.stripe_session_id);
      if (existing.status === "open" && existing.url) return { url: existing.url, sessionId: existing.id };
    } catch { /* fall through and create a new one */ }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.email,
    client_reference_id: booking.booking_ref,
    // Shortest expiry Stripe allows. Must stay below HOLD_MINUTES.
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    line_items: [{
      quantity: booking.seat_count,
      price_data: {
        currency: booking.currency.toLowerCase(),
        unit_amount: toCents(booking.price_per_seat),
        product_data: {
          name: "Swasthgram Gala seat",
          description: `Booking ${booking.booking_ref}. Seats: ${seatList}`,
        },
      },
    }],
    metadata: { booking_id: String(booking.id), booking_ref: booking.booking_ref, seats: seatList },
    payment_intent_data: {
      description: `Swasthgram Gala ${booking.booking_ref}`,
      receipt_email: booking.email,
      metadata: { booking_id: String(booking.id), booking_ref: booking.booking_ref },
    },
    success_url: `${APP_URL}/events/gala26?ref=${booking.booking_ref}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/events/gala26?ref=${booking.booking_ref}&cancelled=1`,
  });

  await withTransaction(async (conn) => {
    await conn.query("UPDATE gala_bookings SET stripe_session_id = ? WHERE id = ?", [session.id, booking.id]);
    await transactionService.insertTransaction(conn, {
      source_type: SOURCE_TYPE,
      source_id: booking.id,
      type: "payment",
      status: "initiated",
      amount: booking.total_amount,
      currency: booking.currency,
      gateway: "stripe",
      gateway_order_id: session.id,
    });
  });

  return { url: session.url, sessionId: session.id };
}

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

function constructEvent(rawBody, signature) {
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new AppError(400, `Webhook signature check failed: ${err.message}`);
  }
}

async function bookingFromSession(conn, session) {
  const id = Number(session.metadata && session.metadata.booking_id);
  const [[booking]] = id
    ? await conn.query("SELECT * FROM gala_bookings WHERE id = ? FOR UPDATE", [id])
    : await conn.query("SELECT * FROM gala_bookings WHERE stripe_session_id = ? FOR UPDATE", [session.id]);
  return booking || null;
}

// Updates the "initiated" row for this session, or inserts one if none exists.
async function recordPaymentRow(conn, booking, session, event, fields) {
  const updateFields = {
    gateway_event_id: event.id,
    processed_at: new Date(),
    gateway_response: JSON.stringify(event.data.object),
    ...fields,
  };
  await transactionService.upsertPaymentTransaction(conn, {
    sourceType: SOURCE_TYPE,
    sourceId: booking.id,
    gatewayOrderId: session.id,
    updateFields,
    insertExtra: {
      amount: fromCents(session.amount_total) || booking.total_amount,
      currency: (session.currency || booking.currency).toUpperCase(),
      gateway: "stripe",
    },
  });
}

async function handleCheckoutPaid(event) {
  const session = event.data.object;
  if (session.payment_status !== "paid") return; // async methods finish later

  // Card details for the record (outside the DB transaction: network call).
  let pi = null;
  if (session.payment_intent) {
    pi = await stripe.paymentIntents.retrieve(session.payment_intent, { expand: ["latest_charge"] });
  }
  const charge = pi && typeof pi.latest_charge === "object" ? pi.latest_charge : null;
  const card = charge && charge.payment_method_details && charge.payment_method_details.card;

  await withTransaction(async (conn) => {
    if (await transactionService.alreadyProcessed(conn, event.id)) return;
    const booking = await bookingFromSession(conn, session);
    if (!booking) { console.warn(`[gala/stripe] No booking for session ${session.id}`); return; }

    await recordPaymentRow(conn, booking, session, event, {
      status: "succeeded",
      amount: fromCents(session.amount_total),
      gateway_payment_id: pi ? pi.id : session.payment_intent,
      charge_id: charge ? charge.id : null,
      payment_method: charge && charge.payment_method_details ? charge.payment_method_details.type : null,
      card_brand: card ? card.brand : null,
      card_last4: card ? card.last4 : null,
      receipt_url: charge ? charge.receipt_url : null,
    });

    if (booking.payment_status === "paid") return;
    if (booking.payment_status !== "pending") {
      // Paid after the hold was released. Seats may be gone, so flag for the team.
      console.warn(`[gala/stripe] Booking ${booking.booking_ref} was paid while ${booking.payment_status}. Refund or reassign seats manually.`);
    }
    await conn.query(
      `UPDATE gala_bookings
          SET payment_status = 'paid', paid_at = NOW(), stripe_payment_id = ?
        WHERE id = ?`,
      [pi ? pi.id : session.payment_intent, booking.id]
    );
  });
}

async function handleCheckoutFailedOrExpired(event, status) {
  const session = event.data.object;
  await withTransaction(async (conn) => {
    if (await transactionService.alreadyProcessed(conn, event.id)) return;
    const booking = await bookingFromSession(conn, session);
    if (!booking) return;
    await recordPaymentRow(conn, booking, session, event, { status });
    if (booking.payment_status === "pending") {
      await releaseSeats(conn, booking.id, status === "failed" ? "failed" : "cancelled");
    }
  });
}

async function handleChargeRefunded(event) {
  const charge = event.data.object;
  await withTransaction(async (conn) => {
    if (await transactionService.alreadyProcessed(conn, event.id)) return;
    const [[booking]] = await conn.query(
      "SELECT * FROM gala_bookings WHERE stripe_payment_id = ? FOR UPDATE",
      [charge.payment_intent]
    );
    if (!booking) return;

    const refund = charge.refunds && charge.refunds.data && charge.refunds.data[0];
    const refunded = await transactionService.sumRefunded(SOURCE_TYPE, booking.id, conn);
    const newRefund = Math.max(0, fromCents(charge.amount_refunded) - refunded);

    await transactionService.insertTransaction(conn, {
      source_type: SOURCE_TYPE,
      source_id: booking.id,
      type: "refund",
      status: "succeeded",
      amount: newRefund,
      currency: charge.currency.toUpperCase(),
      gateway: "stripe",
      gateway_payment_id: charge.payment_intent,
      charge_id: charge.id,
      refund_id: refund ? refund.id : null,
      gateway_event_id: event.id,
      receipt_url: charge.receipt_url,
      gateway_response: JSON.stringify(charge),
      processed_at: new Date(),
    });

    // Full refund: free the seats. Partial refund keeps the booking.
    if (charge.refunded) await releaseSeats(conn, booking.id, "refunded");
  });
}

async function handleWebhook(rawBody, signature) {
  const event = constructEvent(rawBody, signature);

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await handleCheckoutPaid(event);
      break;
    case "checkout.session.async_payment_failed":
      await handleCheckoutFailedOrExpired(event, "failed");
      break;
    case "checkout.session.expired":
      await handleCheckoutFailedOrExpired(event, "cancelled");
      break;
    case "charge.refunded":
      await handleChargeRefunded(event);
      break;
    default:
      // Not used by the gala. Acknowledge so Stripe stops retrying.
      break;
  }
  return { received: true, type: event.type };
}

// Used by the success page to show "Payment received" right away,
// even if the webhook hasn't arrived yet.
async function getPaymentStatus(ref) {
  const [[b]] = await pool.query(
    "SELECT booking_ref, payment_status, stripe_session_id, total_amount, currency FROM gala_bookings WHERE booking_ref = ?",
    [ref]
  );
  if (!b) throw new AppError(404, `No booking found with reference ${ref}.`);
  let stripeStatus = null;
  if (b.payment_status === "pending" && b.stripe_session_id) {
    const s = await stripe.checkout.sessions.retrieve(b.stripe_session_id);
    stripeStatus = s.payment_status;
  }
  return {
    bookingRef: b.booking_ref,
    paymentStatus: b.payment_status,
    stripePaymentStatus: stripeStatus,
    totalAmount: Number(b.total_amount),
    currency: b.currency,
  };
}

module.exports = { createCheckoutSession, handleWebhook, getPaymentStatus };
