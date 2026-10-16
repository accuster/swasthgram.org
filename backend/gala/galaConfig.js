module.exports = {
  seatPriceUsd:       Number(process.env.SEAT_PRICE_USD || 5000),
  maxSeatsPerBooking: Number(process.env.MAX_SEATS_PER_BOOKING || 12),
  holdMinutes:        Math.max(31, Number(process.env.HOLD_MINUTES || 35)),
  tables:             "ABCDEFGHIJKL",
  seatsPerTable:      6,
};
