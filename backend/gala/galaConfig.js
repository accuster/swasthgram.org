module.exports = {
  seatPriceUsd:       Number(process.env.SEAT_PRICE_USD || 300),
  maxSeatsPerBooking: Number(process.env.MAX_SEATS_PER_BOOKING || 12),
  holdMinutes:        Math.max(31, Number(process.env.HOLD_MINUTES || 35)),
  tableCount:         40,
  seatsPerTable:      10,
  eventName:          "An Evening for Swasthgram",
  eventDate:          "November 18, 2026",
  eventTime:          "6:00 PM – 9:00 PM PST",
  eventVenue:         "India Community Center, Milpitas, California, USA",
};
