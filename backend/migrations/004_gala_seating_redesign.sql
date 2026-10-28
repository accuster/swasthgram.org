-- One-time migration: the gala floor plan moved from 12 lettered tables x 6
-- seats ($5,000/seat) to 40 numbered tables x 10 seats ($300/seat). Seat
-- labels switch from a letter+digit pair (e.g. "A3") to a dash-joined
-- table-seat pair (e.g. "3-5"), matching the redesigned seating chart.
--
-- table_label widens from CHAR(1) to VARCHAR(2) to hold "1".."40". The old
-- A-L range check is dropped rather than replaced, because a handful of real
-- paid bookings already hold letter labels (A, B, D) — no single numeric
-- range check can validate both the historical letters and the new 1-40
-- table numbers, so new values are validated in the app instead
-- (bookingService.parseSeat). Those existing rows are left untouched; they
-- just won't correspond to any seat drawn on the new chart.
--
-- price_per_seat's DEFAULT moves to the new $300 flat price; already-stored
-- amounts on paid/pending bookings are untouched.
--
-- Usage: mysql -u <user> -p <database> < migrations/004_gala_seating_redesign.sql

ALTER TABLE gala_booking_seats
  DROP CHECK chk_gala_table,
  DROP CHECK chk_gala_seat,
  MODIFY COLUMN table_label VARCHAR(2) NOT NULL,
  ADD CONSTRAINT chk_gala_seat CHECK (seat_number BETWEEN 1 AND 10);

ALTER TABLE gala_bookings
  MODIFY COLUMN price_per_seat DECIMAL(10,2) NOT NULL DEFAULT 300.00;
