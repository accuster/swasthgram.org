const { pool, withTransaction } = require("../db");
const gala = require("./galaConfig");
const AppError = require("./AppError");
const { makeBookingRef } = require("./ref");

const SEAT_RE = /^(\d{1,2})-(\d{1,2})$/;

// "3-5" -> { table: '3', seat: 5, label: '3-5' }
function parseSeat(raw) {
  const m = String(raw || "").trim().match(SEAT_RE);
  if (!m) return null;
  const table = Number(m[1]);
  const seat = Number(m[2]);
  if (table < 1 || table > gala.tableCount) return null;
  if (seat < 1 || seat > gala.seatsPerTable) return null;
  return { table: String(table), seat, label: `${table}-${seat}` };
}

function validateBookingInput(body) {
  const errors = {};
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phoneCode = String(body.phoneCode || "").replace(/\D/g, "");
  const phoneNumber = String(body.phoneNumber || "").replace(/[^\d]/g, "");

  if (fullName.length < 2 || fullName.length > 120) errors.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 191) errors.email = "Enter a valid email address.";
  if (!/^\d{1,4}$/.test(phoneCode)) errors.phoneCode = "Choose a country code.";
  if (phoneNumber.length < 6 || phoneNumber.length > 14) errors.phoneNumber = "Enter a valid phone number without the country code.";

  const rawSeats = Array.isArray(body.seats) ? body.seats : [];
  const seats = [];
  const seen = new Set();
  for (const raw of rawSeats) {
    const s = parseSeat(raw);
    if (!s) { errors.seats = `"${raw}" is not a valid seat. Use a table and seat number, like 3-5.`; break; }
    if (!seen.has(s.label)) { seen.add(s.label); seats.push(s); }
  }
  if (!errors.seats && seats.length === 0) errors.seats = "Pick at least one seat.";
  if (seats.length > gala.maxSeatsPerBooking) errors.seats = `You can book up to ${gala.maxSeatsPerBooking} seats at a time.`;

  if (Object.keys(errors).length) throw new AppError(422, "Some booking details need fixing.", errors);
  return { fullName, email, phoneCode, phoneNumber, seats };
}

// Every taken seat (held or paid), for drawing the floor plan.
async function getSeatMap() {
  const [rows] = await pool.query(
    `SELECT s.table_label, s.seat_number, b.payment_status
       FROM gala_booking_seats s
       JOIN gala_bookings b ON b.id = s.booking_id
      ORDER BY (s.table_label + 0), s.seat_number`
  );
  const taken = rows.map((r) => ({
    seat: `${r.table_label}-${r.seat_number}`,
    status: r.payment_status === "paid" ? "booked" : "held",
  }));
  const total = gala.tableCount * gala.seatsPerTable;
  return {
    tables: gala.tableCount,
    seatsPerTable: gala.seatsPerTable,
    seatPriceUsd: gala.seatPriceUsd,
    totalSeats: total,
    takenCount: taken.length,
    taken,
  };
}

// Holds the seats and creates a pending booking (guest checkout, no account
// needed). The UNIQUE key on (table_label, seat_number) guarantees no seat
// is ever held twice.
async function createBooking(body) {
  const input = validateBookingInput(body);
  const price = gala.seatPriceUsd;
  const total = price * input.seats.length;

  return withTransaction(async (conn) => {
    let bookingId;
    let ref;
    for (let attempt = 0; attempt < 5 && !bookingId; attempt++) {
      ref = makeBookingRef();
      try {
        const [res] = await conn.query(
          `INSERT INTO gala_bookings
             (booking_ref, full_name, email, phone_code, phone_number,
              seat_count, price_per_seat, total_amount, currency, payment_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'USD', 'pending')`,
          [ref, input.fullName, input.email, input.phoneCode, input.phoneNumber,
            input.seats.length, price, total]
        );
        bookingId = res.insertId;
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY" && /booking_ref|uq_gala_bookings_ref/.test(err.message)) continue;
        throw err;
      }
    }
    if (!bookingId) throw new Error("Could not generate a unique booking reference");

    try {
      await conn.query(
        "INSERT INTO gala_booking_seats (booking_id, table_label, seat_number) VALUES ?",
        [input.seats.map((s) => [bookingId, s.table, s.seat])]
      );
    } catch (err) {
      if (err.code !== "ER_DUP_ENTRY") throw err;
      const [taken] = await pool.query(
        `SELECT CONCAT(table_label, '-', seat_number) AS seat FROM gala_booking_seats
          WHERE (table_label, seat_number) IN (?)`,
        [input.seats.map((s) => [s.table, s.seat])]
      );
      const list = taken.map((r) => r.seat);
      throw new AppError(409, `${list.join(", ") || "Some seats"} ${list.length === 1 ? "was" : "were"} just booked by someone else. Pick other seats.`, { takenSeats: list });
    }

    return {
      bookingRef: ref,
      seats: input.seats.map((s) => s.label),
      seatCount: input.seats.length,
      pricePerSeat: price,
      totalAmount: total,
      currency: "USD",
      paymentStatus: "pending",
      holdMinutes: gala.holdMinutes,
    };
  });
}

function shapeBooking(b, seats) {
  return {
    bookingRef: b.booking_ref,
    fullName: b.full_name,
    email: b.email,
    phone: `+${b.phone_code} ${b.phone_number}`,
    seats,
    seatCount: b.seat_count,
    pricePerSeat: Number(b.price_per_seat),
    totalAmount: Number(b.total_amount),
    currency: b.currency,
    paymentStatus: b.payment_status,
    paidAt: b.paid_at,
    createdAt: b.created_at,
  };
}

async function seatsFor(bookingIds) {
  if (!bookingIds.length) return {};
  const [rows] = await pool.query(
    `SELECT booking_id, CONCAT(table_label, '-', seat_number) AS seat
       FROM gala_booking_seats WHERE booking_id IN (?) ORDER BY (table_label + 0), seat_number`,
    [bookingIds]
  );
  return rows.reduce((acc, r) => ((acc[r.booking_id] ||= []).push(r.seat), acc), {});
}

// Looked up by its reference alone — there's no account to scope it to, so
// treat the booking ref (like an order number) as the secret the guest holds.
async function getBooking(ref) {
  const [[b]] = await pool.query("SELECT * FROM gala_bookings WHERE booking_ref = ?", [ref]);
  if (!b) throw new AppError(404, `No booking found with reference ${ref}.`);
  const seats = await seatsFor([b.id]);
  return shapeBooking(b, seats[b.id] || []);
}

// Frees the seats and marks the booking with the given status.
// Used for expired holds, refunds and cancellations. Pass `conn` to join
// an existing transaction.
async function releaseSeats(conn, bookingId, newStatus) {
  await conn.query("DELETE FROM gala_booking_seats WHERE booking_id = ?", [bookingId]);
  await conn.query("UPDATE gala_bookings SET payment_status = ? WHERE id = ?", [newStatus, bookingId]);
}

// Cancels unpaid bookings older than HOLD_MINUTES so their seats return to sale.
async function releaseExpiredHolds() {
  const [rows] = await pool.query(
    `SELECT id FROM gala_bookings
      WHERE payment_status = 'pending' AND created_at < (NOW() - INTERVAL ? MINUTE)`,
    [gala.holdMinutes]
  );
  for (const { id } of rows) {
    await withTransaction(async (conn) => {
      const [[b]] = await conn.query("SELECT payment_status FROM gala_bookings WHERE id = ? FOR UPDATE", [id]);
      if (b && b.payment_status === "pending") {
        await releaseSeats(conn, id, "cancelled");
        await conn.query(
          `UPDATE transactions SET status = 'cancelled', processed_at = NOW()
            WHERE source_type = 'gala_booking' AND source_id = ? AND type = 'payment' AND status = 'initiated'`,
          [id]
        );
      }
    });
  }
  return rows.length;
}

module.exports = {
  parseSeat,
  getSeatMap,
  createBooking,
  getBooking,
  releaseSeats,
  releaseExpiredHolds,
};
