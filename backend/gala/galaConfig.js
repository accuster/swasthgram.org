module.exports = {
  seatPriceUsd:       Number(process.env.SEAT_PRICE_USD || 5000),
  maxSeatsPerBooking: Number(process.env.MAX_SEATS_PER_BOOKING || 12),
  holdMinutes:        Math.max(31, Number(process.env.HOLD_MINUTES || 35)),
  tables:             "ABCDEFGHIJKL",
  seatsPerTable:      6,
  eventName:          "An Evening for Swasthgram",
  eventDate:          "November 12, 2026",
  eventTime:          "3:00 PM – 10:00 PM",
  eventVenue:         "India Community Center, Milpitas, CA",
};
