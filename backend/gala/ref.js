const crypto = require("crypto");

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I

// Booking reference like SGF-7KQ2M
function makeBookingRef() {
  const bytes = crypto.randomBytes(5);
  let out = "SGF-";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

module.exports = { makeBookingRef };
