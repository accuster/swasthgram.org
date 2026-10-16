// Shared `transactions` table helpers, used by every feature that takes a
// payment (gala bookings, donations, ...). `source_type` + `source_id` say
// which record the money belongs to — there's no real FK since it points to
// a different table depending on source_type.
const { pool } = require("./db");

// Plain insert — used for one-shot rows (donations, refunds).
async function insertTransaction(conn, fields) {
  const [res] = await conn.query("INSERT INTO transactions SET ?", [fields]);
  return res.insertId;
}

// Stripe webhook idempotency check: has this event already been recorded?
async function alreadyProcessed(conn, gatewayEventId) {
  if (!gatewayEventId) return false;
  const [[row]] = await conn.query("SELECT id FROM transactions WHERE gateway_event_id = ? LIMIT 1", [gatewayEventId]);
  return Boolean(row);
}

// Updates the matching "initiated" payment row for this source + order, or
// inserts one if none exists (e.g. the initiated row was never created, or
// this is the first event we've seen for it).
async function upsertPaymentTransaction(conn, { sourceType, sourceId, gatewayOrderId, updateFields, insertExtra }) {
  const sets = Object.keys(updateFields).map((k) => `${k} = ?`).join(", ");
  const [res] = await conn.query(
    `UPDATE transactions SET ${sets}
      WHERE source_type = ? AND source_id = ? AND gateway_order_id = ? AND type = 'payment' AND status = 'initiated'
      ORDER BY id DESC LIMIT 1`,
    [...Object.values(updateFields), sourceType, sourceId, gatewayOrderId]
  );
  if (res.affectedRows === 0) {
    await conn.query("INSERT INTO transactions SET ?", [{
      source_type: sourceType,
      source_id: sourceId,
      type: "payment",
      gateway_order_id: gatewayOrderId,
      ...insertExtra,
      ...updateFields,
    }]);
  }
}

// Sum of all succeeded refunds recorded so far for a source record. Pass the
// active connection when called inside a withTransaction() block so it sees
// a consistent view alongside any row locks already held there.
async function sumRefunded(sourceType, sourceId, conn = pool) {
  const [[{ refunded }]] = await conn.query(
    `SELECT COALESCE(SUM(amount), 0) AS refunded FROM transactions
      WHERE source_type = ? AND source_id = ? AND type = 'refund' AND status = 'succeeded'`,
    [sourceType, sourceId]
  );
  return Number(refunded);
}

module.exports = { insertTransaction, alreadyProcessed, upsertPaymentTransaction, sumRefunded };
